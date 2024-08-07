import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
  DeleteOutlined,
  EditOutlined,
  WhatsApp,
  LinkedIn,
  Email,
  Telegram,
  Twitter,
  Instagram,
  CloseOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Modal,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { setPosts, setNotifications } from "state";
import { toast } from "react-toastify";
import CloudinaryUploader from "components/CloudinaryUploader";

// props data came from the PostsWidget.jsx
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  imgUrl,
  videoUrl,
  userPicturePath,
  likes,
  comments,
  isProfile,
}) => {
  const { palette } = useTheme();
  const [isComments, setIsComments] = useState(false);
  const mode = useSelector((state) => state.mode);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for edit modal
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [newDescription, setDescription] = useState(description);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  // Initialize CloudinaryUploader for save the edited post
  const cloudinaryUploader = CloudinaryUploader();

  const [shareLink, setShareLink] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  // console.log("Likes:", Object.keys(likes).length);

  // Ensure likes is defined and an object before accessing its properties
  const isLiked =
    loggedInUserId && likes && typeof likes === "object"
      ? Boolean(likes[loggedInUserId])
      : false;
  const likeCount =
    likes && typeof likes === "object" ? Object.keys(likes).length : 0;

  const main = palette?.neutral?.main;
  const primary = palette?.primary?.main;
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  // console.log(loggedInUserId);

  const isOwnPost = loggedInUserId === postUserId;

  /* -----------------------------> Edit Post Implementation --------------------------< */
  const handleEditPost = async () => {
    try {
      let imgUrl = null;
      let videoUrl = null;

      // Upload image if image is selected
      if (image != null) {
        // Get signature for Image upload
        const { timestamp: imgTimestamp, signature: imgSignature } =
          await cloudinaryUploader.getSignatureForUpload("images");
        console.log("imgTimestamp", imgTimestamp, "imgSignature", imgSignature);
        // Upload image file
        imgUrl = await cloudinaryUploader.uploadFile(
          image,
          "image",
          imgTimestamp,
          imgSignature
        );
      }

      // Upload video if video is selected
      if (video != null) {
        // Get signature for video upload
        const { timestamp: videoTimestamp, signature: videoSignature } =
          await cloudinaryUploader.getSignatureForUpload("videos");
        // Upload video file
        videoUrl = await cloudinaryUploader.uploadFile(
          video,
          "video",
          videoTimestamp,
          videoSignature
        );
      }

      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/editPost`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newDescription,
            imgUrl,
            videoUrl,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setPost({ post: data.updatedPost }));
        toast.success("Post updated successfully", { autoClose: 1000 });
        setOpenEditModal(false);
        setImage(null);
        setVideo(null);
        setDescription(description);
      } else {
        // If response.ok is false, handle error
        toast.error("Failed to edit post");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Error editing post");
    }
  };

  /* -----------------------------> like and unlike the post Implementation--------------------------< */
  // when user like the post then we send the data to the server to update the notification so user get notified when someone like their post
  const patchLike = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            postUserId: postUserId,
          }),
        }
      );
      const data = await response.json();

      // console.log("Data received from server:", data); // Log the data received from the server

      // Dispatch the setPost action to update the liked post
      dispatch(setPost({ post: data.updatedPost }));

      // Dispatch the setNotifications action to update the notifications
      dispatch(setNotifications({ notifications: data.updatedNotifications }));

      // console.log(data.updatedNotifications);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  /* ----------------- Delete Post Implementation -----------------  */

  const handleDeletePost = async () => {
    try {
      setOpenDeleteDialog(false);
      const response = await fetch(
        // here we pass the postId to delete the post
        // and the loggedInUserId to and isProfile to check when user is on the profile page then we return only userAllPost when user
        // is on the home page then we return all the post
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/${loggedInUserId}/?isProfile=${isProfile}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        toast.success("Post deleted successfully", { autoClose: 1000 });
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    }
  };

  /* ----------------- Share Post Implementation -----------------  */
  const handleSharePost = () => {
    // Generate shareable link
    const shareableLink = `${process.env.REACT_APP_Backend_URL}/posts/${postUserId}/posts`;
    setShareLink(shareableLink);
    setOpenShareDialog(true);
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopyMessage("Link copied!");
    setTimeout(() => {
      setCopyMessage("");
    }, 3000); // Clear message after 3 seconds
  };
  const handleShareWhatsApp = () => {
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareLink
    )}`;
    window.open(whatsappLink, "_blank");
  };
  const handleShareLinkedIn = () => {
    const LinkedInLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareLink
    )}`;
    window.open(LinkedInLink, "_blank");
  };
  const handleShareGmail = () => {
    const gmailLink = `mailto:?subject=Check out this post&body=${shareLink}`;
    window.open(gmailLink, "_blank");
  };
  const handleShareTelegram = () => {
    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(
      shareLink
    )}`;
    window.open(telegramLink, "_blank");
  };
  const handleShareInstagram = () => {
    const instagramLink = `https://www.instagram.com/?url=${encodeURIComponent(
      shareLink
    )}`;
    window.open(instagramLink, "_blank");
  };
  const handleShareTwitter = () => {
    const twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareLink
    )}`;
    window.open(twitterLink, "_blank");
  };
  // Implement similar functions for other sharing options

  return (
    <WidgetWrapper m="2rem 0">
      {/* -----------------------> Post Header ----------------------------< */}
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {/* if image in the post then we display the image */}
      {imgUrl && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={imgUrl}
        />
      )}
      {/* if video in the post  then we display the video */}
      {videoUrl && (
        <video
          width="100%"
          height="auto"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        >
          <source src={videoUrl} />
          {/* Optionally, provide fallback content here */}
        </video>
      )}
      {/*  -----------------------> Like, Comment, Share  and edit Section ----------------------------< */}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments ? comments.length : 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween>
          <IconButton onClick={handleSharePost}>
            <ShareOutlined />
          </IconButton>
          {isOwnPost && (
            <FlexBetween>
              <IconButton onClick={() => setOpenDeleteDialog(true)}>
                <DeleteOutline />
              </IconButton>
              <IconButton onClick={() => setOpenEditModal(true)}>
                <EditOutlined />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>
      </FlexBetween>
      {/* ----------------------->   Edit Post Modal dialog --------------------< */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-post-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
          },
        }}
      >
        <DialogTitle
          id="edit-post-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.background.alt,
            color: palette.text.primary,
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "1.5rem 0", // Adjust padding as needed
          }}
        >
          Update Post
        </DialogTitle>
        <Divider
          sx={{
            backgroundColor: palette.text.primary,
            borderTop: `1px solid ${palette.divider}`, // Add a border at the top for separation
          }}
        />
        <WidgetWrapper
          sx={{
            display: "inline-block",
            "&:hover": {
              backgroundColor: mode === "dark" ? palette.grey[800] : "#EBEBEB", // Adjust hover background color based on theme
              cursor: "pointer",
            },
            width: "100%",
          }}
        >
          <FlexBetween>
            <Friend
              friendId={postUserId}
              name={name}
              subtitle={location}
              userPicturePath={userPicturePath}
            />
          </FlexBetween>
        </WidgetWrapper>
        <Divider
          sx={{
            backgroundColor: palette.text.primary,
            borderTop: `1px solid ${palette.divider}`, // Add a border at the top for separation
          }}
        />
        <DialogContent sx={{ backgroundColor: palette.background.alt }}>
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setDescription(e.target.value)}
            value={newDescription}
            // multiline // Enable multiline input
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault(); // Prevent default behavior of Enter key
            //     setDescription((prevDescription) => prevDescription + "\n"); // Add a new line character
            //   }
            // }}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />

          {/* Container for Dropzone and image */}
          <Box position="relative" width="100%">
            {/* Dropzone component */}
            <Dropzone
              acceptedFiles={["image/*", "video/*"]} // Accept only images and videos
              multiple={false}
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file.type.startsWith("image")) {
                  setImage(file);
                  setVideo(null); // Reset video if image is selected
                } else if (file.type.startsWith("video")) {
                  setVideo(file);
                  setImage(null); // Reset image if video is selected
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} position="relative">
                  {/* Input for Dropzone */}
                  <input {...getInputProps()} />

                  {/* when newImage are not selected then we display the curernt image or video of the post */}
                  {!image && !video && (
                    <div>
                      {/* if image in the post then we display the image */}
                      {imgUrl && (
                        <img
                          width="100%"
                          height="auto"
                          alt="post"
                          style={{
                            borderRadius: "0.75rem",
                            marginTop: "0.75rem",
                          }}
                          src={imgUrl}
                        />
                      )}
                      {/* if video in the post then we display the video */}
                      {videoUrl && (
                        <video
                          width="100%"
                          height="auto"
                          controls
                          style={{
                            borderRadius: "0.75rem",
                            marginTop: "0.75rem",
                          }}
                        >
                          <source src={videoUrl} />
                          {/* Optionally, provide fallback content here */}
                        </video>
                      )}
                    </div>
                  )}

                  {/* display when user select the image */}
                  {image && (
                    <img
                      width="100%"
                      height="auto"
                      alt="post"
                      style={{
                        borderRadius: "0.75rem",
                        marginTop: "0.75rem",
                      }}
                      src={URL.createObjectURL(image)}
                    />
                  )}

                  {/* display when user select the video */}
                  {video && (
                    <video
                      width="100%"
                      height="auto"
                      controls
                      style={{
                        borderRadius: "0.75rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      <source src={URL.createObjectURL(video)} />
                      {/* Optionally, provide fallback content here */}
                    </video>
                  )}

                  {/* Render edit icon at the top right corner when image or video is not selected*/}
                  {!image && !video && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        backgroundColor:
                          mode === "dark"
                            ? palette.grey[800]
                            : palette.grey[200],
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor:
                            mode === "dark"
                              ? palette.grey[900]
                              : palette.grey[300],
                        },
                        "& .MuiIconButton-label": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      <EditOutlined />
                    </IconButton>
                  )}
                </Box>
              )}
            </Dropzone>
            {/* Render delete icon if either image or video  is selected */}
            {(image || video) && (
              <IconButton
                onClick={() => {
                  setImage(null);
                  setVideo(null);
                }}
                sx={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  backgroundColor:
                    mode === "dark" ? palette.grey[800] : palette.grey[200],
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor:
                      mode === "dark" ? palette.grey[900] : palette.grey[300],
                  },
                  "& .MuiIconButton-label": {
                    fontSize: "1.5rem",
                  },
                }}
              >
                <DeleteOutlined />
              </IconButton>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "1rem",
            backgroundColor: palette.background.alt,
            borderTop: `1px solid ${palette.divider}`, // Add a border at the top for separation
          }}
        >
          <Button
            onClick={() => {
              setOpenEditModal(false);
              setImage(null);
              setVideo(null);
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            Cancel
          </Button>
          {(image || newDescription !== description || video) && (
            <Button variant="contained" onClick={handleEditPost}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/*---------------->  Delete confirmation dialog -------------<*/}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* ----------------> Share dialog -----------------------< */}
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        aria-labelledby="share-dialog-title"
      >
        <WidgetWrapper>
          <DialogTitle id="share-dialog-title">Share Post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Share this post via the following options:
            </DialogContentText>
            <Box display="flex" flexDirection="column" gap={1} mt="5px">
              {!copyMessage && (
                <Button variant="outlined" onClick={handleCopyLink}>
                  Copy Link
                </Button>
              )}
              {copyMessage && (
                <Button variant="outlined">Linked Copied!</Button>
              )}

              <FlexBetween mt="15px">
                <IconButton onClick={handleShareWhatsApp}>
                  <WhatsApp />
                </IconButton>
                <IconButton onClick={handleShareLinkedIn}>
                  <LinkedIn />
                </IconButton>
                <IconButton onClick={handleShareGmail}>
                  <Email />
                </IconButton>
                <IconButton onClick={handleShareTelegram}>
                  <Telegram />
                </IconButton>
                <IconButton onClick={handleShareInstagram}>
                  <Instagram />
                </IconButton>
                <IconButton onClick={handleShareTwitter}>
                  <Twitter />
                </IconButton>
              </FlexBetween>
              {/* Add similar icons for other sharing options */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenShareDialog(false)} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </WidgetWrapper>
      </Dialog>
      {/* -----------------------> Comment Section ----------------------------< */}
      {isComments && (
        <Box mt="0.5rem">
          {comments &&
            comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
          <Divider />
        </Box>
      )}
      {/* we direct can't use ToastContainer here it gives toggle error beacuse all these part are came from home 
      page so we use toast conatiner homepage only and here we set all the success and error message of taost  */}
      {/* <ToastContainer /> */}{" "}
    </WidgetWrapper>
  );
};

export default PostWidget;
