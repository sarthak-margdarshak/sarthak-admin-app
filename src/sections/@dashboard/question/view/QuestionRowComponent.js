import { Autocomplete, Box, Card, CardContent, CardHeader, Checkbox, Chip, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, Link, List, ListItem, MenuItem, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
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

export default function QuestionRowComponent({ question, onSave, allPerson }) {
  const [standard, setStandard] = useState('---');
  const [subject, setSubject] = useState('---');
  const [chapter, setChapter] = useState('---');
  const [concept, setConcept] = useState('---');

  const [openDrawer, setOpenDrawer] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newSentReviewBack, setNewSentReviewBack] = useState({});
  const [comment, setComment] = useState('');
  const [coverQuestion, setCoverQuestion] = useState();
  const [coverOptionA, setCoverOptionA] = useState();
  const [coverOptionB, setCoverOptionB] = useState();
  const [coverOptionC, setCoverOptionC] = useState();
  const [coverOptionD, setCoverOptionD] = useState();
  const [coverAnswer, setCoverAnswer] = useState();

  const [status, setStatus] = useState('');
  const [createdBy, setCreatedBy] = useState({});
  const [createdAt, setCreatedAt] = useState();
  const [updatedBy, setUpdatedBy] = useState({});
  const [updatedAt, setUpdatedAt] = useState();
  const [approvedBy, setApprovedBy] = useState({});
  const [approvedAt, setApprovedAt] = useState();
  const [sentForReviewTo, setSentForReviewTo] = useState({});
  const [sentForReviewAt, setSentForReviewAt] = useState();
  const [reviewBackTo, setReviewBackTo] = useState({});
  const [reviewBackAt, setReviewBackAt] = useState();
  const [reviewComment, setReviewComment] = useState('');

  const [updating, setUpdating] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      var data = await Question.getStandardName(question?.standardId);
      setStandard(data);

      data = await Question.getSubjectName(question?.subjectId);
      setSubject(data);

      data = await Question.getChapterName(question?.chapterId);
      setChapter(data);

      data = await Question.getConceptName(question?.conceptId);
      setConcept(data);

      setStatus(question?.status);
      if (question?.createdBy) {
        const tmpData = await User.getProfileData(question?.createdBy);
        setCreatedBy(tmpData);
        setNewSentReviewBack(tmpData);
      }
      setCreatedAt(question?.$createdAt);
      if (question?.updatedBy) {
        const tmpData = await User.getProfileData(question?.updatedBy);
        setUpdatedBy(tmpData);
      }
      setUpdatedAt(question?.$updatedAt);
      if (question?.approvedBy) {
        const tmpData = await User.getProfileData(question?.approvedBy);
        setApprovedBy(tmpData);
      }
      setApprovedAt(question?.approvedAt);
      if (question?.sentForReviewTo) {
        const tmpData = await User.getProfileData(question?.sentForReviewTo);
        setSentForReviewTo(tmpData);
      }
      setSentForReviewAt(question?.sentForReviewAt);
      if (question?.reviewdBackTo) {
        const tmpData = await User.getProfileData(question?.reviewdBackTo);
        setReviewBackTo(tmpData);
        setNewSentReviewBack(tmpData);
      }
      setReviewBackAt(question?.reviewBackAt);
      setReviewComment(question?.reviewComment);
      setNewStatus(question?.status);

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

      data = await Question.getQuestionContentForPreview(question?.coverAnswer);
      setCoverAnswer(data);

      setIsDataLoading(false);
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
        await Question.reviewBackQuestion(question?.$id, user?.$id, newSentReviewBack?.$id, comment);
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

  if (isDataLoading) {
    return (
      <>
        <Divider>
          <Chip label={question?.$id} />
        </Divider>

        <Grid container>
          <Grid item xs>
            <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
            <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
          </Grid>
          <Grid item xs>
            <Grid container>
              <Grid item xs>
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
              </Grid>
              <Grid item xs>
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Divider>
        <Chip label={question?.$id} />
      </Divider>

      <Grid container>
        <Grid item sm={12} xs={12} md={12} lg={6} xl={6}>
          <Card sx={{ m: 1 }}>
            <CardHeader
              title={question?.$id}
              action={
                <>
                  <IconButton aria-label="view" onClick={() => window.open(PATH_DASHBOARD.question.view(question?.$id), '_blank')}>
                    <Iconify icon="carbon:view-filled" />
                  </IconButton>
                  <IconButton aria-label="Action" disabled={user?.$id !== question?.sentForReviewTo}
                    onClick={() => setOpenDrawer(true)}>
                    <Iconify icon="fluent-mdl2:set-action" />
                  </IconButton>
                  <IconButton aria-label="Edit" onClick={() => window.open(PATH_DASHBOARD.question.edit(question?.$id), '_blank')}>
                    <Iconify icon="ic:baseline-edit" />
                  </IconButton>
                </>
              }
            >

            </CardHeader>
            <CardContent>
              <Stack direction='row'>
                <Typography sx={{ mr: 2 }} variant="h5">Q.</Typography>
                <ReactKatex>{question?.contentQuestion || ''}</ReactKatex>
              </Stack>
              {question?.coverQuestion &&
                <Image
                  disabledEffect
                  alt='Question'
                  src={coverQuestion}
                  sx={{ borderRadius: 1, ml: 2, width: 300 }}
                />
              }
              <List dense>
                <ListItem>
                  <Stack direction='column'>
                    <Stack direction='row'>
                      <Typography sx={{ mr: 2 }}>A. </Typography>
                      <ReactKatex>{question?.contentOptionA || ''}</ReactKatex>
                    </Stack>
                    {question?.coverOptionA &&
                      <Image
                        disabledEffect
                        alt='option A'
                        src={coverOptionA}
                        sx={{ borderRadius: 1, ml: 2, width: 300 }}
                      />
                    }
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack direction='column'>
                    <Stack direction='row'>
                      <Typography sx={{ mr: 2 }}>B. </Typography>
                      <ReactKatex>{question?.contentOptionB || ''}</ReactKatex>
                    </Stack>
                    {question?.coverOptionB &&
                      <Image
                        disabledEffect
                        alt='option B'
                        src={coverOptionB}
                        sx={{ borderRadius: 1, ml: 2, width: 300 }}
                      />
                    }
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack direction='column'>
                    <Stack direction='row'>
                      <Typography sx={{ mr: 2 }}>C. </Typography>
                      <ReactKatex>{question?.contentOptionC || ''}</ReactKatex>
                    </Stack>
                    {question?.coverOptionC &&
                      <Image
                        disabledEffect
                        alt='option C'
                        src={coverOptionC}
                        sx={{ borderRadius: 1, ml: 2, width: 300 }}
                      />
                    }
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack direction='column'>
                    <Stack direction='row'>
                      <Typography sx={{ mr: 2 }}>D. </Typography>
                      <ReactKatex>{question?.contentOptionD || ''}</ReactKatex>
                    </Stack>
                    {question?.coverOptionD &&
                      <Image
                        disabledEffect
                        alt='option D'
                        src={coverOptionD}
                        sx={{ borderRadius: 1, ml: 2, width: 300 }}
                      />
                    }
                  </Stack>
                </ListItem>
              </List>

              <Stack direction='row'>
                <Typography sx={{ mr: 2 }} variant="h6">{"Ans. (" + question?.answerOption + ") "}</Typography>
                <ReactKatex>{question?.contentAnswer || ''}</ReactKatex>
              </Stack>
              {question?.coverAnswer &&
                <Image
                  disabledEffect
                  alt='Question'
                  src={coverAnswer}
                  sx={{ borderRadius: 1, ml: 2, width: 300 }}
                />
              }
            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={12} xs={12} md={12} lg={3} xl={3}>
          <Card sx={{ m: 1 }}>
            <CardContent>
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
                <Typography sx={{ mr: 1 }} variant="subtitle2">Status -</Typography>
                <Typography variant="body2">{status}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Created By -</Typography>
                <Link sx={{ cursor: 'pointer' }} onClick={() => window.open('/dashboard/user/profile/' + createdBy?.$id)}>
                  <Typography variant="body2">{createdBy?.name}</Typography>
                </Link>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Created At -</Typography>
                <Typography variant="body2">{fDate(createdAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Updated By -</Typography>
                <Link sx={{ cursor: 'pointer' }} onClick={() => window.open('/dashboard/user/profile/' + updatedBy?.$id)}>
                  <Typography variant="body2">{updatedBy?.name}</Typography>
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={12} xs={12} md={12} lg={3} xl={3}>
          <Card sx={{ m: 1 }}>
            <CardContent>
              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Updated At -</Typography>
                <Typography variant="body2">{fDate(updatedAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Approved By -</Typography>
                <Link sx={{ cursor: 'pointer' }} onClick={() => window.open('/dashboard/user/profile/' + approvedBy?.$id)}>
                  <Typography variant="body2">{approvedBy?.name}</Typography>
                </Link>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Approved At -</Typography>
                <Typography variant="body2">{fDate(approvedAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Sent For Review To -</Typography>
                <Link sx={{ cursor: 'pointer' }} onClick={() => window.open('/dashboard/user/profile/' + sentForReviewTo?.$id)}>
                  <Typography variant="body2">{updatedBy?.name}</Typography>
                </Link>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Sent For Review At -</Typography>
                <Typography variant="body2">{fDate(sentForReviewAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Review Back To -</Typography>
                <Link sx={{ cursor: 'pointer' }} onClick={() => window.open('/dashboard/user/profile/' + reviewBackTo?.$id)}>
                  <Typography variant="body2">{reviewBackTo?.name}</Typography>
                </Link>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Review Back At -</Typography>
                <Typography variant="body2">{fDate(reviewBackAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Review Comment -</Typography>
                <Typography variant="body2">{reviewComment}</Typography>
              </Stack>
            </CardContent>
          </Card>
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

        <Typography variant="h6" sx={{ m: 4 }}>{"Update Status of question id - " + question?.$id}</Typography>

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

        {newStatus === 'ReviewedBack' &&
          <Autocomplete
            autoComplete
            options={allPerson}
            onChange={(event, value) => {
              setNewSentReviewBack(value);
            }}
            value={newSentReviewBack}
            getOptionLabel={(option) => option?.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option?.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Review Back To" />
            )}
            sx={{ mt: 2, ml: 2 }}
          />
        }

        <LoadingButton loading={updating} variant="contained" onClick={updateData} sx={{ m: 2 }}>Save</LoadingButton>

      </Drawer>
    </>
  );
}