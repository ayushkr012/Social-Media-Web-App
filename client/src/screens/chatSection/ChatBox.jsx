import { Box, Typography, IconButton } from "@mui/material";
import { Call, VideoCall, Settings } from "@mui/icons-material"; 
import UserChatFriend from "screens/chatSection/UserChatFriend";
import { useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const ChatBox = () => {
  const chatFriend = useSelector((state) => state.chatFriend);

  if (!chatFriend) {
    // If chatFriend is null, you can return some placeholder or loading component
    return <WidgetWrapper>Loading...</WidgetWrapper>;
  }

  const { friendId, name, subtitle, userPicturePath } = chatFriend;

  return (
    <WidgetWrapper>
      <FlexBetween gap="1rem">
        <UserChatFriend {...{ friendId, name, subtitle, userPicturePath }} />
        <FlexBetween>
          <IconButton aria-label="Phone call">
            <Call />
          </IconButton>
          <IconButton aria-label="Video call">
            <VideoCall />
          </IconButton>
          <IconButton aria-label="Settings">
            <Settings />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default ChatBox;
