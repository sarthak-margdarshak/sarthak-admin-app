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
import { useEffect, useState } from 'react';
import { Question } from '../../../../auth/AppwriteContext';

// ----------------------------------------------------------------------

QuestionTableRow.propTypes = {
  row: PropTypes.object,
  onClickRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function QuestionTableRow({ row, onClickRow }) {

  const [question, setQuestion] = useState('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      setQuestion(await (await fetch(await Question.getQuestionContentForPreview(row?.question))).text());
    }
    fetchData();
  })

  return (
    <>
      <TableRow hover component={RouterLink} to={onClickRow}>

        <TableCell align="left">{row?.sn}</TableCell>

        <TableCell align="left">
          <FroalaEditorView model={question} />
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
