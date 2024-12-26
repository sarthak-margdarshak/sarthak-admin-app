import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import React, { Fragment, useEffect, useState } from "react";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { timeAgo } from "../../../../auth/AppwriteContext";
import QuestionBar from "./QuestionBar";
import MockTestBar from "./MockTestBar";

export default function ConceptBar({
  standardId,
  subjectId,
  chapterId,
  conceptId,
}) {
  const { standardsData, loadQuestions, refreshQuestions, loadMockTests } =
    useQuestionTreeViewContext();
  const conceptData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId].concepts.documents[conceptId];

  const [opened, setOpened] = useState(false);
  const [mockTestOpened, setMockTestOpened] = useState(false);
  const [questionsOpened, setQuestionsOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpened = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [mockTestsLoading, setMockTestsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <Fragment>
      <Fragment>
        <LoadingButton
          fullWidth
          variant={opened ? "contained" : "outlined"}
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 85 }}
          color="success"
          startIcon={opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          onClick={async () => setOpened(!opened)}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {conceptData.concept}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Question</ListItemText>
          </MenuItem>

          <MenuItem>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a mock Test</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={async () => {
              handleCloseMenu();
              setMockTestOpened(false);
              setQuestionsOpened(false);
              setOpened(false);
              setRefreshing(true);
              await refreshQuestions(
                standardId,
                subjectId,
                chapterId,
                conceptId
              );
              setRefreshing(false);
            }}
          >
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(conceptData.lastSynced))}
          </MenuItem>
        </Menu>
      </Fragment>

      {/** Questions */}
      {opened && (
        <Fragment>
          <Tooltip
            title={
              conceptData.questions.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    conceptData.questions.documents
                  ).length.toString() +
                  " out of " +
                  conceptData.questions.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={questionsOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 95,
              }}
              color="error"
              startIcon={
                questionsOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
              }
              onClick={async () => {
                setQuestionsOpened(!questionsOpened);
                setQuestionsLoading(true);
                if (
                  !questionsOpened &&
                  conceptData.questions.loadedOnce === false
                ) {
                  await loadQuestions(
                    standardId,
                    subjectId,
                    chapterId,
                    conceptId
                  );
                }
                setQuestionsLoading(false);
              }}
            >
              Questions
            </Button>
          </Tooltip>

          {questionsOpened && (
            <Fragment>
              {Object.keys(conceptData.questions.documents).map((id, index) => (
                <QuestionBar
                  key={index}
                  standardId={standardId}
                  subjectId={subjectId}
                  chapterId={chapterId}
                  conceptId={conceptId}
                  questionId={id}
                />
              ))}
              {(questionsLoading ||
                conceptData.questions.total !==
                  Object.keys(conceptData.questions.documents).length) && (
                <LoadingButton
                  fullWidth
                  variant="contained"
                  style={{
                    justifyContent: "left",
                    borderRadius: 0,
                    paddingLeft: 105,
                  }}
                  color="info"
                  startIcon={<KeyboardDoubleArrowDownIcon />}
                  onClick={async () => {
                    setQuestionsLoading(true);
                    await loadQuestions(
                      standardId,
                      subjectId,
                      chapterId,
                      conceptId
                    );
                    setQuestionsLoading(false);
                  }}
                  loading={questionsLoading}
                >
                  Load More
                </LoadingButton>
              )}
            </Fragment>
          )}
        </Fragment>
      )}

      {/** Mock Tests */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              conceptData.mockTests.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    conceptData.mockTests.documents
                  ).length.toString() +
                  " out of " +
                  conceptData.mockTests.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={mockTestOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 95,
              }}
              color="error"
              startIcon={
                mockTestOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
              }
              onClick={async () => {
                setMockTestOpened(!mockTestOpened);
                setMockTestsLoading(true);
                if (
                  !mockTestOpened &&
                  conceptData.mockTests.loadedOnce === false
                ) {
                  await loadMockTests(
                    standardId,
                    subjectId,
                    chapterId,
                    conceptId
                  );
                }
                setMockTestsLoading(false);
              }}
            >
              Mock Tests
            </Button>
          </Tooltip>

          {mockTestOpened && (
            <React.Fragment>
              {conceptData.mockTests.documents.map((mockTest, index) => (
                <MockTestBar
                  key={index}
                  mtId={mockTest.mtId}
                  id={mockTest.$id}
                  level={4}
                />
              ))}
              {(mockTestsLoading ||
                conceptData.mockTests.total !==
                  Object.keys(conceptData.mockTests.documents).length) && (
                <LoadingButton
                  fullWidth
                  variant="contained"
                  style={{
                    justifyContent: "left",
                    borderRadius: 0,
                    paddingLeft: 105,
                  }}
                  color="info"
                  startIcon={<KeyboardDoubleArrowDownIcon />}
                  onClick={async () => {
                    setMockTestsLoading(true);
                    await loadMockTests(
                      standardId,
                      subjectId,
                      chapterId,
                      conceptId
                    );
                    setMockTestsLoading(false);
                  }}
                  loading={mockTestsLoading}
                >
                  Load More
                </LoadingButton>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Fragment>
  );
}
