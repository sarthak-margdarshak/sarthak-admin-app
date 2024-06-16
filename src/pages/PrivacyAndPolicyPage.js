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
    title: "Introduction",
    desc: [
      "Sarthak Guidance Institute is committed to protecting the privacy and confidentiality of personal information collected from students, faculty, staff, and other individuals associated with the Institute. This Privacy Policy outlines how we collect, use, store, and protect personal information in accordance with applicable privacy laws and regulations.",
    ],
  },
  {
    title: "Personal Information Collection and Use",
    desc: [
      "The Institute collects personal information, such as names, contact details, academic records, and any other relevant information, for purposes including but not limited to Admission processes, Academic administration and support Communication with students, faculty, staff, and stakeholders Institutional research and reporting",
    ],
  },
  {
    title: "Consent",
    desc: [
      "By providing personal information to the Institute, individuals consent to the collection, use, and disclosure of their personal information as described in this Privacy Policy.",
      "Consent may be withdrawn at any time, subject to legal and contractual requirements. However, withdrawal of consent may impact the Institute's ability to provide certain services or fulfill specific obligations.",
    ],
  },
  {
    title: "Data Security and Confidentiality",
    desc: [
      "The Institute implements reasonable security measures to protect personal information from unauthorized access, loss, or disclosure.",
      "Personal information is treated as confidential and is only accessed and disclosed on a need-to-know basis.",
      "Secure technologies, encryption, access controls, and employee training are utilized to safeguard personal information.",
    ],
  },
  {
    title: "Data Retention",
    desc: [
      "Personal information is retained only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations.",
      "Once personal information is no longer needed, it is securely disposed of in accordance with the Institute's data disposal procedures.",
    ],
  },
  {
    title: "Third-Party Disclosure",
    desc: [
      "The Institute may disclose personal information to third parties, such as government bodies, service providers, or educational partners, for purposes consistent with the Institute's activities.",
      "The Institute takes reasonable steps to ensure that third parties handle personal information in compliance with applicable privacy laws and regulations.",
    ],
  },
  {
    title: "Access and Correction",
    desc: [
      "Individuals have the right to access and review their personal information held by the Institute, subject to any legal restrictions.",
    ],
  },
];

// ----------------------------------------------------------------------

export default function PrivacyAndPolicyPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Privacy And Policy | Sarthak Admin</title>
      </Helmet>
      <Container sx={{ my: 10 }}>
        <Block title="Privacy and policy for Sarthak Guidance Institute">
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
