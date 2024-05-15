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

import PropTypes from "prop-types";
import { useRef } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Container,
  Link,
  IconButton,
} from "@mui/material";
// hooks
import useOffSetTop from "../../hooks/useOffSetTop";
import useResponsive from "../../hooks/useResponsive";
// utils
import { bgBlur } from "../../utils/cssStyles";
// config
import { HEADER } from "../../config-global";
// routes
import { PATH_PAGE, PATH_DASHBOARD } from "../../routes/paths";
// components
import Logo from "../../components/logo";
import Label from "../../components/label";
//
import navConfig from "./nav/config-navigation";
import NavMobile from "./nav/mobile";
import NavDesktop from "./nav/desktop";
import SvgColor from "../../components/svg-color/SvgColor";
import { useSettingsContext } from "../../components/settings";

// ----------------------------------------------------------------------

export default function Header() {
  const carouselRef = useRef(null);

  const theme = useTheme();
  const { themeMode, onToggleMode } = useSettingsContext();

  const isDesktop = useResponsive("up", "md");

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  var pjson = require("../../../package.json");

  return (
    <AppBar ref={carouselRef} color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(["height", "background-color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: "flex", alignItems: "center" }}>
          <Logo />

          <Link
            href={PATH_PAGE.changelog}
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ ml: 1 }}
          >
            <Label color="info"> {pjson.version} </Label>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <NavDesktop isOffset={isOffset} data={navConfig} />}

          <IconButton
            color={themeMode === "dark" ? "warning" : "default"}
            onClick={onToggleMode}
          >
            <SvgColor
              src={`/assets/icons/setting/ic_${
                themeMode === "light" ? "moon" : "sun"
              }.svg`}
            />
          </IconButton>

          <Button
            variant="contained"
            rel="noopener"
            href={PATH_DASHBOARD.root}
            sx={{ ml: 2 }}
          >
            Dashboard
          </Button>

          {!isDesktop && <NavMobile isOffset={isOffset} data={navConfig} />}
        </Container>
      </Toolbar>

      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: "auto",
        borderRadius: "50%",
        position: "absolute",
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
