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

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import {
  Question,
  Team,
  User,
} from '../../../../auth/AppwriteContext';
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
  var userId = window.location.pathname.split('/')[4];
  const {
    user,
  } = useAuthContext();
  if (userId === '') {
    userId = user.$id;
  }

  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();
  const [userProfile, setUserProfile] = useState(null);
  const [userGeneral, setUserGeneral] = useState(null);
  const [userSocialLinks, setUserSocialLinks] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [teamCount, setTeamCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      var data = await User.getProfileData(userId);
      setUserProfile(data);
      const user = data;
      if (data?.photoUrl && data?.photoUrl!=='') {
        data = await User.getImageProfileLink(data?.photoUrl);
        setProfileImage(data);
      }
      data = await User.getUserGeneralData(userId);
      setUserGeneral(data);
      data = await User.getUserSocialLinksData(userId);
      setUserSocialLinks(data);
      data = await Question.getQuestionList({ createdBy: user?.$id }, 1, 1);
      setQuestionCount(data?.total)
      data = await Team.getMyTeamData(user?.$id);
      setTeamCount(data?.total)
    }
    fetchData();
  }, [userId])

  const [currentTab, setCurrentTab] = useState('profile');

  const TABS = [
    {
      value: 'profile',
      label: translate("profile"),
      icon: <Iconify icon="ic:round-account-box" />,
      component: <Profile userId={userId} team={teamCount} question={questionCount} infoGeneral={userGeneral} infoProfile={userProfile} infoSocialLinks={userSocialLinks} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>User: Profile | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={translate("profile")}
          links={[
            { name: translate('dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('user'), href: PATH_DASHBOARD.user.root },
            { name: userProfile?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover name={userProfile?.name} role={userProfile?.designation} profileImage={profileImage} empId={userProfile?.empId} />

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
