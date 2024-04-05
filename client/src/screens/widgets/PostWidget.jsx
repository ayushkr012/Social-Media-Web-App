// props data came from the PostsWidget.jsx
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
  WhatsApp,
  LinkedIn,
  Email,
  Telegram,
  Twitter,
  Instagram,
  Message,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { setPosts, setNotifications } from "state";
import { toast } from "react-toastify";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isProfile,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const BackendUrl = useSelector((state) => state.BackendUrl);

  const isLiked = likes && loggedInUserId && Boolean(likes[loggedInUserId]);
  const likeCount = likes
    ? Object.keys(likes).length
    : Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette?.neutral?.main;
  const primary = palette?.primary?.main;

  const isOwnPost = loggedInUserId === postUserId;

  // like and unlike the post
  // when user like the post then we send the data to the server to update the notification so user get notified when someone like their post
  const patchLike = async () => {
    try {
      const response = await fetch(`${BackendUrl}posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          postUserId: postUserId,
        }),
      });
      const data = await response.json();

      // console.log("Data received from server:", data); // Log the data received from the server

      // Dispatch the setNotifications action to update the notifications
      dispatch(setNotifications({ notifications: data.updatedNotifications }));

      // Dispatch the setPost action to update the liked post
      dispatch(setPost({ post: data.updatedPost }));

      console.log(data.updatedNotifications);
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
        `${BackendUrl}/posts/${postId}/${loggedInUserId}/?isProfile=${isProfile}`,
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
    const shareableLink = `${BackendUrl}/posts/${postUserId}/posts`;
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
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${BackendUrl}/assets/${picturePath}`}
        />
      )}
      {/*  -----------------------> Like, Comment, Share Section ----------------------------< */}
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
          {isOwnPost && (
            <IconButton onClick={() => setOpenDeleteDialog(true)}>
              <DeleteOutline />
            </IconButton>
          )}
          <IconButton onClick={handleSharePost}>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
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
