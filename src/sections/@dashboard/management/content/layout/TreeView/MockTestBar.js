import { Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function MockTestBar({ mtId, id, level }) {
  return (
    <Button
      fullWidth
      variant="outlined"
      style={{
        justifyContent: "left",
        borderRadius: 0,
        paddingLeft:
          level === 1 ? 40 : level === 2 ? 65 : level === 3 ? 85 : 105,
      }}
      color={
        level === 1
          ? "info"
          : level === 2
          ? "secondary"
          : level === 3
          ? "success"
          : "info"
      }
      startIcon={<MenuBookIcon />}
      onClick={() => console.log("Open Mock Test")}
    >
      {mtId}
    </Button>
  );
}
