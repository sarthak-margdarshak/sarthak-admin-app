import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "components/snackbar";
import { useAuthContext } from "auth/useAuthContext";
import { Fragment, useEffect, useState } from "react";
import { appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { labels, sarthakAPIPath } from "assets/data";
import {
  Button,
  Card,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Scrollbar from "components/scrollbar/Scrollbar";
import { TableEmptyRows, TableHeadCustom } from "components/table";
import UserTableRow from "./UserTableRow";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ebebeb",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  marginBottom: 5,
  textAlign: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const TABLE_HEAD = [
  { id: "sn", label: "S.N", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "id", label: "Id", align: "left" },
  { id: "role", label: "Role", align: "left" },
  { id: "status", label: "Status", align: "left" },
  { id: "action", label: "Action", align: "center" },
];

export default function UsersListComponent() {
  const [searchParams] = useSearchParams();

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(true);

  const [labelSelected, setLabelSelected] = useState(searchParams.get("label"));
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [lastId, setLastId] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setUpdate(true);
    try {
      let body = {};
      if (labelSelected) body = { ...body, label: labelSelected };
      if (search) body = { ...body, search: search };
      if (lastId) body = { ...body, lastId: lastId };

      let response = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify(body),
        false,
        sarthakAPIPath.user.fetch.list
      );
      response = JSON.parse(response.responseBody);

      if (response.status === "success") {
        setUsers(users.concat(response.users));
        setTotal(response.total);
        if (response.users.length > 0)
          setLastId(response.users[response.users.length - 1].$id);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setUpdate(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const denseHeight = 72;

  return (
    <Fragment>
      <Item>
        <Stack direction="row" spacing={2}>
          <Chip
            color="primary"
            label="Founder"
            onClick={() =>
              labelSelected === labels.founder
                ? setLabelSelected(null)
                : setLabelSelected(labels.founder)
            }
            deleteIcon={
              labelSelected === labels.founder ? <DoneIcon /> : <CloseIcon />
            }
            onDelete={() =>
              labelSelected === labels.founder
                ? setLabelSelected(null)
                : setLabelSelected(labels.founder)
            }
            variant={
              labelSelected === labels.founder ? "contained" : "outlined"
            }
            sx={{ borderRadius: 1 }}
          />

          <Chip
            color="success"
            label="Admin"
            onClick={() =>
              labelSelected === labels.admin
                ? setLabelSelected(null)
                : setLabelSelected(labels.admin)
            }
            deleteIcon={
              labelSelected === labels.admin ? <DoneIcon /> : <CloseIcon />
            }
            onDelete={() =>
              labelSelected === labels.admin
                ? setLabelSelected(null)
                : setLabelSelected(labels.admin)
            }
            variant={labelSelected === labels.admin ? "contained" : "outlined"}
            sx={{ borderRadius: 1 }}
          />

          <Chip
            color="warning"
            label="Author"
            onClick={() =>
              labelSelected === labels.author
                ? setLabelSelected(null)
                : setLabelSelected(labels.author)
            }
            deleteIcon={
              labelSelected === labels.author ? <DoneIcon /> : <CloseIcon />
            }
            onDelete={() =>
              labelSelected === labels.author
                ? setLabelSelected(null)
                : setLabelSelected(labels.author)
            }
            variant={labelSelected === labels.author ? "contained" : "outlined"}
            sx={{ borderRadius: 1 }}
          />

          <Chip
            color="info"
            label="Student"
            onClick={() =>
              labelSelected === labels.student
                ? setLabelSelected(null)
                : setLabelSelected(labels.student)
            }
            deleteIcon={
              labelSelected === labels.student ? <DoneIcon /> : <CloseIcon />
            }
            onDelete={() =>
              labelSelected === labels.student
                ? setLabelSelected(null)
                : setLabelSelected(labels.student)
            }
            variant={
              labelSelected === labels.student ? "contained" : "outlined"
            }
            sx={{ borderRadius: 1 }}
          />

          <TextField
            value={search}
            label="Search Users"
            variant="outlined"
            size="small"
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button
            variant="outlined"
            onClick={() => {
              let url = PATH_DASHBOARD.team;
              let ret = [];
              if (labelSelected)
                ret.push(
                  encodeURIComponent("label") +
                    "=" +
                    encodeURIComponent(labelSelected)
                );
              if (search !== null && search !== "")
                ret.push(
                  encodeURIComponent("search") +
                    "=" +
                    encodeURIComponent(search)
                );
              if (ret.length > 0) {
                url += "?" + ret.join("&");
              }
              window.open(url, "_self");
            }}
          >
            Filter
          </Button>
        </Stack>
      </Item>

      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            {update ? (
              <LinearProgress />
            ) : (
              <Table size={"medium"} sx={{ minWidth: 800 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {users.map((user, index) => (
                    <UserTableRow
                      key={user.$id}
                      incomingUser={user}
                      index={index + 1}
                    />
                  ))}

                  {users.length === 0 && (
                    <TableEmptyRows height={denseHeight} emptyRows={5} />
                  )}

                  {users.length !== total && (
                    <Button sx={{ m: 2 }} onClick={fetchData}>
                      Load More
                    </Button>
                  )}
                </TableBody>
              </Table>
            )}
          </Scrollbar>
        </TableContainer>
      </Card>
    </Fragment>
  );
}
