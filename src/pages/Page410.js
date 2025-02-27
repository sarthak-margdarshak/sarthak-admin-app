import { m } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { MotionContainer, varBounce } from "components/animate";
import { SeverErrorIllustration } from "assets/illustrations";
import { Fragment } from "react";

export default function Page410() {
  return (
    <Fragment>
      <Helmet>
        <title> 410 Link Expired | Sarthak Admin</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Sorry, Link Expired!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you are
            late to access the URL? You should have come earlier.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          Go to Home
        </Button>
      </MotionContainer>
    </Fragment>
  );
}
