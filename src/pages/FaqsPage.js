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
import { Box, Container, Typography } from "@mui/material";
// sections
import { FaqsHero, FaqsList } from "../sections/faqs";
import { ContactForm } from "../sections/contact";
import React from "react";

// ----------------------------------------------------------------------

export default function FaqsPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Faqs | Sarthak Admin</title>
      </Helmet>

      <FaqsHero />

      <Container sx={{ pt: 15, pb: 10, position: "relative" }}>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Frequently asked questions
        </Typography>

        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
        >
          <FaqsList />

          <ContactForm title="Haven't found the right help?" />
        </Box>
      </Container>
    </React.Fragment>
  );
}
