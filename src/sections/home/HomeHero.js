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

import { m, useScroll } from "framer-motion";
import React, { useEffect, useState } from "react";
// @mui
import { styled, alpha } from "@mui/material/styles";
import { Box, Container, Typography, Stack, Grid, Rating } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
// utils
import { textGradient, bgGradient } from "../../utils/cssStyles";
// config
import { HEADER } from "../../config-global";
// components
import { MotionContainer, varFade } from "../../components/animate";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  position: "relative",
  ...bgGradient({
    color: alpha(
      theme.palette.background.default,
      theme.palette.mode === "light" ? 0.9 : 0.94
    ),
    imgUrl: "/assets/background/overlay_2.jpg",
  }),
  [theme.breakpoints.up("md")]: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    position: "fixed",
  },
}));

// ----------------------------------------------------------------------

const StyledDescription = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(15, 0),
  height: "100%",
}));

// ----------------------------------------------------------------------

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: "400%",
  fontFamily: "'Barlow', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: "center",
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up("md")]: {
    fontSize: `${96 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

const StyledEllipseTop = styled("div")(({ theme }) => ({
  position: "absolute",
  width: 480,
  height: 480,
  top: -80,
  right: -80,
  borderRadius: "50%",
  filter: "blur(100px)",
  WebkitFilter: "blur(100px)",
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

// ----------------------------------------------------------------------

const StyledEllipseBottom = styled("div")(({ theme }) => ({
  position: "absolute",
  height: 400,
  bottom: -200,
  left: "10%",
  right: "10%",
  borderRadius: "50%",
  filter: "blur(100px)",
  WebkitFilter: "blur(100px)",
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const isDesktop = useResponsive("up", "md");

  const { scrollYProgress } = useScroll();

  const [hide, setHide] = useState(false);

  useEffect(
    () =>
      scrollYProgress.on("change", (scrollHeight) => {
        if (scrollHeight > 0.8) {
          setHide(true);
        } else {
          setHide(false);
        }
      }),
    [scrollYProgress]
  );

  return (
    <React.Fragment>
      <StyledRoot sx={{ ...(hide && { opacity: 0 }) }}>
        <Container component={MotionContainer} sx={{ height: 1 }}>
          <Grid container spacing={10} sx={{ height: 1 }}>
            <Grid item xs={12} md={6} sx={{ height: 1 }}>
              <Description />
            </Grid>

            {isDesktop && (
              <Grid item xs={12} md={6}>
                <Content />
              </Grid>
            )}
          </Grid>
        </Container>

        {isDesktop && <StyledEllipseTop />}

        <StyledEllipseBottom />
      </StyledRoot>

      <Box sx={{ height: { md: "100vh" } }} />
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

function Description() {
  return (
    <StyledDescription>
      <m.div variants={varFade().in}>
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Leading the Way <br />
          with Education
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledGradientText
          animate={{ backgroundPosition: "200% center" }}
          transition={{
            repeatType: "reverse",
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          SARTHAK
        </StyledGradientText>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          We are dedicated to providing a transformative educational experience
          that empowers students to excel academically and personally. We strive
          to create a vibrant learning community where knowledge, innovation,
          and critical thinking thrive.
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ my: 3 }}
        >
          <Rating readOnly value={4.95} precision={0.1} max={5} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <Box component="strong" sx={{ mr: 0.5, color: "text.primary" }}>
              4.95/5
            </Box>
            (99+ reviews)
          </Typography>
        </Stack>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack
          spacing={1.5}
          direction={{ xs: "column-reverse", sm: "row" }}
          sx={{ mb: 5 }}
        >
          {/* <Button
            component={RouterLink}
            to="https://sarthakguidanceinstitute.ac.in/"
            color="inherit"
            size="large"
            variant="contained"
            startIcon={<Iconify icon="ic:twotone-touch-app" width={24} />}
            sx={{
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
              },
            }}
          >
            Student Web App
          </Button> */}
        </Stack>
      </m.div>
    </StyledDescription>
  );
}
// ----------------------------------------------------------------------

function Content() {
  const transition = {
    repeatType: "loop",
    ease: "linear",
    duration: 60 * 4,
    repeat: Infinity,
  };

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: 1,
        overflow: "hidden",
        position: "absolute",
        mt: `${HEADER.H_MAIN_DESKTOP}px`,
      }}
    >
      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 344, position: "relative" }}
      >
        <Box
          component={m.img}
          animate={{ y: ["0%", "100%"] }}
          transition={transition}
          alt={`hero_1`}
          src={`/assets/images/home/hero_1.png`}
          sx={{ position: "absolute" }}
        />
        <Box
          component={m.img}
          animate={{ y: ["-100%", "0%"] }}
          transition={transition}
          alt={`hero_1`}
          src={`/assets/images/home/hero_1.png`}
          sx={{ position: "absolute" }}
        />
      </Stack>

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 720, position: "relative", ml: -2 }}
      >
        <Box
          component={m.img}
          animate={{ y: ["100%", "0%"] }}
          transition={transition}
          alt={`hero_2`}
          src={`/assets/images/home/hero_2.png`}
          sx={{ position: "absolute" }}
        />
        <Box
          component={m.img}
          animate={{ y: ["0%", "-100%"] }}
          transition={transition}
          alt={`hero_2`}
          src={`/assets/images/home/hero_2.png`}
          sx={{ position: "absolute" }}
        />
      </Stack>
    </Stack>
  );
}
