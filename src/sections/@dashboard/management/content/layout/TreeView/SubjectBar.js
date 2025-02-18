import {
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Fragment, useEffect, useState } from "react";
import ChapterBar from "./ChapterBar";
import { useContent } from "../../hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { timeAgo } from "auth/AppwriteContext";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";

export default function SubjectBar({ standardId, subjectId }) {
  const { standardsData, loadChapter, refreshChapter, addChapter } =
    useContent();
  const subjectData =
    standardsData.documents[standardId].subjects.documents[subjectId];

  const [chaptersOpened, setChaptersOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newChapter, setNewChapter] = useState("");

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const initiateCreateChapter = async () => {
    setChaptersOpened(true);
    handleCloseMenu();
    if (!chaptersOpened && subjectData.chapters.loadedOnce === false) {
      setChaptersLoading(true);
      await loadChapter(standardId, subjectId);
      setChaptersLoading(false);
    }
    setCreatingNew(true);
  };

  const refreshSubject = async () => {
    handleCloseMenu();
    setChaptersOpened(false);
    setRefreshing(true);
    await refreshChapter(standardId, subjectId);
    setRefreshing(false);
  };

  return (
    <Fragment>
      <Fragment>
        <LoadingButton
          fullWidth
          variant={chaptersOpened ? "contained" : "outlined"}
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 25 }}
          color="primary"
          startIcon={
            chaptersOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
          }
          onClick={async () => {
            setChaptersOpened(!chaptersOpened);
            setChaptersLoading(true);
            if (!chaptersOpened && subjectData.chapters.loadedOnce === false) {
              await loadChapter(standardId, subjectId);
            }
            setChaptersLoading(false);
          }}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {subjectData?.subject}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateChapter}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Chapter</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a mock Test</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <AddToQueueIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Product</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Questions</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <ViewCompactAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View mock Tests</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <ViewQuiltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View products</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={refreshSubject}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(subjectData.lastSynced))}
          </MenuItem>
        </Menu>
      </Fragment>

      {chaptersOpened && (
        <Fragment>
          {creatingNew && (
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
              size="small"
              color="success"
              autoFocus={creatingNew}
              disabled={submittingNew}
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              style={{ borderRadius: 0, paddingLeft: 33 }}
              startAdornment={<ArrowRightIcon fontSize="small" />}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={async () => {
                      setNewChapter("");
                      setCreatingNew(false);
                    }}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSubmittingNew(true);
                      await addChapter(newChapter, standardId, subjectId);
                      setSubmittingNew(false);
                      setNewChapter("");
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

          {Object.keys(subjectData.chapters.documents).map((id, index) => (
            <ChapterBar
              key={index}
              standardId={standardId}
              subjectId={subjectId}
              chapterId={id}
            />
          ))}

          {(chaptersLoading ||
            subjectData.chapters.total !==
              Object.keys(subjectData.chapters.documents).length) && (
            <LoadingButton
              fullWidth
              variant="contained"
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 65,
              }}
              color="secondary"
              startIcon={<KeyboardDoubleArrowDownIcon />}
              onClick={async () => {
                setChaptersLoading(true);
                await loadChapter(standardId, subjectId);
                setChaptersLoading(false);
              }}
              loading={chaptersLoading}
            >
              Load More
            </LoadingButton>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
