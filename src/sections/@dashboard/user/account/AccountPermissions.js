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
import { Card, Stack, Typography, Switch, FormControlLabel } from '@mui/material';
// locales
import { useLocales } from '../../../../locales';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AccountPermissions() {

  const { translate } = useLocales();
  const { userProfile } = useAuthContext();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="overline" component="div" sx={{ color: 'text.secondary' }}>
        {translate('activity')}
      </Typography>

      <Stack alignItems="flex-start" sx={{ mt: 2, mb: 5, }}>
        <FormControlLabel
          control={
            <Switch
              key={"createTeam"}
              defaultChecked={userProfile?.createTeam || false}
              disabled
              sx={{ m: 0 }}
            />
          }
          label={translate('permission_createTeam')} />
      </Stack>

      <Typography variant="overline" component="div" sx={{ color: 'text.info' }}>
        {translate('note')} :- {translate('permission_owner')}
      </Typography>
    </Card>
  );
}