import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import Navbar from "screens/navbar";

const Feedback = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Navbar />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          p="1rem 6%"
          textAlign="center"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            Feedback
          </Typography>
        </Box>
        <Form />
        
      </Box>
    </Box>
  );
};

export default Feedback;
