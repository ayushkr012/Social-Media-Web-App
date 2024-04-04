import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import NotificationWidget from "screens/widgets/NotificationWidget";
import FlexBetween from "components/FlexBetween";

const Notification = () => {
  // const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user); // destruct the userId from the user object
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [activeMenuItem, setActiveMenuItem] = useState("All");

  //   const getNotification = async () => {
  //     const response = await fetch(`http://localhost:3001/users/${_id}`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     setUser(data);
  //   };

  //   useEffect(() => {
  //     getNotification();
  //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //   if (!user) return null;

  //  {
  //    theme.palette.mode === "dark" ? (
  //      <DarkMode sx={{ fontSize: "25px" }} />
  //    ) : (
  //      <LightMode sx={{ color: dark, fontSize: "25px" }} />
  //    );
  //  }

  const BoxStyle = {
    padding: "0.8rem",
    borderRadius: "1rem",
    border: "1px solid",
    transition: "background-color 0.3s ease",
  };

  const BoxHoverStyle = {
    ...BoxStyle,
    "&:hover": {
      backgroundColor: "lightgray", // Change to appropriate color for light mode
      cursor: "pointer",
      color: "black",
    },
  };

  const BoxActiveStyle = {
    ...BoxStyle,
    backgroundColor: "darkgreen", // Change to appropriate color for active state
    color: "white",
  };
  const MenuItem = ({ text, isActive, onClick }) => {
    const boxStyle = isActive ? BoxActiveStyle : BoxHoverStyle;

    return (
      <Box sx={boxStyle} onClick={onClick} ml="1rem">
        <Typography fontWeight="500">{text}</Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 13%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {/* left part of notification */}
        <WidgetWrapper
          flexBasis={isNonMobileScreens ? "25%" : undefined}
          style={{ height: "18vh" }}
        >
          <Box
            display={
              isNonMobileScreens
                ? "block"
                : {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
            }
          >
            <Box
              display={isNonMobileScreens ? "block" : "flex"}
              //   mt={isNonMobileScreens ? "0.5rem" : undefined}
            >
              <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="430"
              >
                Manage your
              </Typography>
              <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="430"
                ml={isNonMobileScreens ? undefined : "0.3rem"}
              >
                Notifications
              </Typography>
            </Box>
            <Box mt={isNonMobileScreens ? "0.7rem" : undefined}>
              <Typography color="primary">View Settings</Typography>
            </Box>
          </Box>
        </WidgetWrapper>

        {/* middle part of notification */}
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          <WidgetWrapper>
            <FlexBetween>
              <FlexBetween>
                <MenuItem
                  text="All"
                  isActive={activeMenuItem === "All"}
                  onClick={() => setActiveMenuItem("All")}
                />
                <MenuItem
                  text="Unread"
                  isActive={activeMenuItem === "Unread"}
                  onClick={() => setActiveMenuItem("Unread")}
                />
                <MenuItem
                  text="My Posts"
                  isActive={activeMenuItem === "My Posts"}
                  onClick={() => setActiveMenuItem("My Posts")}
                />
                <MenuItem
                  text="Mentions"
                  isActive={activeMenuItem === "Mentions"}
                  onClick={() => setActiveMenuItem("Mentions")}
                />
              </FlexBetween>
            </FlexBetween>
          </WidgetWrapper>

          <Box m="1rem 0" />
          <NotificationWidget userId={_id} />
          <Box m="2rem 0" />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "22%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* <NotificationWidget userId={_id} /> */}
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default Notification;
