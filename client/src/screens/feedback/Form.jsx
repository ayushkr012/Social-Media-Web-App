import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup"; // yup is a JavaScript library for object schema validation.
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import WidgetWrapper from "components/WidgetWrapper";

const feedbackSchema = yup.object().shape({
  feedback: yup.string().required("Feedback is required"),
});

const initialValuesFeedback = {
  feedback: "",
};

const FeedbackForm = () => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { firstName, lastName, email } = useSelector((state) => state.user);
  const [isloading, setisLoading] = useState(false);
  const BackendUrl = useSelector((state) => state.BackendUrl);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  let navigate = useNavigate();
  console.log(BackendUrl);

  const sendFeedback = async (values, onSubmitProps) => {
    setisLoading(true);
    const responce = await fetch(`${BackendUrl}/users/feedback`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        feedback: values.feedback,
      }),
    });
    const json = await responce.json();
    if (json.success) {
      toast.success(json.message);
      setisLoading(false);

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      toast.error(json.message);
    }
  };

  return (
    <Formik
      onSubmit={sendFeedback}
      initialValues={initialValuesFeedback}
      validationSchema={feedbackSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Typography variant="h5" gutterBottom>
              We'd love to hear your feedback!
            </Typography>
            <TextField
              label="Feedback"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.feedback}
              name="feedback"
              multiline
              rows={6}
              variant="outlined"
              error={Boolean(touched.feedback) && Boolean(errors.feedback)}
              helperText={touched.feedback && errors.feedback}
              fullWidth
              sx={{ mt: 2 }}
            />
            {isloading ? (
              <WidgetWrapper>
                <Loading />
              </WidgetWrapper>
            ) : (
              <Button
                fullWidth
                type="submit"
                disabled={feedbackSent}
                sx={{
                  mt: 2,
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {feedbackSent ? "Feedback Sent" : "Send Feedback"}
              </Button>
            )}
          </Box>
          <ToastContainer />
        </form>
      )}
    </Formik>
  );
};

export default FeedbackForm;
