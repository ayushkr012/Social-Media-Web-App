import { useState, useEffect, React } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "screens/navbar";
import UserWidget from "screens/widgets/UserWidget";
import MyPostWidget from "screens/widgets/MyPostWidget";
import PostsWidget from "screens/widgets/PostsWidget";
import AdvertWidget from "screens/widgets/AdvertWidget";
import FriendListWidget from "screens/widgets/FriendListWidget";
import { ToastContainer } from "react-toastify";
import { setNotifications } from "state";
import { useDispatch, useSelector } from "react-redux";
/* we can also do this way 
const HomePage=()=>{};
export default HomePage;

or direct 
export default function HomePage(){}

*/

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user); // destruct the user id and picture path from user after login
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const getNotification = async () => {
    const response = await fetch(
      `http://localhost:3001/users/notification/${_id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // console.log(notifications);
    dispatch(setNotifications({ notifications: data.updatedNotifications }));
  };

  useEffect(() => {
    getNotification();
  });

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        sx={
          // isNonMobileScreens && {
          {
            maxHeight: "100vh", //"calc(100vh - 200px)", // Adjust the max height as per your design
            overflowY: "auto", // Add vertical scrollbar
            scrollbarWidth: "0px", // Set scrollbar width thin bold strong
            scrollbarColor: `${palette.primary.main} ${palette.background.default}`, // Set scrollbar color
          }
        }
      >
        {/*  left part of the home scree */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        {/*  middle part of the home screen */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          // sx={
          //   isNonMobileScreens && {
          //     maxHeight: "100vh", //"calc(100vh - 200px)", // Adjust the max height as per your design
          //     overflowY: "auto", // Add vertical scrollbar
          //     scrollbarWidth: "strong", // Set scrollbar width
          //     scrollbarColor: `${palette.primary.main} ${palette.background.default}`, // Set scrollbar color
          //   }
          // }
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>

        {/*  right part of the home screen */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default HomePage;
