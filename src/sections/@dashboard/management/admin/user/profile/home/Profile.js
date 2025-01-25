import { Stack } from "@mui/material";
import ProfileAbout from "sections/@dashboard/management/admin/user/profile/home/ProfileAbout";
import ProfileSocialInfo from "sections/@dashboard/management/admin/user/profile/home/ProfileSocialInfo";

export default function Profile({ userId, infoProfile }) {

  return (
    <Stack spacing={3}>
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
