/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

// IMPORT ---------------------------------------------------------------

import PropTypes from "prop-types";
// React
import { useState } from "react";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
} from "@mui/material";
// sections
import { Block } from "../../../../sections/_examples/Block";
// Components
import Iconify from "../../../../components/iconify";
import { useSnackbar } from "../../../../components/snackbar";
// Auth
import { User } from "../../../../auth/User";
import {
  appwriteDatabases,
  appwriteTeams,
} from "../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../config-global";
import { PATH_AUTH } from "../../../../routes/paths";
import { Query } from "appwrite";

// ----------------------------------------------------------------------

UserInviteDialoge.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  teamId: PropTypes.string,
  teamName: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function UserInviteDialoge({
  open,
  onClose,
  onUpdate,
  teamName,
  teamId,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);

  const sendInvite = async () => {
    setIsSubmitting(true);
    try {
      const x = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.adminUsers,
          [Query.equal("empId", selectedUser.match(/\w{3}\d{4}/g))]
        )
      ).documents[0];
      await appwriteTeams.createMembership(
        teamId,
        [role],
        window.location.origin + PATH_AUTH.acceptInvite,
        undefined,
        x.$id
      );
      onClose();
      onUpdate();
      enqueueSnackbar("Invite sent successfully");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ pb: 2 }}>Invite existing Users</DialogTitle>
      <Block>
        <Autocomplete
          fullWidth
          autoComplete
          loading={isUserListLoading}
          options={userList}
          onFocus={async (event) => {
            setIsUserListLoading(true);
            try {
              const tem = await User.getUserList(event.currentTarget.value);
              setUserList(tem);
            } catch (error) {
              console.log(error);
            }
            setIsUserListLoading(false);
          }}
          onInputChange={async (event) => {
            setIsUserListLoading(true);
            try {
              const tem = await User.getUserList(event.currentTarget.value);
              setUserList(tem);
            } catch (error) {
              console.log(error);
            }
            setIsUserListLoading(false);
          }}
          onChange={async (event) => {
            setSelectedUser(event.currentTarget.innerHTML);
          }}
          renderOption={(props, option) => (
            <li {...props} key={props.key}>
              {option}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Users" />}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          onChange={(event) => setRole(event.target.value)}
          placeholder="Role"
          label="Role of Selected User"
          helperText="Role of the selected User only in the current team."
          sx={{ mt: 3 }}
        />

        <DialogActions>
          <LoadingButton
            variant="contained"
            startIcon={<Iconify icon="material-symbols:send-outline" />}
            onClick={sendInvite}
            loading={isSubmitting}
          >
            Send Invite
          </LoadingButton>

          <Button
            variant="outlined"
            startIcon={<Iconify icon="zondicons:close-outline" />}
            onClick={onClose}
          >
            Close
          </Button>
        </DialogActions>
      </Block>
    </Dialog>
  );
}
