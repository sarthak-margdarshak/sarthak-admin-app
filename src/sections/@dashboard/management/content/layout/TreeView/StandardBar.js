import {
  Button,
  Divider, IconButton, InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, OutlinedInput,
  Tooltip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import React, { useEffect, useState } from "react";
import SubjectBar from "sections/@dashboard/management/content/layout/TreeView/SubjectBar";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { LoadingButton } from "@mui/lab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import { timeAgo } from "auth/AppwriteContext";
import MockTestBar from "sections/@dashboard/management/content/layout/TreeView/MockTestBar";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from '@mui/icons-material/Close';

export default function StandardBar({ standardId }) {
  const { standardsData, loadSubject, loadMockTests, refreshSubject, addSubject } =
    useContent();
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
  const [creatingNew, setCreatingNew] = useState(false);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");

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
          <MenuItem onClick={() => {
            setCreatingNew(true);
            handleCloseMenu()
          }}>
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
              {creatingNew && <OutlinedInput
                id="outlined-basic"
                variant="outlined"
                size='small'
                color='success'
                autoFocus={creatingNew}
                disabled={submittingNew}
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{borderRadius: 0, paddingLeft: 37}}
                startAdornment={<ArrowRightIcon fontSize='small' />}
                endAdornment={<InputAdornment position="end">
                  <IconButton
                    onClick={async () => {
                      setNewSubject("")
                      setCreatingNew(false)
                    }}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSubmittingNew(true)
                      await addSubject(newSubject, standardId)
                      setSubmittingNew(false)
                      setNewSubject("")
                      setCreatingNew(false)
                    }}
                    edge="end"
                  >
                    <DoneIcon />
                  </IconButton>
                </InputAdornment>}
              />}

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
