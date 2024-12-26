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
import React, { useEffect, useState } from "react";
import ConceptBar from "./ConceptBar";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import { timeAgo } from "../../../../auth/AppwriteContext";
import MockTestBar from "./MockTestBar";

export default function ChapterBar({ standardId, subjectId, chapterId }) {
  const { standardsData, loadConcept, loadMockTests, refreshConcept } =
    useQuestionTreeViewContext();
  const chapterData =
    standardsData.documents[standardId].subjects.documents[subjectId].chapters
      .documents[chapterId];

  const [opened, setOpened] = useState(false);
  const [mockTestOpened, setMockTestOpened] = useState(false);
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
    <React.Fragment>
      <React.Fragment>
        <LoadingButton
          fullWidth
          variant={opened ? "contained" : "outlined"}
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 65 }}
          color="secondary"
          startIcon={opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          onClick={async () => setOpened(!opened)}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {chapterData.chapter}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Concept</ListItemText>
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
              setConceptsOpened(false);
              setOpened(false);
              setRefreshing(true);
              await refreshConcept(standardId, subjectId, chapterId);
              setRefreshing(false);
            }}
          >
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(chapterData.lastSynced))}
          </MenuItem>
        </Menu>
      </React.Fragment>

      {/** Concepts */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              chapterData.concepts.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    chapterData.concepts.documents
                  ).length.toString() +
                  " out of " +
                  chapterData.concepts.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={conceptsOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 75,
              }}
              color="warning"
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
            >
              Concepts
            </Button>
          </Tooltip>

          {conceptsOpened && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {/** Mock Tests */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              chapterData.mockTests.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    chapterData.mockTests.documents
                  ).length.toString() +
                  " out of " +
                  chapterData.mockTests.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={mockTestOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 75,
              }}
              color="warning"
              startIcon={
                mockTestOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
              }
              onClick={async () => {
                setMockTestOpened(!mockTestOpened);
                setMockTestsLoading(true);
                if (
                  !mockTestOpened &&
                  chapterData.mockTests.loadedOnce === false
                ) {
                  await loadMockTests(standardId, subjectId, chapterId, null);
                }
                setMockTestsLoading(false);
              }}
            >
              Mock Tests
            </Button>
          </Tooltip>

          {mockTestOpened && (
            <React.Fragment>
              {chapterData.mockTests.documents.map((mockTest, index) => (
                <MockTestBar
                  key={index}
                  mtId={mockTest.mtId}
                  id={mockTest.$id}
                  level={3}
                />
              ))}
              {(mockTestsLoading ||
                chapterData.mockTests.total !==
                  Object.keys(chapterData.mockTests.documents).length) && (
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
                    setMockTestsLoading(true);
                    await loadMockTests(standardId, subjectId, chapterId, null);
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
    </React.Fragment>
  );
}
