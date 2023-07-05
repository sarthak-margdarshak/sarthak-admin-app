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

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Checkbox, Container, FormControlLabel, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Block from '../../../../components/settings/drawer/Block';
import Iconify from '../../../../components/iconify/Iconify';
import { useSnackbar } from '../../../../components/snackbar';
import LoadingScreen from '../../../../components/loading-screen/LoadingScreen';
// locales
import { useLocales } from '../../../../locales';
// Auth
import {
  User,
} from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';
// sections
import PermissionDeniedComponent from '../../../../sections/_examples/PermissionDeniedComponent';
import Page404 from '../../../Page404';

// ----------------------------------------------------------------------

export default function UserUpdatePermissionPage() {
  const teamId = window.location.pathname.split('/')[3];
  const userId = window.location.pathname.split('/')[5];

  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const {
    user,
    notificationCount,
  } = useAuthContext();

  const [currentUser, setCurrentUser] = useState(null);
  const [createTeam, setCreateTeam] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAccessible, setIsAccessible] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var data = await User.isPermissionUpdatable(userId, teamId, user?.$id);
        setIsAccessible(data);
        data = await User.getProfileData(userId);
        setCurrentUser(data);
        data = await User.getUserPermissionData(userId);
        setCreateTeam(data?.createTeam);
        setCreateTask(data?.createTask);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  }, [userId, teamId, enqueueSnackbar, user])

  const updatePermission = async () => {
    try {
      setIsSubmitting(true);
      await User.updatePermissions(userId, createTeam, createTask);
      enqueueSnackbar('Updated Successfully');
      setIsSubmitting(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  if(isAccessible === -1) return <LoadingScreen />

  return (
    <>
      <Helmet>
        <title>{(notificationCount!==0?'('+notificationCount+')':'')+' '+currentUser?.name + " Permission: Update | Sarthak Admin"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Update Permissions"
          links={[
            {
              name: translate('dashboard'),
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Team',
              href: PATH_DASHBOARD.team.list,
            },
            {
              name: currentUser?.name,
              href: PATH_DASHBOARD.user.profile(userId),
            },
            {
              name: 'Permissions',
            },
          ]}
        />
        {isAccessible === 1 ? <PermissionDeniedComponent /> : (isAccessible === 0 ? <Page404 /> :
          <>
            <Block>

              <Stack direction="column">
                <FormControlLabel
                  sx={{ mb: 2 }}
                  label="Permission to create Team"
                  control={
                    <Checkbox checked={createTeam} onChange={(event, checked) => setCreateTeam(checked)} />
                  }
                />
                <FormControlLabel
                  sx={{ mb: 2 }}
                  label="Permission to create Task"
                  control={
                    <Checkbox checked={createTask} onChange={(event, checked) => setCreateTask(checked)} />
                  }
                />
              </Stack>
            </Block>
            <LoadingButton
              variant="contained"
              alignItems="flex-end"
              startIcon={<Iconify icon="material-symbols:update" />}
              onClick={updatePermission}
              loading={isSubmitting}
            >
              Update
            </LoadingButton>
          </>
        )}
      </Container>
    </>
  );
}
