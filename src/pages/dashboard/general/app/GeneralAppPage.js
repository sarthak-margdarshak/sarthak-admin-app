import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { useSettingsContext } from "components/settings";
import { Fragment } from "react";

export default function GeneralAppPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <Fragment>
      <Helmet>
        <title> General: App | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}></Container>
    </Fragment>
  );
}
