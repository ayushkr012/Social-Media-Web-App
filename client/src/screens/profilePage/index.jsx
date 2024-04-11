import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "screens/navbar";
import FriendListWidget from "screens/widgets/FriendListWidget";
import PostsWidget from "screens/widgets/PostsWidget";
import UserWidget from "screens/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams(); // grab the userId from the url
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const getUser = async () => {
    const response = await fetch(`${BackendUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
        sx={{
          maxHeight: "100vh", //"calc(100vh - 200px)", // Adjust the max height as per your design
          overflowY: "auto", // Add vertical scrollbar
          scrollbarWidth: "0px", // Set scrollbar width thin bold strong
          scrollbarColor: `${palette.primary.main} ${palette.background.default}`, // Set scrollbar color
        }}
      >
        <Box flexBasis={isNonMobileScreens ? "60%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
            isProfile
          />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "22%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <FriendListWidget userId={userId} />
          <Box m="2rem 0" />
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ProfilePage;
