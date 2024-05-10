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

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Button, Card, LinearProgress, TableContainer, Table, TableBody } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify/Iconify';
import { useSnackbar } from '../../../../components/snackbar';
// locales
import { useLocales } from '../../../../locales';
// auth
import { User } from '../../../../auth/User';
import { Team } from '../../../../auth/Team';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { useTable, getComparator, emptyRows, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import TeamTableRow from '../../../../sections/@dashboard/team/list/TeamTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sn', },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'totalMember', label: 'Total Member', align: 'left' },
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'view', label: 'View', align: 'left' },
];

export default function TeamListPage() {
  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { translate } = useLocales();
  const [createTeam, setCreateTeam] = useState(false);
  const [myTeam, setMyTeam] = useState([]);
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
      try {
        // Get My Team Data
        const team = await Team.getMyTeamData();
        setMyTeam(team.teams);
        // Check whether user has permission to create Team or not
        const permission = await User.getUserPermissionData(user.$id);
        setCreateTeam(permission.createTeam);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setUpdate(false)
    }
    fetchData();
  }, [user, enqueueSnackbar])

  const denseHeight = 72;

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.team.view(id));
  };

  const dataFiltered = applyFilter({
    inputData: myTeam,
    comparator: getComparator(order, orderBy),
  });

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

        <Card>
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
                          <TeamTableRow
                            key={row.$id}
                            index={row?.sn}
                            row={row}
                            onViewRow={() => handleViewRow(row?.$id)}
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
        </Card>

      </Container>
    </>
  );
}

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  var filtered = [];
  var count = 1;
  for (let i in inputData) {
    filtered.push(
      {
        ...inputData[i],
        sn: count,
      }
    );
    count++;
  }
  return filtered;
}