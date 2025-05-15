import {
  Button,
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

export default function ConceptBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
}) {
  const { standardsData, refreshConcept } = useContent();
  const { user } = useAuthContext();
  const conceptData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId].concepts.documents[conceptId];

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrFounder = user?.labels?.some(
    (label) => label === labels.admin || label === labels.founder
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

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const createQuestion = async () => {
    setQuestionCreating(true);
    const question = await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.questions,
      ID.unique(),
      {
        standard: standardId,
        subject: subjectId,
        chapter: chapterId,
        concept: conceptId,
        bookIndex: conceptId,
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
        standard: standardId,
        subject: subjectId,
        chapter: chapterId,
        concept: conceptId,
        bookIndex: conceptId,
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
    setEditedConceptName(conceptData.concept);
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
      await refreshConcept(standardId, subjectId, chapterId);
      setEditingConcept(false);
      setEditedConceptName("");
      enqueueSnackbar("Concept name updated successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUpdatingConcept(false);
    }
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
        <Button
          fullWidth
          variant="outlined"
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 70 }}
          color="warning"
          onContextMenu={handleOpenMenu}
          id={conceptId}
        >
          {conceptData.concept}
        </Button>
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

        {isAdminOrFounder && (
          <MenuItem onClick={initiateEditConcept}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Concept Name</ListItemText>
          </MenuItem>
        )}

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
      </Menu>
    </Fragment>
  );
}
