import { Helmet } from "react-helmet-async";
import Signup from "sections/auth/Signup";
import { Typography } from "@mui/material";
import { Fragment } from "react";

export default function SignupPage() {
  return (
    <Fragment>
      <Helmet>
        <title> Login | Sarthak Admin</title>
      </Helmet>

      <Typography variant="h3" paragraph>
        New Here?
      </Typography>

      <Signup />
    </Fragment>
  );
}
