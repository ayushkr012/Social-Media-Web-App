import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { setChatFriend } from "state";

// props data came from the PostWidget.jsx and FriendListWidget.jsx
const UserChatFreind = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const mode = useSelector((state) => state.mode);

  return (
    <FlexBetween
      onClick={() => {
        const friendData = {
          friendId,
          name,
          subtitle,
          userPicturePath,
        };
        dispatch(setChatFriend(friendData));
      }}
    >
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color:
                  mode == "light" ? palette.text.primary : palette.text.primary,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default UserChatFreind;
