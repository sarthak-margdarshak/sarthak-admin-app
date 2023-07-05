import { useEffect, useState } from 'react';
// sections
import { QuestionNewCreateForm } from '../../../../sections/@dashboard/question/create';
// Auth
import { Question, User } from '../../../../auth/AppwriteContext';
// @mui
import { Box, Card, CardActions, CardContent, CardHeader, FormControlLabel, Grid, LinearProgress, Paper, Switch, Typography } from '@mui/material';
// components
import { useSnackbar } from '../../../../components/snackbar';
import QuestionViewComponent from '../view/QuestionViewComponent';
import { LoadingButton, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import Iconify from '../../../../components/iconify/Iconify';
import { fDate } from '../../../../utils/formatTime';
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function QuestionEditForm({ questionId, purpose }) {

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [concept, setConcept] = useState('');
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
  const [editedBy, setEditedBy] = useState('');

  const [createdByID, setCreatedByID] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [reviewdBackTo, setReviewdBackTo] = useState('');

  const [statusList, setStatusList] = useState([
    { id: 0, type: 'error', title: 'Initialize', active: false },
    { id: 1, type: 'warning', title: 'SentForReview', active: false },
    { id: 2, type: 'error', title: 'ReviewedBack', active: false },
    { id: 3, type: 'info', title: 'Approved', active: false },
    { id: 4, type: 'success', title: 'Active', active: false },
  ]);

  const [canApprove, setCanApprove] = useState(false);
  const [canActivate, setCanActivate] = useState(false);
  const [status, setStatus] = useState('');

  const [loadStatus, setLoadStatus] = useState({ value: 0, status: 'Editor is starting...' })
  const [error, setError] = useState(null);

  const [isApproving, setIsApproving] = useState(false);
  const [isUpdatingActiveStatus, setIsUpdatingActiveStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempQuestion = await Question.getQuestion(questionId);
        setLoadStatus({ value: 5, status: 'Question Metadata loading...' })

        var tempStatus = [];
        if (tempQuestion?.status === 'Initialize') {
          tempStatus.push({ id: 0, type: 'error', title: 'Initialize', active: true });
          tempStatus.push({ id: 1, type: 'warning', title: 'SentForReview', active: false });
          tempStatus.push({ id: 2, type: 'error', title: 'ReviewedBack', active: false });
          tempStatus.push({ id: 3, type: 'info', title: 'Approved', active: false });
          tempStatus.push({ id: 4, type: 'success', title: 'Active', active: false });
        } else {
          tempStatus.push({ id: 0, type: 'error', title: 'Initialize', active: true });
          if (tempQuestion?.status === 'SentForReview') {
            tempStatus.push({ id: 1, type: 'warning', title: 'SentForReview', active: true });
            tempStatus.push({ id: 2, type: 'error', title: 'ReviewedBack', active: false });
            tempStatus.push({ id: 3, type: 'info', title: 'Approved', active: false });
            tempStatus.push({ id: 4, type: 'success', title: 'Active', active: false });
          } else {
            tempStatus.push({ id: 1, type: 'warning', title: 'SentForReview', active: true });
            if (tempQuestion?.status === 'ReviewedBack') {
              tempStatus.push({ id: 2, type: 'error', title: 'ReviewedBack', active: true });
              tempStatus.push({ id: 3, type: 'info', title: 'Approved', active: false });
              tempStatus.push({ id: 4, type: 'success', title: 'Active', active: false });
            } else {
              tempStatus.push({ id: 2, type: 'error', title: 'ReviewedBack', active: true });
              if (tempQuestion?.status === 'Approved') {
                tempStatus.push({ id: 3, type: 'info', title: 'Approved', active: true });
                tempStatus.push({ id: 4, type: 'success', title: 'Active', active: false });
              } else {
                tempStatus.push({ id: 3, type: 'info', title: 'Approved', active: true });
                tempStatus.push({ id: 4, type: 'success', title: 'Active', active: true });
              }
            }
          }
        }
        setStatusList(tempStatus);

        if (tempQuestion?.status === 'SentForReview' && tempQuestion?.sentForReviewTo === user?.$id) {
          setCanApprove(true);
        }

        if ((tempQuestion?.status === 'Approved' || tempQuestion?.status === 'Active') && tempQuestion?.approvedBy === user?.$id) {
          setCanActivate(true);
        }

        setEditedBy(tempQuestion?.updatedBy)
        setStatus(tempQuestion?.status)
        setReviewdBackTo(tempQuestion?.setReviewdBackTo)

        var data = await Question.getStandardName(tempQuestion?.standardId);
        setStandard(data);
        setLoadStatus({ value: 10, status: 'Question Metadata loading...' })

        setCreatedByID(tempQuestion?.createdBy);
        data = (await User.getProfileData(tempQuestion?.createdBy)).name;
        setCreatedBy(data);
        setCreatedAt(fDate(tempQuestion?.$createdAt));

        data = (await User.getProfileData(tempQuestion?.updatedBy)).name;
        setUpdatedBy(data);
        setUpdatedAt(fDate(tempQuestion?.$updatedAt));

        data = await Question.getSubjectName(tempQuestion?.subjectId);
        setSubject(data);
        setLoadStatus({ value: 15, status: 'Question Metadata loading...' })

        data = await Question.getChapterName(tempQuestion?.chapterId);
        setChapter(data);
        setLoadStatus({ value: 20, status: 'Question Metadata loading...' })

        data = await Question.getConceptName(tempQuestion?.conceptId);
        setConcept(data);
        setLoadStatus({ value: 25, status: 'Question content loading...' })

        data = await Question.getQuestionContent(tempQuestion?.question);
        setLoadStatus({ value: 30, status: 'Reading Question content...' })
        data = await (await fetch(data)).text();
        setQuestion(data);
        setLoadStatus({ value: 35, status: 'Question content image loading...' })

        data = await Question.getQuestionContentForPreview(tempQuestion?.coverQuestion);
        setCoverQuestion(data);
        setLoadStatus({ value: 40, status: 'Option A content loading...' })

        data = await Question.getQuestionContent(tempQuestion?.optionA);
        setLoadStatus({ value: 45, status: 'Option A content reading...' })
        data = await (await fetch(data)).text();
        setOptionA(data);
        setLoadStatus({ value: 50, status: 'Option A image loading...' })

        data = await Question.getQuestionContentForPreview(tempQuestion?.coverOptionA);
        setCoverOptionA(data);
        setLoadStatus({ value: 55, status: 'Option B content loading...' })

        data = await Question.getQuestionContent(tempQuestion?.optionB);
        setLoadStatus({ value: 60, status: 'Option B content reading...' })
        data = await (await fetch(data)).text();
        setOptionB(data);
        setLoadStatus({ value: 65, status: 'Option B image loading...' })

        data = await Question.getQuestionContentForPreview(tempQuestion?.coverOptionB);
        setCoverOptionB(data);
        setLoadStatus({ value: 70, status: 'Option C content loading...' })

        data = await Question.getQuestionContent(tempQuestion?.optionC);
        setLoadStatus({ value: 75, status: 'Option C content reading...' })
        data = await (await fetch(data)).text();
        setOptionC(data);
        setLoadStatus({ value: 80, status: 'Option C image loading...' })

        data = await Question.getQuestionContentForPreview(tempQuestion?.coverOptionC);
        setCoverOptionC(data);
        setLoadStatus({ value: 85, status: 'Option D content loading...' })

        data = await Question.getQuestionContent(tempQuestion?.optionD);
        setLoadStatus({ value: 90, status: 'Option D content reading...' })
        data = await (await fetch(data)).text();
        setOptionD(data);
        setLoadStatus({ value: 95, status: 'Option D image loading...' })

        data = await Question.getQuestionContentForPreview(tempQuestion?.coverOptionD);
        setCoverOptionD(data);
        setLoadStatus({ value: 100, status: 'Finished...' })
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setError(error.message)
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchData();
  }, [questionId, enqueueSnackbar, user])

  const metaData = {
    id: questionId,
    standard: standard,
    subject: subject,
    chapter: chapter,
    concept: concept,
    question: question,
    coverQuestion: coverQuestion,
    optionA: optionA,
    coverOptionA: coverOptionA,
    optionB: optionB,
    coverOptionB: coverOptionB,
    optionC: optionC,
    coverOptionC: coverOptionC,
    optionD: optionD,
    coverOptionD: coverOptionD,
    editedBy: editedBy,
    status: status,
    reviewdBackTo: reviewdBackTo,
  }

  const reviewBack = async () => {
    setIsApproving(true);
    try {
      await Question.reviewBackQuestion(questionId, user?.$id, createdByID);
      setCanApprove(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsApproving(false);
  }

  const approveQuestion = async () => {
    setIsApproving(true);
    try {
      await Question.approveQuestion(questionId, user?.$id);
      setStatusList([
        { id: 0, type: 'error', title: 'Initialize', active: true },
        { id: 1, type: 'warning', title: 'SentForReview', active: true },
        { id: 2, type: 'error', title: 'ReviewedBack', active: true },
        { id: 3, type: 'info', title: 'Approved', active: true },
        { id: 4, type: 'success', title: 'Active', active: false },
      ]);
      setCanActivate(true);
      setCanApprove(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsApproving(false);
  }

  const updateActive = async (checked) => {
    setIsUpdatingActiveStatus(true);
    try {
      if (checked) {
        await Question.activateQuestion(questionId, user?.$id, 'Active');
        setStatus('Active');
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: true },
          { id: 3, type: 'info', title: 'Approved', active: true },
          { id: 4, type: 'success', title: 'Active', active: true },
        ]);
      } else {
        await Question.activateQuestion(questionId, user?.$id, 'Approved');
        setStatus('Approved');
        setStatusList([
          { id: 0, type: 'error', title: 'Initialize', active: true },
          { id: 1, type: 'warning', title: 'SentForReview', active: true },
          { id: 2, type: 'error', title: 'ReviewedBack', active: true },
          { id: 3, type: 'info', title: 'Approved', active: true },
          { id: 4, type: 'success', title: 'Active', active: false },
        ]);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsUpdatingActiveStatus(false);
  }

  if (isLoading) return (
    <>
      <Typography
        variant='subtitle1'
        sx={{ mb: 3 }}
      >
        Editor is being started. This may take a while. Please Wait.
      </Typography>

      <Typography
        variant='subtitle2'
        sx={{ mb: 3 }}
      >
        {loadStatus?.status}
      </Typography>

      <LinearProgress variant='determinate' value={loadStatus?.value} />
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
      {
        purpose === 'edit' ?
          <QuestionNewCreateForm metaData={metaData} /> :
          <>
            <QuestionViewComponent metaData={metaData} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} xl={3} lg={4}>
                <Card>
                  <CardHeader title='Status' />

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
                  <CardActions>
                    {canActivate &&
                      <FormControlLabel
                        control={
                          <Switch
                            checked={status === 'Active'}
                            disabled={isUpdatingActiveStatus}
                            onChange={(event, checked) => {
                              updateActive(checked);
                            }}
                          />
                        }
                        label="Activate"
                      />
                    }

                    {canApprove &&
                      <LoadingButton
                        variant="outlined"
                        startIcon={<Iconify icon="mdi:file-revert" />}
                        sx={{ mr: 2 }}
                        onClick={reviewBack}
                        loading={isApproving}
                      >
                        Review Back
                      </LoadingButton>
                    }
                    {canApprove &&
                      <LoadingButton
                        variant="contained"
                        endIcon={<Iconify icon="mdi:approve" />}
                        color='success'
                        onClick={approveQuestion}
                        loading={isApproving}
                      >
                        Approve
                      </LoadingButton>
                    }
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs={12} sm={12} md={6} xl={9} lg={8}>
                <Card>
                  <CardHeader title='Meta data' />

                  <CardContent>
                    <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
                      <Paper key='standard' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="healthicons:i-training-class" color="#1877F2" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          Standard
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {standard}
                        </Typography>
                      </Paper>

                      <Paper key='subject' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="ic:round-subject" color="#FF0000" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          Subject
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {subject}
                        </Typography>
                      </Paper>

                      <Paper key='chapter' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="grommet-icons:chapter-add" color="#FFA500" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          Chapter
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {chapter}
                        </Typography>
                      </Paper>

                      <Paper key='concept' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="icon-park-solid:concept-sharing" color="#FFFF00" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          Concept
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {concept}
                        </Typography>
                      </Paper>

                      <Paper key='concept' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write" color="#457812" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          {createdBy}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {createdAt}
                        </Typography>
                      </Paper>

                      <Paper key='concept' variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                        <Iconify icon="la:user-cog" color="#FFC0CB" width={32} />

                        <Typography variant="h6" sx={{ mt: 0.5 }}>
                          {updatedBy}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {updatedAt}
                        </Typography>
                      </Paper>

                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
      }
    </>
  );
}

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