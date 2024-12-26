import {
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import StandardBar from "./StandardBar";
import { Fragment, useEffect, useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { LoadingButton } from "@mui/lab";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";
import Scrollbar from "../../../../components/scrollbar";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { ArrowRight } from "@mui/icons-material";
import { timeAgo } from "../../../../auth/AppwriteContext";

export default function QuestionTreeView() {
  const { standardsData, loadStandard, refreshStandard } =
    useQuestionTreeViewContext();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (standardsData.loadedOnce === false) {
        await loadStandard();
      }
      setLoading(false);
    };
    fetchData()
      .then((_) => {})
      .catch((err) => console.log(err));
  }, [loadStandard, standardsData]);

  return (
    <Drawer
      open
      variant="permanent"
      anchor="right"
      PaperProps={{
        sx: {
          mt: 12,
          pb: 15,
          zIndex: 0,
          width: 400,
          bgcolor: "transparent",
          borderLeftStyle: "dashed",
        },
      }}
    >
      <Scrollbar
        sx={{
          height: 1,
          "& .simplebar-content": {
            height: 1,
            margin: 1,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <ListItem component="div" disablePadding>
          <Tooltip
            title={
              standardsData.loadedOnce
                ? "Loaded " +
                  Object.keys(standardsData.documents).length.toString() +
                  " out of " +
                  standardsData.total.toString()
                : "Not yet loaded"
            }
          >
            <ListItemButton sx={{ height: 56 }}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText
                primary="Standards"
                secondary={
                  standardsData.lastSynced === null
                    ? "Not yet Fetched"
                    : timeAgo.format(Date.parse(standardsData.lastSynced))
                }
                primaryTypographyProps={{
                  fontWeight: "medium",
                  variant: "body2",
                }}
              />
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Create a Standard">
            <IconButton
              size="large"
              sx={{
                "& svg": {
                  transition: "0.2s",
                  transform: "translateX(0) rotate(0)",
                },
                "&:hover, &:focus": {
                  bgcolor: "unset",
                  "& svg:first-of-type": {
                    transform: "translateX(-4px) rotate(-90deg)",
                  },
                  "& svg:last-of-type": {
                    right: 0,
                    opacity: 1,
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  height: "80%",
                  display: "block",
                  left: 0,
                  width: "1px",
                  bgcolor: "divider",
                },
              }}
            >
              <AddIcon />
              <ArrowRight sx={{ position: "absolute", right: 4, opacity: 0 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton
              size="large"
              onClick={async () => {
                setRefreshing(true);
                await refreshStandard();
                setRefreshing(false);
              }}
              sx={{
                "& svg": {
                  transition: "0.2s",
                  transform: "translateX(0) rotate(0)",
                },
                "&:hover, &:focus": {
                  bgcolor: "unset",
                  "& svg:first-of-type": {
                    transform: "translateX(-4px) rotate(-360deg)",
                  },
                  "& svg:last-of-type": {
                    right: 0,
                    opacity: 1,
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  height: "80%",
                  display: "block",
                  left: 0,
                  width: "1px",
                  bgcolor: "divider",
                },
              }}
            >
              <RefreshIcon />
              <ArrowRight sx={{ position: "absolute", right: 4, opacity: 0 }} />
            </IconButton>
          </Tooltip>
        </ListItem>

        {refreshing ? (
          <LoadingButton loading={refreshing}>Loading</LoadingButton>
        ) : (
          <Fragment>
            {Object.keys(standardsData.documents).map((id, index) => (
              <StandardBar key={index} standardId={id} />
            ))}

            {(loading ||
              standardsData.total !==
                Object.keys(standardsData.documents).length) && (
              <LoadingButton
                fullWidth
                variant="contained"
                style={{ justifyContent: "left", borderRadius: 0 }}
                color="success"
                startIcon={<KeyboardDoubleArrowDownIcon />}
                onClick={async () => {
                  setLoading(true);
                  await loadStandard();
                  setLoading(false);
                }}
                loading={loading}
              >
                Load More
              </LoadingButton>
            )}
          </Fragment>
        )}
      </Scrollbar>
    </Drawer>
  );
}
