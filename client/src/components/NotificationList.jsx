import { MoreHorizOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { setNotifications } from "state";

// props data came from the NotificationWidget.jsx
const NotificationList = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  message,
  time,
  read,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const mode = useSelector((state) => state.mode);
  const medium = palette.neutral.medium;
  const mediumMain = palette.neutral.mediumMain;
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const { _id } = useSelector((state) => state.user);

  // when user click on notification then they navigate to the Crossponding user profile page
  const handleClick = async () => {
    //  we update the notification read status to true
    const response = await fetch(
      `${BackendUrl}/users/updateNotificationStatus/${_id}/${friendId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setNotifications({ notifications: data.updatedNotifications }));

    navigate(`/profile/${friendId}`);
    //  we go to the user friend profile page and then again go to the someone profile page
    // then url update with react router but component does not reender so we use navigate(0) to reender the component
    navigate(0);
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem" onClick={handleClick}>
        <UserImage image={userPicturePath} size="55px" />
        <Box>
          <Typography
            sx={{
              color:
                mode == "dark" ? palette.text.primary : palette.text.primary,
            }}
            variant="h6"
            fontWeight="450"
          >
            {name}
          </Typography>
        </Box>
        <Typography
          sx={{ color: mode == "dark" ? main : "dark" }}
          fontSize="0.75rem"
        >
          {message}
        </Typography>
      </FlexBetween>
      <FlexBetween gap="0.25rem">
        <IconButton>
          <MoreHorizOutlined sx={{ color: mediumMain }} />
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default NotificationList;
