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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { labels } from "assets/data/labels";
import { LoadingButton } from "@mui/lab";
import Iconify from "components/iconify";
import { ProviderHelper } from "sections/@dashboard/management/content/hook/ProviderHelper";

export default function ConceptBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
}) {
  const { deleteConcept, getBookIndex } = useContent();

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );
  const isFounder = user?.labels?.some((label) => label === labels.founder);

  const [conceptLabel, setConceptLabel] = useState(
    localStorage.getItem(`bookIndex_${conceptId}`)
      ? JSON.parse(localStorage.getItem(`bookIndex_${conceptId}`)).concept
      : ""
  );
  const [labelLoading, setLabelLoading] = useState(
    localStorage.getItem(`bookIndex_${conceptId}`) ? false : true
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    if (!questionCreating) setAnchorEl(null);
  };
  const [questionCreating, setQuestionCreating] = useState(false);
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [editingConcept, setEditingConcept] = useState(false);
  const [editedConceptName, setEditedConceptName] = useState("");
  const [updatingConcept, setUpdatingConcept] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canBeDeleted, setCanBeDeleted] = useState(false);
  const [isCheckingDeletability, setIsCheckingDeletability] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const x = await getBookIndex(conceptId);
      setConceptLabel(x.concept);
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

  const createQuestion = async () => {
    setQuestionCreating(true);
    const question = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      ID.unique(),
      {
        standardId: standardId,
        subjectId: subjectId,
        chapterId: chapterId,
        conceptId: conceptId,
        bookIndexId: conceptId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setQuestionCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.edit(question.$id), { replace: true });
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
        conceptId: conceptId,
        bookIndexId: conceptId,
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
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + conceptId);
  };

  const openMockTest = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + conceptId);
  };

  const initiateEditConcept = () => {
    setEditedConceptName(conceptLabel);
    setEditingConcept(true);
    handleCloseMenu();
  };

  const handleUpdateConcept = async () => {
    try {
      setUpdatingConcept(true);
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        conceptId,
        {
          concept: editedConceptName,
        }
      );
      const x = await getBookIndex(conceptId);
      setConceptLabel(x.concept);
      setLabelLoading(false);
      setEditingConcept(false);
      setEditedConceptName("");
      enqueueSnackbar("Concept name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingConcept(false);
    }
  };

  useEffect(() => {
    // Only run the check when the dialog is opened
    if (isDeleteDialogOpen) {
      const performDeletabilityCheck = async () => {
        try {
          setCanBeDeleted(await ProviderHelper.canIndexBeDeleted(conceptId));
        } catch (error) {
          console.error("Error checking deletability:", error);
          enqueueSnackbar("Could not verify if concept can be deleted.", {
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
  }, [isDeleteDialogOpen, conceptId, enqueueSnackbar]);

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
    await deleteConcept(conceptId, conceptLabel);
    setDeleteDialogOpen(false);
    setIsDeleting(false);
  };

  return (
    <Fragment>
      {editingConcept && isAdminOrFounder ? (
        <OutlinedInput
          fullWidth
          variant="outlined"
          color="success"
          size="small"
          value={editedConceptName}
          onChange={(e) => setEditedConceptName(e.target.value)}
          disabled={updatingConcept}
          style={{ borderRadius: 0, paddingLeft: 70 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setEditingConcept(false);
                  setEditedConceptName("");
                }}
                edge="end"
                disabled={updatingConcept}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                onClick={handleUpdateConcept}
                edge="end"
                disabled={updatingConcept}
              >
                <DoneIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      ) : (
        <LoadingButton
          fullWidth
          variant="outlined"
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 70 }}
          color="warning"
          onContextMenu={handleOpenMenu}
          id={conceptId}
          loading={labelLoading}
        >
          {conceptLabel}
        </LoadingButton>
      )}

      <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
        <MenuItem onClick={createQuestion} disabled={questionCreating}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {questionCreating ? "Creating..." : "Create a Question"}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate(PATH_DASHBOARD.question.bulkImport(conceptId));
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Bulk Question</ListItemText>
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
          <MenuItem onClick={initiateEditConcept}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Concept Name</ListItemText>
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
                ? `Are you sure you want to delete the concept "${conceptLabel}"? This action cannot be undone.`
                : `This concept cannot be deleted because it contains associated items (e.g., standards, subjects, chapters, questions, mock tests, products). Please remove all items from this concept before trying again.`}
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
