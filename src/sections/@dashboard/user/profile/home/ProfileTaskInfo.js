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
import { Card, Stack, Typography, Divider, Link } from '@mui/material';
// utils
import { fNumber } from '../../../../../utils/formatNumber';
// locales
import { useLocales } from '../../../../../locales';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthContext } from '../../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

ProfileTaskInfo.propTypes = {
  team: PropTypes.number,
  question: PropTypes.number,
};

// ----------------------------------------------------------------------

export default function ProfileTaskInfo({ team, question }) {

  const { translate } = useLocales();
  const {user} = useAuthContext();

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Link component={RouterLink} to='/dashboard/team/list'>
            <Typography variant="h4">{fNumber(team)}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('Team')}
            </Typography>
          </Link>
        </Stack>

        <Stack width={1} textAlign="center">
          <Link component={RouterLink} onClick={() => window.open(window.location.origin+'/dashboard/question/list?createdBy='+user?.$id, '_self')}>
            <Typography variant="h4">{fNumber(question)}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('question')}
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}
