import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import NotificationWidget from "screens/widgets/NotificationWidget";
import FlexBetween from "components/FlexBetween";
import { setNotifications } from "state";
import { useDispatch } from "react-redux";
const Notification = () => {
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user); // destruct the userId from the user object
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [activeMenuItem, setActiveMenuItem] = useState("All");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const mode = useSelector((state) => state.mode);

  useEffect(() => {
    const getNotification = async () => {
      const response = await fetch(`${BackendUrl}/users/notification/${_id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // console.log(notifications);
      dispatch(setNotifications({ notifications: data.updatedNotifications }));
    };

    getNotification();
  }, []);

  // middle up section part of notification
  const BoxStyle = {
    padding: "0.8rem",
    borderRadius: "1rem",
    border: "1px solid",
    transition: "background-color 0.3s ease",
  };

  const BoxHoverStyle = {
    ...BoxStyle,
    "&:hover": {
      backgroundColor:
        mode == "dark" ? palette.primary.dark : palette.primary.light,
      cursor: "pointer",
      color: "black",
    },
  };

  const BoxActiveStyle = {
    ...BoxStyle,
    backgroundColor: "darkgreen",
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
  const paragraphColor =
    mode === "dark" ? palette.text.secondary : palette.text.primary;

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
          style={{ height: isNonMobileScreens ? "18vh" : "10vh" }}
        >
          <Box
            display={
              isNonMobileScreens
                ? "block"
                : {
                    display: "block",
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
                Manage your Notifications
              </Typography>
            </Box>
            <Box mt={isNonMobileScreens ? "0.7rem" : undefined}>
              <Typography
                color="primary"
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  cursor: "pointer",
                }}
              >
                View Settings
              </Typography>
            </Box>
          </Box>
        </WidgetWrapper>

        {/* middle part of notification */}
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          {isNonMobileScreens ? (
            // when the screen is not mobile
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
          ) : (
            // when the screen is mobile
            <WidgetWrapper>
              <FlexBetween sx={{ flexWrap: "wrap" }}>
                {/* <FlexBetween> */}
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
                {/* </FlexBetween> */}
              </FlexBetween>
            </WidgetWrapper>
          )}

          <Box m="1rem 0" />
          <NotificationWidget userId={_id} />
          <Box m="2rem 0" />
        </Box>

        {/* right part of notification */}
        <Box
          flexBasis={isNonMobileScreens ? "22%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          display="flex"
          justifyContent="center"
        >
          <Box style={{ textAlign: "center" }}>
            <Typography
              color="primary"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <p style={{ color: paragraphColor }}>
                About | Accessibility | Help Center
              </p>
            </Typography>

            <Typography
              color="primary"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <p style={{ color: paragraphColor }}>
                Privacy & Terms | Ad Choices | Advertising
              </p>
            </Typography>
            <Typography
              color="primary"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <p style={{ color: paragraphColor }}>
                Business Services | Get the Connectify app
              </p>
            </Typography>
            <Typography
              color="primary"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <p style={{ color: paragraphColor }}>
                Connectify Corporation © 2024
              </p>
            </Typography>
          </Box>
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default Notification;
