import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ProductRowTable from "sections/@dashboard/management/content/product/component/ProductRowTable";
import { StyledTableCell } from "components/table/StyledTableCell";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 200 },
  { id: "description", label: "Description", minWidth: 250 },
  { id: "status", label: "Status", minWidth: 170 },
];

export default function ProductListTable({ data, searchId }) {
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
          {data?.map((id) => (
            <ProductRowTable key={id} id={id} searchId={searchId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
