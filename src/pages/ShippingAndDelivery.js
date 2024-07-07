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
import { Container, Paper, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Block } from "../sections/_examples/Block";
import React from "react";

const TYPOGRAPHYS = [
  {
    title: "Order Processing",
    desc: [
      "Upon successful payment, students will receive an email confirmation of their order and payment receipt.",
      "Access to the mock test series will be provided through our online platform immediately after the purchase.",
    ],
  },
  {
    title: "Delivery Method",
    desc: [
      "The mock test series materials will be delivered electronically via our secure online platform.",
      "Students will be able to access the mock series through their account on mobile app.",
    ],
  },
  {
    title: "Shipping Fees",
    desc: [
      "Since the delivery is electronic, no shipping fees are applicable.",
    ],
  },
  {
    title: "Non-Delivery",
    desc: [
      "In rare cases where students do not receive access details within the specified timeframe, they should contact our support team immediately for assistance.",
    ],
  },
  {
    title: "Refunds and Returns",
    desc: [
      "Given the nature of digital products and immediate access upon purchase, refunds are generally not provided once access to the mock tests has been granted.",
      "If there are technical issues preventing access or if the mock tests do not meet expected standards, students may contact us for resolution.",
    ],
  },
  {
    title: "Contact Information",
    desc: [
      "For any queries regarding shipping and delivery of mock test series, students can contact us at support@sarthakmargdarshak.in or +918340378552..",
    ],
  },
  {
    title: "Policy Updates",
    desc: [
      "This Shipping and Delivery Policy is subject to change without prior notice. Any updates will be published on our website.",
    ],
  },
];

// ----------------------------------------------------------------------

export default function ShippingAndDelivery() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Shipping And Delivery | Sarthak Admin</title>
      </Helmet>
      <Container sx={{ my: 10 }}>
        <Block title="Shipping And Delivery policy for Sold product at Sarthak Guidance Institute">
          <Stack spacing={3}>
            {TYPOGRAPHYS.map((font) => (
              <BlockVariant key={font.title} font={font} />
            ))}
          </Stack>
        </Block>
      </Container>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

BlockVariant.propTypes = {
  font: PropTypes.shape({
    label: PropTypes.string,
    variant: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

function BlockVariant({ font }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
      <Typography variant="body1" sx={{ color: "text.primary" }}>
        {font.title}
      </Typography>
      {font.desc.map((row, i) => {
        return (
          <Typography key={i} variant="body2" sx={{ color: "text.secondary" }}>
            {i + 1}
            {". " + row}
          </Typography>
        );
      })}
    </Paper>
  );
}
