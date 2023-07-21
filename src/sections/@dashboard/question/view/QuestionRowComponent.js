import { Box, Button, Chip, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Image from '../../../../components/image/Image';
import ReactKatex from '@pkasila/react-katex';
import { useEffect, useState } from "react";
import { Question, User } from "../../../../auth/AppwriteContext";
import Iconify from "../../../../components/iconify/Iconify";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from '../../../../components/snackbar';
import { fDate } from "../../../../utils/formatTime";

export default function QuestionRowComponent({ question, onSave }) {
  const [standard, setStandard] = useState('---');
  const [subject, setSubject] = useState('---');
  const [chapter, setChapter] = useState('---');
  const [concept, setConcept] = useState('---');
  const [status, setStatus] = useState('---');
  const [createdBy, setCreatedBy] = useState('---');
  const [updatedBy, setUpdatedBy] = useState('---');
  const [approvedBy, setApprovedBy] = useState('---');
  const [sentForReviewTo, setSentForReviewTo] = useState('---');
  const [reviewedBackTo, setReviewedBackTo] = useState('---');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [coverQuestion, setCoverQuestion] = useState();
  const [coverOptionA, setCoverOptionA] = useState();
  const [coverOptionB, setCoverOptionB] = useState();
  const [coverOptionC, setCoverOptionC] = useState();
  const [coverOptionD, setCoverOptionD] = useState();

  const [updating, setUpdating] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      var data = await Question.getStandardName(question?.standardId);
      setStandard(data);

      data = await Question.getSubjectName(question?.subjectId);
      setSubject(data);

      data = await Question.getChapterName(question?.chapterId);
      setChapter(data);

      data = await Question.getConceptName(question?.conceptId);
      setConcept(data);

      if (question?.createdBy) {
        data = await User.getProfileData(question?.createdBy);
        setCreatedBy(data?.name);
      }

      setStatus(question?.status);
      setNewStatus(question?.status);

      if (question?.updatedBy) {
        data = await User.getProfileData(question?.updatedBy);
        setUpdatedBy(data?.name);
      }

      if (question?.approvedBy) {
        data = await User.getProfileData(question?.approvedBy);
        setApprovedBy(data?.name);
      }

      if (question?.sentForReviewTo) {
        data = await User.getProfileData(question?.sentForReviewTo);
        setSentForReviewTo(data?.name);
      }

      if (question?.reviewdBackTo) {
        data = await User.getProfileData(question?.reviewdBackTo);
        setReviewedBackTo(data?.name);
      }

      data = await Question.getQuestionContentForPreview(question?.coverQuestion);
      setCoverQuestion(data);

      data = await Question.getQuestionContentForPreview(question?.coverOptionA);
      setCoverOptionA(data);

      data = await Question.getQuestionContentForPreview(question?.coverOptionB);
      setCoverOptionB(data);

      data = await Question.getQuestionContentForPreview(question?.coverOptionC);
      setCoverOptionC(data);

      data = await Question.getQuestionContentForPreview(question?.coverOptionD);
      setCoverOptionD(data);
    }
    fetchData();
  }, [question])

  const updateData = async () => {
    setUpdating(true);
    console.log(newStatus)
    try {
      if (newStatus === 'Approved') {
        await Question.approveQuestion(question?.$id, user?.$id);
      } else if (newStatus === 'ReviewedBack') {
        await Question.reviewBackQuestion(question?.$id, user?.$id, question?.createdBy, comment);
      } else if (newStatus === 'Active') {
        await Question.activateQuestion(question?.$id, user?.$id, 'Active');
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setComment('');
    setUpdating(false);
    setOpenDrawer(false);
    onSave();
  }

  return (
    <>
      <Divider>
        <Chip label={question?.$id} />
      </Divider>

      <Grid container>
        <Grid item xs>
          <Box sx={{ m: 2 }}>
            <Stack direction='row'>
              <Typography sx={{ mr: 2 }} variant="h5">Q.</Typography>
              <ReactKatex>{question?.contentQuestion || ''}</ReactKatex>
            </Stack>
            {question?.coverQuestion &&
              <Image
                disabledEffect
                alt='Question'
                src={coverQuestion}
                sx={{ borderRadius: 1, ml: 2 }}
              />
            }
            <List dense>
              <ListItem>
                <Typography sx={{ mr: 2 }}>A. </Typography>
                <ReactKatex>{question?.contentOptionA || ''}</ReactKatex>
                {question?.coverOptionA &&
                  <Image
                    disabledEffect
                    alt='option C'
                    src={coverOptionA}
                    sx={{ borderRadius: 1, ml: 2 }}
                  />
                }
              </ListItem>

              <ListItem>
                <Typography sx={{ mr: 2 }}>B. </Typography>
                <ReactKatex>{question?.contentOptionB || ''}</ReactKatex>
                {question?.coverOptionB &&
                  <Image
                    disabledEffect
                    alt='option C'
                    src={coverOptionB}
                    sx={{ borderRadius: 1, ml: 2 }}
                  />
                }
              </ListItem>

              <ListItem>
                <Typography sx={{ mr: 2 }}>C. </Typography>
                <ReactKatex>{question?.contentOptionC || ''}</ReactKatex>
                {question?.coverOptionC &&
                  <Image
                    disabledEffect
                    alt='option C'
                    src={coverOptionC}
                    sx={{ borderRadius: 1, ml: 2 }}
                  />
                }
              </ListItem>

              <ListItem>
                <Typography sx={{ mr: 2 }}>D. </Typography>
                <ReactKatex>{question?.contentOptionD || ''}</ReactKatex>
                {question?.coverOptionD &&
                  <Image
                    disabledEffect
                    alt='option C'
                    src={coverOptionD}
                    sx={{ borderRadius: 1, ml: 2 }}
                  />
                }
              </ListItem>
            </List>
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem>
        </Divider>

        <Grid item xs>
          <Grid container>

            <Grid item xs>
              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Standard -</Typography>
                <Typography variant="body2">{standard}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Subject -</Typography>
                <Typography variant="body2">{subject}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Chapter -</Typography>
                <Typography variant="body2">{chapter}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Concept -</Typography>
                <Typography variant="body2">{concept}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Created By -</Typography>
                <Typography variant="body2">{createdBy}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Created At -</Typography>
                <Typography variant="body2">{fDate(question?.$createdAt)}</Typography>
              </Stack>
            </Grid>

            <Grid item xs>
              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Status -</Typography>
                <Typography variant="body2">{status}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Updated By -</Typography>
                <Typography variant="body2">{updatedBy}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Approved By -</Typography>
                <Typography variant="body2">{approvedBy}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Sent For Review To -</Typography>
                <Typography variant="body2">{sentForReviewTo}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Reviwed Back To -</Typography>
                <Typography variant="body2">{reviewedBackTo}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Review Comment -</Typography>
                <Typography variant="body2">{question?.reviewComment}</Typography>
              </Stack>
            </Grid>

          </Grid>

          <Box sx={{ textAlign: 'right', mt: 2, mb: 2 }}>

            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              onClick={() => window.open(PATH_DASHBOARD.question.edit(question?.$id), '_blank', 'rel=noopener noreferrer')}
              startIcon={<Iconify icon="ic:baseline-edit" />}
            >
              Edit
            </Button>

            <Button
              sx={{ mr: 2 }}
              variant="contained"
              disabled={user?.$id !== question?.sentForReviewTo}
              onClick={() => setOpenDrawer(true)}
              startIcon={<Iconify icon="fluent-mdl2:set-action" />}
            >
              Action
            </Button>


          </Box>
        </Grid>
      </Grid>

      <Drawer
        anchor='right'
        open={openDrawer}
      >
        <Box sx={{ textAlign: 'right', m: 2 }}>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <Iconify icon="material-symbols:close" />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ m: 4 }}>Update Status</Typography>

        <FormControl sx={{ m: 2, minWidth: 300 }} size="small">
          <InputLabel id="demo-select-small-label">Status</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={newStatus}
            label="Status"
            onChange={(event) => setNewStatus(event.target.value)}
          >
            <MenuItem value={'Initialize'}>Initialize</MenuItem>
            <MenuItem value={'SentForReview'}>SentForReview</MenuItem>
            <MenuItem value={'ReviewedBack'}>ReviewedBack</MenuItem>
            <MenuItem value={'Approved'}>Approved</MenuItem>
            <MenuItem value={'Active'}>Active</MenuItem>
          </Select>
        </FormControl>

        {newStatus === 'ReviewedBack' &&
          <TextField
            multiline
            sx={{ m: 2 }}
            maxRows={5}
            minRows={5}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add your Comment ...."
            label='Comment' />
        }

        <LoadingButton loading={updating} variant="contained" onClick={updateData} sx={{ m: 2 }}>Save</LoadingButton>

      </Drawer>
    </>
  );
}