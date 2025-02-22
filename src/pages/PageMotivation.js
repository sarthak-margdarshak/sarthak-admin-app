import { m } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { MotionContainer, varBounce } from "components/animate";
import { MotivationIllustration } from "assets/illustrations";
import { Fragment } from "react";

export default function PageMotivation() {
  return (
    <Fragment>
      <Helmet>
        <title> Success | Sarthak Admin</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Successfully completed the action
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            You have successfully completed the required action. Click on below
            button to explore.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <MotivationIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          Go to Home
        </Button>
      </MotionContainer>
    </Fragment>
  );
}
