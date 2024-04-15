import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import Chatheader from "./Chatheader";
import Messages from "./Messages";
import { getConversation } from "state";

const ChatBox = ({ friendId }) => {
  console.log(friendId);
  const userId = useSelector((state) => state.user?._id);
  const [conversation, setConversation] = useState({});


  useEffect(() => {
    const getConverDetails = async () => {
      let data = await getConversation({ senderId: userId, receiverId: friendId });
      setConversation(data);
      console.log(data)
    }
    getConverDetails();
  }, [userId,friendId]);

  return (
    <WidgetWrapper>
      <Chatheader />
      <Messages friendId={friendId} conversation={conversation} />
    </WidgetWrapper>
  );
};

export default ChatBox;
