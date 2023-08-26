import { useEffect, useState } from 'react';
// Auth
import { Question, User } from '../../../../auth/AppwriteContext';
// @mui
import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, TextField, Typography, alpha } from '@mui/material';
import { LoadingButton, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify/Iconify';
// Utils
import { fDate } from '../../../../utils/formatTime';
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import ReactKatex from '@pkasila/react-katex';
import Image from '../../../../components/image/Image';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { SarthakUserDisplayUI } from '../../user/profile';

// ----------------------------------------------------------------------

export default function QuestionDetails({ inComingQuestionId }) {

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  const [question, setQuestion] = useState('');
  const [coverQuestion, setCoverQuestion] = useState(null);
  const [optionA, setOptionA] = useState('');
  const [coverOptionA, setCoverOptionA] = useState(null);
  const [optionB, setOptionB] = useState('');
  const [coverOptionB, setCoverOptionB] = useState(null);
  const [optionC, setOptionC] = useState('');
  const [coverOptionC, setCoverOptionC] = useState(null);
  const [optionD, setOptionD] = useState('');
  const [coverOptionD, setCoverOptionD] = useState(null);
  const [answerOption, setAnswerOption] = useState('');
  const [contentAnswer, setContentAnswer] = useState('');
  const [coverAnswer, setCoverAnswer] = useState(null);

  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [concept, setConcept] = useState('');

  const [status, setStatus] = useState('');
  const [createdBy, setCreatedBy] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [updatedBy, setUpdatedBy] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  const [approvedBy, setApprovedBy] = useState();
  const [approvedAt, setApprovedAt] = useState();
  const [sentForReviewTo, setSentForReviewTo] = useState();
  const [sentForReviewAt, setSentForReviewAt] = useState();
  const [reviewBackTo, setReviewBackTo] = useState();
  const [reviewBackAt, setReviewBackAt] = useState();
  const [reviewComment, setReviewComment] = useState('');

  const [openDrawer, setOpenDrawer] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newSentReviewBack, setNewSentReviewBack] = useState({});
  const [comment, setComment] = useState('');
  const [allPerson, setAllPerson] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [canDoAction, setCanDoAction] = useState(false);

  const [statusList, setStatusList] = useState([
    { id: 0, type: 'error', title: 'Initialize', active: false },
    { id: 1, type: 'warning', title: 'SentForReview', active: false },
    { id: 2, type: 'error', title: 'ReviewedBack', active: false },
    { id: 3, type: 'info', title: 'Approved', active: false },
    { id: 4, type: 'success', title: 'Active', active: false },
  ]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Question.getQuestion(inComingQuestionId);
        setCanDoAction(inComingQuestionId, user?.$id);

        setQuestion(data?.contentQuestion);
        var fileData = await Question.getQuestionContentForPreview(data?.coverQuestion);
        setCoverQuestion(fileData);

        setOptionA(data?.contentOptionA);
        fileData = await Question.getQuestionContentForPreview(data?.coverOptionA);
        setCoverOptionA(fileData);

        setOptionB(data?.contentOptionB);
        fileData = await Question.getQuestionContentForPreview(data?.coverOptionB);
        setCoverOptionB(fileData);

        setOptionC(data?.contentOptionC);
        fileData = await Question.getQuestionContentForPreview(data?.coverOptionC);
        setCoverOptionC(fileData);

        setOptionD(data?.contentOptionD);
        fileData = await Question.getQuestionContentForPreview(data?.coverOptionD);
        setCoverOptionD(fileData);

        setAnswerOption(data?.answerOption);
        setContentAnswer(data?.contentAnswer);
        fileData = await Question.getQuestionContentForPreview(data?.coverAnswer);
        setCoverAnswer(fileData);

        var tmpData = await Question.getStandardName(data?.standardId);
        setStandard(tmpData);
        tmpData = await Question.getSubjectName(data?.subjectId);
        setSubject(tmpData);
        tmpData = await Question.getChapterName(data?.chapterId);
        setChapter(tmpData);
        tmpData = await Question.getConceptName(data?.conceptId);
        setConcept(tmpData);

        setStatus(data?.status);
        setNewStatus(data?.status);
        if (data?.status === 'Initialize') {
          setStatusList([
            { id: 0, type: 'error', title: 'Initialize', active: true },
            { id: 1, type: 'warning', title: 'SentForReview', active: false },
            { id: 2, type: 'error', title: 'ReviewedBack', active: false },
            { id: 3, type: 'info', title: 'Approved', active: false },
            { id: 4, type: 'success', title: 'Active', active: false },
          ])
        } else if (data?.status === 'SentForReview') {
          setStatusList([
            { id: 0, type: 'error', title: 'Initialize', active: true },
            { id: 1, type: 'warning', title: 'SentForReview', active: true },
            { id: 2, type: 'error', title: 'ReviewedBack', active: false },
            { id: 3, type: 'info', title: 'Approved', active: false },
            { id: 4, type: 'success', title: 'Active', active: false },
          ])
        } else if (data?.status === 'ReviewedBack') {
          setStatusList([
            { id: 0, type: 'error', title: 'Initialize', active: true },
            { id: 1, type: 'warning', title: 'SentForReview', active: true },
            { id: 2, type: 'error', title: 'ReviewedBack', active: true },
            { id: 3, type: 'info', title: 'Approved', active: false },
            { id: 4, type: 'success', title: 'Active', active: false },
          ])
        } else if (data?.status === 'Approved') {
          setStatusList([
            { id: 0, type: 'error', title: 'Initialize', active: true },
            { id: 1, type: 'warning', title: 'SentForReview', active: true },
            { id: 2, type: 'error', title: 'ReviewedBack', active: true },
            { id: 3, type: 'info', title: 'Approved', active: true },
            { id: 4, type: 'success', title: 'Active', active: false },
          ])
        } else {
          setStatusList([
            { id: 0, type: 'error', title: 'Initialize', active: true },
            { id: 1, type: 'warning', title: 'SentForReview', active: true },
            { id: 2, type: 'error', title: 'ReviewedBack', active: true },
            { id: 3, type: 'info', title: 'Approved', active: true },
            { id: 4, type: 'success', title: 'Active', active: true },
          ])
        }
        if (data?.createdBy) {
          setNewSentReviewBack(data?.createdBy);
        }
        setCreatedBy(data?.createdBy);
        setCreatedAt(data?.$createdAt);
        setUpdatedBy(data?.updatedBy);
        setUpdatedAt(data?.$updatedAt);
        setApprovedBy(data?.approvedBy);
        setApprovedAt(data?.approvedAt);
        setSentForReviewTo(data?.sentForReviewTo)
        setSentForReviewAt(data?.sentForReviewAt);
        if (data?.reviewdBackTo) {
          setNewSentReviewBack(data?.reviewdBackTo);
        }
        setReviewBackTo(data?.reviewdBackTo);
        setReviewBackAt(data?.reviewBackAt);
        setReviewComment(data?.reviewComment);

        var tempData = await User.getUserList();
        setAllPerson(tempData);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setError(error.message)
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchData();
  }, [inComingQuestionId, enqueueSnackbar, user])

  const updateData = async () => {
    setUpdating(true);
    console.log(newStatus)
    try {
      if (newStatus === 'Approved') {
        await Question.approveQuestion(inComingQuestionId, user?.$id);
        setApprovedBy(user?.$id);
        setApprovedAt(new Date());
        setUpdatedBy(user?.$id);
        setUpdatedAt(new Date());
      } else if (newStatus === 'ReviewedBack') {
        await Question.reviewBackQuestion(inComingQuestionId, user?.$id, newSentReviewBack?.$id, comment);
        setReviewComment(comment);
        setReviewBackTo(newSentReviewBack?.$id);
        setReviewBackAt(new Date());
        setUpdatedBy(user?.$id);
        setUpdatedAt(new Date());
      } else if (newStatus === 'Active') {
        await Question.activateQuestion(inComingQuestionId, user?.$id, 'Active');
        setUpdatedBy(user?.$id);
        setUpdatedAt(new Date());
      } else {
        enqueueSnackbar('Cannot Update Status', { variant: 'error' });
      }
      setStatus(newStatus);
      if (newStatus === 'Initialize') {
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: false },
          { id: 2, type: 'error', title: 'ReviewedBack', active: false },
          { id: 3, type: 'info', title: 'Approved', active: false },
          { id: 4, type: 'success', title: 'Active', active: false },
        ])
      } else if (newStatus === 'SentForReview') {
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: false },
          { id: 3, type: 'info', title: 'Approved', active: false },
          { id: 4, type: 'success', title: 'Active', active: false },
        ])
      } else if (newStatus === 'ReviewedBack') {
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: true },
          { id: 3, type: 'info', title: 'Approved', active: false },
          { id: 4, type: 'success', title: 'Active', active: false },
        ])
      } else if (newStatus === 'Approved') {
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: true },
          { id: 3, type: 'info', title: 'Approved', active: true },
          { id: 4, type: 'success', title: 'Active', active: false },
        ])
      } else {
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: true },
          { id: 3, type: 'info', title: 'Approved', active: true },
          { id: 4, type: 'success', title: 'Active', active: true },
        ])
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setComment('');
    setUpdating(false);
    setOpenDrawer(false);
  }

  if (isLoading) return (
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
            <Typography variant='h6' sx={{ m: 2 }}>Question</Typography>

            <Paper
              sx={{
                p: 1,
                height: '100%',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={250} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={12} xl={4} lg={4}>
            <Typography variant='h6' sx={{ m: 2 }}>Options</Typography>

            <Paper
              sx={{
                p: 1,
                height: '100%',
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
            <Typography variant='h6' sx={{ m: 2 }}>Answer</Typography>
            <Paper
              sx={{
                p: 1,
                height: '100%',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={250} />
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 9 }} />

        <Box sx={{ textAlign: 'right', m: 2 }}>
        <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={40} />
        </Box>
      </Paper >

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
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
                <Skeleton sx={{ m: 2, pl: 2 }} variant="rounded" height={20} />
              </Grid>

              <Divider orientation="vertical" flexItem />

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
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={6} xl={3} lg={4}>
          <Card>
            <CardHeader
              title='Status'
              action={<IconButton aria-label="Action" disabled={user?.$id !== sentForReviewTo?.$id}
                onClick={() => setOpenDrawer(true)}>
                <Iconify icon="fluent-mdl2:set-action" />
              </IconButton>
              } />

            <CardContent
              sx={{
                '& .MuiTimelineItem-missingOppositeContent:before': {
                  display: 'none',
                },
              }}
            >
              <Timeline>
                {statusList.map((item, index) => (
                  <OrderItem key={item.id} item={item} isLast={index === statusList.length - 1} />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )

  if (error) {
    return (
      <Typography
        variant='subtitle1'
        sx={{ mb: 3 }}
        color='error'
      >
        {error}
      </Typography>
    )
  }

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
            <Typography variant='h6' sx={{ m: 2 }}>Question</Typography>

            <Paper
              sx={{
                p: 1,
                height: '100%',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <ReactKatex>{question}</ReactKatex>
              {coverQuestion &&
                <Image
                  disabledEffect
                  alt='question'
                  src={coverQuestion}
                  sx={{ borderRadius: 1 }}
                />
              }
            </Paper>
          </Grid>

          <Grid item xs={12} md={12} xl={4} lg={4}>
            <Typography variant='h6' sx={{ m: 2 }}>Options</Typography>

            <Paper
              sx={{
                p: 1,
                height: '100%',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Stack direction={'row'}>
                <Typography variant='subtitle2' sx={{ mt: 2, mr: 1 }}>{'(A)'}</Typography>
                <ReactKatex>{optionA}</ReactKatex>
              </Stack>
              {coverOptionA &&
                <Image
                  disabledEffect
                  alt='option A'
                  src={coverOptionA}
                  sx={{ borderRadius: 1, ml: 2 }}
                />
              }
              <Divider sx={{ m: 1 }} />

              <Stack direction={'row'} >
                <Typography variant='subtitle2' sx={{ mt: 2, mr: 1 }}>{'(B)'}</Typography>
                <ReactKatex>{optionB}</ReactKatex>
              </Stack>
              {coverOptionB &&
                <Image
                  disabledEffect
                  alt='option B'
                  src={coverOptionB}
                  sx={{ borderRadius: 1, ml: 2 }}
                />
              }
              <Divider sx={{ m: 1 }} />

              <Stack direction={'row'} >
                <Typography variant='subtitle2' sx={{ mt: 2, mr: 1 }}>{'(C)'}</Typography>
                <ReactKatex>{optionC}</ReactKatex>
              </Stack>
              {coverOptionC &&
                <Image
                  disabledEffect
                  alt='option C'
                  src={coverOptionC}
                  sx={{ borderRadius: 1, ml: 2 }}
                />
              }
              <Divider sx={{ m: 1 }} />

              <Stack direction={'row'}>
                <Typography variant='subtitle2' sx={{ mt: 2, mr: 1 }}>{'(D)'}</Typography>
                <ReactKatex sx={{ ml: 2 }}>{optionD}</ReactKatex>
              </Stack>
              {coverOptionD &&
                <Image
                  disabledEffect
                  alt='option D'
                  src={coverOptionD}
                  sx={{ borderRadius: 1, ml: 2 }}
                />
              }
            </Paper>
          </Grid>

          <Grid item xs={12} md={12} xl={4} lg={4}>
            <Typography variant='h6' sx={{ m: 2 }}>Answer</Typography>
            <Paper
              sx={{
                p: 1,
                height: '100%',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Stack direction='row'>
                <Typography sx={{ mr: 2 }} variant="h6">{"Ans. (" + answerOption + ") "}</Typography>
                <ReactKatex>{contentAnswer || ''}</ReactKatex>
              </Stack>
              {coverAnswer &&
                <Image
                  disabledEffect
                  alt='Answer'
                  src={coverAnswer}
                  sx={{ borderRadius: 1, ml: 2 }}
                />
              }
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 9 }} />

        <Box sx={{ textAlign: 'right', m: 2 }}>
          <Button
            startIcon={<Iconify icon='tabler:edit' />}
            onClick={() => navigate(PATH_DASHBOARD.question.edit(inComingQuestionId))}
          >
            Edit
          </Button>
        </Box>
      </Paper >

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
                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Standard -</Typography>
                  <Typography variant="body2">{standard}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Subject -</Typography>
                  <Typography variant="body2">{subject}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Status -</Typography>
                  <Typography variant="body2">{status}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Created By -</Typography>
                  <SarthakUserDisplayUI userId={createdBy} />
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Created At -</Typography>
                  <Typography variant="body2">{fDate(createdAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Updated By -</Typography>
                  <SarthakUserDisplayUI userId={updatedBy} />
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Updated At -</Typography>
                  <Typography variant="body2">{fDate(updatedAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Approved By -</Typography>
                  <SarthakUserDisplayUI userId={approvedBy} />
                </Stack>
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs>
                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Chapter -</Typography>
                  <Typography variant="body2">{chapter}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Concept -</Typography>
                  <Typography variant="body2">{concept}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Approved At -</Typography>
                  <Typography variant="body2">{fDate(approvedAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Sent For Review To -</Typography>
                  <SarthakUserDisplayUI userId={sentForReviewTo} />
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Sent For Review At -</Typography>
                  <Typography variant="body2">{fDate(sentForReviewAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Review Back To -</Typography>
                  <SarthakUserDisplayUI userId={reviewBackTo} />
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Review Back At -</Typography>
                  <Typography variant="body2">{fDate(reviewBackAt, 'dd/MM/yyyy HH:mm:ss')}</Typography>
                </Stack>

                <Stack direction='row' sx={{ m: 2 }}>
                  <Typography sx={{ mr: 1 }} variant="subtitle2">Review Comment -</Typography>
                  <Typography variant="body2">{reviewComment}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={6} xl={3} lg={4}>
          <Card>
            <CardHeader
              title='Status'
              action={<IconButton aria-label="Action" disabled={!canDoAction}
                onClick={() => setOpenDrawer(true)}>
                <Iconify icon="fluent-mdl2:set-action" />
              </IconButton>
              } />

            <CardContent
              sx={{
                '& .MuiTimelineItem-missingOppositeContent:before': {
                  display: 'none',
                },
              }}
            >
              <Timeline>
                {statusList.map((item, index) => (
                  <OrderItem key={item.id} item={item} isLast={index === statusList.length - 1} />
                ))}
              </Timeline>
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

        <Typography variant="h6" sx={{ m: 4 }}>{"Update Status of question id - " + inComingQuestionId}</Typography>

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

// ----------------------------------------------------------------------

function OrderItem({ item, isLast }) {
  const { type, title, active } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={type}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography color={active ? '' : 'gray'} variant={active ? "h6" : "caption"}>{title}</Typography>
        {active &&
          <Iconify icon='teenyicons:tick-circle-solid' color='#198754' />
        }
      </TimelineContent>
    </TimelineItem>
  );
}