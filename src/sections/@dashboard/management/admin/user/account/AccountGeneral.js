import * as Yup from "yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "auth/useAuthContext";
import { fData } from "utils/formatNumber";
import { countries } from "assets/data";
import { useSnackbar } from "components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "components/hook-form";

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, userProfile, profileImage, updateUserProfile } =
    useAuthContext();

  const [photoFile, setPhotoFile] = useState();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address."),
    photoURL: Yup.string().required("Avatar is required").nullable(true),
    phoneNumber: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    zipCode: Yup.string().required("Zip Code is required"),
    about: Yup.string().required("About is required"),
    schoolCollege: Yup.string().required("School/College is required"),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      photoURL: profileImage || "",
      phoneNumber: user?.phone || "",
      country: userProfile?.country || "",
      address: userProfile?.address || "",
      state: userProfile?.state || "",
      city: userProfile?.city || "",
      zipCode: userProfile?.zipCode || "",
      about: userProfile?.about || "",
      schoolCollege: userProfile?.schoolCollege || "",
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await updateUserProfile(
        {
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
          schoolCollege: data.schoolCollege,
          about: data.about,
          state: data.state,
          address: data.address,
        },
        photoFile
      );
      enqueueSnackbar("Update Success!!!", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPhotoFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("photoURL", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={10485760}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> {"Max Size of"} {fData(3145728)}
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
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField
                name="name"
                disabled
                label="Name"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="email"
                disabled
                label="Email"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="phoneNumber"
                disabled
                label="Phone Number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="address"
                label="Address"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect
                native
                name="country"
                label="Country"
                placeholder="Country"
                InputLabelProps={{ shrink: true }}
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField
                name="state"
                label="State/Region"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="city"
                label="City"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="zipCode"
                label="Zip/Code"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="schoolCollege"
                label="School/College"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField
                name="about"
                multiline
                rows={4}
                label="About"
                InputLabelProps={{ shrink: true }}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Change
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
