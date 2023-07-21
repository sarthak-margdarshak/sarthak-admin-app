import { Badge, Box, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../../routes/paths";
// utils
import { fToNow } from '../../../../utils/formatTime';
import { Notification } from "../../../../auth/AppwriteContext";
import { useSnackbar } from '../../../../components/snackbar';

export default function QuestionReviewReceivedNotification({ item }) {
  console.log(item)

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const data = JSON.parse(item?.data);

  const updateNotification = async () => {
    try {
      await Notification.updateSeen(item?.$id);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  return (
    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
      {item?.seen ?
        <Card
          sx={{ cursor: 'pointer', mb: 2 }}
          onClick={() => {
            updateNotification();
            navigate(PATH_DASHBOARD.question.view(data?.questionId));
          }}>
          <CardHeader title='Review Question' subheader={fToNow(item?.$createdAt)} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={9} lg={10}>
                <Stack direction="row" alignItems="center">
                  <Box sx={{ minWidth: 240 }}>
                    <Typography color="inherit" variant="subtitle2">
                      {data?.createdBy + ' has sent you to review a question ' + data?.questionId}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card> :
        <Badge badgeContent='New' color="error">
          <Card
            sx={{ cursor: 'pointer', mb: 2 }}
            onClick={() => {
              updateNotification();
              navigate(PATH_DASHBOARD.question.view(data?.questionId));
            }}>
            <CardHeader title='Review Question' subheader={fToNow(item?.$createdAt)} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={9} lg={10}>
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ minWidth: 240 }}>
                      <Typography color="inherit" variant="subtitle2">
                        {data?.createdBy + ' has sent you to review a question ' + data?.questionId}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Badge>
      }
    </Grid>
  )
}