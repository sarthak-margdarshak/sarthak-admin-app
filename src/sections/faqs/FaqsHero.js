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
import { styled } from "@mui/material/styles";
import { Container, Stack } from "@mui/material";
// components
import {
  MotionContainer,
  TextAnimate,
  varFade,
} from "../../components/animate";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage:
    "url(/assets/background/overlay_1.svg), url(/assets/images/faqs/hero.jpg)",
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up("md")]: {
    height: 560,
    padding: 0,
  },
}));

// ----------------------------------------------------------------------

const StyledContent = styled("div")(({ theme }) => ({
  textAlign: "center",
  [theme.breakpoints.up("md")]: {
    bottom: 80,
    textAlign: "left",
    position: "absolute",
  },
}));

// ----------------------------------------------------------------------

export default function FaqsHero() {
  return (
    <StyledRoot>
      <Container component={MotionContainer}>
        <StyledContent>
          <div>
            <TextAnimate
              text="How"
              sx={{ color: "primary.main" }}
              variants={varFade().inRight}
            />
            <br />

            <Stack
              spacing={2}
              display="inline-flex"
              direction="row"
              sx={{ color: "common.white" }}
            >
              <TextAnimate text="can" />
              <TextAnimate text="we" />
              <TextAnimate text="help" />
              <TextAnimate text="you?" />
            </Stack>
          </div>
        </StyledContent>
      </Container>
    </StyledRoot>
  );
}
