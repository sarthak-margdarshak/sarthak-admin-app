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

export default function SubjectBar({ standardId, subjectId }) {
  const { standardsData, loadChapter, refreshChapter, addChapter } =
    useContent();
  const { user } = useAuthContext();
  const subjectData =
    standardsData.documents[standardId].subjects.documents[subjectId];
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
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
  const [refreshing, setRefreshing] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newChapter, setNewChapter] = useState("");
  const [mockTestCreating, setMockTestCreating] = useState(false);
  const [productCreating, setProductCreating] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [updatingSubject, setUpdatingSubject] = useState(false);

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

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + subjectId);
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
        bookIndex: subjectId,
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
    navigate(PATH_DASHBOARD.mockTest.list + "?bookIndex=" + subjectId);
  };

  const createProduct = async () => {
    setProductCreating(true);
    const mockTest = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      ID.unique(),
      {
        standard: standardId,
        subject: subjectId,
        bookIndex: subjectId,
        creator: (await appwriteAccount.get()).$id,
        updater: (await appwriteAccount.get()).$id,
      }
    );
    setProductCreating(false);
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.edit(mockTest.$id), { replace: true });
  };

  const openProduct = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.product.list + "?bookIndex=" + subjectId);
  };

  const initiateEditSubject = () => {
    setEditedSubjectName(subjectData.subject);
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
      await refreshChapter(standardId, subjectId);
      setEditingSubject(false);
      setEditedSubjectName("");
      enqueueSnackbar("Subject name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingSubject(false);
    }
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
              setChaptersLoading(true);
              if (
                !chaptersOpened &&
                subjectData.chapters.loadedOnce === false
              ) {
                await loadChapter(standardId, subjectId);
              }
              setChaptersLoading(false);
            }}
            onContextMenu={handleOpenMenu}
            loading={refreshing}
          >
            {subjectData?.subject}
          </LoadingButton>
        )}

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem onClick={initiateCreateChapter}>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Chapter</ListItemText>
          </MenuItem>

          {isAdminOrFounder && (
            <MenuItem onClick={initiateEditSubject}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Subject Name</ListItemText>
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
