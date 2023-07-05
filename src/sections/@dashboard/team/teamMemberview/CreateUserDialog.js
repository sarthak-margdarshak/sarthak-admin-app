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
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Dialog, DialogTitle } from '@mui/material';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
// auth
import { Team } from '../../../../auth/AppwriteContext';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

CreateUserDialog.propTypes = {
  open: PropTypes.bool,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
  teamId: PropTypes.string,
  teamName: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function CreateUserDialog({ open, teamName, teamId, onClose, onUpdate, ...other }) {

  const { enqueueSnackbar } = useSnackbar();

  const { userProfile } = useAuthContext();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
    designation: Yup.string().required('Designation is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data) => {
    try {
      await Team.onboardWelcome(
        data.name,
        data.email,
        data.password,
        data.designation,
        data.phoneNumber,
        userProfile.$id,
        userProfile.name,
        userProfile.designation,
        userProfile.email,
        userProfile.phoneNumber,
        data.role,
        teamId,
        teamName
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      reset();
      onClose();
      onUpdate();
      enqueueSnackbar('Data sent successfully');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };


  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ pb: 2 }}>Create New User</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={12}>
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
                <RHFTextField name="name" label="Full Name" />
                <RHFTextField name="phoneNumber" label="Phone Number" />
                <RHFTextField name="email" label="Email Address" />
                <RHFTextField name="password" label="Password" />
                <RHFTextField name="role" label="Role" />
                <RHFTextField name="designation" label="Designation" />
              </Box>

              <Stack direction={"row-reverse"} alignItems={"end"} sx={{ mt: 3 }}>
              <Button
                  variant="outlined"
                  startIcon={<Iconify icon="zondicons:close-outline" />}
                  onClick={onClose}
                  sx={{ml: 2}}
                >
                  Close
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create & Add
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Dialog>
  );
}
