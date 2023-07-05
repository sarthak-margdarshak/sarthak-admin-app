import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
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
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import { Upload } from '../../../../components/upload';
// Froala Editor
import FroalaEditorComponent from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// Auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import {
  Question,
} from '../../../../auth/AppwriteContext';
import PermissionDeniedComponent from '../../../_examples/PermissionDeniedComponent';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const STEPS = ['Meta data', 'Question', 'Option A', 'Option B', 'Option C', 'Option D'];

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

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
};

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

export default function QuestionNewCreateForm({ metaData }) {

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [content, setContent] = useState('');

  const [questionId, setquestionId] = useState(metaData?.id || '');

  const [question, setQuestion] = useState(metaData?.question || '');
  const [coverQuestion, setCoverQuestion] = useState(metaData?.coverQuestion || null);
  const [optionA, setOptionA] = useState(metaData?.optionA || '');
  const [coverOptionA, setCoverOptionA] = useState(metaData?.coverOptionA || null);
  const [optionB, setOptionB] = useState(metaData?.optionB || '');
  const [coverOptionB, setCoverOptionB] = useState(metaData?.coverOptionB || null);
  const [optionC, setOptionC] = useState(metaData?.optionC || '');
  const [coverOptionC, setCoverOptionC] = useState(metaData?.coverOptionC || null);
  const [optionD, setOptionD] = useState(metaData?.optionD || '');
  const [coverOptionD, setCoverOptionD] = useState(metaData?.coverOptionD || null);

  const [standard, setStandard] = useState(metaData?.standard || '');
  const [subject, setSubject] = useState(metaData?.subject || '');
  const [chapter, setChapter] = useState(metaData?.chapter || '');
  const [concept, setConcept] = useState(metaData?.concept || '');

  const [standardList, setStandardList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [conceptList, setConceptList] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isMetaDataSaving, setIsMetaDataSaving] = useState(false);
  const [isMetaDataUpdated, setIsMetaDataUpdated] = useState(false);

  const [isQuestionSaving, setIsQuestionSaving] = useState(false);
  const [isQuestionUpdated, setIsQuestionUpdated] = useState(false);

  const [isOptionASaving, setIsOptionASaving] = useState(false);
  const [isOptionAUpdated, setIsOptionAUpdated] = useState(false);

  const [isOptionBSaving, setIsOptionBSaving] = useState(false);
  const [isOptionBUpdated, setIsOptionBUpdated] = useState(false);

  const [isOptionCSaving, setIsOptionCSaving] = useState(false);
  const [isOptionCUpdated, setIsOptionCUpdated] = useState(false);

  const [isOptionDSaving, setIsOptionDSaving] = useState(false);
  const [isOptionDUpdated, setIsOptionDUpdated] = useState(false);

  const [canEdit] = useState(!metaData || ((metaData?.status === 'Initialize' && user?.$id === metaData?.editedBy) || (metaData?.status === 'ReviewedBack' || user?.$id === metaData?.reviewdBackTo)));

  const formData = {
    questionId: questionId,
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
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        var data = await Question.getStandardList();
        setStandardList(data);
        data = await Question.getSubjectList()
        setSubjectList(data);
        data = await Question.getChapterList()
        setChapterList(data);
        data = await Question.getConceptList()
        setConceptList(data);
        setIsLoadingData(false)
      } catch (error) {
        setIsLoadingData(false)
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    fetchData();
  }, [metaData, enqueueSnackbar])

  const froalaConfig = {
    placeholderText: 'Type  Something',
    toolbarButtons: [
      ['undo', 'redo'], '|',
      ['fullscreen'], '|',
      ['bold', 'italic', 'underline'], '|',
      ['alignLeft', 'alignCenter', 'alignRight'], '|',
      ['wirisEditor', 'wirisChemistry']
    ],
    imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
    quickInsertButtons: ['embedly', 'table', 'ul', 'ol', 'hr'],
    htmlAllowedTags: ['.*'],
    htmlAllowedAttrs: ['.*'],
    htmlAllowedEmptyTags: ['mprescripts', 'none'],
    theme: 'dark',
    attribution: false,
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (formData?.standard === null || formData?.standard === '') {
        enqueueSnackbar('Standard cannot be empty.', { variant: 'error' });
        return false;
      }
      if (formData?.subject === null || formData?.subject === '') {
        enqueueSnackbar('Subject cannot be empty.', { variant: 'error' });
        return false;
      }
      if (formData?.chapter === null || formData?.chapter === '') {
        enqueueSnackbar('Chapter cannot be empty.', { variant: 'error' });
        return false;
      }
      if (formData?.concept === null || formData?.concept === '') {
        enqueueSnackbar('Concept cannot be empty.', { variant: 'error' });
        return false;
      }
      setContent(question);
    } else if (activeStep === 1) {
      if (formData?.question === null || formData?.question === '') {
        enqueueSnackbar('Question cannot be empty.', { variant: 'error' });
        return false;
      }
      setContent(optionA);
    } else if (activeStep === 2) {
      if (formData?.optionA === null || formData?.optionA === '') {
        enqueueSnackbar('Option A cannot be empty.', { variant: 'error' });
        return false;
      }
      setContent(optionB);
    } else if (activeStep === 3) {
      if (formData?.optionB === null || formData?.optionB === '') {
        enqueueSnackbar('Option B cannot be empty.', { variant: 'error' });
        return false;
      }
      setContent(optionC);
    } else if (activeStep === 4) {
      if (formData?.optionC === null || formData?.optionC === '') {
        enqueueSnackbar('Option C cannot be empty.', { variant: 'error' });
        return false;
      }
      setContent(optionD);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setContent(question);
    } else if (activeStep === 3) {
      setContent(optionA);
    } else if (activeStep === 4) {
      setContent(optionB);
    } else if (activeStep === 5) {
      setContent(optionC);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInsert = () => {
    if (activeStep === 1) {
      setIsQuestionUpdated(true);
      setQuestion(updateMathContent(content));
    } else if (activeStep === 2) {
      setIsOptionAUpdated(true);
      setOptionA(updateMathContent(content));
    } else if (activeStep === 3) {
      setIsOptionBUpdated(true);
      setOptionB(updateMathContent(content));
    } else if (activeStep === 4) {
      setIsOptionCUpdated(true);
      setOptionC(updateMathContent(content));
    } else {
      setIsOptionDUpdated(true);
      setOptionD(updateMathContent(content));
    }
  };

  const saveMetaData = async () => {
    setIsMetaDataSaving(true);
    if (formData?.standard === null || formData?.standard === '') {
      enqueueSnackbar('Standard cannot be empty.', { variant: 'error' });
      setIsMetaDataSaving(false);
      return false;
    }
    if (formData?.subject === null || formData?.subject === '') {
      enqueueSnackbar('Subject cannot be empty.', { variant: 'error' });
      setIsMetaDataSaving(false);
      return false;
    }
    if (formData?.chapter === null || formData?.chapter === '') {
      enqueueSnackbar('Chapter cannot be empty.', { variant: 'error' });
      setIsMetaDataSaving(false);
      return false;
    }
    if (formData?.concept === null || formData?.concept === '') {
      enqueueSnackbar('Concept cannot be empty.', { variant: 'error' });
      setIsMetaDataSaving(false);
      return false;
    }
    try {
      const savedQuestion = await Question.uploadMetaDataQuestion(questionId, standard, subject, chapter, concept, user?.$id);
      setquestionId(savedQuestion?.$id);
      setIsMetaDataSaving(false);
      setIsMetaDataUpdated(false);
      enqueueSnackbar('Meta data saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setIsMetaDataSaving(false);
    }
  }

  const saveQuestion = async () => {
    setIsQuestionSaving(true);
    if (formData?.question === null || formData?.question === '') {
      enqueueSnackbar('Question cannot be empty.', { variant: 'error' });
      setIsQuestionSaving(false);
      return false;
    }
    try {
      await Question.uploadQuestionContent(questionId, question, coverQuestion, user?.$id);
      setIsQuestionUpdated(false);
      enqueueSnackbar('Question Content saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsQuestionSaving(false);
  }

  const saveOptionA = async () => {
    setIsOptionASaving(true);
    if (formData?.optionA === null || formData?.optionA === '') {
      enqueueSnackbar('Option A cannot be empty.', { variant: 'error' });
      setIsOptionAUpdated(false);
      return false;
    }
    try {
      await Question.uploadOptionAContent(questionId, optionA, coverOptionA, user?.$id);
      setIsOptionAUpdated(false);
      enqueueSnackbar('Option A saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsOptionASaving(false);
  }

  const saveOptionB = async () => {
    setIsOptionBSaving(true);
    if (formData?.optionB === null || formData?.optionB === '') {
      enqueueSnackbar('Option B cannot be empty.', { variant: 'error' });
      setIsOptionBSaving(false);
      return false;
    }
    try {
      await Question.uploadOptionBContent(questionId, optionB, coverOptionB, user?.$id);
      setIsOptionBUpdated(false);
      enqueueSnackbar('Option B saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsOptionBSaving(false);
  }

  const saveOptionC = async () => {
    setIsOptionCSaving(true);
    if (formData?.optionC === null || formData?.optionC === '') {
      enqueueSnackbar('Option C cannot be empty.', { variant: 'error' });
      setIsOptionCSaving(false);
      return false;
    }
    try {
      await Question.uploadOptionCContent(questionId, optionC, coverOptionC, user?.$id);
      setIsOptionCUpdated(false);
      enqueueSnackbar('Option C saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsOptionCSaving(false);
  }

  const saveOptionD = async () => {
    setIsOptionDSaving(true);
    if (formData?.optionD === null || formData?.optionD === '') {
      enqueueSnackbar('Option D cannot be empty.', { variant: 'error' });
      setIsOptionDSaving(false);
      return false;
    }
    try {
      await Question.uploadOptionDContent(questionId, optionD, coverOptionD, user?.$id);
      setIsOptionDUpdated(false);
      enqueueSnackbar('Option D saved successfully.');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsOptionDSaving(false);
  }

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isMetaDataUpdated) await saveMetaData();
      if (isQuestionUpdated) await saveQuestion();
      if (isOptionAUpdated) await saveOptionA();
      if (isOptionBUpdated) await saveOptionB();
      if (isOptionCUpdated) await saveOptionC();
      if (isOptionDUpdated) await saveOptionD();
      await Question.sendForApproval(questionId, user?.$id);
      enqueueSnackbar('Successfully Sent for Approval');
      navigate(PATH_DASHBOARD.question.view(questionId))
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDropQuestion = useCallback(
    (acceptedFiles) => {
      setIsQuestionUpdated(true);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverQuestion(newFile)
      }
    },
    [setCoverQuestion, setIsQuestionUpdated]
  );

  const handleDropOptionA = useCallback(
    (acceptedFiles) => {
      setIsOptionAUpdated(true);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionA(newFile)
      }
    },
    [setCoverOptionA, setIsOptionAUpdated]
  );

  const handleDropOptionB = useCallback(
    (acceptedFiles) => {
      setIsOptionBUpdated(true);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionB(newFile);
      }
    },
    [setCoverOptionB, setIsOptionBUpdated]
  );

  const handleDropOptionC = useCallback(
    (acceptedFiles) => {
      setIsOptionCUpdated(true);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionC(newFile);
      }
    },
    [setCoverOptionC, setIsOptionCUpdated]
  );

  const handleDropOptionD = useCallback(
    (acceptedFiles) => {
      setIsOptionDUpdated(true);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverOptionD(newFile);
      }
    },
    [setCoverOptionD, setIsOptionDUpdated]
  );

  if (!canEdit) {
    return <PermissionDeniedComponent />
  }

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} >
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 5 }} />
      <Paper
        sx={{
          p: 1,
          my: 3,
          minHeight: 120,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
      >

        <Grid container spacing={4} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' sx={{m: 2}}>Math Playground</Typography>
            <Typography variant='subtitle2' sx={{m: 2}}>Use this editor to insert in the box of question and options</Typography>
            <FroalaEditorComponent
              tag='textarea'
              config={froalaConfig}
              model={content}
              onModelChange={(event) => setContent(event)}
            />

            <Box sx={{ textAlign: 'right', mt: 2, mb: 2 }}>
              <Button
                disabled={content === ''}
                sx={{ mr: 1 }}
                onClick={() => setContent('')}
                startIcon={<Iconify icon="mdi:clear-outline" />}
              >
                Clear
              </Button>

              <Button
                disabled={activeStep === 0 || activeStep === 6}
                variant="contained"
                sx={{ mr: 1 }}
                onClick={handleInsert}
                endIcon={<Iconify icon="codicon:insert" />}
              >
                Insert
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title={STEPS[activeStep]} />

              <CardContent>
                <Grid container spacing={3}>
                  {activeStep === 0 ?
                    <>
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
                            setIsMetaDataUpdated(true);
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
                            setIsMetaDataUpdated(true);
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
                            setIsMetaDataUpdated(true);
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
                            setIsMetaDataUpdated(true);
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

                      <Grid item xs={12} md={12}>
                        <LoadingButton
                          onClick={saveMetaData}
                          variant="contained"
                          startIcon={<Iconify icon="material-symbols:save-outline" />}
                          loading={isMetaDataSaving}
                          disabled={!isMetaDataUpdated}
                        >
                          Save
                        </LoadingButton>
                      </Grid>
                    </>
                    : (
                      activeStep === 1 ?
                        <>
                          <Grid item xs={12} md={12}>
                            <Paper
                              sx={{
                                p: 1,
                                my: 1,
                                minHeight: 200,
                                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                              }}
                            >
                              <FroalaEditorView model={question} />
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
                                  setIsQuestionUpdated(true);
                                }}
                              />
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <LoadingButton
                              onClick={saveQuestion}
                              variant="contained"
                              startIcon={<Iconify icon="material-symbols:save-outline" />}
                              loading={isQuestionSaving}
                              disabled={!isQuestionUpdated}
                            >
                              Save
                            </LoadingButton>
                          </Grid>
                        </>
                        : (
                          activeStep === 2 ?
                            <>
                              <Grid item xs={12} md={12}>
                                <Paper
                                  sx={{
                                    p: 1,
                                    my: 1,
                                    minHeight: 200,
                                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                                  }}
                                >
                                  <FroalaEditorView model={optionA} />
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
                                      setIsOptionAUpdated(true);
                                    }}
                                  />
                                </Stack>
                              </Grid>

                              <Grid item xs={12} md={12}>
                                <LoadingButton
                                  onClick={saveOptionA}
                                  variant="contained"
                                  startIcon={<Iconify icon="material-symbols:save-outline" />}
                                  loading={isOptionASaving}
                                  disabled={!isOptionAUpdated}
                                >
                                  Save
                                </LoadingButton>
                              </Grid>
                            </>
                            : (
                              activeStep === 3 ?
                                <>
                                  <Grid item xs={12} md={12}>
                                    <Paper
                                      sx={{
                                        p: 1,
                                        my: 1,
                                        minHeight: 200,
                                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                                      }}
                                    >
                                      <FroalaEditorView model={optionB} />
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
                                          setIsOptionBUpdated(true)
                                        }}
                                      />
                                    </Stack>
                                  </Grid>

                                  <Grid item xs={12} md={12}>
                                    <LoadingButton
                                      onClick={saveOptionB}
                                      variant="contained"
                                      startIcon={<Iconify icon="material-symbols:save-outline" />}
                                      loading={isOptionBSaving}
                                      disabled={!isOptionBUpdated}
                                    >
                                      Save
                                    </LoadingButton>
                                  </Grid>
                                </>
                                : (
                                  activeStep === 4 ?
                                    <>
                                      <Grid item xs={12} md={12}>
                                        <Paper
                                          sx={{
                                            p: 1,
                                            my: 1,
                                            minHeight: 200,
                                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                                          }}
                                        >
                                          <FroalaEditorView model={optionC} />
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
                                              setIsOptionCUpdated(true);
                                            }}
                                          />
                                        </Stack>
                                      </Grid>

                                      <Grid item xs={12} md={12}>
                                        <LoadingButton
                                          onClick={saveOptionC}
                                          variant="contained"
                                          startIcon={<Iconify icon="material-symbols:save-outline" />}
                                          loading={isOptionCSaving}
                                          disabled={!isOptionCUpdated}
                                        >
                                          Save
                                        </LoadingButton>
                                      </Grid>
                                    </>
                                    :
                                    <>
                                      <Grid item xs={12} md={12}>
                                        <Paper
                                          sx={{
                                            p: 1,
                                            my: 1,
                                            minHeight: 200,
                                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                                          }}
                                        >
                                          <FroalaEditorView model={optionD} />
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
                                              setIsOptionDUpdated(true);
                                            }}
                                          />
                                        </Stack>
                                      </Grid>

                                      <Grid item xs={12} md={12}>
                                        <LoadingButton
                                          onClick={saveOptionD}
                                          variant="contained"
                                          startIcon={<Iconify icon="material-symbols:save-outline" />}
                                          loading={isOptionDSaving}
                                          disabled={!isOptionDUpdated}
                                        >
                                          Save
                                        </LoadingButton>
                                      </Grid>
                                    </>
                                )
                            )
                        )
                    )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid >
      </Paper >
      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<Iconify icon="mingcute:back-fill" />}
        >
          Back
        </Button>
        {activeStep === STEPS.length - 1 ?
          <LoadingButton
            variant="contained"
            sx={{ mr: 1 }}
            endIcon={<Iconify icon="iconoir:submit-document" />}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            Submit For Approval
          </LoadingButton>
          :
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mr: 1 }}
            endIcon={<Iconify icon="carbon:next-outline" />}
            color='success'
            disabled={questionId===''}
          >
            Proceed to Next Step
          </Button>
        }
      </Box>
    </>
  );
}


