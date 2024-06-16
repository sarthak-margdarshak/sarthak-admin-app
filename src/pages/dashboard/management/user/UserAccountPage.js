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

import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
// @mui
import { Container, Tab, Tabs, Box } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// auth
import { useAuthContext } from "../../../../auth/useAuthContext";
// components
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import {
  AccountGeneral,
  AccountSocialLinks,
  AccountPermissions,
  AccountChangePassword,
} from "../../../../sections/@dashboard/user/account";
// locales
import { useLocales } from "../../../../locales";

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState(
    urlParams.has("tab") ? urlParams.get("tab") : "general"
  );

  const { translate } = useLocales();

  const { user } = useAuthContext();

  const TABS = [
    {
      value: "general",
      label: translate("general"),
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    {
      value: "permissions",
      label: translate("permission"),
      icon: (
        <Iconify icon="streamline:computer-desktop-block-desktop-device-display-disable-permission-computer" />
      ),
      component: <AccountPermissions />,
    },
    {
      value: "social_links",
      label: translate("social_links"),
      icon: <Iconify icon="eva:share-fill" />,
      component: <AccountSocialLinks />,
    },
    {
      value: "change_password",
      label: translate("change_password"),
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>User: Account Settings | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={translate("account")}
          links={[
            { name: translate("dashboard"), href: PATH_DASHBOARD.root },
            { name: user?.name, href: PATH_DASHBOARD.user.profile(user?.$id) },
            { name: translate("account_settings") },
          ]}
        />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </React.Fragment>
  );
}
