import { Box, Typography, useTheme, Divider } from "@mui/material";
import NotificationList from "components/NotificationList";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// props data came from screens/notification/index.jsx
const NotificationWidget = ({ userId }) => {
  const { palette } = useTheme();
  const notifications = useSelector((state) => state.notifications);
  console.log(notifications);
  const mode = useSelector((state) => state.mode);

  return (
    <WidgetWrapper
      sx={
        // isNonMobileScreens && {
        {
          maxHeight: "100vh", //"calc(100vh - 200px)", // Adjust the max height as per your design
          overflowY: "auto", // Add vertical scrollbar
          scrollbarWidth: "thin", // Set scrollbar width thin bold strong
          scrollbarColor: `${palette.primary.main} ${palette.background.default}`, // Set scrollbar color
        }
      }
    >
      <Box display="flex" flexDirection="column" gap="2rem">
        {Array.isArray(notifications) &&
          notifications.map((user, index) => (
            <Box
              sx={{
                "&:hover": {
                  backgroundColor: mode == "dark" ? "#333333" : "#EBEBEA",
                  cursor: "pointer",
                },
              }}
            >
              <NotificationList // it is component : path client/src/components/NotificationList.jsx
                key={`${user.userId}_${index}`}
                friendId={user.userId}
                name={`${user.firstName} ${user.lastName}`}
                subtitle={user.occupation}
                userPicturePath={user.picturePath}
                message={user.message}
                time={user.time}
                read={user.read}
              />
              <Divider
                sx={{
                  color:
                    mode == "dark"
                      ? `${palette.primary.main} ${palette.background.default}`
                      : "light",
                }}
              />
            </Box>
          ))}

        {(!notifications || notifications.length === 0) && (
          <Typography
            color={palette.neutral.medium}
            sx={{ textAlign: "center" }}
            fontSize="500"
            fontWeight={500}
          >
            It looks like you haven't any Notifications yet.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default NotificationWidget;
