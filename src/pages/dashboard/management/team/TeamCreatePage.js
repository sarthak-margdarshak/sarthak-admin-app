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
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import TeamNewForm from '../../../../sections/@dashboard/team/newTeam/TeamNewForm';
// locales
import { useLocales } from '../../../../locales';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TeamCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  const {
    notificationCount,
  } = useAuthContext();

  return (
    <>
      <Helmet>
        <title> {(notificationCount!==0?'('+notificationCount+')':'')+'Team: Create | Sarthak Admin'}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Team"
          links={[
            {
              name: translate('dashboard'),
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Team',
              href: PATH_DASHBOARD.team.list,
            },
            { name: 'New Team' },
          ]}
        />
        <TeamNewForm />
      </Container>
    </>
  );
}
