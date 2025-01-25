import { Link as RouterLink } from "react-router-dom";
import { Link, Card, CardHeader, Stack, IconButton } from "@mui/material";
import { _socials } from "_mock/arrays";
import Iconify from "components/iconify";
import { useAuthContext } from "auth/useAuthContext";
import { PATH_DASHBOARD } from "routes/paths";
import React from "react";

export default function ProfileSocialInfo({ userId, infoProfile }) {
  const { user } = useAuthContext();

  return (
    <Card>
      <CardHeader
        title="Social"
        action={
          userId === user?.$id ? (
            <IconButton
              component={RouterLink}
              aria-label="Edit"
              to={PATH_DASHBOARD.user.account + "?tab=social_links"}
            >
              <Iconify icon="ic:baseline-edit" />
            </IconButton>
          ) : (
            <React.Fragment></React.Fragment>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {_socials.map((link) => (
          <Stack
            key={link.name}
            direction="row"
            sx={{ wordBreak: "break-all" }}
          >
            <Iconify
              icon={link.icon}
              sx={{
                mr: 2,
                flexShrink: 0,
                color: link.color,
              }}
            />
            <Link
              component="span"
              variant="body2"
              color="text.primary"
              onClick={() =>
                window.open(
                  (link.value === "facebook" && infoProfile?.facebookId) ||
                    (link.value === "instagram" && infoProfile?.instagramId) ||
                    (link.value === "linkedin" && infoProfile?.linkedinId) ||
                    infoProfile?.twitterId,
                  "_blank"
                )
              }
              sx={{ cursor: "pointer" }}
            >
              {(link.value === "facebook" && infoProfile?.facebookId) ||
                (link.value === "instagram" && infoProfile?.instagramId) ||
                (link.value === "linkedin" && infoProfile?.linkedinId) ||
                infoProfile?.twitterId}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
