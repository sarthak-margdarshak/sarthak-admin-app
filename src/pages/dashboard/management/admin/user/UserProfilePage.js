import { Helmet } from "react-helmet-async";
import { Fragment, useState } from "react";
import { Tab, Card, Tabs, Container, Box } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useAuthContext } from "auth/useAuthContext";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import ProfileCover from "sections/@dashboard/management/admin/user/profile/ProfileCover";
import AccountChangePassword from "sections/@dashboard/management/admin/user/profile/AccountChangePassword";

export default function UserProfilePage() {
  const { user } = useAuthContext();

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("change-password");

  const TABS = [
    {
      value: "change-password",
      label: "Change Password",
      icon: <Iconify icon="solar:password-minimalistic-input-bold" />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Fragment>
      <Helmet>
        <title>User: Profile | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "User", href: PATH_DASHBOARD.user },
            { name: user?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <ProfileCover />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: "absolute",
              bgcolor: "background.paper",
              "& .MuiTabs-flexContainer": {
                pr: { md: 3 },
                justifyContent: {
                  sm: "center",
                  md: "flex-end",
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value}> {tab.component} </Box>
            )
        )}
      </Container>
    </Fragment>
  );
}
