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
import { Link, Card, CardHeader, Stack } from '@mui/material';
// _mock
import { _socials } from '../../../../../_mock/arrays';
// components
import Iconify from '../../../../../components/iconify';
// locales
import { useLocales } from '../../../../../locales';

// ----------------------------------------------------------------------

ProfileSocialInfo.propTypes = {
  socialLinks: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ProfileSocialInfo({ socialLinks }) {

  const { translate } = useLocales();

  return (
    <Card>
      <CardHeader title={translate('social')}/>

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
