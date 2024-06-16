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
import { Divider } from "@mui/material";
// sections
import {
  AboutHero,
  AboutWhat,
  AboutTeam,
  AboutVision,
} from "../sections/about";
import React from "react";

// ----------------------------------------------------------------------

export default function AboutPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title> About us | Sarthak Admin</title>
      </Helmet>

      <AboutHero />

      <AboutWhat />

      <AboutVision />

      <Divider
        orientation="vertical"
        sx={{ my: 10, mx: "auto", width: 2, height: 40 }}
      />

      <AboutTeam />
    </React.Fragment>
  );
}
