import { Box, Typography, useTheme } from "@mui/material";
import UserChatFriend from "screens/chatSection/UserChatFriend";
import WidgetWrapper from "components/WidgetWrapper";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "@mui/material";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { socket, setActiveUsers } from "state";

const ScrollableBox = styled(Box)`
  overflow-y: auto;
  height: 61vh;
  &::-webkit-scrollbar {
    width: 0.5em;
  }
  &::-webkit-scrollbar-track {
    background: ${({ mode }) => (mode === "light" ? "#f0f0f0" : "#ggg")};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ mode }) => (mode === "light" ? "#ccc" : "#fff")};
  }
`;

const FriendListWidget = () => {
  const { palette } = useTheme();
  const dispatch= useDispatch();
  const friends = useSelector((state) => state.user.friends);
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.emit('addUsers', user);
  //     socket.current.on('getUsers', users => {
  //       dispatch(setActiveUsers(users));
  //     });
  //   }
  // }, [user, dispatch]);

  useEffect(() => {
    // Ensure socket exists
    if (socket.current) {
      // Emit 'addUser' event with user ID when component mounts
      socket.current.emit('addUser', user._id);

      // Listen for 'getUsers' event and update active users list
      socket.current.on('getUsers', users => {
        dispatch(setActiveUsers(users));
      });

      // Clean up event listener on unmount
      return () => {
        socket.off('getUsers');
      };
    }
  }, [user, dispatch]);

  return (
    <WidgetWrapper>
      
      <Search/>
      
      <Divider sx={{ mt: "1.5rem",mb: "1.5rem" }} />


      <ScrollableBox mode={mode}>
        {Array.isArray(friends) &&
          friends.map((friend) => (
            <UserChatFriend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))}
        {friends.length === 0 && (
          <Typography color={palette.neutral.medium}>
            It looks like you haven't made any friends yet. Start forging
            meaningful connections today!
          </Typography>
        )}
      </ScrollableBox>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
