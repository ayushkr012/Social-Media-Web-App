import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup"; // yup is a JavaScript library for object schema validation.
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const feedbackSchema = yup.object().shape({
  feedback: yup.string().required("Feedback is required"),
});

const initialValuesFeedback = {
  feedback: "",
};

const FeedbackForm = () => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { firstName, lastName, email } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  let navigate = useNavigate();

  const sendFeedback = async (values, onSubmitProps) => {
    const responce = await fetch("http://localhost:3001/users/feedback", {
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
      // Set success message
      toast.success(json.message);

      // after 2 second it will redirect to login page
      setTimeout(() => {
        navigate("/home");
      }, 2500);
    } else {
      // Set error message
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
          </Box>
          <ToastContainer />
        </form>
      )}
    </Formik>
  );
};

export default FeedbackForm;
