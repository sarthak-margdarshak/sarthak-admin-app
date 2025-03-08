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
import React from "react";
import { Marker } from "react-mark.js";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactKatex from "@pkasila/react-katex";
import { styled } from "@mui/material/styles";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "question", label: "Question", minWidth: 250 },
  { id: "creator", label: "Created By", minWidth: 170 },
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

export default function QuestionListTable({ data }) {
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
                    PATH_DASHBOARD.question.view(row.$id) +
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
                <TableCell>{row.qnId}</TableCell>
                <TableCell>
                  <Marker mark={content}>
                    <ReactKatex>{row.contentQuestion}</ReactKatex>
                  </Marker>
                </TableCell>
                <TableCell>{row.creator}</TableCell>
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
