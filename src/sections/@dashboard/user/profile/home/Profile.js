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
import { Stack } from "@mui/material";
//
import ProfileAbout from "./ProfileAbout";
import ProfileTaskInfo from "./ProfileTaskInfo";
import ProfileSocialInfo from "./ProfileSocialInfo";
import { useAuthContext } from "../../../../../auth/useAuthContext";

// ----------------------------------------------------------------------

export default function Profile({ userId, infoProfile, team, question }) {
  const { user } = useAuthContext();

  return (
    <Stack spacing={3}>
      {user?.$id === userId && (
        <ProfileTaskInfo team={team} question={question} />
      )}

      <ProfileAbout
        quote={infoProfile?.about}
        userId={userId}
        country={
          infoProfile?.city +
          ", " +
          infoProfile?.state +
          ", " +
          infoProfile?.country
        }
        email={infoProfile?.email}
        role={infoProfile?.designation}
        company="Sarthak Guidance Institute"
        school={infoProfile?.schoolCollege}
      />

      <ProfileSocialInfo userId={userId} infoProfile={infoProfile} />
    </Stack>
  );
}
