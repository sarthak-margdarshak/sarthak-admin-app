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
import { useCallback, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import { User } from '../../../../auth/User';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';
// locales
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

export default function AccountGeneral({ userGeneral }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const {
    user,
    profileImage,
    updateProfileImage,
    updateUserGeneral,
  } = useAuthContext();

  const [photoFile, setPhotoFile] = useState();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('name')+' '+translate('is_required')),
    email: Yup.string().required(translate('email')+' '+translate('is_required')).email(translate('valid_email')),
    photoURL: Yup.string().required(translate('avatar')+' '+translate('is_required')).nullable(true),
    phoneNumber: Yup.string().required(translate('phone_number')+' '+translate('is_required')),
    country: Yup.string().required(translate('country')+' '+translate('is_required')),
    address: Yup.string().required(translate('address')+' '+translate('is_required')),
    state: Yup.string().required(translate('state')+' '+translate('is_required')),
    city: Yup.string().required(translate('city')+' '+translate('is_required')),
    zipCode: Yup.string().required(translate('zip')+' '+translate('code')+' '+translate('is_required')),
    about: Yup.string().required(translate('about')+' '+translate('is_required')),
    schoolCollege: Yup.string().required(translate('school')+'/'+translate('college')+' '+translate('is_required')),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: async() => {
      const userGeneral = await User.getUserGeneralData(user.$id)
      return {
        name: user?.name || '',
        email: user?.email || '',
        photoURL: profileImage || '',
        phoneNumber: user?.phone || '',
        country: userGeneral?.country || '',
        address: userGeneral?.address || '',
        state: userGeneral?.state || '',
        city: userGeneral?.city || '',
        zipCode: userGeneral?.zipCode || '',
        about: userGeneral?.about || '',
        schoolCollege: userGeneral?.schoolCollege || '',
      }
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await updateUserGeneral(data);
      if(photoFile) {
        await updateProfileImage(photoFile)
      }
      enqueueSnackbar(translate('update_success')+' !!!', {variant: 'success'});
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPhotoFile(file)

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {translate('allowed')} *.jpeg, *.jpg, *.png, *.gif
                  <br /> {translate('max_size')} {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" disabled label={translate('name')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="email" disabled label={translate('email')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="phoneNumber" disabled label={translate('phone_number')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="address" label={translate('address')} InputLabelProps={{ shrink: true }} />

              <RHFSelect native name="country" label={translate('country')} placeholder="Country" InputLabelProps={{ shrink: true }} >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label={translate('state')+'/'+translate('region')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="city" label={translate('city')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="zipCode" label={translate('zip')+'/'+translate('code')} InputLabelProps={{ shrink: true }} />

              <RHFTextField name="schoolCollege" label={translate('school')+'/'+translate('college')} InputLabelProps={{ shrink: true }} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label={translate('about')} InputLabelProps={{ shrink: true }} />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate('save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
