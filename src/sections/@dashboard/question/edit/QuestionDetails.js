import { useEffect, useState } from "react";
// Auth
import { Question } from "../../../../auth/Question";
// @mui
import {
  Box,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
// components
import { useSnackbar } from "../../../../components/snackbar";
// Utils
// Auth
import { useAuthContext } from "../../../../auth/useAuthContext";
import { SarthakUserDisplayUI } from "../../user/profile";
import QuestionRowComponent from "../view/QuestionRowComponent";
import StandardDisplayUI from "../view/StandardDisplayUI";
import SubjectDisplayUI from "../view/SubjectDisplayUI";
import ChapterDisplayUI from "../view/ChapterDisplayUI";
import ConceptDisplayUI from "../view/ConceptDisplayUI";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useNavigate } from "react-router-dom";
import { PATH_PAGE } from "../../../../routes/paths";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

// ----------------------------------------------------------------------

export default function QuestionDetails({ inComingQuestionId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  const [question, setQuestion] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await Question.getQuestion(inComingQuestionId);
        setQuestion(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
        if (error.code === 404) navigate(PATH_PAGE.page404);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [inComingQuestionId, enqueueSnackbar, user]);

  if (isLoading)
    return (
      <>
        <Paper
          sx={{
            p: 1,
            mb: 2,
            minHeight: 120,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={4} lg={4}>
              <Typography variant="h6" sx={{ m: 2 }}>
                Question
              </Typography>

              <Paper
                sx={{
                  p: 1,
                  height: "100%",
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={250} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} xl={4} lg={4}>
              <Typography variant="h6" sx={{ m: 2 }}>
                Options
              </Typography>

              <Paper
                sx={{
                  p: 1,
                  height: "100%",
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
                <Divider sx={{ m: 1 }} />

                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
                <Divider sx={{ m: 1 }} />

                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
                <Divider sx={{ m: 1 }} />

                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} xl={4} lg={4}>
              <Typography variant="h6" sx={{ m: 2 }}>
                Answer
              </Typography>
              <Paper
                sx={{
                  p: 1,
                  height: "100%",
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={250} />
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ mt: 9 }} />

          <Box sx={{ textAlign: "right", m: 2 }}>
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
          </Box>
        </Paper>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6} xl={9} lg={8}>
            <Paper
              sx={{
                p: 1,
                minHeight: 120,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Grid container>
                <Grid item xs>
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item xs>
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                  <Skeleton
                    sx={{ m: 2, pl: 2 }}
                    variant="rounded"
                    height={20}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </>
    );

  return (
    <>
      <QuestionRowComponent question={question} />

      <Grid container>
        <Grid item xs>
          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              System Id -
            </Typography>
            <Typography variant="body2">{question?.$id}</Typography>
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Standard -
            </Typography>
            <StandardDisplayUI id={question?.standardId} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Subject -
            </Typography>
            <SubjectDisplayUI id={question?.subjectId} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Created By -
            </Typography>
            <SarthakUserDisplayUI userId={question?.createdBy} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Created At -
            </Typography>
            <Typography variant="body2">
              {timeAgo.format(new Date(question?.$createdAt))}
            </Typography>
          </Stack>

          {question.published && (
            <Stack direction="row" sx={{ m: 2 }}>
              <Typography sx={{ mr: 1 }} variant="subtitle2">
                Approved By -
              </Typography>
              <SarthakUserDisplayUI userId={question?.approvedBy} />
            </Stack>
          )}
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs>
          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Sarthak Id -
            </Typography>
            <Typography variant="body2">{question?.qnId}</Typography>
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Chapter -
            </Typography>
            <ChapterDisplayUI id={question?.chapterId} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Concept -
            </Typography>
            <ConceptDisplayUI id={question?.conceptId} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Updated By -
            </Typography>
            <SarthakUserDisplayUI userId={question?.updatedBy} />
          </Stack>

          <Stack direction="row" sx={{ m: 2 }}>
            <Typography sx={{ mr: 1 }} variant="subtitle2">
              Updated At -
            </Typography>
            <Typography variant="body2">
              {timeAgo.format(new Date(question?.$updatedAt))}
            </Typography>
          </Stack>

          {question.published && (
            <Stack direction="row" sx={{ m: 2 }}>
              <Typography sx={{ mr: 1 }} variant="subtitle2">
                Approved At -
              </Typography>
              <Typography variant="body2">
                {timeAgo.format(new Date(question?.approvedAt))}
              </Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
