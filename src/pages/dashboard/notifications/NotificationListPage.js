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

import { Box, Container, Tab, Tabs, } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { useSettingsContext } from "../../../components/settings";
import Iconify from "../../../components/iconify/Iconify";
import { useEffect, useState } from "react";
import NotificationListComponent from "../../../sections/@dashboard/notification/NotificationListComponent";
import { Notification } from "../../../auth/AppwriteContext";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useSnackbar } from '../../../components/snackbar';

export default function NotificationListPage() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [allNotification, setAllNotification] = useState([]);
  const [unreadNotification, setUnreadNotification] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        var data = await Notification.getAllNotification(user?.$id);
        setAllNotification(data);
        data = await Notification.getUnreadNotification(user?.$id);
        setUnreadNotification(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  }, [user, enqueueSnackbar])

  const TABS = [
    {
      value: 'all',
      label: 'All',
      icon: <Iconify icon="solar:check-read-bold-duotone" />,
      component: <NotificationListComponent notifications={allNotification} />,
    },
    {
      value: 'unread',
      label: 'Unread',
      icon: <Iconify icon="ion:mail-unread" />,
      component: <NotificationListComponent notifications={unreadNotification} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Notifications | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Notification'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Notifications', href: PATH_DASHBOARD.notification.list },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value}>
                {tab.component}
              </Box>
            )
        )}

      </Container>
    </>
  )
}