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
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Label from '../../../../components/label';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';
// Auth
import {
  addMemberToTeamDatabase,
  addTeamToDatabase,
  updateProfileTeamOwner,
  uploadTeamCover
} from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

TeamNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTeam: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TeamNewForm({ isEdit = false, currentTeam }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const [ coverFile, setCoverFile] = useState(null);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    cover: Yup.string().required('Avatar is required').nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTeam?.name || '',
      cover: currentTeam?.cover || null,
    }),
    [currentTeam]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentTeam) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentTeam, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      // Create Team
      const newTeam = await addTeamToDatabase(data.name, user.$id);
      // Upload Cover of the team if present
      if(coverFile) {
        await uploadTeamCover(coverFile, newTeam.$id, user.$id);
      }
      // Add membership of owner as owner
      await addMemberToTeamDatabase(newTeam.$id, user.$id, user.$id, "owner", true, true);
      reset();
      // Add info in team profile
      await updateProfileTeamOwner(user?.$id, newTeam.$id);
      enqueueSnackbar(!isEdit ? 'Your Team is created successfully!!!' : 'Update success!');
      navigate(PATH_DASHBOARD.team.view(newTeam.$id));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, {variant: 'error'});
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverFile(file);
        setValue('cover', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="cover"
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
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
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
              <RHFTextField name="name" label="Team Name" />

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Create Team
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
