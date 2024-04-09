import {
  Handshake,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import { setNotifications } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

// props data came from the PostWidget.jsx and FriendListWidget.jsx
const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user); // destruct the id from the current login user
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends); // take a look of user schema for better understanding // here we grab the current login user friends list
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const mode = useSelector((state) => state.mode);

  // check if the friend is in the user's friends list so we add and remove friend
  const isFriend =
    Array.isArray(friends) && friends.find((friend) => friend._id === friendId);

  /*  ---------------------> addRemoveFriend <-----------------------*/
  const patchFriend = async () => {
    const response = await fetch(`${BackendUrl}/users/${_id}/${friendId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  // navigate to the user friend profile page
  // and send the data to the server to update the notification so user get notified when someone view their profile
  // and update the profile view Count
  const handleClick = async () => {
    const response = await fetch(
      `${BackendUrl}/users/profileview/${_id}/${friendId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(notifications);
    dispatch(setNotifications({ notifications: data.updatedNotifications }));

    navigate(`/profile/${friendId}`);
    //  we go to the user friend profile page and then again go to the someone profile page
    // then url update with react router but component does not reender so we use navigate(0) to reender the component
    navigate(0);
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box onClick={handleClick}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color:
                  mode == "dark" ? palette.primary.dark : palette.primary.dark,
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

      {/*  not show add or remove friend when user has own post  */}
      {_id != friendId && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
