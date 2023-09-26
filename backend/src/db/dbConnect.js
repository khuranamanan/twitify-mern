import mongoose from "mongoose";

const mongoURI = process.env["MONGODB_URI"];

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "twitify",
    });
    if (connection) {
      console.log(`DB Connected succesfully`);
    }
  } catch (err) {
    console.log(`Connection failed ${err}`);
  }
};

export { dbConnect };
