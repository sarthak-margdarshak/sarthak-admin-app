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

import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Alert, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// locales
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { user, updatePassword } = useAuthContext();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(translate('old')+' '+translate('password')+' '+translate('is_required')),
    newPassword: Yup.string()
      .min(8, translate('password_8_char'))
      .required(translate('new')+' '+translate('password')+' '+translate('is_required')),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], translate('password_match')),
  });

  const defaultValues = {
    email: user?.email,
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await updatePassword(data.oldPassword, data.newPassword);
      reset();
      enqueueSnackbar(translate('update_success')+' !!!', {variant: 'success'});
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="email" type="email" label={translate('email')} disabled />

          <RHFTextField name="oldPassword" type="password" label={translate('old')+' '+translate('password')} />

          <RHFTextField
            name="newPassword"
            type="password"
            label={translate('new')+' '+translate('password')}
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> {translate('password_8_char')}
              </Stack>
            }
          />

          <RHFTextField name="confirmNewPassword" type="password" label={translate('password_confirm')} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {translate('save_changes')}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
