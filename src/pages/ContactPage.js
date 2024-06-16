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
import { Container, Box } from "@mui/material";
// sections
import { ContactHero, ContactForm } from "../sections/contact";
import React from "react";

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Contact us | Sarthak Admin</title>
      </Helmet>

      <ContactHero />

      <Container sx={{ py: 10 }}>
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
        >
          <ContactForm title="Feel free to contact us.   We will be glad to hear from you, buddy." />
        </Box>
      </Container>
    </React.Fragment>
  );
}
