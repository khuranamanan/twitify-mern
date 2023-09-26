import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

/**
 * This handler handles user signups.
 * send POST Request at /auth/signup
 * body contains {firstName, lastName, username, password}
 * */

async function signup(req, res) {
  const { username, password, firstName, lastName, ...rest } = req.body;

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ errors: ["Missing Required fields."] });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(422)
        .json({ errors: ["Unprocessable Entity. Username Already Exists."] });
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      ...rest,
      followers: [],
      following: [],
      bookmarks: [],
    });

    await newUser.save();

    const responseNewUser = { ...newUser._doc };
    delete responseNewUser.password;

    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username },
      JWT_SECRET_KEY
    );

    res.status(201).json({ createdUser: responseNewUser, encodedToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * This handler handles user login.
 * send POST Request at /api/auth/login
 * body contains {username, password}
 * */

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ errors: ["Missing Required fields."] });
  }

  try {
    const foundUser = await User.findOne({ username }).populate({
      path: "followers following",
      select: "_id firstName lastName username profileImg",
    });

    if (!foundUser) {
      return res.status(404).json({
        errors: ["The username you entered is not Registered. Not Found error"],
      });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (passwordMatch) {
      const token = jwt.sign({ _id: foundUser._id, username }, JWT_SECRET_KEY);

      const responseFoundUser = { ...foundUser._doc };
      delete responseFoundUser.password;

      return res
        .status(200)
        .json({ foundUser: responseFoundUser, encodedToken: token });
    }

    return res.status(401).json({
      errors: [
        "The credentials you entered are invalid. Unauthorized access error.",
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { signup, login };
