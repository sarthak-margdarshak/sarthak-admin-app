import { IconButton, TableCell, TableRow } from "@mui/material";
import Label from "../../../components/label";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../../../components/iconify";

export default function MockTestTableRow({ mockTest }) {
  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        {mockTest.mtId}
      </TableCell>
      <TableCell>{mockTest.name}</TableCell>
      <TableCell>{mockTest.description}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={(mockTest?.published === false && "error") || "success"}
          sx={{ textTransform: "capitalize" }}
        >
          {mockTest?.published ? "Published" : "Unpublished"}
        </Label>
      </TableCell>
      <TableCell align="center">
        <IconButton
          to={PATH_DASHBOARD.mockTest.view(mockTest.$id)}
          component={RouterLink}
          target="_blank"
        >
          <Iconify icon="fa-solid:external-link-alt" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
