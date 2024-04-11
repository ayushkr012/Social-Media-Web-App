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
import EditAccountModal from "./EditAccountModal";
import { setUser } from "state";

// props data came from homePage/index.jsx and profilePage/index.jsx
const UserWidget = ({ userId, picturePath }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal open/close
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const user = useSelector((state) => state.user);
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();

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
        // set the updated User object in the state
        dispatch(setUser({ user: json.user }));
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

  if (!user) {
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
  } = user;

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
        <Button onClick={handleEditAccount} sx={{ borderRadius: "10px" }}>
          <ManageAccountsOutlined />
        </Button>
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
                <Typography color={medium}>{linkedinProfile}</Typography>
              </a>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
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
                <Typography color={medium}>{twitterProfile}</Typography>
              </a>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
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
