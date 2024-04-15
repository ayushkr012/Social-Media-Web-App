import { useState, useEffect, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import Message from './Message';
import { getMsgs, newMessage } from 'state';

const Wrapper = styled(Box)`
    background-image: url(${'https://i.pinimg.com/1200x/26/88/9f/26889fb85cb76049f09b4ca91ef42a4d.jpg'});
    background-size: 50%;
    border-radius: 20px;
    height:64vh;
`;

const Component = styled(Box)`
    overflow-y: auto;
    height: 54vh;
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

const Container = styled(Box)`
    padding: 10px 40px;
`;
// props data coming from ChatBox.jsx
const Messages = ({ friendId, conversation }) => {
    

    const [value, setValue] = useState('');
    const [msg, setMsg] = useState('');
    const [newmsg, setNewmsg] = useState(false);
    const userId = useSelector((state) => state.user?._id);
    const mode = useSelector((state) => state.mode);
    // const [ file, setFile ] = useState();
    const scrollRef = useRef();

    useEffect(() => {
        const getmsgDetails = async () => {
            let data = await getMsgs(conversation._id);
            setMsg(data);
        }
        conversation._id && getmsgDetails();
    },[conversation._id, friendId, newmsg])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: 'smooth'})
    },[msg]);

    const sendText = async (e) => {
        console.log(e);
        const code = e.keyCode || e.which;
        if (code === 13) {
            let message = {
                senderId: userId,
                receiverId: friendId,
                conversationId: conversation._id,
                type: 'text',
                text: value
            }
            await newMessage(message);
            setValue('');
            setNewmsg(prev => !prev);
        }
        else{
            console.log("error");
        }
    }

    return (
        <Wrapper>
            <Component mode={mode}>
                {
                    msg && msg.map(message => (
                        <Container ref={scrollRef}>
                            <Message message={message} />
                        </Container>
                    ))
                }
            </Component>
            <Footer
                sendText={sendText}
                setValue={setValue}
                value={value}
            // file={file}
            // setFile={setFile}
            />
        </Wrapper>
    )
}

export default Messages;