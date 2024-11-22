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

import { useSearchParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { PATH_PAGE } from "../../routes/paths";
import { useAuthContext } from "../../auth/useAuthContext";
import { Helmet } from "react-helmet-async";
import { EmailInboxIcon } from "../../assets/icons";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import PageMotivation from "../PageMotivation";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const membershipId = searchParams.get("membershipId");
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const teamId = searchParams.get("teamId");

  const { acceptInvite } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState(0);
  const [acceptingInvite, setAcceptingInvite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, [userId]);

  const startAcceptInvite = async () => {
    setAcceptingInvite(true);
    const res = await acceptInvite(userId, teamId, membershipId, secret);
    if (res?.success) {
      setStatus(1);
    } else {
      enqueueSnackbar(res?.message, { variant: "error" });
    }
    setAcceptingInvite(false);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title> Accept Invite | Sarthak Admin</title>
      </Helmet>

      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

      {status === 1 ? (
        <PageMotivation />
      ) : (
        <React.Fragment>
          <Typography variant="h3" paragraph>
            Excited to contribute to Sarthak Margdarshak?
          </Typography>

          {/* <Typography sx={{ color: "text.secondary", mb: 5 }}>
            Hey, RITESH RANJAN
          </Typography> */}

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            Please click below to accept invite to join Sarthak Margdarshak
            team.
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            By clicking below button, you will agree to{" "}
            <Link
              to={PATH_PAGE.termsAndConditions}
              target="_blank"
              component={RouterLink}
            >
              terms and conditions
            </Link>{" "}
            provided by us. Please read the{" "}
            <Link
              to={PATH_PAGE.termsAndConditions}
              target="_blank"
              component={RouterLink}
            >
              terms and conditions
            </Link>{" "}
            carefully before joining us.
          </Typography>

          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={acceptingInvite}
            onClick={startAcceptInvite}
            sx={{ mt: 3 }}
          >
            Accept Invite
          </LoadingButton>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
