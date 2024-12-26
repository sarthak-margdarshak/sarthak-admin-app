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
import ChapterBar from "./ChapterBar";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import { timeAgo } from "../../../../auth/AppwriteContext";
import MockTestBar from "./MockTestBar";

export default function SubjectBar({ standardId, subjectId }) {
  const { standardsData, loadChapter, loadMockTests, refreshChapter } =
    useQuestionTreeViewContext();
  const subjectData =
    standardsData.documents[standardId].subjects.documents[subjectId];

  const [opened, setOpened] = useState(false);
  const [mockTestOpened, setMockTestOpened] = useState(false);
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
          style={{ justifyContent: "left", borderRadius: 0, paddingLeft: 40 }}
          color="info"
          startIcon={opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          onClick={async () => setOpened(!opened)}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {subjectData?.subject}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Chapter</ListItemText>
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
              setChaptersOpened(false);
              setOpened(false);
              setRefreshing(true);
              await refreshChapter(standardId, subjectId);
              setRefreshing(false);
            }}
          >
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            {timeAgo.format(Date.parse(subjectData.lastSynced))}
          </MenuItem>
        </Menu>
      </React.Fragment>

      {/** Chapters */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              subjectData.chapters.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    subjectData.chapters.documents
                  ).length.toString() +
                  " out of " +
                  subjectData.chapters.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={chaptersOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 55,
              }}
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
            >
              Chapters
            </Button>
          </Tooltip>

          {chaptersOpened && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {/** Mock Tests */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              subjectData.mockTests.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    subjectData.mockTests.documents
                  ).length.toString() +
                  " out of " +
                  subjectData.mockTests.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={mockTestOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 55,
              }}
              color="primary"
              startIcon={
                mockTestOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
              }
              onClick={async () => {
                setMockTestOpened(!mockTestOpened);
                setMockTestsLoading(true);
                if (
                  !mockTestOpened &&
                  subjectData.mockTests.loadedOnce === false
                ) {
                  await loadMockTests(standardId, subjectId, null, null);
                }
                setMockTestsLoading(false);
              }}
            >
              Mock Tests
            </Button>
          </Tooltip>

          {mockTestOpened && (
            <React.Fragment>
              {subjectData.mockTests.documents.map((mockTest, index) => (
                <MockTestBar
                  key={index}
                  mtId={mockTest.mtId}
                  id={mockTest.$id}
                  level={2}
                />
              ))}
              {(mockTestsLoading ||
                subjectData.mockTests.total !==
                  Object.keys(subjectData.mockTests.documents).length) && (
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
                    setMockTestsLoading(true);
                    await loadMockTests(standardId, subjectId, null, null);
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
