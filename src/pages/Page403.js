import { m } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { MotionContainer, varBounce } from "components/animate";
import { ForbiddenIllustration } from "assets/illustrations";
import { Fragment } from "react";

export default function Page403() {
  return (
    <Fragment>
      <Helmet>
        <title> 403 Forbidden | Sarthak Admin</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            No permission
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            The page you&apos;re trying access has restricted access.
            <br />
            Please refer to your system administrator
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          Go to Home
        </Button>
      </MotionContainer>
    </Fragment>
  );
}
