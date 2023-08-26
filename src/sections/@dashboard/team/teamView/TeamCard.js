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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Link } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/image';
import SvgColor from '../../../../components/svg-color';
import { useSnackbar } from '../../../../components/snackbar';
// Routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// Auth
import {
  Team,
  User,
} from '../../../../auth/AppwriteContext';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

TeamCard.propTypes = {
  team: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TeamCard({ team }) {

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [cover, setCover] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [ownerName, setOwnerName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await Team.getTeamData(team?.$id);
        const ownerData = await User.getProfileData(teamData?.teamOwner);
        if (teamData?.cover && teamData?.cover !== '') {
          const tempCover = await Team.getTeamCover(teamData?.cover);
          setCover(tempCover);
        }
        if (ownerData?.photoUrl && ownerData?.photoUrl !== '') {
          const tempAvatarUrl = await User.getImageProfileLink(ownerData?.photoUrl);
          setAvatarUrl(tempAvatarUrl);
        }
        setOwnerName(ownerData?.name)
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  })

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={ownerName}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <StyledOverlay />

        <Image src={cover} alt={team?.name} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
        <Link
          noWrap
          color="inherit"
          onClick={() => navigate(PATH_DASHBOARD.team.view(team?.$id))}
          sx={{ cursor: 'pointer' }}>
          {team?.name}
        </Link>
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {ownerName}
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Member
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(team?.member)}</Typography>
        </div>
      </Box>
    </Card>
  );
}
