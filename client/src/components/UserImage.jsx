import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const UserImage = ({ image, size = "60px" }) => {
  const BackendUrl = useSelector((state) => state.BackendUrl);
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${BackendUrl}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
