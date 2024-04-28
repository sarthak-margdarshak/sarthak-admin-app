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
import { Container, Button, Card } from '@mui/material';
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
// auth
import { User } from '../../../../auth/User';
import { Team } from '../../../../auth/Team';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { useTable, getComparator, emptyRows, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sn', },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'totalMember', label: 'Total Member', align: 'left' },
  { id: '' },
];

export default function TeamListPage() {

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { translate } = useLocales();
  const [createTeam, setCreateTeam] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get My Team Data
        const team = await Team.getMyTeamData(user.$id);
        setMyTeam(team.documents);
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

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <>
      <Helmet>
        <title>Team: List | Sarthak Admin</title>
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

        {/* <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              {update ?
                <LinearProgress /> :
                <Table size={'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <UserTableRow
                            key={row.$id}
                            index={row?.sn}
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
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                    />
                  </TableBody>
                </Table>
              }
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card> */}

      </Container>
    </>
  );
}
