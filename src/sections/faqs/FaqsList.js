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

// @mui
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
// components
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

const faqs = [
  {
    id: 0,
    heading: "How do I apply for admission to your institute?",
    detail:
      "You can directly apply from our android app or web app on the location saarthakguidanceinstitute.ac.in",
  },
  {
    id: 1,
    heading: "What are the admission requirements and deadlines?",
    detail: "You can take admission anytime and can belog to any class",
  },
  {
    id: 2,
    heading: "What academic programs do you offer?",
    detail:
      "We offer 1oth and 12th board exam preparation,& Navodaya, Sainik School, Netarhat, Simultala School competative exam preparartion & Other government job competiotions.",
  },
  {
    id: 3,
    heading: "How can I get information about scholarships and financial aid?",
    detail:
      "You can appear in the schorship exams we conduct to get scholarships.",
  },
  {
    id: 4,
    heading: "What are the tuition fees and payment options?",
    detail:
      "Fees are dependent on what programmes you apply for. For more detail you can visit pricing section.",
  },
  {
    id: 5,
    heading:
      "How is the institute different from other educational institutions?",
    detail:
      "We are dedicated to providing a transformative educational experience that empowers students to excel academically and personally. We strive to create a vibrant learning community where knowledge, innovation, and critical thinking thrive.",
  },
  {
    id: 6,
    heading:
      "Are there any specific entry exams or tests required for admission?",
    detail:
      "No, There is no other specific exams or tests needed for admission. You can take admission directly.",
  },
  {
    id: 7,
    heading:
      "What support services are available for students, such as counseling or tutoring?",
    detail:
      "We offer Academic Excellence, Innovative Programs, Distinguished Faculty, Student Support Services, Technological Integration, Commitment to Diversity, Equity, and Inclusion.",
  },
];

// ----------------------------------------------------------------------

export default function FaqsList() {
  return (
    <div>
      {faqs.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
