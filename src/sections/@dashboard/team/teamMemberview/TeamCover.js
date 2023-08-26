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
import { Box, IconButton, Typography } from '@mui/material';
// components
import Image from '../../../../components/image';
import { CustomAvatar } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify/Iconify';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

// ----------------------------------------------------------------------

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

TeamCover.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  ownerName: PropTypes.string,
  ownerCover: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TeamCover({ id, cover, name, ownerName, ownerCover }) {

  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          src={ownerCover}
          alt={ownerName}
          name={ownerName}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{name}
            <IconButton component={RouterLink} to={PATH_DASHBOARD.team.edit(id)}>
              <Iconify icon='ic:baseline-edit'></Iconify>
            </IconButton>
          </Typography>

          <Typography sx={{ opacity: 0.72 }}>{"Owner :- " + ownerName}</Typography>
        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    </StyledRoot>
  );
}
