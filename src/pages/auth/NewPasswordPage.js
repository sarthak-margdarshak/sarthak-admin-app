import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Link, Typography } from "@mui/material";
import { PATH_AUTH } from "routes/paths";
import Iconify from "components/iconify";
import AuthNewPasswordForm from "sections/auth/AuthNewPasswordForm";
import { SentIcon } from "assets/icons";
import { Fragment } from "react";

export default function NewPasswordPage() {
  return (
    <Fragment>
      <Helmet>
        <title> New Password | Sarthak Admin</title>
      </Helmet>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Request sent successfully!
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        We&apos;ve sent a confirmation link to your email.
        <br />
        Please enter the password in below box to reset your password.
      </Typography>

      <AuthNewPasswordForm />

      <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link variant="subtitle2">Resend code</Link>
      </Typography>

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </Fragment>
  );
}
