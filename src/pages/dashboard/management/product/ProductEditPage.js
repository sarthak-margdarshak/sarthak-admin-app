import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  Dialog,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  TextField,
  Toolbar,
  Typography,
  alpha,
  stepConnectorClasses,
  styled,
  useTheme,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { ID, Permission, Query, Role } from "appwrite";
import { AppwriteHelper } from "../../../../auth/AppwriteHelper";
import { APPWRITE_API } from "../../../../config-global";
import StandardDisplayUI from "../../../../sections/@dashboard/question/view/StandardDisplayUI";
import SubjectDisplayUI from "../../../../sections/@dashboard/question/view/SubjectDisplayUI";
import ChapterDisplayUI from "../../../../sections/@dashboard/question/view/ChapterDisplayUI";
import ConceptDisplayUI from "../../../../sections/@dashboard/question/view/ConceptDisplayUI";
import Iconify from "../../../../components/iconify";
import { bgGradient } from "../../../../utils/cssStyles";
import { Upload } from "../../../../components/upload";
import { Reorder } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../../auth/AppwriteContext";
import ReactKatex from "@pkasila/react-katex";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthContext } from "../../../../auth/useAuthContext";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import Image from "../../../../components/image";

const STEPS = ["Metadata", "Mock-Tests / Products", "Images", "Publish"];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.divider,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[700],
  ...(ownerState.active && {
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
  ...(ownerState.completed && {
    color: theme.palette.common.white,
    ...bgGradient({
      startColor: theme.palette.error.light,
      endColor: theme.palette.error.main,
    }),
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <Iconify icon="majesticons:data" width={24} />,
    2: <Iconify icon="fluent:data-bar-horizontal-24-filled" width={24} />,
    3: <Iconify icon="hugeicons:image-upload" width={24} />,
    4: <Iconify icon="carbon:ibm-cloud-mass-data-migration" width={24} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductEditPage() {
  const id = window.location.pathname.split("/")[3];

  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user, sarthakInfoData } = useAuthContext();
  const [mockTestDriverIds, setMockTestDriverIds] = useState([]);
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("NORMAL");
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [deletedImage, setDeletedImage] = useState([]);
  const [allMockTests, setAllMockTests] = useState([]);
  const [selectedMockTests, setSelectedMockTests] = useState([]);
  const [dragStarted, setDragStarted] = useState(false);
  const [activeMockTest, setActiveMockTest] = useState(null);
  const [activeMockTestOnDialoge, setActiveMockTestOnDialoge] = useState(null);
  const [mockTestDialogOpen, setMockTestDialogOpen] = useState(false);
  const [productMRP, setProductMRP] = useState(0);
  const [productSellPrice, setProductSellPrice] = useState(0);
  const [creating, setCreating] = useState(false);
  // TODO -
  // const [comingSoon, setComingSoon] = useState(false);
  // const [schedulePublish, setSchedulePublish] = useState(false);
  // const [schedulePublishDate, setSchedulePublishDate] = useState(null);
  // const [scheduleDecomission, setScheduleDecomission] = useState(false);
  // const [scheduleDecomissionDate, setScheduleDecomissionDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const y = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        id
      );
      setProductId(y?.productId);
      setProductName(y?.name);
      setDescription(y?.description);
      setProductType(y?.type);
      setMockTestDriverIds(y?.mockTestDriverIds);
      setStandards(y?.standards);
      setSubjects(y?.subjects);
      setChapters(y?.chapters);
      setConcepts(y?.concepts);
      setProductMRP(y?.mrp);
      setProductSellPrice(y?.sellPrice);

      var tmpMockTests = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        [
          Query.equal("published", true),
          Query.equal("mockTestDriverId", [y?.mockTestDriverIds]),
        ]
      );
      for (let i in tmpMockTests) {
        var tmpQuestions = [];
        for (let j in tmpMockTests[i].questions) {
          const x = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.questions,
            tmpMockTests[i].questions[j]
          );
          tmpQuestions.push(x);
        }
        tmpMockTests[i].questions = tmpQuestions;
      }
      setAllMockTests(tmpMockTests);

      const tmpSelectedMockTests = tmpMockTests.filter((mockTest) => {
        var prersent = false;
        for (let i in y?.mockTestIds) {
          if (y?.mockTestIds[i] === mockTest.$id) prersent = true;
        }
        return prersent;
      });
      setSelectedMockTests(tmpSelectedMockTests);

      var tmpImages = [];
      for (let i in y.images) {
        const z = appwriteStorage.getFileDownload(
          APPWRITE_API.buckets.productFiles,
          y.images[i]
        ).href;
        tmpImages.push({
          value: y.images[i],
          url: z,
        });
      }
      setSavedImages(tmpImages);
    };
    fetchData();
  }, [id]);

  const fetchMockTestList = async () => {
    var tmpMockTests = await AppwriteHelper.listAllDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      [
        Query.equal("published", true),
        Query.equal("mockTestDriverId", [mockTestDriverIds]),
      ]
    );
    for (let i in tmpMockTests) {
      var tmpQuestions = [];
      for (let j in tmpMockTests[i].questions) {
        const x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          tmpMockTests[i].questions[j]
        );
        tmpQuestions.push(x);
      }
      tmpMockTests[i].questions = tmpQuestions;
    }
    setAllMockTests(tmpMockTests);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (productType === "NORMAL") {
        if (mockTestDriverIds.length !== 0) {
          fetchMockTestList();
        }
      } else {
        // fetchProductList();
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 3) {
      setCreating(true);
      try {
        // Delete remove files
        for (let i in deletedImage) {
          await appwriteStorage.deleteFile(
            APPWRITE_API.buckets.productFiles,
            deletedImage[i]
          );
        }
        // Upload Files first
        var arrUploadedFiles = savedImages.map((img) => img.value);
        for (let i in files) {
          arrUploadedFiles.push(
            (
              await appwriteStorage.createFile(
                APPWRITE_API.buckets.productFiles,
                ID.unique(),
                files[i]
              )
            ).$id
          );
        }

        const y = await appwriteDatabases.updateDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          id,
          {
            name: productName,
            description: description,
            type: productType,
            mockTestIds: selectedMockTests.map((mockTest) => mockTest.$id),
            images: arrUploadedFiles,
            updatedBy: user.$id,
            mrp: productMRP,
            sellPrice: productSellPrice,
          },
          [Permission.update(Role.team(sarthakInfoData.adminTeamId))]
        );

        enqueueSnackbar("Successfully Updated the product - " + productId, {
          variant: "success",
        });

        navigate(PATH_DASHBOARD.product.view(y.$id));
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
      setCreating(false);
    }
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter(
      (fileFiltered) => fileFiltered !== inputFile
    );
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const removeSavedFile = (inputFile) => {
    const filesFiltered = savedImages.filter(
      (fileFiltered) => fileFiltered.value !== inputFile
    );
    var x = deletedImage;
    x.push(inputFile);
    setDeletedImage(x);
    setSavedImages(filesFiltered);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title> {"Product: Edit | " + productId}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Products"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Product",
              href: PATH_DASHBOARD.product.root,
            },
            {
              name: productId,
              href: PATH_DASHBOARD.product.view(id),
            },
            {
              name: "new",
            },
          ]}
        />

        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ m: 1 }}>
          {activeStep === 0 && (
            <CardContent>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  my: 1,
                  mb: 2,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2.3}
                    lg={2.3}
                    xl={2.3}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textDecorationLine: "underline",
                        }}
                      >
                        Mock Test Driver Ids -
                      </Typography>
                      {mockTestDriverIds?.map((driver) => (
                        <Typography
                          key={driver}
                          variant="body2"
                          sx={{
                            alignSelf: "center",
                          }}
                        >
                          {driver}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={2.3}
                    lg={2.3}
                    xl={2.3}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textDecorationLine: "underline",
                        }}
                      >
                        Standards -
                      </Typography>
                      {standards.length === 0 ? (
                        <Typography variant="body2">All</Typography>
                      ) : (
                        standards.map((value) => (
                          <StandardDisplayUI key={value} id={value} />
                        ))
                      )}
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={2.3}
                    lg={2.3}
                    xl={2.3}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textDecorationLine: "underline",
                        }}
                      >
                        Subjects -
                      </Typography>
                      {subjects.length === 0 ? (
                        <Typography variant="body2">All</Typography>
                      ) : (
                        subjects.map((value) => (
                          <SubjectDisplayUI key={value} id={value} />
                        ))
                      )}
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={2.3}
                    lg={2.3}
                    xl={2.3}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textDecorationLine: "underline",
                        }}
                      >
                        Chapters -
                      </Typography>
                      {chapters.length === 0 ? (
                        <Typography variant="body2">All</Typography>
                      ) : (
                        chapters.map((value) => (
                          <ChapterDisplayUI key={value} id={value} />
                        ))
                      )}
                    </Stack>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={5.9}
                    sm={5.9}
                    md={2.3}
                    lg={2.3}
                    xl={2.3}
                    padding={1}
                  >
                    <Stack direction="column" sx={{ alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textDecorationLine: "underline",
                        }}
                      >
                        Concepts -
                      </Typography>
                      {concepts.length === 0 ? (
                        <Typography variant="body2">All</Typography>
                      ) : (
                        concepts.map((value) => (
                          <ConceptDisplayUI key={value} id={value} />
                        ))
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Grid container>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
                      <TextField
                        fullWidth
                        disabled
                        id="product-id"
                        label="Product Id"
                        value={productId}
                        helperText="This is auto generated."
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} padding={1}>
                      <FormControl fullWidth>
                        <InputLabel id="product-type">Product Type</InputLabel>
                        <Select
                          fullWidth
                          disabled
                          labelId="product-type"
                          id="product-type"
                          value={productType}
                          label="Product Type"
                          onChange={(event) =>
                            setProductType(event.target.value)
                          }
                        >
                          <MenuItem value="NORMAL">NORMAL</MenuItem>
                          {/* <MenuItem value="COMBO">COMBO</MenuItem> */}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      padding={1}
                    >
                      <TextField
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                        id="product-name"
                        label="Product Name"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        helperText="Enter a unique name"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} padding={1}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5.3}
                    inputProps={{ maxLength: 500 }}
                    id="product-description"
                    label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    helperText="Describe this product"
                  />
                </Grid>
              </Grid>
            </CardContent>
          )}

          {activeStep === 1 &&
            (productType === "NORMAL" ? (
              <CardContent>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      p: 1,
                    }}
                  >
                    <Reorder.Group
                      values={selectedMockTests}
                      onReorder={setSelectedMockTests}
                      as="ol"
                    >
                      {selectedMockTests.map((mockTest) => (
                        <Reorder.Item
                          value={mockTest}
                          key={mockTest.$id}
                          onDragStart={() => setDragStarted(true)}
                          onDragEnd={() => setDragStarted(false)}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              m: 1,
                              pb: 2.5,
                              mr:
                                mockTest?.$id === activeMockTest?.$id ? -5 : 2,
                              cursor: dragStarted ? "grabbing" : "grab",
                            }}
                          >
                            <CardHeader
                              title={mockTest.name + " (" + mockTest.mtId + ")"}
                              subheader={mockTest.description}
                              action={
                                mockTest === activeMockTest ? (
                                  <IconButton
                                    onClick={() => setActiveMockTest(null)}
                                  >
                                    <Iconify
                                      icon="icon-park-solid:view-list"
                                      style={{
                                        color: theme.palette.primary.main,
                                      }}
                                    />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    onClick={() => setActiveMockTest(mockTest)}
                                  >
                                    <Iconify icon="icon-park-outline:view-list" />
                                  </IconButton>
                                )
                              }
                            />
                          </Card>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>

                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ height: 80 }}
                      onClick={() => setMockTestDialogOpen(true)}
                    >
                      Add / Remove Mock Test
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Stack direction="row" sx={{ m: 3 }}>
                      <Typography variant="h6">{"Mock Test Id - "}</Typography>
                      <Link
                        component={RouterLink}
                        onClick={() =>
                          window.open(
                            window.location.origin +
                              "/dashboard/mock-test/" +
                              activeMockTest?.$id,
                            "_blank"
                          )
                        }
                      >
                        <Typography variant="h6">
                          {activeMockTest?.mtId}
                        </Typography>
                      </Link>
                    </Stack>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        m: 2,
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey[500], 0.12),
                      }}
                    >
                      {activeMockTest === null ? (
                        <Button
                          fullWidth
                          disabled
                          variant="outlined"
                          sx={{ height: 200 }}
                        >
                          Select the Icon of mock test to view its questions
                        </Button>
                      ) : (
                        <div>
                          {activeMockTest?.questions?.map((question) => (
                            <Card sx={{ m: 1 }} key={question.$id}>
                              <Divider sx={{ mt: 1 }}>
                                <Chip label={question?.qnId} />
                              </Divider>
                              <CardHeader
                                title={
                                  <ReactKatex>
                                    {question?.contentQuestion || ""}
                                  </ReactKatex>
                                }
                              ></CardHeader>

                              <CardContent>
                                <Grid container>
                                  <Grid
                                    item
                                    sm={12}
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <Alert
                                      variant={
                                        question?.answerOption?.includes("A")
                                          ? "filled"
                                          : "outlined"
                                      }
                                      severity={
                                        question?.answerOption?.includes("A")
                                          ? "success"
                                          : "info"
                                      }
                                      icon={
                                        <Iconify icon="mdi:alphabet-a-box" />
                                      }
                                      sx={{ m: 0.5 }}
                                    >
                                      <ReactKatex>
                                        {question?.contentOptionA || ""}
                                      </ReactKatex>
                                    </Alert>
                                  </Grid>

                                  <Grid
                                    item
                                    sm={12}
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <Alert
                                      variant={
                                        question?.answerOption?.includes("B")
                                          ? "filled"
                                          : "outlined"
                                      }
                                      severity={
                                        question?.answerOption?.includes("B")
                                          ? "success"
                                          : "info"
                                      }
                                      icon={
                                        <Iconify icon="mdi:alphabet-b-box" />
                                      }
                                      sx={{ m: 0.5 }}
                                    >
                                      <ReactKatex>
                                        {question?.contentOptionB || ""}
                                      </ReactKatex>
                                    </Alert>
                                  </Grid>

                                  <Grid
                                    item
                                    sm={12}
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <Alert
                                      variant={
                                        question?.answerOption?.includes("C")
                                          ? "filled"
                                          : "outlined"
                                      }
                                      severity={
                                        question?.answerOption?.includes("C")
                                          ? "success"
                                          : "info"
                                      }
                                      icon={
                                        <Iconify icon="mdi:alphabet-c-box" />
                                      }
                                      sx={{ m: 0.5 }}
                                    >
                                      <ReactKatex>
                                        {question?.contentOptionC || ""}
                                      </ReactKatex>
                                    </Alert>
                                  </Grid>

                                  <Grid
                                    item
                                    sm={12}
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <Alert
                                      variant={
                                        question?.answerOption?.includes("D")
                                          ? "filled"
                                          : "outlined"
                                      }
                                      severity={
                                        question?.answerOption?.includes("D")
                                          ? "success"
                                          : "info"
                                      }
                                      icon={
                                        <Iconify icon="mdi:alphabet-d-box" />
                                      }
                                      sx={{ m: 0.5 }}
                                    >
                                      <ReactKatex>
                                        {question?.contentOptionD || ""}
                                      </ReactKatex>
                                    </Alert>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            ) : (
              <CardContent>
                <Button fullWidth variant="outlined" sx={{ height: 100 }}>
                  Add / Remove Product
                </Button>
              </CardContent>
            ))}

          {activeStep === 2 && (
            <CardContent>
              <Grid container>
                {savedImages.map((img) => (
                  <Grid
                    item
                    key={img.value}
                    sx={6}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    spacing={1}
                  >
                    <Image
                      disabledEffect
                      alt={img.value}
                      src={img.url}
                      ratio="4/3"
                      sx={{
                        borderRadius: 1,
                        width: "calc(100% - 10px)",
                        height: "calc(100% - 10px)",
                      }}
                    />

                    <IconButton
                      sx={{ mt: -8 }}
                      onClick={() => removeSavedFile(img.value)}
                    >
                      <Iconify
                        icon="mdi:remove-box"
                        sx={{ color: "#e70d0d" }}
                      />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
              <Upload
                multiple
                thumbnail
                files={files}
                onDrop={handleDropMultiFile}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </CardContent>
          )}

          {activeStep === 3 && (
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    fullWidth
                    type="number"
                    id="product-mrp"
                    label="Product MRP"
                    value={productMRP}
                    onChange={(event) => setProductMRP(event.target.value)}
                    helperText="Enter the MRP"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    fullWidth
                    type="number"
                    id="product-sell-price"
                    label="Product Sell Price"
                    value={productSellPrice}
                    onChange={(event) =>
                      setProductSellPrice(event.target.value)
                    }
                    helperText="Enter the Sell Price"
                  />
                </Grid>
              </Grid>
            </CardContent>
          )}
        </Card>

        <Box sx={{ textAlign: "right" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleNext}
            sx={{ mr: 1 }}
            loading={creating}
          >
            {activeStep === STEPS.length - 1 ? "Update" : "Next"}
          </LoadingButton>
        </Box>
      </Container>

      <Dialog
        fullScreen
        open={mockTestDialogOpen}
        scroll="body"
        onClose={() => setMockTestDialogOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMockTestDialogOpen(false)}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Pick Mock Tests
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            my: 1,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} padding={1}>
              {allMockTests.map((mockTest) => (
                <div key={mockTest?.$id}>
                  <Card
                    variant={
                      mockTest?.$id === activeMockTestOnDialoge?.$id
                        ? "elevation"
                        : "outlined"
                    }
                    sx={{
                      m: 1,
                      mr:
                        mockTest?.$id === activeMockTestOnDialoge?.$id ? -5 : 2,
                      pb: 2.5,
                    }}
                  >
                    <CardHeader
                      title={mockTest.name + " (" + mockTest.mtId + ")"}
                      subheader={mockTest.description}
                      action={
                        <React.Fragment>
                          <Checkbox
                            defaultChecked={
                              selectedMockTests.findIndex(
                                (value) => value?.$id === mockTest?.$id
                              ) !== -1
                            }
                            onChange={(event) => {
                              var y = selectedMockTests;
                              if (event.target.checked) {
                                y.push(mockTest);
                              } else {
                                const x = y.findIndex(
                                  (value) => value?.$id === mockTest?.$id
                                );
                                y.splice(x, 1);
                              }
                              setSelectedMockTests(y);
                            }}
                          />
                          {mockTest === activeMockTestOnDialoge ? (
                            <IconButton
                              onClick={() => setActiveMockTestOnDialoge(null)}
                            >
                              <Iconify
                                icon="icon-park-solid:view-list"
                                style={{
                                  color: theme.palette.primary.main,
                                }}
                              />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                setActiveMockTestOnDialoge(mockTest)
                              }
                            >
                              <Iconify icon="icon-park-outline:view-list" />
                            </IconButton>
                          )}
                        </React.Fragment>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Grid>

            <Divider orientation="vertical" flexItem />

            <Grid item xs={12} sm={12} md={5.9} lg={5.9} xl={5.9} padding={1}>
              <Stack direction="row" sx={{ m: 3 }}>
                <Typography variant="h6">{"Mock Test Id - "}</Typography>
                <Link
                  component={RouterLink}
                  onClick={() =>
                    window.open(
                      window.location.origin +
                        "/dashboard/mock-test/" +
                        activeMockTestOnDialoge?.$id,
                      "_blank"
                    )
                  }
                >
                  <Typography variant="h6">
                    {activeMockTestOnDialoge?.mtId}
                  </Typography>
                </Link>
              </Stack>

              {activeMockTestOnDialoge === null ? (
                <Grid container>
                  <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      disabled
                      variant="outlined"
                      sx={{ height: 200 }}
                    >
                      Select the Icon of mock test to view its questions
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    m: 2,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  }}
                >
                  {activeMockTestOnDialoge?.questions?.map((question) => (
                    <Card sx={{ m: 1 }} key={question.$id}>
                      <Divider sx={{ mt: 1 }}>
                        <Chip label={question?.qnId} />
                      </Divider>
                      <CardHeader
                        title={
                          <ReactKatex>
                            {question?.contentQuestion || ""}
                          </ReactKatex>
                        }
                      />

                      <CardContent>
                        <Grid container>
                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("A")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("A")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-a-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionA || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("B")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("B")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-b-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionB || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("C")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("C")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-c-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionC || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>

                          <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
                            <Alert
                              variant={
                                question?.answerOption?.includes("D")
                                  ? "filled"
                                  : "outlined"
                              }
                              severity={
                                question?.answerOption?.includes("D")
                                  ? "success"
                                  : "info"
                              }
                              icon={<Iconify icon="mdi:alphabet-d-box" />}
                              sx={{ m: 0.5 }}
                            >
                              <ReactKatex>
                                {question?.contentOptionD || ""}
                              </ReactKatex>
                            </Alert>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    </React.Fragment>
  );
}
