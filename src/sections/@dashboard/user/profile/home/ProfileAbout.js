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

import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, IconButton } from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';
// locales
import { useLocales } from '../../../../../locales';
import { useAuthContext } from '../../../../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  userId: PropTypes.string,
  company: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string,
  quote: PropTypes.string,
  role: PropTypes.string,
  school: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function ProfileAbout({ userId, quote, country, email, role, company, school }) {

  const { translate } = useLocales();
  const { user } = useAuthContext();

  return (
    <Card>
      <CardHeader
        title={translate("about")}
        action={
          userId === user?.$id ?
            <IconButton component={RouterLink} aria-label="Edit" to={PATH_DASHBOARD.user.account}>
              <Iconify icon="ic:baseline-edit" />
            </IconButton> : <></>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{quote}</Typography>

        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2">
            {translate('live_at') + " : "} &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {country}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2">
            {role} , &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {company}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="material-symbols:school" />

          <Typography variant="body2">
            {translate('studied_at') + ' : '} &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {school}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
