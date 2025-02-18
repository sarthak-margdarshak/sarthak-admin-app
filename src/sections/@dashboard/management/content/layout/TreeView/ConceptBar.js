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
import { ID, Permission, Query, Role } from "appwrite";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { labels } from "assets/data";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export default function ConceptBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
}) {
  const { standardsData, updateQuestion } = useContent();
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
      },
      [
        Permission.read(Role.label(labels.admin)),
        Permission.update(Role.label(labels.admin)),
        Permission.read(Role.label(labels.author)),
        Permission.update(Role.label(labels.author)),
        Permission.read(Role.label(labels.founder)),
        Permission.update(Role.label(labels.founder)),
      ]
    );
    let functionInProgress = true;
    while (functionInProgress) {
      await new Promise((r) => setTimeout(r, 1000));
      question.qnId = (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          question.$id,
          [Query.select("qnId")]
        )
      ).qnId;
      functionInProgress = question.qnId === null;
    }
    await updateQuestion(question.$id);
    navigate(PATH_DASHBOARD.question.edit(question.$id));
    setQuestionCreating(false);
    handleCloseMenu();
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

        <MenuItem>
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
      </Menu>
    </Fragment>
  );
}
