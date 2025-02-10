import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Alert, Stack, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "components/iconify";
import { useSnackbar } from "components/snackbar";
import FormProvider, { RHFTextField } from "components/hook-form";
import { useAuthContext } from "auth/useAuthContext";
import { appwriteAccount } from "auth/AppwriteContext";

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match."
    ),
  });

  const defaultValues = {
    email: user?.email,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
      await appwriteAccount.updatePassword(data.newPassword, data.oldPassword);
      reset();
      enqueueSnackbar("Update Success !!!", {
        variant: "success",
      });
    } catch (error) {
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}

          <RHFTextField name="email" type="email" label="Email" disabled />

          <RHFTextField
            name="oldPassword"
            type="password"
            label="Old Password"
          />

          <RHFTextField
            name="newPassword"
            type="password"
            label="New Password"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{" "}
                Password must be at least 8 characters.
              </Stack>
            }
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
