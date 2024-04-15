import { Box, IconButton, InputBase, styled } from "@mui/material";
import { Send, Photo, Mic, EmojiEmotions } from "@mui/icons-material"; // Import icons
import { useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const Search = styled(Box)`
  background-color: ${({mode}) => (mode === "light" ? "#f0f2f5" : "black")};
  border-radius: 10px;
  width: calc(94% - 100px);
`;

const Inputfield = styled(InputBase)`
  width: 100%;
  padding: 20px;
  height: 10px;
  padding: auto;
  font-size: 16px;
`;


const Footer = ({sendText, setValue, value}) => {
const mode = useSelector((state) => state.mode);


  return (
    
    <WidgetWrapper>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <IconButton aria-label="Add emoji">
              <EmojiEmotions />
            </IconButton>
            <label htmlFor='fileInput'>
                <Photo />
            </label>
            <input
                type='file'
                id='fileInput'
                style={{display:'none'}}
                onChange={(e) => setValue(e.target.value)}
            />
            
          </FlexBetween>
            <Search mode={mode}>
            <Inputfield 
                    placeholder='Write here...'
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => sendText(e)}
                    value={value}
              />
            </Search>
          <FlexBetween gap="1rem">
            <IconButton aria-label="Send message">
              <Send />
            </IconButton>
            <IconButton aria-label="Record voice">
              <Mic />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
    </WidgetWrapper>
  );
};

export default Footer;
