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

import PropTypes from 'prop-types';
// React
import { useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  Button,
  DialogActions
} from '@mui/material';
// sections
import { Block } from '../../../../sections/_examples/Block';
// Components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
// Auth
import {
  Team,
  User,
} from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

UserInviteDialoge.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  teamId: PropTypes.string,
  teamName: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function UserInviteDialoge({ open, onClose, onUpdate, teamName, teamId, ...other }) {

  const { enqueueSnackbar } = useSnackbar();

  const [selectedUser, setSelectedUser] = useState({});
  const { userProfile } = useAuthContext();
  const [role, setRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);

  const sendInvite = async () => {
    setIsSubmitting(true);
    try {
      await Team.sendTeamInvitationEmail(
        selectedUser.email,
        selectedUser.$id,
        teamName,
        selectedUser.name,
        userProfile.name,
        userProfile.designation,
        userProfile.email,
        userProfile.phoneNumber,
        role,
        teamId,
        userProfile.$id,
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onClose();
      onUpdate();
      enqueueSnackbar('Invite sent successfully');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ pb: 2 }}>Invite existing Users</DialogTitle>
      <Block>
        <Autocomplete
          fullWidth
          autoComplete
          value={selectedUser?.name}
          loading={isUserListLoading}
          options={userList}
          onFocus={async (event, value) => {
            try {
              setIsUserListLoading(true);
              const tem = await User.getUserList(value?.$id ? value?.name : value);
              setUserList(tem);
              setIsUserListLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
          onInputChange={async (event, value) => {
            try {
              setIsUserListLoading(true);
              const tem = await User.getUserList(value?.$id ? value?.name : value);
              setUserList(tem);
              setIsUserListLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
          onChange={async (event, value) => {
            setSelectedUser(value);
          }}
          getOptionLabel={(option) => option?.name ? option?.name + ' (' + option?.empId + ')' : option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {option?.name + ' (' + option?.empId + ')'}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Value" />
          )}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          onChange={(event) => setRole(event.target.value)}
          placeholder='Role'
          label='Role of Selected User'
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