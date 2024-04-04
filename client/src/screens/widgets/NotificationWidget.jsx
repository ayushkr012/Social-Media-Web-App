import { Box, Typography, useTheme } from "@mui/material";
import NotificationList from "components/NotificationList";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "state";

// props data came from screens/notification/index.jsx
const NotificationWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const notifications = useSelector((state) => state.notifications);

  //   const getFriends = async () => {
  //     const response = await fetch(
  //       `http://localhost:3001/users/${userId}/friends`,
  //       {
  //         method: "GET",
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const data = await response.json();
  //     dispatch(setFriends({ friends: data }));
  //   };

  //   useEffect(() => {
  //     getFriends();
  //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(notifications) &&
          notifications.map((user) => (
            <NotificationList
              key={user.userId}
              friendId={user.userId}
              name={`${user.firstName} ${user.lastName}`}
              subtitle={user.occupation}
              userPicturePath={user.picturePath}
              message={user.message}
            />
          ))}
        {notifications.length === 0 && (
          <Typography color={palette.neutral.medium}>
            It looks like you haven't any notifications yet.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default NotificationWidget;
