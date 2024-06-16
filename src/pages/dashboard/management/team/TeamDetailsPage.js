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

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  LinearProgress,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import Iconify from "../../../../components/iconify";
import Scrollbar from "../../../../components/scrollbar";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import {
  useTable,
  getComparator,
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "../../../../components/table";
import { useSnackbar } from "../../../../components/snackbar";
// sections
import { UserTableRow } from "../../../../sections/@dashboard/team/list";
import CreateUserDialog from "../../../../sections/@dashboard/team/teamMemberview/CreateUserDialog";
import UserInviteDialoge from "../../../../sections/@dashboard/team/teamMemberview/UserInviteDialoge";
// Auth
import { useAuthContext } from "../../../../auth/useAuthContext";
import {
  appwriteFunctions,
  appwriteDatabases,
  appwriteTeams,
} from "../../../../auth/AppwriteContext";
import { Query } from "appwrite";
import { APPWRITE_API } from "../../../../config-global";
import React from "react";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "sn" },
  { id: "name", label: "Name", align: "left" },
  { id: "role", label: "Role", align: "left" },
  { id: "status", label: "Status", align: "center" },
  { id: "active", lable: "Active", align: "center" },
  { id: "action", label: "Action", align: "center" },
];

// ----------------------------------------------------------------------

export default function TeamDetailsPage() {
  const teamId = window.location.pathname.split("/")[3];

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const { user, sarthakInfoData } = useAuthContext();

  const [team, setTeam] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [update, setUpdate] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setUpdate(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        // Get Team Data
        const membershipData = await appwriteTeams.listMemberships(teamId, [
          Query.limit(100),
        ]);
        const tempTeam = await appwriteTeams.get(teamId);
        setTeam(tempTeam);
        // Get Team members data
        var f_data = [];
        var count = 1;
        for (let i in membershipData.memberships) {
          if (
            membershipData.memberships[i].userId === user.$id &&
            membershipData.memberships[i].roles.find(
              (val) => val === "owner"
            ) !== undefined
          ) {
            setIsOwner(true);
          }
          var tempRowUser = null;
          try {
            tempRowUser = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.adminUsers,
              membershipData.memberships[i]?.userId
            );
          } catch (error) {}
          f_data.push({
            sn: count,
            ...membershipData.memberships[i],
            blocked: tempRowUser?.blocked || false,
            photoUrl: tempRowUser?.photoUrl,
            createTeam: tempRowUser?.createTeam || false,
          });
          count++;
        }
        setTableData(f_data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: "error" });
      }
      setUpdate(false);
    };
    fetchData();
  }, [enqueueSnackbar, updated, teamId, user.$id]);

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

  const handleToogleBlockRow = async (row) => {
    try {
      await appwriteFunctions.createExecution(
        APPWRITE_API.functions.toogleBlock,
        JSON.stringify({
          userId: row.userId,
          action: row.blocked ? "unblock" : "block",
        }),
        true
      );
      if (row.blocked) {
        enqueueSnackbar("Successfully Unblocked");
      } else {
        enqueueSnackbar("Successfully Blocked");
      }
      setUpdated(updated + 1);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>{"Team: " + team?.name + " | Sarthak Admin"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={team?.name + " Members"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Team", href: PATH_DASHBOARD.team.list },
            { name: team?.name },
          ]}
          action={
            <React.Fragment>
              {team?.$id === sarthakInfoData?.adminTeamId &&
                user?.$id === APPWRITE_API.documents.ceoId &&
                !update && (
                  <Button
                    component={RouterLink}
                    onClick={() => setOpenConfirm(true)}
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    New
                  </Button>
                )}
              {team?.$id !== sarthakInfoData?.adminTeamId &&
                !update &&
                isOwner && (
                  <Button
                    component={RouterLink}
                    sx={{ ml: 2 }}
                    onClick={() => setOpenInvite(true)}
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:invite-line" />}
                  >
                    Invite
                  </Button>
                )}
            </React.Fragment>
          }
        />

        <Card>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              {update ? (
                <LinearProgress />
              ) : (
                <Table size={"medium"} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <UserTableRow
                            key={row.$id}
                            index={row?.sn}
                            userRow={row}
                            onViewRow={() => handleViewRow(row?.userId)}
                            onToogleBlockRow={() => handleToogleBlockRow(row)}
                            isCEO={user?.$id === APPWRITE_API.documents.ceoId}
                            teamId={teamId}
                          />
                        );
                      })}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        dataFiltered.length
                      )}
                    />
                  </TableBody>
                </Table>
              )}
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
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

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
    filtered.push({
      ...inputData[i],
      sn: count,
    });
    count++;
  }
  return filtered;
}
