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
import { QuestionTreeViewProvider } from "../../../../sections/@dashboard/question/TreeView/QuestionTreeViewProvider";
import QuestionTreeView from "../../../../sections/@dashboard/question/TreeView/QuestionTreeView";

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <React.Fragment>
      <Helmet>
        <title> General: App | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        <QuestionTreeViewProvider>
          <QuestionTreeView />
        </QuestionTreeViewProvider>
      </Container>
    </React.Fragment>
  );
}
