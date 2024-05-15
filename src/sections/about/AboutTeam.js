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
import { m } from "framer-motion";
import { useRef } from "react";
// @mui
import { useTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Stack,
  Card,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
// _mock_
import { _socials } from "../../_mock/arrays";
// components
import Image from "../../components/image";
import Iconify from "../../components/iconify";
import Carousel, { CarouselArrows } from "../../components/carousel";
import { MotionViewport, varFade } from "../../components/animate";

// ----------------------------------------------------------------------

const teamMembers = [
  {
    id: "EMP0001",
    name: "Suryamani Kumar",
    role: "Co-Founder/ CEO",
    avatar: "/assets/images/portraits/portrait_2.jpg",
    facebookId: "#",
    instagramId: "#",
    linkedinId: "#",
    twitterId: "#",
  },
];

// ----------------------------------------------------------------------

export default function AboutTeam() {
  const carouselRef = useRef(null);

  const theme = useTheme();

  const carouselSettings = {
    infinite: false,
    arrows: false,
    slidesToShow: 4,
    rtl: Boolean(theme.direction === "rtl"),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: "center" }}>
      <m.div variants={varFade().inDown}>
        <Typography
          component="p"
          variant="overline"
          sx={{ color: "text.disabled" }}
        >
          Dream team
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3 }}>
          Great team is the key
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mx: "auto",
            maxWidth: 640,
            color: "text.secondary",
          }}
        >
          Teamwork is the ability to work together toward a common vision. The
          ability to direct individual accomplishments toward organizational
          objectives. It is the fuel that allows common people to attain
          uncommon results.
        </Typography>
      </m.div>

      <Box sx={{ position: "relative" }}>
        <CarouselArrows
          filled
          shape="rounded"
          onNext={handleNext}
          onPrevious={handlePrev}
          leftButtonProps={{
            sx: {
              left: 24,
              ...(teamMembers.length < 5 && { display: "none" }),
            },
          }}
          rightButtonProps={{
            sx: {
              right: 24,
              ...(teamMembers.length < 5 && { display: "none" }),
            },
          }}
        >
          <Carousel ref={carouselRef} {...carouselSettings}>
            {teamMembers.map((member) => (
              <Box
                key={member.id}
                component={m.div}
                variants={varFade().in}
                sx={{ px: 1.5, py: 10 }}
              >
                <MemberCard member={member} />
              </Box>
            ))}
          </Carousel>
        </CarouselArrows>
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------

MemberCard.propTypes = {
  member: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    facebookId: PropTypes.string,
    instagramId: PropTypes.string,
    linkedinId: PropTypes.string,
    twitterId: PropTypes.string,
  }),
};

function MemberCard({ member }) {
  const { name, role, avatar, facebookId, instagramId, linkedinId, twitterId } =
    member;

  return (
    <Card key={name}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        {role}
      </Typography>

      <Box sx={{ px: 1 }}>
        <Image alt={name} src={avatar} ratio="1/1" sx={{ borderRadius: 2 }} />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2 }}
      >
        {_socials.map((social) => (
          <IconButton
            key={social.name}
            href={
              social.name === "FaceBook"
                ? facebookId
                : social.name === "Instagram"
                ? instagramId
                : social.name === "Linkedin"
                ? linkedinId
                : twitterId
            }
            sx={{
              color: social.color,
              "&:hover": {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        ))}
      </Stack>
    </Card>
  );
}
