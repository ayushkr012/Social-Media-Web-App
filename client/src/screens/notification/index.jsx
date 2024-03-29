import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import FriendListWidget from "screens/widgets/FriendListWidget";
import PostsWidget from "screens/widgets/PostsWidget";
import UserWidget from "screens/widgets/UserWidget";

const Notification = () => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user); // destruct the userId from the user object
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  //   const getNotification = async () => {
  //     const response = await fetch(`http://localhost:3001/users/${_id}`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     setUser(data);
  //   };

  //   useEffect(() => {
  //     getNotification();
  //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //   if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 13%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {/* left part of notification */}
        <WidgetWrapper
          flexBasis={isNonMobileScreens ? "25%" : undefined}
          style={{ height: "18vh" }}
        >
          <Box
            display={
              isNonMobileScreens
                ? "block"
                : {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
            }
          >
            <Box
              display={isNonMobileScreens ? "block" : "flex"}
              //   mt={isNonMobileScreens ? "0.5rem" : undefined}
            >
              <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="430"
              >
                Manage your
              </Typography>
              <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="430"
                ml={isNonMobileScreens ? undefined : "0.3rem"}
              >
                Notifications
              </Typography>
            </Box>
            <Box mt={isNonMobileScreens ? "0.7rem" : undefined}>
              <Typography color="primary">View Settings</Typography>
            </Box>
          </Box>
        </WidgetWrapper>

        {/* middle part of notification */}
        <Box flexBasis={isNonMobileScreens ? "60%" : undefined}>
          {/* <UserWidget userId={userId} picturePath={user.picturePath} /> */}
          <Box m="2rem 0" />
          {/* <PostsWidget userId={userId} isProfile /> */}
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "22%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <FriendListWidget userId={_id} />
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default Notification;
