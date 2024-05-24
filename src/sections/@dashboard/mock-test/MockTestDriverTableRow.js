import { TableCell, TableRow, Typography } from "@mui/material";

export default function MockTestDriverTableRow({ row }) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" paragraph>
          {row.mtdId}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" paragraph>
          {row.standardIds}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" paragraph>
          {row.subjectIds}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" paragraph>
          {row.chapterIds}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap paragraph>
          {row.conceptIds}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
