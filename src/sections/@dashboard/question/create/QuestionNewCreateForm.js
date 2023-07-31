import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Grid,
  CardHeader,
  CardContent,
  Card,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Divider,
  Alert,
  Collapse,
  IconButton,
  Dialog,
  Slide,
  Toolbar,
  AppBar,
  Chip,
  Link,
  Skeleton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import { Upload } from '../../../../components/upload';
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import {
  Question, User,
} from '../../../../auth/AppwriteContext';
// Routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// Animation
import { MotionContainer, varFade, varZoom } from '../../../../components/animate';
import { m } from 'framer-motion';
// Latex
import MathInput from "react-math-keyboard";
import 'katex/dist/katex.min.css';
import ReactKatex from '@pkasila/react-katex';

import PermissionDeniedComponent from '../../../_examples/PermissionDeniedComponent';
import { fDate } from '../../../../utils/formatTime';
import Image from '../../../../components/image/Image';

// ----------------------------------------------------------------------

const STEPS = ['Meta data', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Answer'];

// ----------------------------------------------------------------------

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.palette.divider,
  },
}));

// ----------------------------------------------------------------------

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  height: 22,
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  ...(ownerState.active && {
    color: theme.palette.success.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    zIndex: 1,
    fontSize: 18,
    color: theme.palette.success.main,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

// ----------------------------------------------------------------------

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
};

// ----------------------------------------------------------------------

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Iconify
          icon="eva:checkmark-fill"
          className="QontoStepIcon-completedIcon"
          width={24}
          height={24}
        />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

// ----------------------------------------------------------------------

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

export default function QuestionNewCreateForm({ inComingQuestionId }) {

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [content, setContent] = useState('');

  const [questionId, setQuestionId] = useState('');
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

  const [correctOptionA, setCorrectOptionA] = useState(false);
  const [correctOptionB, setCorrectOptionB] = useState(false);
  const [correctOptionC, setCorrectOptionC] = useState(false);
  const [correctOptionD, setCorrectOptionD] = useState(false);

  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [concept, setConcept] = useState('');

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

  const [standardList, setStandardList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [conceptList, setConceptList] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [motionKey, setMotionKey] = useState(0);
  const [motion, setMotion] = useState('fadeInRight');

  const [mathDialogOpen, setMathDialogOpen] = useState(false);
  const [latex, setLatex] = useState("")

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState({ active: false, message: 'This is an error' })

  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (inComingQuestionId) {
          const data = await Question.getQuestion(inComingQuestionId);
          setQuestionId(data?.$id);

          setCanEdit(data?.sentForReviewTo===user?.$id || (data?.status==='Initialize' && data?.createdBy===user?.$id) || ((data?.status==='SentForReview' || data?.status==='ReviewedBack') && data?.reviewdBackTo===user?.$id));

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

          var tmpData = data?.answerOption;
          for (let i in tmpData) {
            if (tmpData[i] === 'A') {
              setCorrectOptionA(true);
            } else if (tmpData[i] === 'B') {
              setCorrectOptionB(true);
            } else if (tmpData[i] === 'C') {
              setCorrectOptionC(true);
            } else if (tmpData[i] === 'D') {
              setCorrectOptionD(true);
            }
          }

          setAnswerOption(data?.answerOption);
          setContentAnswer(data?.contentAnswer);
          fileData = await Question.getQuestionContentForPreview(data?.coverAnswer);
          setCoverAnswer(fileData);

          tmpData = await Question.getStandardName(data?.standardId);
          setStandard(tmpData);
          tmpData = await Question.getSubjectName(data?.subjectId);
          setSubject(tmpData);
          tmpData = await Question.getChapterName(data?.chapterId);
          setChapter(tmpData);
          tmpData = await Question.getConceptName(data?.conceptId);
          setConcept(tmpData);

          setStatus(data?.status);
          if (data?.createdBy) {
            tmpData = await User.getProfileData(data?.createdBy);
            setCreatedBy(tmpData);
          }
          setCreatedAt(data?.$createdAt);
          if (data?.updatedBy) {
            tmpData = await User.getProfileData(data?.updatedBy);
            setUpdatedBy(tmpData);
          }
          setUpdatedAt(data?.$updatedAt);
          if (data?.approvedBy) {
            tmpData = await User.getProfileData(data?.approvedBy);
            setApprovedBy(tmpData);
          }
          setApprovedAt(data?.approvedAt);
          if (data?.sentForReviewTo) {
            tmpData = await User.getProfileData(data?.sentForReviewTo);
            setSentForReviewTo(tmpData);
          }
          setSentForReviewAt(data?.sentForReviewAt);
          if (data?.reviewdBackTo) {
            tmpData = await User.getProfileData(data?.reviewdBackTo);
            setReviewBackTo(tmpData);
          }
          setReviewBackAt(data?.reviewBackAt);
          setReviewComment(data?.reviewComment);
        }
        var dt = await Question.getStandardList();
        setStandardList(dt);
        dt = await Question.getSubjectList()
        setSubjectList(dt);
        dt = await Question.getChapterList()
        setChapterList(dt);
        dt = await Question.getConceptList()
        setConceptList(dt);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setIsLoadingData(false)
    }
    fetchData();
  }, [inComingQuestionId, enqueueSnackbar, user])

  const handleNext = () => {
    if (activeStep === 0) {
      saveMetaData();
    } else if (activeStep === 1) {
      saveQuestion(1);
    } else if (activeStep === 2) {
      saveOptionA(1);
    } else if (activeStep === 3) {
      saveOptionB(1);
    } else if (activeStep === 4) {
      saveOptionC(1);
    } else if (activeStep === 5) {
      saveOptionD(1);
    } else if (activeStep === 6) {
      saveAnswer(1);
    }
  };

  const handleBack = async () => {
    if (activeStep === 1) {
      saveQuestion(-1);
    } else if (activeStep === 2) {
      saveOptionA(-1);
    } else if (activeStep === 3) {
      saveOptionB(-1);
    } else if (activeStep === 4) {
      saveOptionC(-1);
    } else if (activeStep === 5) {
      saveOptionD(-1);
    } else if (activeStep === 6) {
      saveAnswer(-1);
    } else {
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setContent(contentAnswer);
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight')
    }
  };

  const saveMetaData = async () => {
    setIsSaving(true);
    if (standard === null || standard === '') {
      setError({ active: true, message: 'Standard cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    if (subject === null || subject === '') {
      setError({ active: true, message: 'Subject cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    if (chapter === null || chapter === '') {
      setError({ active: true, message: 'Chapter cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    if (concept === null || concept === '') {
      setError({ active: true, message: 'Concept cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const savedQuestion = await Question.uploadMetaDataQuestion(questionId, standard, subject, chapter, concept, user?.$id);
      setQuestionId(savedQuestion?.$id);
      setContent(question);
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight');
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
    setMotionKey(motionKey + 1);
  }

  const saveQuestion = async (direction) => {
    setQuestion(content);
    setIsSaving(true);
    if (content === null || content === '') {
      setError({ active: true, message: 'Question cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadQuestionContent(questionId, content, coverQuestion, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverQuestion);
      setCoverQuestion(fileData);

      if (direction === 1) {
        setContent(optionA);
      } else {
        setContent('');
      }
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight')
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const saveOptionA = async (direction) => {
    setIsSaving(true);
    setOptionA(content);
    if (content === null || content === '') {
      setError({ active: true, message: 'Option A cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadOptionAContent(questionId, content, coverOptionA, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverOptionA);
      setCoverOptionA(fileData);
      if (direction === 1) {
        setContent(optionB);
      } else {
        setContent(question);
      }
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight')
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const saveOptionB = async (direction) => {
    setIsSaving(true);
    setOptionB(content);
    if (content === null || content === '') {
      setError({ active: true, message: 'Option B cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadOptionBContent(questionId, content, coverOptionB, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverOptionB);
      setCoverOptionB(fileData);
      if (direction === 1) {
        setContent(optionC);
      } else {
        setContent(optionA);
      }
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight')
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const saveOptionC = async (direction) => {
    setIsSaving(true);
    setOptionC(content);
    if (content === null || content === '') {
      setError({ active: true, message: 'Option C cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadOptionCContent(questionId, content, coverOptionC, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverOptionC);
      setCoverOptionC(fileData);
      if (direction === 1) {
        setContent(optionD);
      } else {
        setContent(optionB);
      }
      setMotionKey(motionKey + 1)
      setMotion('zoomOut')
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2)
      setMotion('fadeInRight')
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const saveOptionD = async (direction) => {
    setIsSaving(true);
    setOptionD(content);
    if (content === null || content === '') {
      setError({ active: true, message: 'Option D cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadOptionDContent(questionId, content, coverOptionD, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverOptionD);
      setCoverOptionD(fileData);
      if (direction === 1) {
        setContent(contentAnswer);
      } else {
        setContent(optionC);
      }
      setMotionKey(motionKey + 1);
      setMotion('zoomOut');
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2);
      setMotion('fadeInRight');
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const saveAnswer = async (direction) => {
    setIsSaving(true);
    setContentAnswer(content);
    var tmp = '';
    if (correctOptionA) tmp += 'A';
    if (correctOptionB) tmp += 'B';
    if (correctOptionC) tmp += 'C';
    if (correctOptionD) tmp += 'D';
    setAnswerOption(tmp);
    if (content === null || content === '') {
      setError({ active: true, message: 'Answer cannot be empty. — check it out!' });
      setIsSaving(false);
      return false;
    }
    try {
      const data = await Question.uploadAnswerContent(questionId, tmp, content, coverAnswer, user?.$id);
      const fileData = await Question.getQuestionContentForPreview(data?.coverAnswer);
      setCoverAnswer(fileData);
      if (direction === 1) {
        setContent('');
      } else {
        setContent(optionD);
      }
      setMotionKey(motionKey + 1);
      setMotion('zoomOut');
      setActiveStep((prevActiveStep) => prevActiveStep + direction);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMotionKey(motionKey + 2);
      setMotion('fadeInRight');
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  }

  const onSubmit = async () => {
    setIsSaving(true);
    try {
      await Question.sendForApproval(questionId, user?.$id);
      enqueueSnackbar('Successfully Sent for Approval');
      navigate(PATH_DASHBOARD.question.view(questionId))
    } catch (error) {
      setError({ active: true, message: error.message });
    }
    setIsSaving(false);
  };

  const handleDropQuestion = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverQuestion(newFile)
      }
    },
    [setCoverQuestion]
  );

  const handleDropOptionA = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionA(newFile)
      }
    },
    [setCoverOptionA]
  );

  const handleDropOptionB = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionB(newFile);
      }
    },
    [setCoverOptionB]
  );

  const handleDropOptionC = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionC(newFile);
      }
    },
    [setCoverOptionC]
  );

  const handleDropOptionD = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionD(newFile);
      }
    },
    [setCoverOptionD]
  );

  const handleDropAnswer = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverAnswer(newFile);
      }
    },
    [setCoverAnswer]
  );

  if (isLoadingData) {
    return (
      <>
        {inComingQuestionId &&
          <>
            <Divider>
              <Chip label='Meta Data Section' />
            </Divider>
            <Paper
              sx={{
                p: 1,
                my: 1,
                minHeight: 250,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >

              <Grid container>
                <Grid item xs>
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item xs>
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                  <Skeleton sx={{ m: 2 }} />
                </Grid>
              </Grid>

            </Paper>
          </>
        }

        <Divider>
          <Chip label='Edit Section' />
        </Divider>

        <Paper
          sx={{
            p: 1,
            my: 1,
            minHeight: 400,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Grid container>
            <Grid item xs>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={60} />
              <Divider />
              <Skeleton sx={{ m: 2 }} height={30} width={150} />
              <Skeleton sx={{ m: 2 }} />

              <Box sx={{ textAlign: 'right', mt: 2, mb: 2 }}>
                <Skeleton sx={{ m: 2 }} height={50} width={150} />
              </Box>

              <Skeleton sx={{ m: 2 }} variant="rounded" height={100} />

              <Divider />

              <Grid container>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Box sx={{ textAlign: 'left', mt: 1 }}>
                    <Skeleton sx={{ m: 2 }} height={50} width={150} />
                  </Box>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Box sx={{ textAlign: 'right', mt: 1 }}>
                    <Skeleton sx={{ m: 2 }} height={50} width={150} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs>
              <Card>
                <CardContent>
                  <Skeleton sx={{ m: 2 }} height={30} width={100} />
                  <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
                  <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
                  <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
                  <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
                  <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }

  if (!canEdit) {
    return <PermissionDeniedComponent />
  }

  return (
    <>
      {inComingQuestionId &&
        <>
          <Divider>
            <Chip label='Meta Data Section' />
          </Divider>

          <Paper
            sx={{
              p: 1,
              my: 1,
              minHeight: 120,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Grid container>
              <Grid item xs>
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
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid item xs>
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
              </Grid>
            </Grid>
          </Paper>
        </>
      }

      <Divider>
        <Chip label='Edit Section' />
      </Divider>

      <Paper
        sx={{
          p: 1,
          my: 1,
          minHeight: 120,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
      >

        <Grid container spacing={4}>
          <Grid item xs>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} >
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ m: 1 }} />

            <Typography variant='h6' sx={{ m: 1 }}>
              Editor Playground
            </Typography>

            <Typography variant='subtitle2' sx={{ m: 1 }}>
              Use this editor to insert in the box of question and options
            </Typography>

            <Box sx={{ textAlign: 'right', mt: 2, mb: 2 }}>
              <Button
                sx={{ mr: 1 }}
                onClick={() => setMathDialogOpen(true)}
                color='info'
                variant='outlined'
                disabled={activeStep === 0 || activeStep === 7}
                startIcon={<Iconify icon="tabler:math" />}
              >
                Math
              </Button>
            </Box>

            <TextField
              id="outlined-textarea"
              placeholder="Type here......."
              multiline
              fullWidth
              rows={5}
              maxRows={10}
              variant="filled"
              disabled={activeStep === 0 || activeStep === 7}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            <Dialog
              fullScreen
              open={mathDialogOpen}
              onClose={() => setMathDialogOpen(false)}
              TransitionComponent={Transition}
            >
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setMathDialogOpen(false)}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Math Editor
                  </Typography>
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={() => {
                      if (latex !== '') {
                        setContent(content + ' $' + latex + '$');
                      }
                      setLatex('');
                      setMathDialogOpen(false);

                    }}>
                    save
                  </Button>
                </Toolbar>
              </AppBar>
              <MathInput setValue={setLatex} />
            </Dialog>

            <Box sx={{ textAlign: 'right', mt: 2, mb: 2 }}>
              <Button
                disabled={content === '' || activeStep === 0 || activeStep === 7}
                sx={{ mr: 1 }}
                onClick={() => setContent('')}
                startIcon={<Iconify icon="mdi:clear-outline" />}
              >
                Clear
              </Button>
            </Box>

            <Divider />

            <Grid container>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>

                <Box sx={{ textAlign: 'left', mt: 1 }}>
                  <LoadingButton
                    disabled={activeStep === 0}
                    variant="contained"
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    loading={isSaving}
                    startIcon={<Iconify icon="mingcute:back-fill" />}
                  >
                    Back
                  </LoadingButton>
                </Box>

              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  {activeStep === STEPS.length ?
                    <LoadingButton
                      variant="contained"
                      sx={{ mr: 1 }}
                      endIcon={<Iconify icon="iconoir:submit-document" />}
                      loading={isSaving}
                      color='warning'
                      onClick={onSubmit}
                    >
                      Submit For Approval
                    </LoadingButton>
                    :
                    <LoadingButton
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                      endIcon={<Iconify icon="carbon:next-outline" />}
                      color='success'
                      loading={isSaving}
                    >
                      Proceed to Next Step
                    </LoadingButton>
                  }
                </Box>
              </Grid>
            </Grid>

            <Collapse in={error?.active}>
              <Divider sx={{ m: 1 }} />

              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setError({ active: false });
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error?.message}
              </Alert>
            </Collapse>
          </Grid>

          <Grid item xs>
            <Card>
              <CardHeader title={activeStep === 7 ? 'Preview' : STEPS[activeStep]} />

              <CardContent sx={{mt: 2}}>
                <MotionContainer component={m.body} variants={getVariant(motion)}>
                  <Grid container spacing={3} key={motionKey} sx={{ p: 1, display: activeStep === 0 ? 'block' : 'none' }}>

                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        disabled
                        value={questionId}
                        label='ID'
                        helperText='ID is automatically generated by the system.'
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        fullWidth
                        freeSolo
                        autoSelect
                        autoComplete
                        value={standard}
                        loading={isLoadingData}
                        options={standardList}
                        onChange={(event, value) => {
                          setStandard(value?.$id ? value?.name : value);
                        }}
                        getOptionLabel={(option) => option?.name || option}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            {option?.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Standard" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        fullWidth
                        freeSolo
                        autoSelect
                        autoComplete
                        value={subject}
                        loading={isLoadingData}
                        options={subjectList}
                        onChange={(event, value) => {
                          setSubject(value?.$id ? value?.name : value);
                        }}
                        getOptionLabel={(option) => option?.name || option}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            {option?.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Subject" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        fullWidth
                        freeSolo
                        autoSelect
                        autoComplete
                        value={chapter}
                        loading={isLoadingData}
                        options={chapterList}
                        onChange={(event, value) => {
                          setChapter(value?.$id ? value?.name : value);
                        }}
                        getOptionLabel={(option) => option?.name || option}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            {option?.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Chapter" />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        fullWidth
                        freeSolo
                        autoSelect
                        autoComplete
                        value={concept}
                        loading={isLoadingData}
                        filterSelectedOptions
                        options={conceptList}
                        onChange={(event, value) => {
                          setConcept(value?.$id ? value?.name : value);
                        }}
                        getOptionLabel={(option) => option?.name || option}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            {option?.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Concept" />
                        )}
                      />
                    </Grid>
                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>
                    <Grid item xs={12} md={12}>
                      <Paper
                        sx={{
                          p: 1,
                          my: 1,
                          minHeight: 100,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        }}
                      >
                        <ReactKatex>{content}</ReactKatex>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverQuestion}
                          maxSize={15360}
                          onDrop={handleDropQuestion}
                          onDelete={() => {
                            setCoverQuestion(null);
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>
                    <Grid item xs={12} md={12}>
                      <Paper
                        sx={{
                          p: 1,
                          my: 1,
                          minHeight: 100,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        }}
                      >
                        <ReactKatex>{content}</ReactKatex>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverOptionA}
                          maxSize={15360}
                          onDrop={handleDropOptionA}
                          onDelete={() => {
                            setCoverOptionA(null);
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 3 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>

                    <Grid item xs={12} md={12}>
                      <Paper
                        sx={{
                          p: 1,
                          my: 1,
                          minHeight: 100,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        }}
                      >
                        <ReactKatex>{content}</ReactKatex>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverOptionB}
                          maxSize={15360}
                          onDrop={handleDropOptionB}
                          onDelete={() => {
                            setCoverOptionB(null)
                          }}
                        />
                      </Stack>
                    </Grid>

                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 4 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>

                    <Grid item xs={12} md={12}>
                      <Paper
                        sx={{
                          p: 1,
                          my: 1,
                          minHeight: 100,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        }}
                      >
                        <ReactKatex>{content}</ReactKatex>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverOptionC}
                          maxSize={15360}
                          onDrop={handleDropOptionC}
                          onDelete={() => {
                            setCoverOptionC(null)
                          }}
                        />
                      </Stack>
                    </Grid>

                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 5 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>
                    <Grid item xs={12} md={12}>
                      <Paper
                        sx={{
                          p: 1,
                          my: 1,
                          minHeight: 100,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        }}
                      >
                        <ReactKatex>{content}</ReactKatex>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverOptionD}
                          maxSize={15360}
                          onDrop={handleDropOptionD}
                          onDelete={() => {
                            setCoverOptionD(null)
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 6 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Select Correct Options
                        </Typography>
                        <Paper
                          sx={{
                            p: 1,
                            my: 1,
                            minHeight: 50,
                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                          }}
                        >
                          <FormControlLabel control={<Checkbox checked={correctOptionA} onChange={() => setCorrectOptionA(!correctOptionA)} />} label="Option A" />
                          <FormControlLabel control={<Checkbox checked={correctOptionB} onChange={() => setCorrectOptionB(!correctOptionB)} />} label="Option B" />
                          <FormControlLabel control={<Checkbox checked={correctOptionC} onChange={() => setCorrectOptionC(!correctOptionC)} />} label="Option C" />
                          <FormControlLabel control={<Checkbox checked={correctOptionD} onChange={() => setCorrectOptionD(!correctOptionD)} />} label="Option D" />
                        </Paper>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Explanation
                        </Typography>
                        <Paper
                          sx={{
                            p: 1,
                            my: 1,
                            minHeight: 100,
                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                          }}
                        >
                          <ReactKatex>{content}</ReactKatex>
                        </Paper>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Upload Image If Required
                        </Typography>

                        <Upload
                          accept={{ 'image/*': [] }}
                          file={coverAnswer}
                          maxSize={15360}
                          onDrop={handleDropAnswer}
                          onDelete={() => {
                            setCoverAnswer(null)
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MotionContainer>

                <MotionContainer component={m.body} variants={getVariant(motion)} sx={{ display: activeStep === 7 ? 'block' : 'none' }}>
                  <Grid sx={{ p: 1 }} container spacing={3} key={motionKey}>
                    <Grid item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} variant="h5">Q.</Typography>
                        <ReactKatex>{question}</ReactKatex>
                      </Stack>
                      {coverQuestion &&
                        <Image
                          disabledEffect
                          alt='Question'
                          src={coverQuestion}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>

                    <Grid sx={{ ml: 3 }} item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} >A.</Typography>
                        <ReactKatex>{optionA}</ReactKatex>
                      </Stack>
                      {coverOptionA &&
                        <Image
                          disabledEffect
                          alt='Option A'
                          src={coverOptionA}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>

                    <Grid sx={{ ml: 3 }} item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} >B.</Typography>
                        <ReactKatex>{optionB}</ReactKatex>
                      </Stack>
                      {coverOptionB &&
                        <Image
                          disabledEffect
                          alt='Option B'
                          src={coverOptionB}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>

                    <Grid sx={{ ml: 3 }} item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} >C.</Typography>
                        <ReactKatex>{optionC}</ReactKatex>
                      </Stack>
                      {coverOptionC &&
                        <Image
                          disabledEffect
                          alt='Option C'
                          src={coverOptionC}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>

                    <Grid sx={{ ml: 3 }} item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} >D.</Typography>
                        <ReactKatex>{optionD}</ReactKatex>
                      </Stack>
                      {coverOptionD &&
                        <Image
                          disabledEffect
                          alt='Option D'
                          src={coverOptionD}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>

                    <Divider />

                    <Grid item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} variant="h5">Correct Option -</Typography>
                        <Typography sx={{ mr: 1 }} variant="h5">{correctOptionA ? 'A' : ''}</Typography>
                        <Typography sx={{ mr: 1 }} variant="h5">{correctOptionB ? 'B' : ''}</Typography>
                        <Typography sx={{ mr: 1 }} variant="h5">{correctOptionC ? 'C' : ''}</Typography>
                        <Typography sx={{ mr: 1 }} variant="h5">{correctOptionD ? 'D' : ''}</Typography>
                      </Stack>
                    </Grid>

                    <Grid sx={{ ml: 3 }} item xs={12} md={12}>
                      <Stack direction='row'>
                        <Typography sx={{ mr: 2 }} >Answer Explanation -</Typography>
                        <ReactKatex>{contentAnswer}</ReactKatex>
                      </Stack>
                      {coverAnswer &&
                        <Image
                          disabledEffect
                          alt='Answer'
                          src={coverAnswer}
                          sx={{ borderRadius: 1, ml: 2, mt: 1, width: 300 }}
                        />
                      }
                    </Grid>
                  </Grid>
                </MotionContainer>

              </CardContent>
            </Card>
          </Grid>
        </Grid >
      </Paper >
    </>
  );
}

// ----------------------------------------------------------------------

function getVariant(variant) {
  return {
    fadeInLeft: varFade().inLeft,
    fadeInRight: varFade().inRight,
    zoomOut: varZoom().out,
  }[variant];
}