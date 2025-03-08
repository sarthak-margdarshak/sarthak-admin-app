import { Fragment, useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "components/snackbar";
import {
  appwriteDatabases,
  appwriteFunctions,
  timeAgo,
} from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { Query } from "appwrite";
import { labels, sarthakAPIPath } from "assets/data";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Iconify from "components/iconify";
import Image from "components/image";
import { PATH_DASHBOARD } from "routes/paths";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import IndexView from "sections/@dashboard/management/content/question/component/IndexView";
import QuestionRowComponent from "sections/@dashboard/management/content/question/component/QuestionRowComponent";
import { Marker } from "react-mark.js";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: theme.palette.background.default,
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ebebeb",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function MockTestRowComponent({
  mockTestId,
  defaultExpanded = true,
}) {
  const { mockTestsData, updateMockTest } = useContent();
  let mockTest = mockTestsData[mockTestId];

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [expanded, setExpanded] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      if (mockTest === undefined) {
        setIsDataLoading(true);
        await updateMockTest(mockTestId);
        setIsDataLoading(false);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.mockTest,
              mockTestId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== mockTest?.$updatedAt;
        if (isChanged) {
          setIsDataLoading(true);
          await updateMockTest(mockTestId);
          setIsDataLoading(false);
        }
      }
      setIsDataLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  const publishMockTest = async () => {
    setPublishing(true);
    try {
      const x = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({ mockTestId: mockTestId }),
        false,
        sarthakAPIPath.mockTest.publish
      );
      const res = JSON.parse(x.responseBody);
      if (res.status === "failed") {
        enqueueSnackbar(res.error, { variant: "error" });
      } else {
        enqueueSnackbar("Published Successfully");
        await fetchData();
      }
      setOpenPublishDialog(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setPublishing(false);
  };

  if (isDataLoading) {
    return (
      <Fragment>
        <Card sx={{ m: 1 }}>
          <Divider sx={{ mt: 2, mb: 2 }}>
            <Chip
              label={mockTestId}
              color="info"
              icon={<Iconify icon="solar:test-tube-bold" color="#e81f1f" />}
            />
          </Divider>
          <Grid container>
            <Grid item sm={12} xs={12} md={4} lg={3} xl={3}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
            <Grid item sm={12} xs={12} md={8} lg={9} xl={9}>
              <Skeleton sx={{ m: 2 }} variant="rounded" height={40} />
            </Grid>
          </Grid>
        </Card>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Card sx={{ m: 1 }}>
        <CardHeader
          title={
            <Divider>
              <Chip
                label={
                  mockTest?.mtId +
                  " (" +
                  timeAgo.format(
                    Date.parse(
                      mockTest?.lastSynced || "2000-01-01T00:00:00.000+00:00"
                    )
                  ) +
                  ")"
                }
                color="info"
                icon={<Iconify icon="solar:test-tube-bold" color="#e81f1f" />}
              />
            </Divider>
          }
          action={
            <Stack direction="row">
              <Tooltip title="Refresh">
                <IconButton
                  aria-label="settings"
                  onClick={async () => {
                    setIsDataLoading(true);
                    await updateMockTest(mockTestId);
                    setIsDataLoading(false);
                  }}
                >
                  <Iconify
                    icon="solar:refresh-square-bold"
                    color="#ff8164"
                    width={35}
                  />
                </IconButton>
              </Tooltip>
              {mockTest?.published && (
                <Tooltip title="Published">
                  <Image
                    src="/assets/images/certified/published.png"
                    sx={{ width: 50 }}
                    style={{ transform: "rotate(30deg)" }}
                  />
                </Tooltip>
              )}
            </Stack>
          }
        />

        <CardContent>
          <Box component="section" sx={{ border: "1px solid grey" }}>
            <Grid container>
              <Grid item sm={12} xs={12} md={4} lg={3} xl={3}>
                <Box
                  component="section"
                  sx={{ p: 1, borderRight: "0.5px solid grey" }}
                >
                  <Marker mark={content}>
                    <Typography variant="h5">{mockTest?.name}</Typography>
                  </Marker>
                </Box>
              </Grid>

              <Grid item sm={12} xs={12} md={8} lg={9} xl={9}>
                <Box
                  component="section"
                  sx={{ p: 1, borderLeft: "0.5px solid grey" }}
                >
                  <Marker mark={content}>
                    <Typography variant="body1">
                      {mockTest?.description}
                    </Typography>
                  </Marker>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        <CardActions disableSpacing>
          {mockTest?.published ? (
            <Tooltip title="Published">
              <Iconify icon="noto:locked" sx={{ m: 1 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Publish">
              <IconButton
                disabled={mockTest?.published}
                onClick={() => setOpenPublishDialog(true)}
              >
                <Iconify icon="ic:round-publish" color="#ff2889" />
              </IconButton>
            </Tooltip>
          )}

          {!mockTest?.published && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() =>
                  navigate(PATH_DASHBOARD.mockTest.edit(mockTestId))
                }
              >
                <Iconify icon="fluent-color:edit-16" />
              </IconButton>
            </Tooltip>
          )}

          {defaultExpanded && (
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <Tooltip title={expanded ? "Show Less" : "Show More"}>
                <ExpandMoreIcon />
              </Tooltip>
            </ExpandMore>
          )}

          {!defaultExpanded && (
            <Tooltip title={"View"}>
              <IconButton
                onClick={() =>
                  navigate(PATH_DASHBOARD.mockTest.view(mockTestId))
                }
              >
                <Iconify icon="mage:preview-fill" color="#287cff" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>

        {defaultExpanded && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Accordion>
                <AccordionSummary>
                  <Chip
                    label="Metadata"
                    variant="outlined"
                    icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
                  />
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container sx={{ mt: 2 }} spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Index →</Typography>
                          <IndexView id={mockTest?.bookIndex?.$id} />
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">
                            System Generated Id →
                          </Typography>
                          <Typography variant="body2">{mockTestId}</Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Duration →</Typography>
                          <Typography variant="body2">{`${mockTest?.duration} mins`}</Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Level →</Typography>
                          <Typography variant="body2">
                            {mockTest?.level}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Sarthak Id →</Typography>
                          <Typography variant="body2">
                            {mockTest?.mtId}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Status →</Typography>
                          <Typography variant="body2">
                            {mockTest?.published ? "Published" : "Draft"}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Created By →</Typography>
                          <Typography variant="body2">
                            {mockTest?.creator}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Created At →</Typography>
                          <Tooltip title={mockTest?.$createdAt}>
                            <Typography variant="body2">
                              {timeAgo.format(
                                Date.parse(
                                  mockTest?.$createdAt ||
                                    "2000-01-01T00:00:00.000+00:00"
                                )
                              )}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Updated By →</Typography>
                          <Typography variant="body2">
                            {mockTest?.updater}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Updated At →</Typography>
                          <Tooltip title={mockTest?.$updatedAt}>
                            <Typography variant="body2">
                              {timeAgo.format(
                                Date.parse(
                                  mockTest?.$updatedAt ||
                                    "2000-01-01T00:00:00.000+00:00"
                                )
                              )}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </Item>
                    </Grid>

                    {mockTest?.published && (
                      <Fragment>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="body1">
                                Approved By →
                              </Typography>
                              <Typography variant="body2">
                                {mockTest?.approver}
                              </Typography>
                            </Stack>
                          </Item>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="body1">
                                Approved At →
                              </Typography>
                              <Tooltip title={mockTest?.approvedAt}>
                                <Typography variant="body2">
                                  {timeAgo.format(
                                    Date.parse(
                                      mockTest?.approvedAt ||
                                        "2000-01-01T00:00:00.000+00:00"
                                    )
                                  )}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          </Item>
                        </Grid>
                      </Fragment>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>
                  <Chip
                    label={"Questions (" + mockTest?.questions?.length + ")"}
                    icon={
                      <Iconify icon="fluent-color:chat-bubbles-question-16" />
                    }
                  />
                </AccordionSummary>

                <AccordionDetails>
                  {mockTest?.questions.map((question, index) => (
                    <QuestionRowComponent
                      key={index}
                      questionId={question}
                      showImages={false}
                      showAnswer={false}
                      defaultExpanded={false}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>

              {/*TODO: Add product details */}
            </CardContent>
          </Collapse>
        )}
      </Card>

      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Publish it?
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText id="alert-dialog-description">
                If you click AGREE, mock test will be published. After that
                there won't be any edit entertained. You can click DISAGREE, if
                you feel that the mock test is not needed to be published.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={publishing}
                onClick={() => setOpenPublishDialog(false)}
              >
                Disagree
              </Button>
              <LoadingButton
                loading={publishing}
                onClick={publishMockTest}
                autoFocus
              >
                Agree
              </LoadingButton>
            </DialogActions>
          </Fragment>
        ) : (
          <DialogContent>
            <PermissionDeniedComponent />
          </DialogContent>
        )}
      </Dialog>
    </Fragment>
  );
}
