import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import { toast } from "react-toastify";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditAccountModal from "../../modal/EditAccountModal";
import { setUser, setPosts } from "state";

// props data came from homePage/index.jsx and profilePage/index.jsx
const UserWidget = ({ userId, picturePath, isProfile = false }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal open/close
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const user = useSelector((state) => state.user);
  const LoggedInUser = useSelector((state) => state.user?._id);
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const [ProfileUser, setProfileUser] = useState(null);

  // let suppose we get the other user profile  then we have to fetch the data of that user
  const getUserData = async () => {
    try {
      const response = await fetch(`${BackendUrl}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();

      setProfileUser(user);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  // Function to handle opening the edit account modal user can edit their own account

  const isOwnProfile = LoggedInUser === userId; // we allow only the user to edit their own profile

  const handleEditAccount = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEditedUser = async (editedUser) => {
    console.log("editedUser", editedUser);
    // Handle saving edited user data
    try {
      const response = await fetch(`${BackendUrl}/users/${userId}/edituser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      const json = await response.json();
      if (json.success) {
        setProfileUser(editedUser); // set the updated user object so it reflect changes in real time

        // if the user is on their profile page then update the posts in the state
        if (isProfile) {
          dispatch(setPosts({ posts: json.userallposts }));
        } else {
          dispatch(setPosts({ posts: json.allfeedposts }));
        }
        toast.success(json.message);

        setIsEditModalOpen(false);
      } else {
        console.log("Error saving edited user:", json.message);
        toast.error(json.message);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.log(err);
      setIsEditModalOpen(false);
    }
  };

  if (!ProfileUser) {
    return null;
  }
  // desturcture items from the user object
  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    linkedinProfile,
    twitterProfile,
  } = ProfileUser;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem" // padding bottom
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              onClick={() => navigate(`/profile/${userId}`)}
              variant="h4"
              color={main}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color:
                    mode == "dark"
                      ? palette.text.primary
                      : palette.text.primary,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            {/* <Typography color={medium}>{friends.length} friends</Typography> */}
          </Box>
        </FlexBetween>
        {isOwnProfile && (
          <Button onClick={handleEditAccount} sx={{ borderRadius: "10px" }}>
            <ManageAccountsOutlined />
          </Button>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}

      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Profile View Count</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}

      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        {/* LinkedIn Profile */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                LinkedIn
              </Typography>
              <a
                href={linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography
                  sx={{ color: mode == "dark" ? palette.primary.dark : "blue" }}
                >
                  {linkedinProfile}
                </Typography>
              </a>
            </Box>
          </FlexBetween>
          {/* <EditOutlined sx={{ color: main }} /> */}
        </FlexBetween>

        {/* Twitter Profile */}
        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <a
                href={twitterProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography
                  sx={{ color: mode == "dark" ? palette.primary.dark : "blue" }}
                >
                  {twitterProfile}
                </Typography>
              </a>
            </Box>
          </FlexBetween>
          {/* <EditOutlined sx={{ color: main }} /> */}
        </FlexBetween>
      </Box>
      {isEditModalOpen && (
        <EditAccountModal
          user={user}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedUser}
        />
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
