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

import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Button, Tabs, Tab } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify/Iconify';
import LoadingScreen from '../../../../components/loading-screen/LoadingScreen';
import { useSnackbar } from '../../../../components/snackbar';
// locales
import { useLocales } from '../../../../locales';
// sections
import TeamListCard from '../../../../sections/@dashboard/team/teamView/TeamListCard';
// auth
import {
  Team,
  User,
} from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TeamListPage() {
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const {
    user,
    notificationCount,
  } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('your_team');

  const { translate } = useLocales();

  const [createTeam, setCreateTeam] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [allTeam, setAllTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get My Team Data
        const team = await Team.getMyTeamData(user.$id);
        setMyTeam(team.documents);
        // Get all data
        const tempAllTeam = await Team.getAllTeamData();
        setAllTeam(tempAllTeam.documents);
        // Check whether user has permission to create Team or not
        const permission = await User.getUserPermissionData(user.$id);
        setCreateTeam(permission.createTeam);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
      }
    }
    fetchData();
  }, [user, enqueueSnackbar])

  const TABS = [
    {
      value: 'your_team',
      label: translate('your_team'),
      icon: <Iconify icon="fluent-mdl2:team-favorite" />,
      component: <TeamListCard teams={myTeam} />,
    },
    {
      value: 'all_team',
      label: translate('all_team'),
      icon: <Iconify icon="ps:people-team" />,
      component: <TeamListCard teams={allTeam} />,
    },
  ];

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <>
      <Helmet>
        <title> {(notificationCount!==0?'('+notificationCount+')':'')+'Team: List | Sarthak Admin'}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Teams"
          links={[
            { name: translate('dashboard'), href: PATH_DASHBOARD.root },
            { name: 'Teams' },
          ]}
          action={
            createTeam &&
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.team.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Create A Team
            </Button>
          }
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
