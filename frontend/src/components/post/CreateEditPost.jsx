/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../ProfileImage";
import { createUserPost, editUserPost } from "../../redux/slices/postsSlice";
import { closePostModal } from "../../redux/slices/modalsSlice";
import { POST_CHAR_LIMIT } from "../../utils/constant";
import { AddMediaIcon, DeleteIcon, EmojiIcon } from "../../assets/icons";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { Tooltip } from "react-tooltip";

function CreateEditPost({ fromModal = false }) {
  const { user, token } = useSelector((state) => state.auth);
  const { postModal, editPostContent } = useSelector((state) => state.modals);
  const themeMode = useSelector((state) => state.theme.mode);
  const [newPost, setNewPost] = useState({
    content: editPostContent && fromModal ? editPostContent.content : "",
    media: editPostContent && fromModal ? editPostContent.media : null,
  });
  const [mediaUploading, setMediaUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const emojiRef = useRef();
  useClickOutside(emojiRef, () => setShowEmojiPicker(false));

  function handleInputChange(event) {
    const inputContent = event.target.value;
    setNewPost({ ...newPost, content: inputContent });
  }

  const characterCount = newPost.content.length;
  const isOverCharacterLimit = characterCount > POST_CHAR_LIMIT;

  function handleMediaChange(event) {
    const mediaFile = event.target.files[0];
    if (!mediaFile) return;

    if (
      mediaFile.type.startsWith("image") &&
      Math.round(mediaFile.size / 1024000) > 2
    ) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    if (
      mediaFile.type.startsWith("video") &&
      Math.round(mediaFile.size / 1024000) > 10
    ) {
      toast.error("Video size should be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", mediaFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_REACT_APP_CLOUDINARY_API_KEY
    );

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    setMediaUploading(true);

    fetch(
      mediaFile.type.startsWith("image")
        ? "https://api.cloudinary.com/v1_1/dsuxc3pwu/image/upload"
        : "https://api.cloudinary.com/v1_1/dsuxc3pwu/video/upload",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setNewPost({
          ...newPost,
          media: {
            url: data.secure_url,
            type: mediaFile.type.startsWith("image") ? "image" : "video",
          },
        });

        toast.success("Media Uploaded");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Media Uploading failed");
      })
      .finally(() => {
        setMediaUploading(false);
      });
  }

  function handleMediaDelete() {
    setNewPost((prevPost) => ({
      ...prevPost,
      media: null,
    }));
  }

  function handlePostUpdateBtnClick() {
    dispatch(
      editUserPost({ newPost: { ...editPostContent, ...newPost }, token })
    );
    setNewPost({ media: null, content: "" });

    if (fromModal) {
      dispatch(closePostModal());
    }
  }

  function handlePostBtnClick() {
    dispatch(createUserPost({ post: { ...newPost }, token }));
    setNewPost({ media: null, content: "" });
    if (fromModal) {
      dispatch(closePostModal());
    }
  }

  function handleEmojiPickerToggle() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiClick(emoji) {
    setNewPost((prevPost) => ({
      ...prevPost,
      content: prevPost.content + emoji.emoji,
    }));
  }

  useEffect(() => {
    if (!postModal && fromModal) {
      setNewPost({ media: null, content: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postModal]);

  return (
    <div className=" gap-2 p-4 border-b border-solid border-darkGray dark:border-darkerGray grid grid-rows-[auto_auto] grid-cols-[auto_1fr]">
      <div className="flex gap-2 row-start-1 row-end-3 col-start-1 col-end-2">
        <ProfileImage
          userImage={user.profileImg}
          userFirstName={user.userFirstName}
        />
      </div>
      <div className="flex flex-col gap-2 grow justify-center items-center">
        <textarea
          className={`flex-grow py-2 px-3 focus:outline-none bg-inherit ${
            fromModal ? "h-40" : "h-16 sm:h-24"
          } border-none resize-none`}
          placeholder="What's happening?!"
          value={newPost.content}
          onChange={handleInputChange}
        />
        {newPost.media && (
          <div className="relative overflow-hidden flex justify-center items-center max-w-xs aspect-video object-contain rounded-lg bg-darkGray dark:bg-darkerGray">
            {newPost.media.type === "image" ? (
              <img
                src={newPost.media.url}
                alt="Post media"
                className="h-full object-contain"
              />
            ) : (
              <video controls>
                <source
                  src={newPost.media.url}
                  type="video/mp4"
                  className="h-full"
                />
              </video>
            )}
            <button
              className="bg-black rounded-full absolute top-2 right-2 "
              onClick={handleMediaDelete}
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 items-center py-2 px-3">
        <div className="flex gap-2">
          <div>
            <label
              htmlFor="media"
              className="cursor-pointer text-cyan"
              data-tooltip-id="media"
              data-tooltip-content="Media"
              data-tooltip-place="bottom"
            >
              <AddMediaIcon />
            </label>
            <input
              type="file"
              id="media"
              className="hidden"
              accept="image/*, video/*"
              onChange={handleMediaChange}
              disabled={mediaUploading}
            />
            <Tooltip id="media" style={{ padding: "3px" }} />
          </div>
          <div className="relative">
            <button
              className="cursor-pointer text-cyan"
              onClick={handleEmojiPickerToggle}
              ref={emojiRef}
              data-tooltip-id="emoji"
              data-tooltip-content="Emoji"
              data-tooltip-place="bottom"
            >
              <EmojiIcon />
            </button>
            <Tooltip id="emoji" style={{ padding: "3px" }} />
            <span className="absolute top-[100%] -left-20  z-40">
              {showEmojiPicker && (
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={themeMode}
                  searchDisabled
                  lazyLoadEmojis
                  skinTonesDisabled
                  suggestedEmojisMode="recent"
                  previewConfig={{
                    showPreview: false,
                  }}
                  height={fromModal ? "200px" : "40vh"}
                  width={"300px"}
                />
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {mediaUploading && (
            <p className="text-sm text-cyan">Media Uploading...</p>
          )}

          {newPost.content.length !== 0 && (
            <div
              className={`text-xs ${
                isOverCharacterLimit ? "text-red-500" : ""
              }`}
            >
              {characterCount}/{POST_CHAR_LIMIT}
            </div>
          )}

          <button
            className="text-white px-4 py-2 rounded-full bg-cyan disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:bg-aqua"
            disabled={
              isOverCharacterLimit || newPost.content.trim().length === 0
            }
            onClick={
              editPostContent && fromModal
                ? handlePostUpdateBtnClick
                : handlePostBtnClick
            }
          >
            {editPostContent && fromModal ? "Update" : "Twit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEditPost;
