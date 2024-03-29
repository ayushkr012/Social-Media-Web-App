import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup"; // yup is a JavaScript library for object schema validation.
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
// yup It allows you to define a schema for an object and then validate that object against the specified schema.
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const otpLoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const enterOtpSchema = yup.object().shape({
  otp: yup.string().required("OTP is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const initialValuesOtpLogin = {
  email: "",
};

const initialValuesEnterOtp = {
  otp: "",
};

const Form = () => {
  const [userEmail, setUserEmail] = useState("");
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isOtpLogin = pageType === "otp";
  const isEnterOtp = pageType == "enterOtp";

  const handleOtpLogin = () => {
    // when user clink on login with otp set pageType to otp
    setPageType("otp");
  };

  const SendOtp = async (values, onSubmitProps) => {
    const response = await fetch("http://localhost:3001/auth/sendotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
      }),
    });

    const json = await response.json();
    if (json.success) {
      toast.success(json.message);
      // after 1.5 second set page type to enterotp
      setTimeout(() => {
        setUserEmail(values.email);
        setPageType("enterOtp");
      }, 1500);
    } else {
      toast.error(json.message);
    }
  };

  const enterOtp = async (values, onSubmitProps) => {
    const response = await fetch("http://localhost:3001/auth/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        otp: values.otp,
      }),
    });
    const json = await response.json();
    // onSubmitProps.resetForm();
    if (json.success) {
      dispatch(
        setLogin({
          // when we have to pass as a payload we use an object and pass the data as a key value pair
          user: json.user,
          token: json.token,
        })
      );
      toast.success(json.message);
      setTimeout(() => navigate("/home"), 1000); // navigate to home after 1 seconds
    } else {
      toast.error(json.message);
    }
  };

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    if (!values.picture || !values.picture.name.trim()) {
      return toast.error("Please upload a picture");
    }

    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const json = await savedUserResponse.json();
    // onSubmitProps.resetForm();

    if (json.success) {
      toast.success(json.message);
      setTimeout(() => setPageType("login"), 1000);
      // setPageType("login");
    } else {
      toast.error(json.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await loggedInResponse.json();
    // onSubmitProps.resetForm();
    if (json.success) {
      dispatch(
        setLogin({
          // when we have to pass as a payload we use an object and pass the data as a key value pair
          user: json.user,
          token: json.token,
        })
      );
      toast.success(json.message);
      setTimeout(() => navigate("/home"), 1000); // navigate to home after 1 seconds
    } else {
      toast.error(json.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isOtpLogin) await SendOtp(values, onSubmitProps);
    if (isEnterOtp) await enterOtp(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        isLogin
          ? initialValuesLogin
          : isOtpLogin
          ? initialValuesOtpLogin
          : isEnterOtp
          ? initialValuesEnterOtp
          : initialValuesRegister
      }
      validationSchema={
        isLogin
          ? loginSchema
          : isOtpLogin
          ? otpLoginSchema
          : isEnterOtp
          ? enterOtpSchema
          : registerSchema
      }
    >
      {/*   {()=>()}   */}
      {/*   {(  { here inside we pass the props }  )=>()} */}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, // for smaller screens it will take 4 columns
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }} // for larger screens it will take 2 columns
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* user profile image upload */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone // for image upload we use Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={
                      (acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0]) // set the value of picture to the first file
                    }
                  >
                    {/* {({props1,props2})=>()}  call back function */}

                    {(
                      { getRootProps, getInputProps } // getRootProps and getInputProps are the props that we get from Dropzone
                    ) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            {isOtpLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4", mb: "0vh", mt: "10vh" }}
                />
                {/* <TextField
                  label="OTP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp}
                  name="otp"
                  error={Boolean(touched.otp) && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4" }}
                /> */}
              </>
            )}

            {isEnterOtp && (
              <>
                <TextField
                  label="OTP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp}
                  name="otp"
                  error={Boolean(touched.otp) && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4", mb: "0vh", mt: "10vh" }}
                />
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin
                ? "LOGIN"
                : isOtpLogin || isEnterOtp
                ? "Submit"
                : "REGISTER"}
            </Button>
            {isLogin ? (
              <FlexBetween>
                <Typography
                  onClick={() => {
                    setPageType("register");
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  Don't have an account? Sign Up here.
                </Typography>
                {isLogin && (
                  <Button onClick={handleOtpLogin}>Login with OTP</Button>
                )}
              </FlexBetween>
            ) : isOtpLogin || isEnterOtp ? (
              <Typography
                onClick={() => {
                  setPageType("register");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                Don't have an account? Sign Up here.
              </Typography>
            ) : (
              <Typography
                onClick={() => {
                  setPageType("login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                Already have an account? Login here.
              </Typography>
            )}
          </Box>

          <ToastContainer />
        </form>
      )}
    </Formik>
  );
};

export default Form;
