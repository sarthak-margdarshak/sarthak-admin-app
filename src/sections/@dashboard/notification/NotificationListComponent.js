import { Grid, Paper, alpha } from "@mui/material";
import PropTypes from 'prop-types';
import { QuestionReviewReceivedNotification, QuestionReviewReturnedNotification, TeamInviteNotification } from "./notificationType";

NotificationListComponent.propTypes = {
  notifications: PropTypes.array
};

export default function NotificationListComponent({ notifications }) {
  return (
    <Paper
      sx={{
        p: 1,
        my: 3,
        minHeight: 120,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Grid container spacing={2}>
        {notifications?.map((item) => {
          if (item?.type === 'TEAM_INVITE') {
            return <TeamInviteNotification key={item?.$id} item={item} />
          } else if (item?.type === 'QUESTION_REVIEW_RECIEVED') {
            return <QuestionReviewReceivedNotification key={item?.$id} item={item} />
          } else if (item?.type === 'QUESTION_REVIEW_RETURNED') {
            return <QuestionReviewReturnedNotification key={item?.$id} item={item} />
          } else {
            return <></>
          }
        })}
      </Grid>
    </Paper>
  );
}