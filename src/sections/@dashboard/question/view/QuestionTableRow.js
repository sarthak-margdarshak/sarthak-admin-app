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

import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import { fDate } from '../../../../utils/formatTime';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

QuestionTableRow.propTypes = {
  row: PropTypes.object,
  onClickRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function QuestionTableRow({ row, onClickRow }) {

  return (
    <>
      <TableRow hover component={RouterLink} to={onClickRow}>

        <TableCell align="left">{row?.sn}</TableCell>

        <TableCell align="left">
          <FroalaEditorView model={row?.question} />
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.standard}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.subject}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {fDate(row?.$createdAt)}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.createdBy}
        </TableCell>

      </TableRow>

    </>
  );
}
