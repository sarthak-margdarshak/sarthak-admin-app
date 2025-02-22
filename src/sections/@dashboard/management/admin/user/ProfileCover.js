import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { bgBlur } from "utils/cssStyles";
import { useCallback, useState } from "react";
import { UploadAvatar } from "components/upload";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "notistack";

const StyledRoot = styled("div")(({ theme }) => ({
  "&:before": {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
}));

const StyledInfo = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

export default function ProfileCover() {
  const { user, updatePhoto } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [changingPhoto, setChangingPhoto] = useState(false);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setChangingPhoto(true);
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        const res = await updatePhoto(newFile);
        if (!res.success) {
          enqueueSnackbar(res.message, { variant: "error" });
        }
      }
      setChangingPhoto(false);
    },
    [enqueueSnackbar, updatePhoto]
  );

  return (
    <StyledRoot>
      <StyledInfo>
        <UploadAvatar
          file={user?.prefs?.photo}
          accept={{ "image/*": [] }}
          maxSize={10485760}
          onDrop={handleDrop}
          uploading={changingPhoto}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4">{user?.name}</Typography>
          <Typography variant="body">{user?.$id}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{user?.labels[0]}</Typography>
        </Box>

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "right" },
          }}
        >
          <Typography variant="body">{user?.phone}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{user?.email}</Typography>
        </Box>
      </StyledInfo>
    </StyledRoot>
  );
}
