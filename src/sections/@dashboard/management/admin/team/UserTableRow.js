import React, { useState } from "react";
import {
  Stack,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import Label from "components/label";
import Iconify from "components/iconify";
import MenuPopover from "components/menu-popover";
import { useSnackbar } from "components/snackbar";
import { labels, sarthakAPIPath } from "assets/data";
import { useAuthContext } from "auth/useAuthContext";
import { LoadingButton } from "@mui/lab";
import { appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";

export default function UserTableRow({ index, incomingUser }) {
  const { user } = useAuthContext();
  const [openPopover, setOpenPopover] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [role, setRole] = useState(
    incomingUser?.labels.findIndex((label) => labels.founder === label) !== -1
      ? labels.founder
      : incomingUser?.labels.findIndex((label) => labels.admin === label) !== -1
      ? labels.admin
      : incomingUser?.labels.findIndex((label) => labels.author === label) !==
        -1
      ? labels.author
      : labels.student
  );
  const [roleColor, setRoleColor] = useState(
    incomingUser?.labels.findIndex((label) => labels.founder === label) !== -1
      ? "primary"
      : incomingUser?.labels.findIndex((label) => labels.admin === label) !== -1
      ? "success"
      : incomingUser?.labels.findIndex((label) => labels.author === label) !==
        -1
      ? "warning"
      : "info"
  );
  const [newRole, setNewRole] = useState(role);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [status, setStatus] = useState(incomingUser?.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    if (!updatingStatus) setOpenPopover(null);
  };

  const updateRole = async () => {
    setUpdatingRole(true);
    try {
      let response = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({
          userId: incomingUser.$id,
          labelRequested: newRole,
        }),
        false,
        sarthakAPIPath.user.update.label
      );
      response = JSON.parse(response.responseBody);

      if (response.status === "success") {
        setRole(newRole);
        setRoleColor(
          labels.founder === newRole
            ? "primary"
            : labels.admin === newRole
            ? "success"
            : labels.author === newRole
            ? "warning"
            : "info"
        );
        enqueueSnackbar(response.message);
        setRoleChangeDialogOpen(false);
      } else {
        setNewRole(role);
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
    setUpdatingRole(false);
  };

  const updateStatus = async () => {
    setUpdatingStatus(true);
    try {
      let response = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({
          userId: incomingUser.$id,
        }),
        false,
        status
          ? sarthakAPIPath.user.update.block
          : sarthakAPIPath.user.update.unblock
      );
      response = JSON.parse(response.responseBody);

      if (response.status === "success") {
        setStatus(!status);
        enqueueSnackbar(response.message);
        handleClosePopover();
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
    setUpdatingStatus(false);
  };

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell align="left">{index}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {incomingUser?.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{incomingUser?.$id}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={roleColor}
            sx={{ textTransform: "capitalize" }}
          >
            {role}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === false && "error") || "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {!status ? "Blocked" : "Active"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={handleOpenPopover}
            disabled={
              user?.labels.findIndex((label) => labels.founder === label) ===
                -1 ||
              incomingUser?.labels.findIndex(
                (label) => labels.founder === label
              ) !== -1
            }
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            setRoleChangeDialogOpen(true);
            handleClosePopover();
          }}
        >
          <Iconify icon="fluent-mdl2:permissions" />
          Update Role
        </MenuItem>

        <MenuItem onClick={updateStatus} disabled={updatingStatus}>
          <Iconify icon="material-symbols:block" />
          {updatingStatus
            ? status
              ? "Blocking..."
              : "Unblocking..."
            : status
            ? "Block"
            : "Unblock"}
        </MenuItem>
      </MenuPopover>

      <Dialog
        open={roleChangeDialogOpen}
        onClose={() => setRoleChangeDialogOpen(false)}
      >
        <DialogTitle sx={{ pb: 2 }} dividers>
          {"Update Role for " + incomingUser?.name}
        </DialogTitle>

        <Divider sx={{ mb: 2 }} />

        <DialogContent dividers>
          <FormControl>
            <RadioGroup
              value={newRole}
              onChange={(event) => setNewRole(event.target.value)}
            >
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Admin"
              />
              <FormControlLabel
                value="author"
                control={<Radio />}
                label="Author"
              />
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={() => setRoleChangeDialogOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={updatingRole}
            onClick={updateRole}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
