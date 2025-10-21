import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
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
import Iconify from "components/iconify";
import { ProviderHelper } from "sections/@dashboard/management/content/hook/ProviderHelper";

export default function ChapterBar({ standardId, subjectId, chapterId }) {
  const {
    bookIndexList,
    loadConcept,
    addConcept,
    deleteChapter,
    getBookIndex,
  } = useContent();
  const standardIndex = bookIndexList.standards.findIndex(
    (standard) => standard.$id === standardId
  );
  const subjectIndex = bookIndexList.standards[
    standardIndex
  ].subjects.findIndex((subject) => subject.$id === subjectId);
  const chapterIndex = bookIndexList.standards[standardIndex].subjects[
    subjectIndex
  ].chapters.findIndex((chapter) => chapter.$id === chapterId);
  const chapterData =
    bookIndexList.standards[standardIndex].subjects[subjectIndex].chapters[
      chapterIndex
    ];

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );
  const isFounder = user?.labels?.some((label) => label === labels.founder);

  const [chapterLabel, setChapterLabel] = useState(
    localStorage.getItem(`bookIndex_${chapterId}`)
      ? JSON.parse(localStorage.getItem(`bookIndex_${chapterId}`)).chapter
      : ""
  );
  const [labelLoading, setLabelLoading] = useState(
    localStorage.getItem(`bookIndex_${chapterId}`) ? false : true
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
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newConcept, setNewConcept] = useState("");
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [editingChapter, setEditingChapter] = useState(false);
  const [editedChapterName, setEditedChapterName] = useState("");
  const [updatingChapter, setUpdatingChapter] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canBeDeleted, setCanBeDeleted] = useState(false);
  const [isCheckingDeletability, setIsCheckingDeletability] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const x = await getBookIndex(chapterId);
      setChapterLabel(x.chapter);
      setLabelLoading(false);
    };
    fetchData()
      .then((_) => {})
      .catch((err) => console.log(err));
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiateCreateConcept = async () => {
    setConceptsOpened(true);
    handleCloseMenu();
    if (!conceptsOpened && chapterData.concepts.length === 0) {
      setConceptsLoading(true);
      await loadConcept(standardId, subjectId, chapterId);
      setConceptsLoading(false);
    }
    setCreatingNew(true);
  };

  const createMockTest = async () => {
    setMockTestCreating(true);
    const mockTest = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      ID.unique(),
      {
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        bookIndexId: chapterId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setMockTestCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.edit(mockTest.$id), { replace: true });
  };

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + chapterId);
  };

  const openMockTest = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + chapterId);
  };

  const initiateEditChapter = () => {
    setEditedChapterName(chapterLabel);
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
      const x = await getBookIndex(chapterId);
      setChapterLabel(x.chapter);
      setLabelLoading(false);
      setEditingChapter(false);
      setEditedChapterName("");
      enqueueSnackbar("Chapter name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingChapter(false);
    }
  };

  useEffect(() => {
    // Only run the check when the dialog is opened
    if (isDeleteDialogOpen) {
      const performDeletabilityCheck = async () => {
        try {
          setCanBeDeleted(await ProviderHelper.canIndexBeDeleted(chapterId));
        } catch (error) {
          console.error("Error checking deletability:", error);
          enqueueSnackbar("Could not verify if chapter can be deleted.", {
            variant: "error",
          });
          setCanBeDeleted(false);
        } finally {
          setIsCheckingDeletability(false); // Mark the check as complete
        }
      };

      performDeletabilityCheck();
    }
    // This effect depends on the dialog's open state and the standardId
  }, [isDeleteDialogOpen, chapterId, enqueueSnackbar]);

  const initiateDeleteSubject = () => {
    handleCloseMenu();
    setIsCheckingDeletability(true);
    setCanBeDeleted(false);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteChapter(chapterId, chapterLabel);
    setDeleteDialogOpen(false);
    setIsDeleting(false);
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
              if (!conceptsOpened && chapterData.concepts.length === 0) {
                setConceptsLoading(true);
                await loadConcept(standardId, subjectId, chapterId);
                setConceptsLoading(false);
              }
            }}
            onContextMenu={handleOpenMenu}
            loading={labelLoading}
          >
            {chapterLabel}
          </LoadingButton>
        )}

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateConcept}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Concept</ListItemText>
          </MenuItem>

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

          {isAdminOrFounder && (
            <MenuItem onClick={initiateEditChapter}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Chapter Name</ListItemText>
            </MenuItem>
          )}

          {isFounder && (
            <MenuItem onClick={initiateDeleteSubject} sx={{ color: "red" }}>
              <ListItemIcon>
                <Iconify icon="mdi:delete" color="red" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
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

          {chapterData.concepts.map((concept) => (
            <ConceptBar
              key={concept.$id}
              standardId={standardId}
              subjectId={subjectId}
              chapterId={chapterId}
              conceptId={concept.$id}
            />
          ))}

          {(conceptsLoading ||
            chapterData.total !== chapterData.concepts.length) && (
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

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isCheckingDeletability
            ? "Checking Deletability..."
            : canBeDeleted
            ? "Confirm Deletion"
            : "Deletion Not Allowed"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: "400px" }}>
          {isCheckingDeletability ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 3,
              }}
            >
              <CircularProgress size={24} />
              <DialogContentText sx={{ ml: 2 }}>
                Checking for associated items...
              </DialogContentText>
            </Box>
          ) : (
            <DialogContentText id="alert-dialog-description">
              {canBeDeleted
                ? `Are you sure you want to delete the chapter "${chapterLabel}"? This action cannot be undone.`
                : `This chapter cannot be deleted because it contains associated items (e.g., subjects, questions, mock tests, products). Please remove all items from this chapter before trying again.`}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {/* Only show buttons after the check is complete */}
          {!isCheckingDeletability && (
            <>
              {canBeDeleted ? (
                <>
                  <Button
                    onClick={handleCloseDeleteDialog}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="error"
                    onClick={handleConfirmDelete}
                    loading={isDeleting}
                  >
                    Delete
                  </LoadingButton>
                </>
              ) : (
                <Button onClick={handleCloseDeleteDialog}>OK</Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
