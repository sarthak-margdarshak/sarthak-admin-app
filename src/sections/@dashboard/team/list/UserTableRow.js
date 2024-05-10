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
import { useEffect, useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import { useSnackbar } from '../../../../components/snackbar';
// Auth
import { APPWRITE_API } from '../../../../config-global';
import { storage } from '../../../../auth/AppwriteContext';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  isCEO: PropTypes.bool,
  onBlockRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function UserTableRow({ index, row, onEditRow, onViewRow, isCEO, onBlockRow }) {
  const [openPopover, setOpenPopover] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (row?.photoUrl) {
          const tempAvatar = (storage.getFilePreview(APPWRITE_API.buckets.adminUserImage, row?.photoUrl, undefined, undefined, undefined, 20)).href;
          setAvatarUrl(tempAvatar)
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  }, [enqueueSnackbar, row])

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>

        <TableCell align="left">{index}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={row?.name} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap>
              {row?.userName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{row?.designation}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.roles}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={row?.confirm ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!row?.confirm && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="center">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view" />
          View
        </MenuItem>
        {
          row?.userId !== APPWRITE_API.ceoId && <>
            <MenuItem
              disabled={!isCEO}
              onClick={() => {
                onEditRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="fluent-mdl2:permissions" />
              Permissions
            </MenuItem>

            <MenuItem
              disabled={!isCEO}
              onClick={() => {
                onBlockRow();
                handleClosePopover();
              }}
            >
              <Iconify icon="material-symbols:block" />
              Block
            </MenuItem>
          </>
        }
      </MenuPopover>
    </>
  );
}
