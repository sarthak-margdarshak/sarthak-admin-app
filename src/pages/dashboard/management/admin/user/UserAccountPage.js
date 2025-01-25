import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { Container, Tab, Tabs, Box } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useAuthContext } from "auth/useAuthContext";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import AccountGeneral from "sections/@dashboard/management/admin/user/account/AccountGeneral";
import AccountPermissions from "sections/@dashboard/management/admin/user/account/AccountPermissions";
import AccountSocialLinks from "sections/@dashboard/management/admin/user/account/AccountSocialLinks";
import AccountChangePassword from "sections/@dashboard/management/admin/user/account/AccountChangePassword";

export default function UserAccountPage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState(
    urlParams.has("tab") ? urlParams.get("tab") : "general"
  );

  const { user } = useAuthContext();

  const TABS = [
    {
      value: "general",
      label: "General",
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    {
      value: "permissions",
      label: "Permission",
      icon: (
        <Iconify icon="streamline:computer-desktop-block-desktop-device-display-disable-permission-computer" />
      ),
      component: <AccountPermissions />,
    },
    {
      value: "social_links",
      label: "Social Links",
      icon: <Iconify icon="eva:share-fill" />,
      component: <AccountSocialLinks />,
    },
    {
      value: "change_password",
      label: "Change Password",
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
          heading="account"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: user?.name, href: PATH_DASHBOARD.user.profile(user?.$id) },
            { name: "Account Settings" },
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
