import {
  Card,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useAuthContext } from "auth/useAuthContext";


export default function AccountPermissions() {
  const { userProfile } = useAuthContext();

  return (
    <Card sx={{ p: 3 }}>
      <Typography
        variant="overline"
        component="div"
        sx={{ color: "text.secondary" }}
      >
        Activity
      </Typography>

      <Stack alignItems="flex-start" sx={{ mt: 2, mb: 5 }}>
        <FormControlLabel
          control={
            <Switch
              key={"createTeam"}
              defaultChecked={userProfile?.createTeam || false}
              disabled
              sx={{ m: 0 }}
            />
          }
          label="Permission to create team."
        />
      </Stack>

      <Typography
        variant="overline"
        component="div"
        sx={{ color: "text.info" }}
      >
        Permissions can only be altered by Sarthak CEO/Owner.
      </Typography>
    </Card>
  );
}
