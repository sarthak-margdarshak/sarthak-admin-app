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

// ----------------------------------------------------------------------

export default function TeamCreatePage() {
  const arr = window.location.pathname.split('/');
  var teamId = null;
  if (arr.length === 5) {
    teamId = arr[3];
  }

  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  return (
    <>
      <Helmet>
      {teamId ?
        <title>Team: Edit | Sarthak Admin</title>:
        <title>Team: Create | Sarthak Admin</title>
      }
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {teamId ?
        <CustomBreadcrumbs
        heading="Edit Team"
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
            name: teamId,
            href: PATH_DASHBOARD.team.view(teamId),
          },
          { name: 'edit'}
        ]}
      />:
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
        />}
        <TeamNewForm teamId={teamId} />
      </Container>
    </>
  );
}
