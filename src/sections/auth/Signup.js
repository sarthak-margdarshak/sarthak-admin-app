import { Alert, IconButton, InputAdornment, Link, Stack } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider, { RHFTextField } from "components/hook-form";
import Iconify from "components/iconify";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PATH_AUTH } from "routes/paths";
import { LoadingButton } from "@mui/lab";
import { appwriteAccount } from "auth/AppwriteContext";
import { useSnackbar } from "components/snackbar";

export default function Signup() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  function generateUserId(name) {
    const x = name.split(" ");
    let firstName = "";
    let lastName = "";
    if (x.length >= 2) {
      firstName = x[0];
      lastName = x[1];
    } else {
      firstName = x[0];
    }
    const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const sanitized = sanitize(firstName) + "-" + sanitize(lastName);
    const namePart = sanitized.slice(0, 24) || "user";
    const timestamp = Date.now().toString(36);
    return (namePart + "-" + timestamp).slice(0, 35);
  }

  const onSubmit = async (data) => {
    try {
      await appwriteAccount.create(
        generateUserId(data.name),
        data.email,
        data.password,
        data.name
      );
      reset();
      enqueueSnackbar("Created successfully! Login to continue");
      navigate(PATH_AUTH.login);
    } catch (e) {
      setError("afterSubmit", {
        message: e.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="name" label="Name" />

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>

        <Link
          component={RouterLink}
          to={PATH_AUTH.login}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Already a Member?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Sign Up
      </LoadingButton>
    </FormProvider>
  );
}
