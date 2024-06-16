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
import { m, useScroll, useSpring } from "framer-motion";
// @mui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
// sections
import { HomeHero, HomeMinimal } from "../sections/home";
import React from "react";

// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progress = (
    <m.div
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1999,
        position: "fixed",
        transformOrigin: "0%",
        backgroundColor: theme.palette.primary.main,
        scaleX,
      }}
    />
  );

  return (
    <React.Fragment>
      <Helmet>
        <title> Home | Sarthak Admin</title>
      </Helmet>

      {progress}

      <HomeHero />

      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.default",
        }}
      >
        <HomeMinimal />
      </Box>
    </React.Fragment>
  );
}
