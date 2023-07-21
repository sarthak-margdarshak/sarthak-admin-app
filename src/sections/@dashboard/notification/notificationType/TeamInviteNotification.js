import { LoadingButton } from "@mui/lab";
import { Box, Badge, Card, CardContent, Grid, Stack, Typography, CardHeader } from "@mui/material";
// utils
import { fToNow } from '../../../../utils/formatTime';
import { useState } from "react";
import { Notification } from "../../../../auth/AppwriteContext";
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import { useSnackbar } from '../../../../components/snackbar';

export default function TeamInviteNotification({ item }) {
  const [data, setData] = useState(JSON.parse(item?.data));
  const [isSubmitting, setIsSumitting] = useState(false);
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const rejectInvite = async () => {
    setIsSumitting(true);
    try {
      await Notification.updateInvitationAction('rejected', data?.membershipId, user?.$id, item?.$id, data?.managerName);
      const newData = {
        ...data,
        approved: false,
        rejected: true,
      }
      setData(newData);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsSumitting(false);
  }

  const acceptInvite = async () => {
    setIsSumitting(true);
    try {
      await Notification.updateInvitationAction('approved', data?.membershipId, user?.$id, item?.$id, data?.managerName);
      enqueueSnackbar('Welcome to the new team');
      const newData = {
        ...data,
        approved: true,
        rejected: false,
      }
      setData(newData);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsSumitting(false);
  }

  return (
    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
      {item?.seen ?
        <Card sx={{ mb: 2 }}>
          <CardHeader title='Team Invitation' subheader={fToNow(item?.$createdAt)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={9} lg={10}>
                <Stack direction="row" alignItems="center">
                  <Box sx={{ minWidth: 240 }}>
                    <Typography color="inherit" variant="subtitle2">
                      {'You have been invited to join team ' + data?.teamName + ' by ' + data?.managerName}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={2}>
                {data?.approved &&
                  <LoadingButton disabled color='error' variant="outlined">Approved</LoadingButton>
                }

                {data?.rejected &&
                  <LoadingButton disabled color='error' variant="outlined">Rejected</LoadingButton>
                }

                {!data?.approved && !data?.rejected &&
                  <>
                    <LoadingButton color='error' onClick={rejectInvite} loading={isSubmitting}>Reject</LoadingButton>
                    <LoadingButton color='success' variant="contained" onClick={acceptInvite} loading={isSubmitting}>Approve</LoadingButton>
                  </>
                }
              </Grid>
            </Grid>
          </CardContent>
        </Card> :
        <Badge badgeContent='New' color="error">
          <Card sx={{ mb: 2 }}>
            <CardHeader title='Team Invitation' subheader={fToNow(item?.$createdAt)} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={9} lg={10}>
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ minWidth: 240 }}>
                      <Typography color="inherit" variant="subtitle2">
                        {'You have been invited to join team ' + data?.teamName + ' by ' + data?.managerName}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4} md={3} lg={2}>
                  {data?.approved &&
                    <LoadingButton disabled color='error' variant="outlined">Approved</LoadingButton>
                  }

                  {data?.rejected &&
                    <LoadingButton disabled color='error' variant="outlined">Rejected</LoadingButton>
                  }

                  {!data?.approved && !data?.rejected &&
                    <>
                      <LoadingButton color='error' onClick={rejectInvite} loading={isSubmitting}>Reject</LoadingButton>
                      <LoadingButton color='success' variant="contained" onClick={acceptInvite} loading={isSubmitting}>Approve</LoadingButton>
                    </>
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Badge>
      }
    </Grid>
  )
}