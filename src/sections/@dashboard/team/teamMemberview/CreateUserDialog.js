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
import FormProvider, { RHFTextField, RHFSelect } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
// assets
import { countries } from '../../../../assets/data';
import { teams } from '../../../../auth/AppwriteContext';

// ----------------------------------------------------------------------

CreateUserDialog.propTypes = {
  open: PropTypes.bool,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
  teamId: PropTypes.string,
  teamName: PropTypes.string,
};

// ----------------------------------------------------------------------

function generatePassword(length, options = {}) {
  const defaultCharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
  const excludedChars = options.exclude || "";
  const customCharset = defaultCharset.replace(new RegExp(`[${excludedChars}]`, 'g'), '');
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * customCharset.length);
    password += customCharset[randomIndex];
  }
  return password;
}

// ----------------------------------------------------------------------

export default function CreateUserDialog({ open, teamName, teamId, onClose, onUpdate, ...other }) {

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneCode: Yup.string().required('Phone Code is required'),
    role: Yup.string().required('Role is required'),
    designation: Yup.string().required('Designation is required'),
  });

  const defaultValues = {
    name: '',
    phoneNumber: '',
    email: '',
    phoneCode: '',
    role: '',
    designation: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // await databases.getDocument(APPWRITE_API.databaseId, APPWRITE_API.collections.adminUsers, user.$id)
      await teams.createMembership(
        teamId,
        [data.role],
        window.location.origin,
        data.email,
        // '+'+data.phoneCode+data.phoneNumber,
        // data.name,
      )
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
                <RHFTextField name="email" label="Email Address" />
                <RHFSelect native name="phoneCode" label='Phone Code' InputLabelProps={{ shrink: true }} >
                  <option value="" />
                  {countries.map((country) => (
                    <option key={country.code} value={country.phone}>
                      {country.label+'(+'+country.phone+')'}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="phoneNumber" label="Phone Number" />
                <RHFTextField name="role" label="Role" />
                <RHFTextField name="designation" label="Designation" />
              </Box>

              <Stack direction={"row-reverse"} alignItems={"end"} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="zondicons:close-outline" />}
                  onClick={onClose}
                  sx={{ ml: 2 }}
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
