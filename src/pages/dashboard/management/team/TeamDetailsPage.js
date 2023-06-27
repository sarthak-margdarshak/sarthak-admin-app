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
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import {
  useTable,
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import { useSnackbar } from '../../../../components/snackbar';
// sections
import { UserTableRow } from '../../../../sections/@dashboard/team/list';
import TeamCover from '../../../../sections/@dashboard/team/teamMemberview/TeamCover';
import CreateUserDialog from '../../../../sections/@dashboard/team/teamMemberview/CreateUserDialog';
import UserInviteDialoge from '../../../../sections/@dashboard/team/teamMemberview/UserInviteDialoge';
// Auth
import {
  blockUser,
  getImageProfileLink,
  getProfileData,
  getTeamCover,
  getTeamData,
  listTeamMembership
} from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'designation', label: 'Designation', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'invitationAccepted', label: 'Invite Accepted', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function TeamDetailsPage() {
  const teamId = window.location.pathname.split('/')[3];

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();

  const [team, setTeam] = useState(null);
  const [cover, setCover] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get Team Data
        const tempTeam = await getTeamData(teamId);
        setTeam(tempTeam);
        // Get Owner Data of the team
        const ownerData = await getProfileData(tempTeam?.teamOwner);
        setOwnerName(ownerData?.name)
        if (tempTeam?.cover) {
          const tempCover = await getTeamCover(tempTeam?.cover);
          setCover(tempCover);
        }
        if (ownerData?.photoUrl) {
          const tempAvatarUrl = await getImageProfileLink(ownerData?.photoUrl);
          setAvatarUrl(tempAvatarUrl);
        }
        // Get Team members data
        const data = await listTeamMembership(teamId);
        setTableData(data.documents);
      } catch (error) {
        console.error(error)
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  }, [update, enqueueSnackbar, teamId])

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const denseHeight = 72;

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.user.profile(id));
  };

  const handleEditPermissionRow = (id) => {
    navigate(PATH_DASHBOARD.team.permissionEdit(id?.teamId, id?.userId));
  };
  const handleBlockRow = async (id) => {
    try {
      await blockUser(id);
      setUpdate(true);
      enqueueSnackbar('Blocked');
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> {"Team: " + team?.name + " | Sarthak Admin"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={team?.name + " Members"}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Team', href: PATH_DASHBOARD.team.list },
            { name: team?.name },
          ]}
          action={user?.$id === team?.teamOwner &&
            <>
              <Button
                component={RouterLink}
                onClick={() => setOpenConfirm(true)}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New
              </Button>
              <Button
                component={RouterLink}
                sx={{ ml: 2 }}
                onClick={() => setOpenInvite(true)}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:invite-line" />}
              >
                Invite
              </Button>
            </>
          }
        />

        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <TeamCover cover={cover} name={team?.name} ownerName={ownerName} ownerCover={avatarUrl} />
        </Card>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <UserTableRow
                          key={row.$id}
                          index={index+1}
                          row={row}
                          onViewRow={() => handleViewRow(row?.userId)}
                          onEditRow={() => handleEditPermissionRow(row)}
                          onBlockRow={() => handleBlockRow(row)}
                          userIsOwner={user?.$id === team?.teamOwner}
                        />
                      )
                    })}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>

      <CreateUserDialog
        teamId={teamId}
        teamName={team?.name}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onUpdate={() => setUpdate(!update)}
      />

      <UserInviteDialoge
        teamId={teamId}
        teamName={team?.name}
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        onUpdate={() => setUpdate(!update)}
      />
    </>
  );
}