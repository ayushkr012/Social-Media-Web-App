import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { ToastContainer, toast } from "react-toastify";
import Loading from "components/Loading";
import CloudinaryUploader from "components/CloudinaryUploader";

// props data came from homePage/index.jsx  (picturePath is the user  profile image)
const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const mode = useSelector((state) => state.mode);

  // Initialize CloudinaryUploader
  const cloudinaryUploader = CloudinaryUploader();

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let imgUrl = null;
      let videoUrl = null;

      // Upload image if available
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

      // Upload video if available
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

      // Once all uploads are complete, proceed with creating the post
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/createPost`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: _id, description, imgUrl, videoUrl }),
        }
      );
      const posts = await response.json();

      toast.success("Post created successfully", { autoClose: 1000 });
      console.log("File upload success!");
      dispatch(setPosts({ posts }));
      // after successful post, reset the image and description and video states
      setImage(null);
      setVideo(null);
      setIsVideo(false);
      setIsImage(false);
      setDescription("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          multiline // Enable multiline input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent default behavior of Enter key
              setDescription((prevDescription) => prevDescription + "\n"); // Add a new line character
            }
          }}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles="image/*"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  // border={`2px dashed ${palette.primary.main}`}
                  // p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <Box border={`2px dashed ${palette.primary.main}`}>
                      <p>Add Image Here</p>
                    </Box>
                  ) : (
                    <FlexBetween>
                      <FlexBetween>
                        {/* <Typography>{image.name}</Typography> */}
                        <img
                          width="100%"
                          height="auto"
                          alt="post"
                          style={{ borderRadius: "0.75rem", marginTop: "0rem" }}
                          src={URL.createObjectURL(image)} // Use URL.createObjectURL to display the selected image
                        />
                      </FlexBetween>
                      <EditOutlined sx={{ marginLeft: "0.9rem" }} />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "9%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      {isVideo && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles="video/*"
            multiple={false}
            onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? (
                    <Box border={`2px dashed ${palette.primary.main}`} p="1rem">
                      <p>Add Video Here</p>
                    </Box>
                  ) : (
                    <FlexBetween alignItems="center">
                      <video
                        width="100%"
                        height="auto"
                        alt="video"
                        controls // Add controls attribute to enable video controls
                        style={{ borderRadius: "0.75rem", marginTop: "0rem" }}
                      >
                        <source
                          src={URL.createObjectURL(video)} // Use URL.createObjectURL to create a temporary URL for the selected video
                          type={video.type} // Use the type attribute of the selected video
                        />
                        {/* Your browser does not support the video tag. */}
                      </video>
                      <EditOutlined sx={{ marginLeft: "0.9rem" }} />
                    </FlexBetween>
                  )}
                </Box>
                {video && (
                  <IconButton
                    onClick={() => setVideo(null)}
                    sx={{ width: "9%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
                {/* Optionally add a delete button for video */}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween
          gap="0.25rem"
          onClick={() => {
            setIsImage(!isImage);
            setIsVideo(false);
            setVideo(null); // when user click on image icon we set video to null because at the same time user can't upload image and video
          }}
        >
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween
          gap="0.25rem"
          onClick={() => {
            setIsVideo(!isVideo);
            setIsImage(false);
            setImage(null); // when user click on video icon we set image to null because at the same time user can't upload image and video
          }}
        >
          <VideoFileIcon sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Video
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          // here we have to work on when smallerscreens it also show above all icon when user click on more icon
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        {isLoading ? (
          <WidgetWrapper>
            <Loading />
          </WidgetWrapper>
        ) : (
          <Button
            disabled={!description && !image && !video} // we keep as it optional user can post their post without description
            onClick={handlePost}
            sx={{
              "&:hover": {
                color:
                  mode === "dark" ? palette.primary.dark : palette.primary.main,
              },
              borderRadius: "3rem",
              backgroundColor: palette.primary.light,
            }}
          >
            POST
          </Button>
        )}
      </FlexBetween>
      {/* we direct can't use ToastContainer here it gives toggle error beacuse all these part are came from home 
      page so we use toast conatiner homepage only and here we set all the success and error message of taost  */}
      {/* <ToastContainer /> */}{" "}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
