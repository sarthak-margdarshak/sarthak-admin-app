import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import useResponsive from "hooks/useResponsive";
import { useSettingsContext } from "components/settings";
import Main from "layouts/dashboard/Main";
import Header from "layouts/dashboard/header";
import NavMini from "layouts/dashboard/nav/NavMini";
import NavVertical from "layouts/dashboard/nav/NavVertical";
import NavHorizontal from "layouts/dashboard/nav/NavHorizontal";

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();

  const isDesktop = useResponsive("up", "lg");

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === "horizontal";

  const isNavMini = themeLayout === "mini";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  if (isNavHorizontal) {
    return (
      <React.Fragment>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </React.Fragment>
    );
  }

  if (isNavMini) {
    return (
      <React.Fragment>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: "flex" },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}

          <Main>
            <Outlet />
          </Main>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: "flex" },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </Box>
    </React.Fragment>
  );
}
