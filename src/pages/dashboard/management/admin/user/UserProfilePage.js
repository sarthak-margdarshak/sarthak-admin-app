import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import { Tab, Card, Tabs, Container, Box } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { useAuthContext } from "auth/useAuthContext";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import Profile from "sections/@dashboard/management/admin/user/profile/home/Profile";
import { APPWRITE_API } from "config-global";
import {
  appwriteDatabases,
  appwriteStorage,
} from "auth/AppwriteContext";
import ProfileCover from "sections/@dashboard/management/admin/user/profile/ProfileCover";

export default function UserProfilePage() {
  let userId = window.location.pathname.split("/")[4];
  const { user } = useAuthContext();
  if (userId === "") {
    userId = user.$id;
  }

  const { themeStretch } = useSettingsContext();

  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setProfileImage(null);
      setUserProfile(null);
      let data = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        userId
      );
      if (data.photoUrl) {
        setProfileImage(
          appwriteStorage.getFilePreview(
            APPWRITE_API.buckets.adminUserImage,
            data.photoUrl,
            undefined,
            undefined,
            undefined,
            20
          ).href
        );
      }
      setUserProfile(data);
    }
    fetchData();
  }, [userId]);

  const [currentTab, setCurrentTab] = useState("profile");

  const TABS = [
    {
      value: "profile",
      label: "Profile",
      icon: <Iconify icon="ic:round-account-box" />,
      component: (
        <Profile
          userId={userId}
          infoProfile={userProfile}
        />
      ),
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>User: Profile | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "User", href: PATH_DASHBOARD.user.root },
            { name: userProfile?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <ProfileCover
            name={userProfile?.name}
            role={userProfile?.designation}
            profileImage={profileImage}
            empId={userProfile?.empId}
          />

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
    </React.Fragment>
  );
}
