import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Stack,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import useCountdown from "hooks/useCountdown";
import { socials } from "assets/data";
import Iconify from "components/iconify";
import { CustomTextField } from "components/custom-input";
import { ComingSoonIllustration } from "assets/illustrations";
import { Fragment } from "react";

export default function ComingSoonPage() {
  const { days, hours, minutes, seconds } = useCountdown(
    new Date("07/07/2024 21:30")
  );

  return (
    <Fragment>
      <Helmet>
        <title> Coming Soon | Sarthak Admin</title>
      </Helmet>

      <Typography variant="h3" paragraph>
        Coming Soon!
      </Typography>

      <Typography sx={{ color: "text.secondary" }}>
        We are currently working hard on this page!
      </Typography>

      <ComingSoonIllustration sx={{ my: 10, height: 240 }} />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: "h2" }}
      >
        <TimeBlock label="Days" value={days} />

        <TimeBlock label="Hours" value={hours} />

        <TimeBlock label="Minutes" value={minutes} />

        <TimeBlock label="Seconds" value={seconds} />
      </Stack>

      <CustomTextField
        fullWidth
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" size="large">
                Notify Me
              </Button>
            </InputAdornment>
          ),
          sx: { pr: 0.5 },
        }}
        sx={{ my: 5 }}
      />

      <Stack
        spacing={1}
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        {socials.map((social) => (
          <IconButton
            key={social.name}
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
    </Fragment>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

function TimeBlock({ label, value }) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: "text.secondary", typography: "body1" }}>{label}</Box>
    </div>
  );
}
