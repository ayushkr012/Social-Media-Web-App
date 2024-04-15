import { Typography, Divider, IconButton } from "@mui/material";
import { Call, VideoCall, Settings } from "@mui/icons-material";
import Headername from "./Headername";
import { useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";


const Chatheader = () => {
  const chatFriend = useSelector((state) => state.chatFriend);

  // Check if chatFriend is null before destructure
  const { friendId, name, online, userPicturePath } = chatFriend || {};

  return (
    
    <WidgetWrapper >
        <FlexBetween sx={{height:'4vh'}}>
          {friendId ? (
            <Headername {...{ friendId, name, online, userPicturePath }} />
          ) : (
            <Typography variant="body1">No friend selected</Typography>
          )}

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

        <Divider sx={{ mt: "1.0rem" }} />

    </WidgetWrapper>
  );
};

export default Chatheader;
