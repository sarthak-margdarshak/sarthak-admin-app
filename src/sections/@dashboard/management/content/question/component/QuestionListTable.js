import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import QuestionRowTable from "sections/@dashboard/management/content/question/component/QuestionRowTable";
import { StyledTableCell } from "components/table/StyledTableCell";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "question", label: "Question", minWidth: 250 },
  { id: "creator", label: "Created By", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
];

export default function QuestionListTable({ data, searchId }) {
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
            <QuestionRowTable key={id} id={id} searchId={searchId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
