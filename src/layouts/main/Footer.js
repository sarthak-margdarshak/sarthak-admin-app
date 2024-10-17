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

import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Box,
  Grid,
  Link,
  Stack,
  Divider,
  Container,
  Typography,
} from "@mui/material";
// routes
import { PATH_PAGE } from "../../routes/paths";
// components
import Logo from "../../components/logo";

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: "Sarthak",
    children: [
      // {
      //   name: "Student App",
      //   href: "https://sarthakguidanceinstitute.ac.in",
      //   newTab: true,
      // },
      { name: "About us", href: PATH_PAGE.about, newTab: false },
      { name: "Contact us", href: PATH_PAGE.contact, newTab: false },
      { name: "FAQs", href: PATH_PAGE.faqs, newTab: false },
      { name: "Change Log", href: PATH_PAGE.changelog, newTab: false },
    ],
  },
  {
    headline: "Legal",
    children: [
      {
        name: "Terms and Condition",
        href: PATH_PAGE.termsAndConditions,
        newTab: false,
      },
      { name: "Privacy Policy", href: PATH_PAGE.privacyPolicy, newTab: false },
      {
        name: "Cancellation and Refund",
        href: PATH_PAGE.cancellationAndRefund,
        newTab: false,
      },
      {
        name: "Shipping And Delivery",
        href: PATH_PAGE.shippingAndDelivery,
        newTab: false,
      },
    ],
  },
  {
    headline: "Contact",
    children: [
      {
        name: "sarthakmargdarshak@gmail.com",
        href: "mailto:sarthakmargdarshak@gmail.com",
        newTab: false,
      },
      {
        name: "Jaitipur More, Chandi (Nalanda) Biharsharif, Bihar, 803108",
        href: "https://goo.gl/maps/7os23QnKn21KxH5N6",
        newTab: true,
      },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Divider />

      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{
            xs: "center",
            md: "space-between",
          }}
          sx={{
            textAlign: {
              xs: "center",
              md: "left",
            },
          }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: "auto", md: "inherit" } }} />
          </Grid>

          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              A website to manage students, teachers, engineerers, creators,
              employees of Sarthak Guidance Institute. Created by the
              Engineering department of this insitute.
            </Typography>

            {/* <Stack
              spacing={1}
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{
                mt: 5,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton key={social.name}>
                  <Iconify icon={social.icon} />
                </IconButton>
              ))}
            </Stack> */}
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: "column", md: "row" }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: "center", md: "flex-start" }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      to={link.href}
                      color="inherit"
                      variant="body2"
                      target={link.newTab === true ? "_blank" : ""}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          © {new Date().getFullYear()}. All rights reserved | <b>Sarthak</b>
        </Typography>
      </Container>
    </Box>
  );

  return mainFooter;
}
