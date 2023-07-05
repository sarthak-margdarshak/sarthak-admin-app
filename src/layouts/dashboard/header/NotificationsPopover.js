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

// @mui
import {
  Badge
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { IconButtonAnimate } from '../../../components/animate';
import { useAuthContext } from '../../../auth/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {

  const { notificationCount } = useAuthContext();
  const navigate = useNavigate();

  return (
    <>
      <IconButtonAnimate
        onClick={() => navigate(PATH_DASHBOARD.notification.root)}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={notificationCount} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>
    </>
  );
}