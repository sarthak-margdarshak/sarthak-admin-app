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

import PropTypes from "prop-types";
// @mui
import { TableRow, TableCell, IconButton, Typography } from "@mui/material";
// components
import Iconify from "../../../../components/iconify";

// ----------------------------------------------------------------------

TeamTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function TeamTableRow({ index, row, onViewRow }) {
  return (
    <TableRow hover>
      <TableCell align="left">{index}</TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {row?.name}
        </Typography>
      </TableCell>

      <TableCell align="left">
        {new Date(row?.$createdAt).toLocaleDateString("en-US")}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: "capitalize" }}>
        {row?.total}
      </TableCell>

      <TableCell align="left">{row?.$id}</TableCell>

      <TableCell align="left">
        <IconButton onClick={onViewRow}>
          <Iconify icon="carbon:view" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
