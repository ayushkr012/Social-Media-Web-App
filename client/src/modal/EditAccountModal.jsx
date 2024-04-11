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

const EditAccountModal = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedUser);
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
        }}
      >
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
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditAccountModal;
