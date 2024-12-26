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
import SubjectBar from "./SubjectBar";
import { useQuestionTreeViewContext } from "./useQuestionTreeViewContext";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import { timeAgo } from "../../../../auth/AppwriteContext";
import MockTestBar from "./MockTestBar";

export default function StandardBar({ standardId }) {
  const { standardsData, loadSubject, loadMockTests, refreshSubject } =
    useQuestionTreeViewContext();
  const standardData = standardsData.documents[standardId];

  const [opened, setOpened] = useState(false);
  const [mockTestOpened, setMockTestOpened] = useState(false);
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
          style={{ justifyContent: "left", borderRadius: 0 }}
          color="success"
          startIcon={opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          onClick={() => setOpened(!opened)}
          onContextMenu={handleOpenMenu}
          loading={refreshing}
        >
          {standardData.standard}
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={menuOpened} onClose={handleCloseMenu}>
          <MenuItem>
            <ListItemIcon>
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create a Subject</ListItemText>
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
              setSubjectsOpened(false);
              setOpened(false);
              setRefreshing(true);
              await refreshSubject(standardId);
              setRefreshing(false);
            }}
          >
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sync</ListItemText>
          </MenuItem>
          <MenuItem disabled>
            {timeAgo.format(Date.parse(standardData.lastSynced))}
          </MenuItem>
        </Menu>
      </React.Fragment>

      {/** Subjects */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              standardData.subjects.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    standardData.subjects.documents
                  ).length.toString() +
                  " out of " +
                  standardData.subjects.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={subjectsOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 25,
              }}
              color="error"
              startIcon={
                subjectsOpened ? <ArrowDropDownIcon /> : <ArrowRightIcon />
              }
              onClick={async () => {
                setSubjectsOpened(!subjectsOpened);
                setSubjectsLoading(true);
                if (
                  !subjectsOpened &&
                  standardData.subjects.loadedOnce === false
                ) {
                  await loadSubject(standardId);
                }
                setSubjectsLoading(false);
              }}
            >
              Subjects
            </Button>
          </Tooltip>

          {subjectsOpened && (
            <React.Fragment>
              {Object.keys(standardData.subjects.documents).map((id, index) => (
                <SubjectBar
                  key={index}
                  subjectId={id}
                  standardId={standardId}
                />
              ))}
              {(subjectsLoading ||
                standardData.subjects.total !==
                  Object.keys(standardData.subjects.documents).length) && (
                <LoadingButton
                  fullWidth
                  variant="contained"
                  style={{
                    justifyContent: "left",
                    borderRadius: 0,
                    paddingLeft: 40,
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
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {/** Mock Tests */}
      {opened && (
        <React.Fragment>
          <Tooltip
            title={
              standardData.mockTests.loadedOnce
                ? "Loaded " +
                  Object.keys(
                    standardData.mockTests.documents
                  ).length.toString() +
                  " out of " +
                  standardData.mockTests.total.toString()
                : "Not yet loaded"
            }
          >
            <Button
              fullWidth
              variant={mockTestOpened ? "contained" : "outlined"}
              style={{
                justifyContent: "left",
                borderRadius: 0,
                paddingLeft: 25,
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
                  standardData.mockTests.loadedOnce === false
                ) {
                  await loadMockTests(standardId, null, null, null);
                }
                setMockTestsLoading(false);
              }}
            >
              Mock Tests
            </Button>
          </Tooltip>

          {mockTestOpened && (
            <React.Fragment>
              {standardData.mockTests.documents.map((mockTest, index) => (
                <MockTestBar
                  key={index}
                  mtId={mockTest.mtId}
                  id={mockTest.$id}
                  level={1}
                />
              ))}
              {(mockTestsLoading ||
                standardData.mockTests.total !==
                  Object.keys(standardData.mockTests.documents).length) && (
                <LoadingButton
                  fullWidth
                  variant="contained"
                  style={{
                    justifyContent: "left",
                    borderRadius: 0,
                    paddingLeft: 40,
                  }}
                  color="info"
                  startIcon={<KeyboardDoubleArrowDownIcon />}
                  onClick={async () => {
                    setMockTestsLoading(true);
                    await loadMockTests(standardId, null, null, null);
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
