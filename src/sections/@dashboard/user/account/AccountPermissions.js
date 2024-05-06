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

// ----------------------------------------------------------------------

export default function AccountPermissions({ userPermissions }) {

  const { translate } = useLocales();

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
              defaultChecked={userPermissions?.createTeam || false}
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