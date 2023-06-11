import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections
import {
  Profile,
  ProfileCover,
} from '../../../../sections/@dashboard/user/profile';
// locales
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  const {
    user,
    userProfile,
    userGeneral,
    userSocialLinks,
    fetchSocialLinksData,
    fetchGeneralData,
  } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      await fetchGeneralData(user.$id);
      await fetchSocialLinksData(user.$id);
    }
    fetchData();
  }, [])

  const [currentTab, setCurrentTab] = useState('profile');

  const TABS = [
    {
      value: 'profile',
      label: translate("profile"),
      icon: <Iconify icon="ic:round-account-box" />,
      component: <Profile infoGeneral={userGeneral} infoProfile={userProfile} infoSocialLinks={userSocialLinks} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title> User: Profile | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate("profile")}
          links={[
            { name: translate('dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('user'), href: PATH_DASHBOARD.user.root },
            { name: user?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover name={user?.name} role={userProfile?.designation} />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