function updateMathContent(math) {
  var mathArray = [];
  var startIndex = 0;

  for (let i in math) {
    if (math.substr(i, 5) === '<math') {
      mathArray.push(math.slice(startIndex, parseInt(i)));
      startIndex = parseInt(i);
    }
    if (math.substr(i, 7) === '</math>') {
      mathArray.push(math.slice(startIndex, parseInt(i) + 7));
      startIndex = parseInt(i) + 7;
    }
  }
  mathArray.push(math.substr(startIndex))

  var output = '';

  for (let i in mathArray) {
    if (mathArray[i].substr(0, 5) === '<math') {
      var s = '';
      var temp_s = '';
      var stack = [];
      for (let j in mathArray[i]) {
        if (mathArray[i].substr(j, 8) === '<mfenced') {
          s = s + temp_s;
          temp_s = '';
          if (mathArray[i].substr(j, 9) === '<mfenced>') {
            // '(' ')'
            stack.push(')');
            temp_s += '<mrow><mo>(</mo>';
            j = parseInt(j) + 8;
          } else {
            let k = parseInt(j);
            while (mathArray[i][k] !== '>') {
              k++;
            }
            const separate = mathArray[i].slice(j, parseInt(k) + 1).split('"');
            const open = separate[1];
            const close = separate[3];
            stack.push(close);
            temp_s += '<mrow><mo>' + open + '</mo>';
            j = parseInt(k);
          }
        } else if (mathArray[i].substr(j, 10) === '</mfenced>') {
          temp_s += '<mo>' + stack.pop() + '</mo></mrow>'
          s = s + temp_s;
          temp_s = '';
        } else {
          temp_s += mathArray[i][j];
        }
      }
      s += temp_s;
      s = s.replaceAll('/mfenced>', '');
      s = s.replaceAll('mfenced>', '');
      s = s.replaceAll('function String() { [native code] }', '');
      output += s;
    } else {
      output += mathArray[i];
    }
  }

  return output;
}