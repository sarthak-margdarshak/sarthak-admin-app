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
import SubjectBar from "sections/@dashboard/management/content/layout/tree-view/SubjectBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import EditIcon from "@mui/icons-material/Edit";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { labels } from "assets/data/labels";
import Iconify from "components/iconify";
import { ProviderHelper } from "sections/@dashboard/management/content/hook/ProviderHelper";

export default function StandardBar({ standardId }) {
  const {
    bookIndexList,
    loadSubject,
    addSubject,
    deleteStandard,
    getBookIndex,
  } = useContent();
  const standardIndex = bookIndexList.standards.findIndex(
    (standard) => standard.$id === standardId
  );
  const standardData = bookIndexList.standards[standardIndex];

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
  );
  const isFounder = user?.labels?.some((label) => label === labels.founder);

  const [standardLabel, setStandardLabel] = useState(
    localStorage.getItem(`bookIndex_${standardId}`)
      ? JSON.parse(localStorage.getItem(`bookIndex_${standardId}`)).standard
      : ""
  );
  const [labelLoading, setLabelLoading] = useState(
    localStorage.getItem(`bookIndex_${standardId}`) ? false : true
  );
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
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [productCreating, setProductCreating] = useState(false);
  const [editingStandard, setEditingStandard] = useState(false);
  const [editedStandardName, setEditedStandardName] = useState("");
  const [updatingStandard, setUpdatingStandard] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canBeDeleted, setCanBeDeleted] = useState(false);
  const [isCheckingDeletability, setIsCheckingDeletability] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const x = await getBookIndex(standardId);
      setStandardLabel(x.standard);
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
  }, [standardId]);

  const initiateCreateSubject = async () => {
    setSubjectsOpened(true);
    handleCloseMenu();
    if (!subjectsOpened && standardData.subjects.length === 0) {
      setSubjectsLoading(true);
      await loadSubject(standardId);
      setSubjectsLoading(false);
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
        bookIndexId: standardId,
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
    const product = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      ID.unique(),
      {
        standardId: standardId,
        bookIndexId: standardId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setProductCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.edit(product.$id), { replace: true });
  };

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + standardId);
  };

  const openMockTest = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + standardId);
  };

  const openProduct = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.list + "?bookIndex=" + standardId);
  };

  const initiateEditStandard = () => {
    setEditedStandardName(standardLabel);
    setEditingStandard(true);
    handleCloseMenu();
  };

  const handleUpdateStandard = async () => {
    try {
      setUpdatingStandard(true);
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.bookIndex,
        standardId,
        {
          standard: editedStandardName,
        }
      );
      const x = await getBookIndex(standardId);
      setStandardLabel(x.standard);
      setLabelLoading(false);
      setEditingStandard(false);
      setEditedStandardName("");
      enqueueSnackbar("Standard name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingStandard(false);
    }
  };

  useEffect(() => {
    // Only run the check when the dialog is opened
    if (isDeleteDialogOpen) {
      const performDeletabilityCheck = async () => {
        try {
          setCanBeDeleted(await ProviderHelper.canIndexBeDeleted(standardId));
        } catch (error) {
          console.error("Error checking deletability:", error);
          enqueueSnackbar("Could not verify if standard can be deleted.", {
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
  }, [isDeleteDialogOpen, standardId, enqueueSnackbar]);

  const initiateDeleteStandard = () => {
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
    await deleteStandard(standardId, standardLabel);
    setDeleteDialogOpen(false);
    setIsDeleting(false);
  };

  return (
    <Fragment>
      <Fragment>
        {editingStandard && isAdminOrFounder ? (
          <OutlinedInput
            fullWidth
            variant="outlined"
            color="success"
            size="small"
            value={editedStandardName}
            onChange={(e) => setEditedStandardName(e.target.value)}
            disabled={updatingStandard}
            style={{ borderRadius: 0, paddingLeft: 11 }}
            startAdornment={<ArrowRightIcon fontSize="small" />}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setEditingStandard(false);
                    setEditedStandardName("");
                  }}
                  edge="end"
                  disabled={updatingStandard}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  onClick={handleUpdateStandard}
                  edge="end"
                  disabled={updatingStandard}
                >
                  <DoneIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
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
              if (!subjectsOpened && standardData.subjects.length === 0) {
                setSubjectsLoading(true);
                await loadSubject(standardId);
                setSubjectsLoading(false);
              }
            }}
            onContextMenu={handleOpenMenu}
            loading={labelLoading}
          >
            {standardLabel}
          </LoadingButton>
        )}

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateSubject}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Subject</ListItemText>
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
            <MenuItem onClick={initiateEditStandard}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Standard Name</ListItemText>
            </MenuItem>
          )}

          {isFounder && (
            <MenuItem onClick={initiateDeleteStandard} sx={{ color: "red" }}>
              <ListItemIcon>
                <Iconify icon="mdi:delete" color="red" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
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

          {standardData.subjects.map((subject) => (
            <SubjectBar
              key={subject.$id}
              subjectId={subject.$id}
              standardId={standardId}
            />
          ))}

          {(subjectsLoading ||
            standardData.total !== standardData.subjects.length) && (
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
                ? `Are you sure you want to delete the standard "${standardLabel}"? This action cannot be undone.`
                : `This standard cannot be deleted because it contains associated items (e.g., subjects, questions, mock tests, products). Please remove all items from this standard before trying again.`}
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
