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

import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfileTaskInfo from './ProfileTaskInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
// locales
import { useLocales } from '../../../../../locales';

// ----------------------------------------------------------------------

Profile.propTypes = {
  infoGeneral: PropTypes.object,
  infoProfile: PropTypes.object,
  infoSocialLinks: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function Profile({ infoGeneral, infoProfile, infoSocialLinks }) {

  const { translate } = useLocales();

  return (
    <Stack spacing={3}>
      <ProfileTaskInfo task="50" question="1000" />

      <ProfileAbout
        quote={infoGeneral?.about}
        country={infoGeneral?.city+', '+infoGeneral?.state+', '+infoGeneral?.country}
        email={infoProfile?.email}
        role={infoProfile?.designation}
        company={translate('sarthak_guidance_institute')}
        school={infoGeneral?.schoolCollege}
      />

      <ProfileSocialInfo socialLinks={infoSocialLinks} />
    </Stack>
  );
}
