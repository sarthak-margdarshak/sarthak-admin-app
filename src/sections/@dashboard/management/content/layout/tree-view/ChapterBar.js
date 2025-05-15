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
import ConceptBar from "sections/@dashboard/management/content/layout/tree-view/ConceptBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import {
  appwriteAccount,
  appwriteDatabases,
  timeAgo,
} from "auth/AppwriteContext";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from "@mui/icons-material/Edit";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router-dom";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { labels } from "assets/data/labels";

export default function ChapterBar({ standardId, subjectId, chapterId }) {
  const { standardsData, loadConcept, refreshConcept, addConcept } =
    useContent();
  const { user } = useAuthContext();
  const chapterData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId];
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );

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
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [editingChapter, setEditingChapter] = useState(false);
  const [editedChapterName, setEditedChapterName] = useState("");
  const [updatingChapter, setUpdatingChapter] = useState(false);

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

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + chapterId);
  };

  const createMockTest = async () => {
    setMockTestCreating(true);
    const mockTest = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      ID.unique(),
      {
        standard: standardId,
        subject: subjectId,
        chapter: chapterId,
        bookIndex: chapterId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setMockTestCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.edit(mockTest.$id), { replace: true });
  };

  const openMockTest = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + chapterId);
  };

  const initiateEditChapter = () => {
    setEditedChapterName(chapterData.chapter);
    setEditingChapter(true);
    handleCloseMenu();
  };

  const handleUpdateChapter = async () => {
    try {
      setUpdatingChapter(true);
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        chapterId,
        {
          chapter: editedChapterName,
        }
      );
      await refreshConcept(standardId, subjectId, chapterId);
      setEditingChapter(false);
      setEditedChapterName("");
      enqueueSnackbar("Chapter name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingChapter(false);
    }
  };

  return (
    <Fragment>
      <Fragment>
        {editingChapter && isAdminOrFounder ? (
          <OutlinedInput
            fullWidth
            variant="outlined"
            color="success"
            size="small"
            value={editedChapterName}
            onChange={(e) => setEditedChapterName(e.target.value)}
            disabled={updatingChapter}
            style={{ borderRadius: 0, paddingLeft: 35 }}
            startAdornment={<ArrowRightIcon fontSize="small" />}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setEditingChapter(false);
                    setEditedChapterName("");
                  }}
                  edge="end"
                  disabled={updatingChapter}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  onClick={handleUpdateChapter}
                  edge="end"
                  disabled={updatingChapter}
                >
                  <DoneIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
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
              if (
                !conceptsOpened &&
                chapterData.concepts.loadedOnce === false
              ) {
                await loadConcept(standardId, subjectId, chapterId);
              }
              setConceptsLoading(false);
            }}
            onContextMenu={handleOpenMenu}
            loading={refreshing}
          >
            {chapterData.chapter}
          </LoadingButton>
        )}

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateConcept}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Concept</ListItemText>
          </MenuItem>

          {isAdminOrFounder && (
            <MenuItem onClick={initiateEditChapter}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Chapter Name</ListItemText>
            </MenuItem>
          )}

          <MenuItem onClick={createMockTest} disabled={mockTestCreating}>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {mockTestCreating ? "Creating..." : "Create a mock Test"}
            </ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={openQuestion}>
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Questions</ListItemText>
          </MenuItem>

          <MenuItem onClick={openMockTest}>
            <ListItemIcon>
              <ViewCompactAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View mock Tests</ListItemText>
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
