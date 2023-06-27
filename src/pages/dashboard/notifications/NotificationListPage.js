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

import { Container, } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { useSettingsContext } from "../../../components/settings";

export default function NotificationListPage() {
  const { themeStretch } = useSettingsContext();

  // const TABS = [
  //   {
  //     value: 'your_team',
  //     label: translate('your_team'),
  //     icon: <Iconify icon="fluent-mdl2:team-favorite" />,
  //     component: <TeamListCard teams={null} />,
  //   },
  //   {
  //     value: 'all_team',
  //     label: translate('all_team'),
  //     icon: <Iconify icon="ps:people-team" />,
  //     component: <TeamListCard teams={null} />,
  //   },
  // ];


  return (
    <>
      <Helmet>
        <title> {"Notifications | Sarthak Admin"}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Notification'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Notifications', href: PATH_DASHBOARD.notification.list },
          ]}
        />

        {/* <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )} */}

      </Container>
    </>
  )
}