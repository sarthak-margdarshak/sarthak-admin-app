import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import {
  Link,
  Card,
  Typography,
  CardHeader,
  Stack,
  IconButton,
} from "@mui/material";
import Iconify from "components/iconify";
import { useAuthContext } from "auth/useAuthContext";
import { PATH_DASHBOARD } from "routes/paths";
import React from "react";

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

ProfileAbout.propTypes = {
  userId: PropTypes.string,
  company: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string,
  quote: PropTypes.string,
  role: PropTypes.string,
  school: PropTypes.string,
};

export default function ProfileAbout({
  userId,
  quote,
  country,
  email,
  role,
  company,
  school,
}) {
  const { user } = useAuthContext();

  return (
    <Card>
      <CardHeader
        title="About"
        action={
          userId === user?.$id ? (
            <IconButton
              component={RouterLink}
              aria-label="Edit"
              to={PATH_DASHBOARD.user.account}
            >
              <Iconify icon="ic:baseline-edit" />
            </IconButton>
          ) : (
            <React.Fragment></React.Fragment>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{quote}</Typography>

        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2">
            Live at : &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {country}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2">
            {role} , &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {company}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="material-symbols:school" />

          <Typography variant="body2">
            Studied At : &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {school}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
