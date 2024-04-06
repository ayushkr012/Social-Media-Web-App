import { Box, Typography, useMediaQuery, IconButton } from "@mui/material";
import { Send, Photo, Mic, EmojiEmotions } from "@mui/icons-material"; // Import icons
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import FriendListWidget from "./FriendListWidget";
import FlexBetween from "components/FlexBetween";
import ChatBox from "screens/chatSection/ChatBox";

const ChatSection = () => {
  const userId = useSelector((state) => state.user?._id);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box
      sx={{
        backgroundImage: `url('/background_image.jpg')`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Box
        width="100%"
        padding="1rem 1%"
        display={isNonMobileScreens ? "flex" : "flex"}
        gap="2rem" // the gap between between the friend list and the chat box
        justifyContent="center"
      >
        <Box
          flexBasis={isNonMobileScreens ? "35%" : "35%"}
          // mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <FriendListWidget userId={userId} />
          <Box m="2rem 0" />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "65%" : "65%"} position="relative">
          <ChatBox />
          <Box position="absolute" bottom="1rem" right="1rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="1rem">
                <IconButton aria-label="Add emoji">
                  <EmojiEmotions />
                </IconButton>
                <IconButton aria-label="Upload photo">
                  <Photo />
                </IconButton>
              </FlexBetween>
              <FlexBetween gap="1rem">
                <IconButton aria-label="Send message">
                  <Send />
                </IconButton>
                <IconButton aria-label="Record voice">
                  <Mic />
                </IconButton>
              </FlexBetween>
            </FlexBetween>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatSection;
