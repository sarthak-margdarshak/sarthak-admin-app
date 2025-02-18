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
import ConceptBar from "sections/@dashboard/management/content/layout/TreeView/ConceptBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
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

export default function ChapterBar({ standardId, subjectId, chapterId }) {
  const { standardsData, loadConcept, refreshConcept, addConcept } =
    useContent();
  const chapterData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId];

  const [conceptsOpened, setConceptsOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [conceptsLoading, setConceptsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newConcept, setNewConcept] = useState("");

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const initiateCreateConcept = async () => {
    setConceptsOpened(true);
    handleCloseMenu();
    if (!conceptsOpened && chapterData.concepts.loadedOnce === false) {
      setConceptsLoading(true);
      await loadConcept(standardId, subjectId, chapterId);
      setConceptsLoading(false);
    }
    setCreatingNew(true);
  };

  const refreshChapter = async () => {
    handleCloseMenu();
    setConceptsOpened(false);
    setRefreshing(true);
    await refreshConcept(standardId, subjectId, chapterId);
    setRefreshing(false);
  };

  return (
    <Fragment>
      <Fragment>
        <LoadingButton
          fullWidth
          variant={conceptsOpened ? "contained" : "outlined"}
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 35 }}
          color="secondary"
          startIcon={
            conceptsOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
          }
          onClick={async () => {
            setConceptsOpened(!conceptsOpened);
            setConceptsLoading(true);
            if (!conceptsOpened && chapterData.concepts.loadedOnce === false) {
              await loadConcept(standardId, subjectId, chapterId);
            }
            setConceptsLoading(false);
          }}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {chapterData.chapter}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateConcept}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Concept</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {}}>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a mock Test</ListItemText>
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

          <MenuItem onClick={refreshChapter}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(chapterData.lastSynced))}
          </MenuItem>
        </Menu>
      </Fragment>

      {conceptsOpened && (
        <Fragment>
          {creatingNew && (
            <OutlinedInput
              id="outlined-basic"
              variant="outlined"
              size="small"
              color="success"
              autoFocus={creatingNew}
              disabled={submittingNew}
              value={newConcept}
              onChange={(e) => setNewConcept(e.target.value)}
              style={{ borderRadius: 0, paddingLeft: 50 }}
              startAdornment={<ArrowRightIcon fontSize="small" />}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={async () => {
                      setNewConcept("");
                      setCreatingNew(false);
                    }}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSubmittingNew(true);
                      await addConcept(
                        newConcept,
                        standardId,
                        subjectId,
                        chapterId
                      );
                      setSubmittingNew(false);
                      setNewConcept("");
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

          {Object.keys(chapterData.concepts.documents).map((id, index) => (
            <ConceptBar
              key={index}
              standardId={standardId}
              subjectId={subjectId}
              chapterId={chapterId}
              conceptId={id}
            />
          ))}

          {(conceptsLoading ||
            chapterData.concepts.total !==
              Object.keys(chapterData.concepts.documents).length) && (
            <LoadingButton
              fullWidth
              variant="contained"
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 85,
              }}
              color="success"
              startIcon={<KeyboardDoubleArrowDownIcon />}
              onClick={async () => {
                setConceptsLoading(true);
                await loadConcept(standardId, subjectId, chapterId);
                setConceptsLoading(false);
              }}
              loading={conceptsLoading}
            >
              Load More
            </LoadingButton>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
