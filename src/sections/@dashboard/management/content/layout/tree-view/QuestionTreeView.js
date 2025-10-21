import {
  Drawer,
  Fab,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import StandardBar from "sections/@dashboard/management/content/layout/tree-view/StandardBar";
import { Fragment, useEffect, useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { LoadingButton } from "@mui/lab";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import Scrollbar from "components/scrollbar";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import { ArrowRight } from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import DoneIcon from "@mui/icons-material/Done";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";

export default function QuestionTreeView() {
  const { dockOpen, bookIndexList, updateDock, loadStandard, addStandard } =
    useContent();

  const [loading, setLoading] = useState(bookIndexList.standards.length === 0);
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newStandard, setNewStandard] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (loading) {
        await loadStandard();
        setLoading(false);
      }
    };
    fetchData()
      .then((_) => {})
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadStandard]);

  return (
    <Fragment>
      {!dockOpen && (
        <Fab
          onClick={() => updateDock(true)}
          variant="extended"
          sx={{
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            position: "fixed",
            right: 0,
          }}
        >
          <ListIcon sx={{ mr: 1 }} />
        </Fab>
      )}
      <Drawer
        open={dockOpen}
        variant="persistent"
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
            <ListItemButton
              onClick={() => updateDock(false)}
              sx={{ height: 56 }}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText
                primary="Index"
                secondary={
                  "Loaded " +
                  bookIndexList.standards.length.toString() +
                  " out of " +
                  bookIndexList.total.toString()
                }
                primaryTypographyProps={{
                  fontWeight: "medium",
                  variant: "body2",
                }}
              />
            </ListItemButton>

            <Tooltip title="Create a Standard">
              <IconButton
                size="large"
                onClick={() => setCreatingNew(true)}
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
                <ArrowRight
                  sx={{ position: "absolute", right: 4, opacity: 0 }}
                />
              </IconButton>
            </Tooltip>
          </ListItem>

          {creatingNew && (
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
              size="small"
              color="success"
              autoFocus={creatingNew}
              disabled={submittingNew}
              value={newStandard}
              onChange={(e) => setNewStandard(e.target.value)}
              style={{ borderRadius: 0, paddingLeft: 11 }}
              startAdornment={<ArrowRightIcon fontSize="small" />}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={async () => {
                      setNewStandard("");
                      setCreatingNew(false);
                    }}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSubmittingNew(true);
                      await addStandard(newStandard);
                      setSubmittingNew(false);
                      setNewStandard("");
                      setCreatingNew(false);
                    }}
                    edge="end"
                  >
                    <DoneIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          )}

          {bookIndexList.standards.map((standard) => (
            <StandardBar key={standard.$id} standardId={standard.$id} />
          ))}

          {(loading ||
            bookIndexList.total !== bookIndexList.standards.length) && (
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
        </Scrollbar>
      </Drawer>
    </Fragment>
  );
}
