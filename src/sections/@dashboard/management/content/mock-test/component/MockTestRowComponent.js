import { Fragment, useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "components/snackbar";
import { appwriteDatabases, appwriteFunctions } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { labels, sarthakAPIPath } from "assets/data";
import { lang } from "assets/data/lang";
import { ID, Query } from "appwrite";
import { Alert, Box } from "@mui/material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Iconify from "components/iconify";
import Image from "components/image";
import { PATH_DASHBOARD } from "routes/paths";
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import { Marker } from "react-mark.js";
import MockTestMetadata from "sections/@dashboard/management/content/mock-test/component/MockTestMetadata";
import { Item } from "components/item/Item";
import MockTestQuestion from "sections/@dashboard/management/content/mock-test/component/MockTestQuestion";
import MockTestProduct from "sections/@dashboard/management/content/mock-test/component/MockTestProduct";

export default function MockTestRowComponent({
  mockTestId,
  defaultExpanded = true,
}) {
  const { getMockTest } = useContent();
  const [mockTest, setMockTest] = useState(
    localStorage.getItem(`mockTest_${mockTestId}`)
      ? JSON.parse(localStorage.getItem(`mockTest_${mockTestId}`))
      : {}
  );
  const [langContent, setLangContent] = useState(
    localStorage.getItem(`mockTest_${mockTestId}`)
      ? {
          name: JSON.parse(localStorage.getItem(`mockTest_${mockTestId}`))
            ?.name,
          description: JSON.parse(
            localStorage.getItem(`mockTest_${mockTestId}`)
          )?.description,
        }
      : {}
  );
  const [currLang, setCurrLang] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false);
  const [openLanguageAssignmentDialog, setOpenLanguageAssignmentDialog] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [publishing, setPublishing] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(
    localStorage.getItem(`mockTest_${mockTestId}`) ? false : true
  );
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      setIsLoadingNew(
        localStorage.getItem(`mockTest_${mockTestId}`) ? false : true
      );
      setMockTest(
        localStorage.getItem(`mockTest_${mockTestId}`)
          ? JSON.parse(localStorage.getItem(`mockTest_${mockTestId}`))
          : {}
      );
      setLangContent(
        localStorage.getItem(`mockTest_${mockTestId}`)
          ? {
              name: JSON.parse(localStorage.getItem(`mockTest_${mockTestId}`))
                ?.name,
              description: JSON.parse(
                localStorage.getItem(`mockTest_${mockTestId}`)
              )?.description,
            }
          : {}
      );
      const x = await getMockTest(mockTestId);
      if (x) {
        setLangContent({
          name: x?.name,
          description: x?.description,
        });
        setCurrLang(x?.lang);
      }
      setMockTest(x);
      setIsLoadingNew(false);
      setIsRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const hasLanguageAssigned = () => {
    return (
      mockTest?.lang && mockTest.lang !== null && mockTest.lang !== undefined
    );
  };

  const handleLanguageAssignment = async () => {
    if (!selectedLanguage) {
      enqueueSnackbar("Please select a language", { variant: "error" });
      return;
    }

    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTestId,
        {
          lang: selectedLanguage,
          updater: user.$id,
        }
      );

      enqueueSnackbar(
        `Language assigned successfully: ${lang[selectedLanguage]?.level}`,
        { variant: "success" }
      );
      setOpenLanguageAssignmentDialog(false);
      setSelectedLanguage(null);
      await fetchData();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const getAvailableLanguagesForTranslation = () => {
    const translatedLanguages = mockTest?.translatedLang || [];
    const primaryLanguage = mockTest?.lang;

    return Object.keys(lang).filter(
      (langCode) =>
        langCode !== primaryLanguage && !translatedLanguages.includes(langCode)
    );
  };

  const deleteMockTest = async () => {
    setDeleting(true);
    const canDelete =
      (
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          mockTestId,
          [Query.select("published")]
        )
      ).published === false;
    if (!canDelete) {
      enqueueSnackbar(
        "Cannot delete mock test as it is published. Unpublish or de-reference associations first.",
        { variant: "error" }
      );
      setDeleting(false);
      setOpenDeleteDialog(false);
      return;
    }

    for (const langCode of mockTest.translatedLang) {
      const translatedDocs = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedMockTest,
        [
          Query.equal("mockTestId", mockTestId),
          Query.equal("lang", langCode),
          Query.select("$id"),
        ]
      );

      await appwriteDatabases.deleteDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedMockTest,
        translatedDocs.documents[0].$id
      );
    }

    await appwriteDatabases.deleteDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      mockTestId
    );

    setDeleting(false);
    setOpenDeleteDialog(false);
    localStorage.removeItem(`mockTest_${mockTestId}`);
    enqueueSnackbar(`Mock Test Deleted Successfully with ID: [${mockTestId}]`, {
      variant: "success",
    });
    navigate(PATH_DASHBOARD.mockTest.list);
  };

  useEffect(() => {
    fetchData().then(() => {});
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

  if (isLoadingNew) {
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

  if (mockTest === null) {
    return (
      <Fragment>
        <Card sx={{ m: 1 }}>
          <CardHeader
            title={
              <Divider>
                <Chip
                  label={mockTestId}
                  color="error"
                  icon={<Iconify icon="solar:test-tube-bold" color="#e81f1f" />}
                />
              </Divider>
            }
          />

          <CardContent>
            <Stack
              alignItems="center"
              spacing={2}
              sx={{ textAlign: "center", py: 2 }}
            >
              <Iconify
                icon="eva:alert-triangle-fill"
                width={56}
                height={56}
                style={{ color: "#d32f2f" }}
              />
              <Typography variant="h6">Mock Test Not Found</Typography>
              <Chip label="Error: MTNF-404" color="error" size="small" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 680 }}
              >
                The requested mock test could not be found. It may have been
                deleted, or the provided mock test ID is invalid. Please verify
                the ID and try again.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(PATH_DASHBOARD.mockTest.list)}
                >
                  Back to Mock Tests
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Card sx={{ m: 1, opacity: isRefreshing ? 0.5 : 1 }}>
        <CardHeader
          title={
            <Divider>
              <Chip
                label={mockTest?.mtId}
                color="info"
                icon={<Iconify icon="solar:test-tube-bold" color="#e81f1f" />}
              />
            </Divider>
          }
          action={
            <Stack direction="row">
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
          <Grid container spacing={2}>
            <Grid item sm={12} xs={12} md={4} lg={3} xl={3}>
              <Item>
                <Marker mark={content}>
                  <Typography variant="h5">
                    {langContent?.name || mockTest?.name}
                  </Typography>
                </Marker>
              </Item>
            </Grid>

            <Grid item sm={12} xs={12} md={8} lg={9} xl={9}>
              <Item>
                <Marker mark={content}>
                  <Typography variant="body1">
                    {langContent?.description || mockTest?.description}
                  </Typography>
                </Marker>
              </Item>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions disableSpacing>
          {/* Published Info */}
          {mockTest?.published && defaultExpanded && (
            <Tooltip title="Published">
              <Iconify icon="noto:locked" sx={{ m: 1 }} />
            </Tooltip>
          )}

          {/* Unpublish */}
          {mockTest?.published && defaultExpanded && (
            <Tooltip title="Unpublish">
              <IconButton onClick={() => {}}>
                <Iconify icon="mdi:lock-open-outline" color="#ff2889" />
              </IconButton>
            </Tooltip>
          )}

          {/* Edit */}
          {!mockTest?.published && defaultExpanded && (
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

          {/* Publish */}
          {!mockTest?.published &&
            defaultExpanded &&
            user.labels.findIndex(
              (label) => label === labels.founder || label === labels.admin
            ) !== -1 && (
              <Tooltip title="Publish">
                <IconButton
                  disabled={mockTest?.published}
                  onClick={() => setOpenPublishDialog(true)}
                >
                  <Iconify icon="ic:round-publish" color="#ff2889" />
                </IconButton>
              </Tooltip>
            )}

          {/* Delete */}
          {!mockTest?.published &&
            defaultExpanded &&
            user.labels.findIndex(
              (label) => label === labels.founder || label === labels.admin
            ) !== -1 && (
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                >
                  <Iconify icon="mdi:delete" color="red" />
                </IconButton>
              </Tooltip>
            )}

          {/* View */}
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

          {/* Language Management */}
          {defaultExpanded && (
            <Tooltip
              title={
                hasLanguageAssigned() ? "View Languages" : "Assign Language"
              }
            >
              <IconButton
                onClick={() => {
                  if (hasLanguageAssigned()) {
                    setOpenLanguageDialog(true);
                  } else {
                    setOpenLanguageAssignmentDialog(true);
                  }
                }}
              >
                <Iconify
                  icon="mdi:translate"
                  color={hasLanguageAssigned() ? "#4caf50" : "#ff9800"}
                />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>

        {defaultExpanded && (
          <CardContent>
            <MockTestMetadata mockTest={mockTest} />

            <Box sx={{ m: 1 }} />

            <MockTestQuestion questionList={mockTest?.questions} />

            <Box sx={{ m: 1 }} />

            <MockTestProduct productList={mockTest?.products} />
          </CardContent>
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

      {/* Delete MockTest Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogTitle id="alert-dialog-title">
              Are you sure to Delete it?
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText id="alert-dialog-description">
                If you click AGREE, mock test will be deleted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={deleting}
                onClick={() => setOpenDeleteDialog(false)}
              >
                Disagree
              </Button>
              <LoadingButton
                loading={deleting}
                onClick={deleteMockTest}
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

      {/* Language Management Dialog */}
      <Dialog
        open={openLanguageDialog}
        onClose={() => setOpenLanguageDialog(false)}
        aria-labelledby="language-dialog-title"
        aria-describedby="language-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="language-dialog-title">
          Languages for Mock Test {mockTest?.mtId}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="language-dialog-description" sx={{ mb: 2 }}>
            {hasLanguageAssigned()
              ? `Primary language: ${lang[mockTest.lang]?.level}`
              : "No language assigned to this mock test."}
          </DialogContentText>

          {/* Primary Language Section */}
          {hasLanguageAssigned() && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary">
                Primary Language
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 1,
                  border: "2px solid",
                  borderColor: "primary.main",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "primary.lighter"
                      : theme.palette.action.hover,
                })}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">
                    {lang[mockTest.lang]?.symbol}
                  </Typography>

                  <Typography variant="h6">
                    {lang[mockTest.lang]?.level}
                  </Typography>

                  <Chip
                    label="Primary"
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </Stack>

                {currLang !== mockTest?.lang && (
                  <LoadingButton
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setLangContent({
                        name: mockTest?.name,
                        description: mockTest?.description,
                      });
                      setOpenLanguageDialog(false);
                      setCurrLang(mockTest?.lang);
                    }}
                    startIcon={<Iconify icon="mdi:eye-circle" />}
                  >
                    View
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          )}

          {/* Translated Languages Section */}
          {mockTest?.translatedLang && mockTest.translatedLang.length > 0 && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" color="success.main">
                Available Translations
              </Typography>

              <Stack spacing={1}>
                {mockTest.translatedLang.map((langCode) => (
                  <Stack
                    key={langCode}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={(theme) => ({
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "success.main",
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "success.lighter"
                          : theme.palette.action.hover,
                    })}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">
                        {lang[langCode]?.symbol}
                      </Typography>

                      <Typography variant="body1">
                        {lang[langCode]?.level}
                      </Typography>

                      <Chip
                        label="Translated"
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      {currLang !== langCode && (
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={async () => {
                            setLangContent({
                              name: mockTest[langCode]?.name,
                              description: mockTest[langCode]?.description,
                            });
                            setOpenLanguageDialog(false);
                            setCurrLang(langCode);
                          }}
                          startIcon={<Iconify icon="mdi:eye-circle" />}
                        >
                          View
                        </LoadingButton>
                      )}

                      {user.labels.findIndex(
                        (label) =>
                          label === labels.founder || label === labels.admin
                      ) !== -1 && (
                        <LoadingButton
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={async () => {
                            navigate(
                              PATH_DASHBOARD.mockTest.translate(
                                mockTestId,
                                langCode
                              )
                            );
                          }}
                          startIcon={<Iconify icon="mdi:eye-circle" />}
                        >
                          Edit
                        </LoadingButton>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {user.labels.findIndex(
            (label) => label === labels.founder || label === labels.admin
          ) !== -1 && (
            <>
              {/* Available for Translation Section */}
              {getAvailableLanguagesForTranslation().length > 0 && (
                <Stack spacing={2}>
                  <Typography variant="h6" color="warning.main">
                    Available for Translation
                  </Typography>
                  <Stack spacing={1}>
                    {getAvailableLanguagesForTranslation().map((langCode) => (
                      <Stack
                        key={langCode}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6">
                            {lang[langCode]?.symbol}
                          </Typography>
                          <Typography variant="body1">
                            {lang[langCode]?.level}
                          </Typography>
                        </Stack>
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={async () => {
                            setTranslating(true);
                            await appwriteDatabases.createDocument(
                              APPWRITE_API.databaseId,
                              APPWRITE_API.collections.translatedMockTest,
                              ID.unique(),
                              {
                                mockTestId: mockTestId,
                                lang: langCode,
                              }
                            );
                            const c = mockTest?.translatedLang || [];
                            await appwriteDatabases.updateDocument(
                              APPWRITE_API.databaseId,
                              APPWRITE_API.collections.mockTest,
                              mockTestId,
                              {
                                translatedLang: [...c, langCode],
                              }
                            );
                            setTranslating(false);
                            navigate(
                              PATH_DASHBOARD.mockTest.translate(
                                mockTestId,
                                langCode
                              )
                            );
                          }}
                          loading={translating}
                          startIcon={<Iconify icon="mdi:translate" />}
                        >
                          Translate
                        </LoadingButton>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}

              {/* No translations available */}
              {getAvailableLanguagesForTranslation().length === 0 &&
                (!mockTest?.translatedLang ||
                  mockTest.translatedLang.length === 0) &&
                hasLanguageAssigned() && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    All available languages have been translated for this mock
                    test.
                  </Alert>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLanguageDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Language Assignment Dialog */}
      <Dialog
        open={openLanguageAssignmentDialog}
        onClose={() => setOpenLanguageAssignmentDialog(false)}
        aria-labelledby="language-assignment-dialog-title"
        aria-describedby="language-assignment-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="language-assignment-dialog-title">
          Assign Language for Mock Test {mockTest?.mtId}
        </DialogTitle>
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogContent dividers>
              <DialogContentText id="language-assignment-dialog-description">
                This mock test doesn't have a language assigned. Please select a
                language from the list below:
              </DialogContentText>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {Object.entries(lang).map(([code, language]) => (
                  <Stack
                    key={code}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={(theme) => ({
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor:
                        selectedLanguage === code ? "primary.main" : "divider",
                      bgcolor:
                        selectedLanguage === code
                          ? theme.palette.mode === "light"
                            ? "primary.lighter"
                            : theme.palette.action.hover
                          : theme.palette.background.paper,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor:
                          selectedLanguage === code
                            ? theme.palette.mode === "light"
                              ? "primary.lighter"
                              : theme.palette.action.hover
                            : theme.palette.action.hover,
                      },
                    })}
                    onClick={() => setSelectedLanguage(code)}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">{language.symbol}</Typography>
                      <Typography variant="body1">{language.level}</Typography>
                    </Stack>
                    {selectedLanguage === code && (
                      <Iconify icon="eva:checkmark-fill" color="primary.main" />
                    )}
                  </Stack>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLanguageAssignmentDialog(false)}>
                Cancel
              </Button>
              <LoadingButton
                onClick={handleLanguageAssignment}
                disabled={!selectedLanguage}
                variant="contained"
              >
                Assign Language
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
