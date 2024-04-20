import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RotatingLines } from "react-loader-spinner";

const EditAccountModal = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false); // State to track loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true); // Set loading to true when save button is clicked
    await onSave(editedUser); // Await onSave function which is async
    setLoading(false); // Set loading to false once response is received
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 400,
          maxWidth: 600,
          borderRadius: 8,
          overflow: "hidden", // Ensure modal content is not clipped by the spinner
          pointerEvents: loading ? "none" : "auto", // Disable pointer events when loading
        }}
      >
        {loading && ( // Render spinner only when loading
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999, // Ensure spinner is above modal content
            }}
          >
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </Box>
        )}
        <IconButton
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Edit Account
        </Typography>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={editedUser.firstName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={editedUser.lastName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={editedUser.location}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Profession"
          name="occupation"
          value={editedUser.occupation}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="linkedinProfile"
          name="linkedinProfile"
          value={editedUser.linkedinProfile}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="twitterProfile"
          name="twitterProfile"
          value={editedUser.twitterProfile}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditAccountModal;
