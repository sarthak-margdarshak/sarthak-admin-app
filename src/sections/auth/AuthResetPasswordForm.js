import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFTextField } from "components/hook-form";
import { appwriteAccount } from "auth/AppwriteContext";
import { PATH_AUTH } from "routes/paths";
import { useSnackbar } from "components/snackbar";

export default function AuthResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await appwriteAccount.createRecovery(
        data.email,
        window.location.origin + PATH_AUTH.newPassword
      );
      enqueueSnackbar(
        "We have sent you a link on your email id. Reset your password by clicking on it!!!",
        { variant: "success" }
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
