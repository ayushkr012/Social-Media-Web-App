import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
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

// props data came from homePage/index.jsx
const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const mode = useSelector((state) => state.mode);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", description);
    if (image) {
      formData.append("picture", image);
    }

    const response = await fetch(`${BackendUrl}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();

    toast.success("Post created successfully", { autoClose: 1000 });
    dispatch(setPosts({ posts }));
    // after successfull post we reset the image and description
    setImage(null);
    setIsImage(false);
    setDescription("");
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
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
            acceptedFiles=".jpg,.jpeg,.png"
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
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

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

        <Button
          disabled={!description && !image} // we keep as it optional user can post their post without description
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
      </FlexBetween>
      {/* we direct can't use ToastContainer here it gives toggle error beacuse all these part are came from home 
      page so we use toast conatiner homepage only and here we set all the success and error message of taost  */}
      {/* <ToastContainer /> */}{" "}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
