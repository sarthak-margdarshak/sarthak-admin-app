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
    title: "Cancellation Policy",
    desc: [
      "Students can request cancellation of their mock test series registration within 2 days from the date of purchase.",
      "Cancellation requests must be submitted in writing via email or contact or through our official website.",
      "Upon receipt of a cancellation request, we will process the refund as per our refund policy outlined below.",
    ],
  },
  {
    title: "Refund Policy",
    desc: [
      "Full Refund: If a cancellation request is made within 2 days of purchase, a full refund will be issued.",
      "Partial Refund: If cancellation is requested after 2 days but before the commencement of the mock test series, a partial refund may be issued, subject to deduction of administrative fees or a percentage of the total fees as specified.",
      "No Refund: Once the mock test series has commenced, no refunds will be issued",
    ],
  },
  {
    title: "Refund Processing",
    desc: [
      "Refunds will be processed using the original mode of payment.",
      "It may take 10 business days for the refunded amount to reflect in the student’s account, depending on the policies of the respective banks or payment gateway.",
    ],
  },
  {
    title: "Exceptions",
    desc: [
      "In exceptional circumstances (e.g., medical emergencies, documented personal reasons), the institute may consider refund requests outside the standard policy at its discretion.",
      "Requests for exceptions must be supported by appropriate documentation and will be reviewed on a case-by-case basis.",
    ],
  },
  {
    title: "Contact Information",
    desc: [
      "For any queries regarding cancellations and refunds, students can contact us at support@sarthakmargdarshak.in or +918340378552.",
    ],
  },
  {
    title: "Policy Updates",
    desc: [
      "This cancellation and refund policy is subject to change without prior notice. Any updates will be published on our website.",
    ],
  },
];

// ----------------------------------------------------------------------

export default function CancellationAndRefund() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Privacy And Policy | Sarthak Admin</title>
      </Helmet>
      <Container sx={{ my: 10 }}>
        <Block title="Cancellation and Refund for any sold products on Sarthak Margdarshak">
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
