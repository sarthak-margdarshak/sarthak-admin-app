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
    title: "Admission Requirements",
    desc: [
      "Prospective students must meet the specified academic qualifications and any additional requirements determined by the institute.",
      "Submission of accurate and complete application materials within the designated deadlines is the responsibility of the applicant.",
    ],
  },
  {
    title: "Tuition and Fees",
    desc: [
      "Students are responsible for paying the tuition fees as determined by the institute.",
      "Payment schedules and accepted payment methods will be communicated to students. Late fees may apply for overdue payments.",
      "Refunds of tuition fees, if applicable, will be processed according to the institute's refund policy.",
    ],
  },
  {
    title: "Academic Policies",
    desc: [
      "Students must comply with all academic policies, including course registration, attendance, grading, academic integrity, course changes, credit transfers, and graduation requirements.",
      "The institute reserves the right to modify or cancel courses based on enrollment, resource availability, or other considerations.",
    ],
  },
  {
    title: "Student Conduct",
    desc: [
      "Students are expected to adhere to the institute's code of conduct, demonstrating respect, honesty, and professionalism towards fellow students, faculty, staff, and the institute's property.",
      "The institute reserves the right to take disciplinary action, including warnings, probation, suspension, or expulsion, in cases of student misconduct.",
    ],
  },
  {
    title: "Privacy and Data Protection",
    desc: [
      "The institute collects and stores personal information in accordance with applicable privacy laws and regulations.",
      "Personal information will be used for administrative and educational purposes and will not be disclosed to third parties without consent, except as required by law.",
    ],
  },
  {
    title: "Technology and Network Usage",
    desc: [
      "Students must adhere to the institute's acceptable use policy for technology resources, computer networks, and internet access.",
      "Unauthorized use of institute resources, including hacking, distribution of malware, or any other illegal activities, is strictly prohibited.",
    ],
  },
  {
    title: "Health and Safety",
    desc: [
      "The institute is committed to providing a safe and healthy environment for students.",
      "Students are encouraged to follow safety guidelines, report any safety concerns, and seek appropriate medical assistance when needed.",
    ],
  },
  {
    title: "Withdrawal and Refund Policies",
    desc: [
      "Students must follow the institute's designated procedures for course or institute withdrawal.",
      "Refunds of tuition fees, if applicable, will be processed in accordance with the institute's refund policy.",
    ],
  },
  {
    title: "Intellectual Property",
    desc: [
      "The institute retains ownership of intellectual property created by students, faculty, or staff within the scope of their involvement with the institute, subject to any agreements or policies specific to individual projects or programs.",
    ],
  },
  {
    title: "Dispute Resolution",
    desc: [
      "In the event of disputes or grievances, students should follow the institute's designated dispute resolution process as outlined in the institute's policies and procedures.",
    ],
  },
  {
    title: "Amendments and Updates",
    desc: [
      "These terms and conditions are subject to change. Students will be notified of any updates or revisions to the terms and conditions through official communication channels.",
    ],
  },
];

// ----------------------------------------------------------------------

export default function TermsAndConditionsPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title> Terms And Conditions | Sarthak Admin</title>
      </Helmet>
      <Container sx={{ my: 10 }}>
        <Block title="Terms and Conditions for Sarthak Guidance Institute">
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
