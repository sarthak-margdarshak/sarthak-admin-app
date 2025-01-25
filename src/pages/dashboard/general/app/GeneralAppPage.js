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

import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// auth
// components
import { useSettingsContext } from "../../../../components/settings";

// assets
import React from "react";

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <React.Fragment>
      <Helmet>
        <title> General: App | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
      </Container>
    </React.Fragment>
  );
}
