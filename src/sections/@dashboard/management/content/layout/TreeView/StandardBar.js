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
import SubjectBar from "sections/@dashboard/management/content/layout/TreeView/SubjectBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { timeAgo } from "auth/AppwriteContext";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";

export default function StandardBar({ standardId }) {
  const { standardsData, loadSubject, refreshSubject, addSubject } =
    useContent();
  const standardData = standardsData.documents[standardId];
  const navigate = useNavigate();

  const [subjectsOpened, setSubjectsOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const initiateCreateSubject = async () => {
    setSubjectsOpened(true);
    handleCloseMenu();
    if (!subjectsOpened && standardData.subjects.loadedOnce === false) {
      setSubjectsLoading(true);
      await loadSubject(standardId);
      setSubjectsLoading(false);
    }
    setCreatingNew(true);
  };

  const refreshStandard = async () => {
    handleCloseMenu();
    setSubjectsOpened(false);
    setRefreshing(true);
    await refreshSubject(standardId);
    setRefreshing(false);
  };

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + standardId);
  };

  return (
    <Fragment>
      <Fragment>
        <LoadingButton
          fullWidth
          variant={subjectsOpened ? "contained" : "outlined"}
          style={{ justifyContent: "left", borderRadius: 0 }}
          color="success"
          startIcon={
            subjectsOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
          }
          onClick={async () => {
            setSubjectsOpened(!subjectsOpened);
            setSubjectsLoading(true);
            if (!subjectsOpened && standardData.subjects.loadedOnce === false) {
              await loadSubject(standardId);
            }
            setSubjectsLoading(false);
          }}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {standardData.standard}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateSubject}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Subject</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a mock Test</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <AddToQueueIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Product</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={openQuestion}>
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Questions</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <ViewCompactAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View mock Tests</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <ViewQuiltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View products</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={refreshStandard}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(standardData.lastSynced))}
          </MenuItem>
        </Menu>
      </Fragment>

      {subjectsOpened && (
        <Fragment>
          {creatingNew && (
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
              size="small"
              color="success"
              autoFocus={creatingNew}
              disabled={submittingNew}
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              style={{ borderRadius: 0, paddingLeft: 23 }}
              startAdornment={<ArrowRightIcon fontSize="small" />}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={async () => {
                      setNewSubject("");
                      setCreatingNew(false);
                    }}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSubmittingNew(true);
                      await addSubject(newSubject, standardId);
                      setSubmittingNew(false);
                      setNewSubject("");
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

          {Object.keys(standardData.subjects.documents).map((id, index) => (
            <SubjectBar key={index} subjectId={id} standardId={standardId} />
          ))}

          {(subjectsLoading ||
            standardData.subjects.total !==
              Object.keys(standardData.subjects.documents).length) && (
            <LoadingButton
              fullWidth
              variant="contained"
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 25,
              }}
              color="info"
              startIcon={<KeyboardDoubleArrowDownIcon />}
              onClick={async () => {
                setSubjectsLoading(true);
                await loadSubject(standardId);
                setSubjectsLoading(false);
              }}
              loading={subjectsLoading}
            >
              Load More
            </LoadingButton>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
