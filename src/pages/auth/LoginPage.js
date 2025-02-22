import { Helmet } from "react-helmet-async";
import Login from "sections/auth/Login";
import { Fragment } from "react";

export default function LoginPage() {
  return (
    <Fragment>
      <Helmet>
        <title> Login | Sarthak Admin</title>
      </Helmet>

      <Login />
    </Fragment>
  );
}
