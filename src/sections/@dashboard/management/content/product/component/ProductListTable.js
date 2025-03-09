import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Label from "components/label";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Marker } from "react-mark.js";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 200 },
  { id: "description", label: "Description", minWidth: 250 },
  { id: "status", label: "Status", minWidth: 170 },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function ProductListTable({ data }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell
                key={column.id}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            return (
              <TableRow
                onClick={() => {
                  navigate(
                    PATH_DASHBOARD.product.view(row.$id) +
                      (content === "" ? "" : "?content=" + content)
                  );
                }}
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.$id}
                sx={{
                  cursor: "pointer",
                }}
              >
                <TableCell>{row.productId}</TableCell>
                <TableCell>
                  <Marker mark={content}>{row.name}</Marker>
                </TableCell>
                <TableCell>
                  <Marker mark={content}>{row.description}</Marker>
                </TableCell>
                <TableCell>
                  <Label
                    variant="soft"
                    color={(row.published === false && "error") || "success"}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row.published ? "Published" : "Draft"}
                  </Label>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
