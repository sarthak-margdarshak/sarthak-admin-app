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
import ChapterBar from "./ChapterBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router-dom";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { labels } from "assets/data/labels";
import Iconify from "components/iconify";
import { ProviderHelper } from "sections/@dashboard/management/content/hook/ProviderHelper";

export default function SubjectBar({ standardId, subjectId }) {
  const {
    bookIndexList,
    loadChapter,
    addChapter,
    deleteSubject,
    getBookIndex,
  } = useContent();
  const standardIndex = bookIndexList.standards.findIndex(
    (standard) => standard.$id === standardId
  );
  const subjectIndex = bookIndexList.standards[
    standardIndex
  ].subjects.findIndex((subject) => subject.$id === subjectId);
  const subjectData =
    bookIndexList.standards[standardIndex].subjects[subjectIndex];

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );
  const isFounder = user?.labels?.some((label) => label === labels.founder);

  const [subjectLabel, setSubjectLabel] = useState(
    localStorage.getItem(`bookIndex_${subjectId}`)
      ? JSON.parse(localStorage.getItem(`bookIndex_${subjectId}`)).subject
      : ""
  );
  const [labelLoading, setLabelLoading] = useState(
    localStorage.getItem(`bookIndex_${subjectId}`) ? false : true
  );
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
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newChapter, setNewChapter] = useState("");
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [productCreating, setProductCreating] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [updatingSubject, setUpdatingSubject] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canBeDeleted, setCanBeDeleted] = useState(false);
  const [isCheckingDeletability, setIsCheckingDeletability] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const x = await getBookIndex(subjectId);
      setSubjectLabel(x.subject);
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
  }, [subjectId]);

  const initiateCreateChapter = async () => {
    setChaptersOpened(true);
    handleCloseMenu();
    if (!chaptersOpened && subjectData.chapters.length === 0) {
      setChaptersLoading(true);
      await loadChapter(standardId, subjectId);
      setChaptersLoading(false);
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
        bookIndexId: subjectId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setMockTestCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.edit(mockTest.$id), { replace: true });
  };

  const createProduct = async () => {
    setProductCreating(true);
    const mockTest = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      ID.unique(),
      {
        standardId: standardId,
        subjectId: subjectId,
        bookIndexId: subjectId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setProductCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.edit(mockTest.$id), { replace: true });
  };

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + subjectId);
  };

  const openMockTest = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + subjectId);
  };

  const openProduct = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.list + "?bookIndex=" + subjectId);
  };

  const initiateEditSubject = () => {
    setEditedSubjectName(subjectLabel);
    setEditingSubject(true);
    handleCloseMenu();
  };

  const handleUpdateSubject = async () => {
    try {
      setUpdatingSubject(true);
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        subjectId,
        {
          subject: editedSubjectName,
        }
      );
      const x = await getBookIndex(subjectId);
      setSubjectLabel(x.subject);
      setLabelLoading(false);
      setEditingSubject(false);
      setEditedSubjectName("");
      enqueueSnackbar("Subject name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingSubject(false);
    }
  };

  useEffect(() => {
    // Only run the check when the dialog is opened
    if (isDeleteDialogOpen) {
      const performDeletabilityCheck = async () => {
        try {
          setCanBeDeleted(await ProviderHelper.canIndexBeDeleted(subjectId));
        } catch (error) {
          console.error("Error checking deletability:", error);
          enqueueSnackbar("Could not verify if subject can be deleted.", {
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
  }, [isDeleteDialogOpen, subjectId, enqueueSnackbar]);

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
    await deleteSubject(subjectId, subjectLabel);
    setDeleteDialogOpen(false);
    setIsDeleting(false);
  };

  return (
    <Fragment>
      <Fragment>
        {editingSubject && isAdminOrFounder ? (
          <OutlinedInput
            fullWidth
            variant="outlined"
            color="success"
            size="small"
            value={editedSubjectName}
            onChange={(e) => setEditedSubjectName(e.target.value)}
            disabled={updatingSubject}
            style={{ borderRadius: 0, paddingLeft: 25 }}
            startAdornment={<ArrowRightIcon fontSize="small" />}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setEditingSubject(false);
                    setEditedSubjectName("");
                  }}
                  edge="end"
                  disabled={updatingSubject}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  onClick={handleUpdateSubject}
                  edge="end"
                  disabled={updatingSubject}
                >
                  <DoneIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
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
              if (!chaptersOpened && subjectData.chapters.length === 0) {
                setChaptersLoading(true);
                await loadChapter(standardId, subjectId);
                setChaptersLoading(false);
              }
            }}
            onContextMenu={handleOpenMenu}
            loading={labelLoading}
          >
            {subjectLabel}
          </LoadingButton>
        )}

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateChapter}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Chapter</ListItemText>
          </MenuItem>

          <MenuItem onClick={createMockTest} disabled={mockTestCreating}>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {mockTestCreating ? "Creating..." : "Create a mock Test"}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={createProduct} disabled={productCreating}>
            <ListItemIcon>
              <AddToQueueIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {productCreating ? "Creating..." : "Create a Product"}
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

          <MenuItem onClick={openProduct}>
            <ListItemIcon>
              <ViewQuiltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View products</ListItemText>
          </MenuItem>

          <Divider />

          {isAdminOrFounder && (
            <MenuItem onClick={initiateEditSubject}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Subject Name</ListItemText>
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

          {subjectData.chapters.map((chapter) => (
            <ChapterBar
              key={chapter.$id}
              standardId={standardId}
              subjectId={subjectId}
              chapterId={chapter.$id}
            />
          ))}

          {(chaptersLoading ||
            subjectData.total !== subjectData.chapters.length) && (
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
                ? `Are you sure you want to delete the subject "${subjectLabel}"? This action cannot be undone.`
                : `This subject cannot be deleted because it contains associated items (e.g., subjects, questions, mock tests, products). Please remove all items from this subject before trying again.`}
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
