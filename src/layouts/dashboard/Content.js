import PropTypes from "prop-types";
import {Box} from "@mui/material";
import { useSettingsContext } from "components/settings";
import {useContent} from "sections/@dashboard/management/content/hook/useContent";

Content.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node,
};

export default function Content({ children, sx, ...other }) {
  const { themeMode } = useSettingsContext();

  const { dockOpen } = useContent()

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: themeMode === "light" ? "#F5F5F5" : "black",
        border: '2px solid grey',
        boxShadow: themeMode === "light" ? '5px 5px 8px rgba(0,0,0,0.5)' : '5px 5px 8px rgba(255,255,255,0.5)',
        zIndex: -5,
        pb: 2,
        pt: 2,
        width: `calc(100% - ${dockOpen ? 400: 0}px)`,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
