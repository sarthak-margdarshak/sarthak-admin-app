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

import { m } from "framer-motion";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Box, Card, Container, Typography, Stack } from "@mui/material";
// components
import Image from "../../components/image";
import { MotionViewport, varFade } from "../../components/animate";

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: " /assets/icons/home/ic_make_brand.svg",
    title: "Academic Excellence",
    description:
      "We are committed to provide high-quality education and a to focus on academic rigor. These include well-designed curriculum, qualified faculty members, research opportunities, and a strong emphasis on teaching and learning.",
  },
  {
    icon: " /assets/icons/home/ic_design.svg",
    title: "Innovative Programs",
    description:
      "We offer a diverse range of academic programs, which allows students to explore different fields and pursue their interests. We offer 10th and 12th board exams, Navodaya School, Sainik School, Simultala School and Netarhat School Competitive exams. We also offer cources on other government competitive exams.",
  },
  {
    icon: " /assets/icons/home/ic_development.svg",
    title: "Distinguished Faculty",
    description:
      "We often highlight the expertise and qualifications of our faculty members. Distinguished faculty members bring credibility, experience, and knowledge to the learning process and contribute to the institute's academic reputation.",
  },
  {
    icon: " /assets/icons/home/ic_service.svg",
    title: "Student Support Services",
    description:
      "We have a strong support system. We offer services such as academic advising, counseling, career guidance, mentoring programs, tutoring, and opportunities for extracurricular involvement.",
  },
  {
    icon: " /assets/icons/home/ic_technology.svg",
    title: "Technological Integration",
    description:
      "We embraces technology in education which enhances teaching and learning experiences. We emphasize the integration of technology in classrooms, online learning platforms and digital resources.",
  },
  {
    icon: " /assets/icons/home/ic_diversity.svg",
    title: "Commitment to Diversity, Equity, and Inclusion",
    description:
      "We promotes diversity, equity, and inclusion which creates an inclusive and supportive environment for all students.",
  },
];

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: "center",
  padding: theme.spacing(10, 5),
  [theme.breakpoints.up("md")]: {
    boxShadow: "none",
  },
}));

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Stack
          spacing={3}
          sx={{
            textAlign: "center",
            mb: { xs: 5, md: 10 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography
              component="div"
              variant="overline"
              sx={{ color: "text.disabled" }}
            >
              Sarthak Margdarshak
            </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography variant="h2">
              How Sarthak <br /> helps you?
            </Typography>
          </m.div>
        </Stack>

        <Box
          gap={{ xs: 3, lg: 10 }}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
          }}
        >
          {CARDS.map((card, index) => (
            <m.div variants={varFade().inUp} key={card.title}>
              <StyledCard
                sx={{
                  ...{
                    boxShadow: (theme) => ({
                      md: `-40px 40px 80px ${
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.grey[500], 0.16)
                          : alpha(theme.palette.common.black, 0.4)
                      }`,
                    }),
                  },
                }}
              >
                <Image
                  src={card.icon}
                  alt={card.title}
                  sx={{ mx: "auto", width: 48, height: 48 }}
                />

                <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                  {card.title}
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                  {card.description}
                </Typography>
              </StyledCard>
            </m.div>
          ))}
        </Box>
      </Container>
    </StyledRoot>
  );
}
