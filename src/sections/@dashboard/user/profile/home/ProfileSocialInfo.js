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
import { Link, Card, CardHeader, Stack, IconButton } from '@mui/material';
// _mock
import { _socials } from '../../../../../_mock/arrays';
// components
import Iconify from '../../../../../components/iconify';
// locales
import { useLocales } from '../../../../../locales';
import { useAuthContext } from '../../../../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

ProfileSocialInfo.propTypes = {
  userId:  PropTypes.string,
  socialLinks: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ProfileSocialInfo({ userId, socialLinks }) {

  const { translate } = useLocales();
  const { user } = useAuthContext();

  return (
    <Card>
      <CardHeader
        title={translate('social')}
        action={
          userId === user?.$id ?
            <IconButton aria-label="Edit" onClick={() => window.open(PATH_DASHBOARD.user.account+'?tab=social_links', '_self')}>
              <Iconify icon="ic:baseline-edit" />
            </IconButton> : <></>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {_socials.map((link) => (
          <Stack key={link.name} direction="row" sx={{ wordBreak: 'break-all' }}>
            <Iconify
              icon={link.icon}
              sx={{
                mr: 2,
                flexShrink: 0,
                color: link.color,
              }}
            />
            <Link
              component="span"
              variant="body2"
              color="text.primary"
              onClick={() => window.open(
                (link.value === 'facebook' && socialLinks?.facebookId) ||
                (link.value === 'instagram' && socialLinks?.instagramId) ||
                (link.value === 'linkedin' && socialLinks?.linkedinId) ||
                socialLinks?.twitterId, '_blank',
              )}
              sx={{ cursor: 'pointer' }}>
              {(link.value === 'facebook' && socialLinks?.facebookId) ||
                (link.value === 'instagram' && socialLinks?.instagramId) ||
                (link.value === 'linkedin' && socialLinks?.linkedinId) ||
                socialLinks?.twitterId}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
