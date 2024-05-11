import { Link as RouterLink } from 'react-router-dom';
import { Autocomplete, Box, Card, CardContent, CardHeader, Chip, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, List, ListItem, MenuItem, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
import Image from '../../../../components/image/Image';
import ReactKatex from '@pkasila/react-katex';
import { useEffect, useState } from "react";
import { Question } from "../../../../auth/Question";
import { User } from "../../../../auth/User";
import Iconify from "../../../../components/iconify/Iconify";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from '../../../../components/snackbar';
import { SarthakUserDisplayUI } from "../../user/profile";
import ChapterDisplayUI from "./ChapterDisplayUI";
import StandardDisplayUI from "./StandardDisplayUI";
import SubjectDisplayUI from "./SubjectDisplayUI";
import ConceptDisplayUI from "./ConceptDisplayUI";
import StatusDisplayUI from "./StatusDisplayUI";

export default function QuestionRowComponent({ question, onSave }) {

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
  const [reviewComment, setReviewComment] = useState('');

  const [updating, setUpdating] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);
  const [canDoAction, setCanDoAction] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      var data;
      setStatus(question?.status);
      setCanDoAction(await Question.canAction(question?.$id, user?.$id));

      if (question?.createdBy) {
        const tmpData = await User.getProfileData(question?.createdBy);
        setNewSentReviewBack(tmpData);
      }

      if (question?.reviewdBackTo) {
        const tmpData = await User.getProfileData(question?.reviewdBackTo);
        setNewSentReviewBack(tmpData);
      }
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
  }, [question, user?.$id])

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
      <Card sx={{ m: 1 }}>
        <CardHeader
          title={question?.$id}
          action={
            <>
              <IconButton component={RouterLink} aria-label="view" to={PATH_DASHBOARD.question.view(question?.$id)}>
                <Iconify icon="carbon:view-filled" />
              </IconButton>
              <IconButton aria-label="Action" disabled={!canDoAction}
                onClick={() => setOpenDrawer(true)}>
                <Iconify icon="fluent-mdl2:set-action" />
              </IconButton>
              <IconButton component={RouterLink} aria-label="Edit" disabled={!canDoAction} to={PATH_DASHBOARD.question.edit(question?.$id)}>
                <Iconify icon="ic:baseline-edit" />
              </IconButton>
            </>
          }
        >

        </CardHeader>
        <CardContent>
          <Grid container>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
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

            </Grid>

            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Standard -</Typography>
                <StandardDisplayUI id={question?.standardId} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Subject -</Typography>
                <SubjectDisplayUI id={question?.subjectId} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Chapter -</Typography>
                <ChapterDisplayUI id={question?.chapterId} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Concept -</Typography>
                <ConceptDisplayUI id={question?.conceptId} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Status -</Typography>
                <StatusDisplayUI status={status} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Created By -</Typography>
                <SarthakUserDisplayUI userId={question?.createdBy} />
              </Stack>

              <Stack direction='row' sx={{ m: 2 }}>
                <Typography sx={{ mr: 1 }} variant="subtitle2">Review Comment -</Typography>
                <Typography variant="body2">{reviewComment}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
            fullWidth
            autoComplete
            value={newSentReviewBack}
            loading={isUserListLoading}
            options={userList}
            onFocus={async (event, value) => {
              try {
                setIsUserListLoading(true);
                const tem = await User.getUserList(value?.$id ? value?.name : value);
                setUserList(tem);
                setIsUserListLoading(false);
              } catch (error) {
                console.log(error);
              }
            }}
            onInputChange={async (event, value) => {
              try {
                setIsUserListLoading(true);
                const tem = await User.getUserList(value?.$id ? value?.name : value);
                setUserList(tem);
                setIsUserListLoading(false);
              } catch (error) {
                console.log(error);
              }
            }}
            onChange={async (event, value) => {
              setNewSentReviewBack(value);
            }}
            getOptionLabel={(option) => option?.name ? option?.name + ' (' + option?.empId + ')' : option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                {option?.name + ' (' + option?.empId + ')'}
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