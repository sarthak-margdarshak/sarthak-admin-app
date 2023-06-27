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
import { useEffect, useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
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
  getUserInviteList,
  sendTeamInvitationEmail
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

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { userProfile } = useAuthContext();
  const [role, setRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const tempUsers = await getUserInviteList();
      setUsers(tempUsers.documents);
    }
    fetchData();
  }, [userProfile]);

  const sendInvite = async () => {
    try {
      setIsSubmitting(true);
      selectedUsers.map(async (value) => {
        await sendTeamInvitationEmail(
          value.email,
          value.$id,
          teamName,
          value.name,
          userProfile.name,
          userProfile.designation,
          userProfile.email,
          userProfile.phoneNumber,
          role,
          teamId,
          userProfile.$id,
        );
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onClose();
      onUpdate();
      enqueueSnackbar('Data sent successfully');
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ pb: 2 }}>Invite existing Users</DialogTitle>
      <Block>
        <Autocomplete
          fullWidth
          multiple
          options={users}
          disableCloseOnSelect
          onChange={(event, value) => { setSelectedUsers(value) }}
          getOptionLabel={(option) => option?.name + ' (' + option?.$id + ')'}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              {option?.name + ' (' + option?.$id + ')'}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Select Users" placeholder="Select" />
          )}
        />

        <TextField
          fullWidth
          onChange={(event) => setRole(event.target.value)}
          placeholder='Role'
          label='Role of all Selecte Users'
          sx={{mt: 3}}
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