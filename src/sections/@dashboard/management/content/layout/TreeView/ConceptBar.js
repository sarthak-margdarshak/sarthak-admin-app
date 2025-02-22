import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useContent } from "../../hook/useContent";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { appwriteAccount, appwriteDatabases } from "auth/AppwriteContext";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { APPWRITE_API } from "config-global";
import { ID } from "appwrite";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export default function ConceptBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
}) {
  const { standardsData } = useContent();
  const conceptData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId].concepts.documents[conceptId];

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    if (!questionCreating) setAnchorEl(null);
  };
  const [questionCreating, setQuestionCreating] = useState(false);

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

  const openQuestion = () => {
    handleCloseMenu();
    navigate(PATH_DASHBOARD.question.list + "?bookIndex=" + conceptId);
  };

  return (
    <Fragment>
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

      <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
        <MenuItem onClick={createQuestion} disabled={questionCreating}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {questionCreating ? "Creating..." : "Create a Question"}
          </ListItemText>
        </MenuItem>

        <MenuItem disabled>
          <ListItemIcon>
            <NoteAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create a mock Test</ListItemText>
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
      </Menu>
    </Fragment>
  );
}
