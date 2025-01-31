import { Stack, Typography, Box } from "@mui/material";
import { useAuthContext } from "auth/useAuthContext";

export default function NavDocs() {
  const { user } = useAuthContext();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: "block",
        textAlign: "center",
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />

      <div>
        <Typography gutterBottom variant="subtitle1">
          {`Hi, ${user?.name}`}
        </Typography>
      </div>
    </Stack>
  );
}
