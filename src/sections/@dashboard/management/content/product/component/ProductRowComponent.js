import { Fragment, useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "auth/useAuthContext";
import { useSnackbar } from "components/snackbar";
import {
  appwriteDatabases,
  appwriteFunctions,
  appwriteStorage,
} from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { ID, Query } from "appwrite";
import { lang } from "assets/data/lang";
import { labels, sarthakAPIPath } from "assets/data";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Alert,
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
  Box,
} from "@mui/material";
import Iconify from "components/iconify";
import Image from "components/image";
import { PATH_DASHBOARD } from "routes/paths";
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import { Marker } from "react-mark.js";
import { CarouselAnimation } from "components/carousel";
import { Item } from "components/item/Item";
import ProductMetadata from "sections/@dashboard/management/content/product/component/ProductMetadata";
import ProductMockTest from "sections/@dashboard/management/content/product/component/ProductMockTest";

export default function ProductRowComponent({ productId }) {
  const { getProduct } = useContent();
  const [product, setProduct] = useState(
    localStorage.getItem(`product_${productId}`)
      ? JSON.parse(localStorage.getItem(`product_${productId}`))
      : {}
  );
  const [langContent, setLangContent] = useState(
    localStorage.getItem(`product_${productId}`)
      ? {
          name: JSON.parse(localStorage.getItem(`product_${productId}`))?.name,
          description: JSON.parse(localStorage.getItem(`product_${productId}`))
            ?.description,
        }
      : {}
  );
  const [currLang, setCurrLang] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(
    localStorage.getItem(`product_${productId}`) ? false : true
  );
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false);
  const [openLanguageAssignmentDialog, setOpenLanguageAssignmentDialog] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const x = await getProduct(productId);
      if (x) {
        setLangContent({ name: x?.name, description: x?.description });
        setCurrLang(x?.lang);
      }
      setProduct(x);
      setIsDataLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const publishProduct = async () => {
    setPublishing(true);
    try {
      const x = await appwriteFunctions.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({ productId: productId }),
        false,
        sarthakAPIPath.product.publish
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

  const hasLanguageAssigned = () => {
    return product?.lang && product.lang !== null && product.lang !== undefined;
  };

  const handleLanguageAssignment = async () => {
    if (!selectedLanguage) {
      enqueueSnackbar("Please select a language", { variant: "error" });
      return;
    }
    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        productId,
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
    const translatedLanguages = product?.translatedLang || [];
    const primaryLanguage = product?.lang;
    return Object.keys(lang).filter(
      (langCode) =>
        langCode !== primaryLanguage && !translatedLanguages.includes(langCode)
    );
  };

  const deleteProduct = async () => {
    setDeleting(true);
    const x = await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      productId,
      [Query.select(["published", "images", "translatedLang"])]
    );
    const canDelete = x.published === false;
    if (!canDelete) {
      enqueueSnackbar(
        "Cannot delete product as it is published. Unpublish or de-reference associations first.",
        { variant: "error" }
      );
      setDeleting(false);
      setOpenDeleteDialog(false);
      return;
    }

    // delete images from storage
    for (const img of x.images) {
      await appwriteStorage.deleteFile(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        img
      );
    }

    // delete translated docs
    for (const langCode of x.translatedLang || []) {
      const translatedDoc = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedProducts,
          [
            Query.equal("productId", productId),
            Query.equal("lang", langCode),
            Query.select("$id"),
          ]
        )
      ).documents[0];
      await appwriteDatabases.deleteDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.translatedProducts,
        translatedDoc.$id
      );
    }

    await appwriteDatabases.deleteDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      productId
    );

    setDeleting(false);
    setOpenDeleteDialog(false);
    localStorage.removeItem(`product_${productId}`);
    enqueueSnackbar(`Product Deleted Successfully with ID: [${productId}]`, {
      variant: "success",
    });
    navigate(PATH_DASHBOARD.product.list);
  };

  if (isDataLoading) {
    return (
      <Fragment>
        <Card sx={{ m: 1 }}>
          <Divider sx={{ mt: 2, mb: 2 }}>
            <Chip
              label={productId}
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

          <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />

          <Skeleton sx={{ m: 2 }} variant="rounded" height={50} />
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
                label={product?.productId}
                color="success"
                icon={<Iconify icon="fluent-emoji:money-bag" />}
              />
            </Divider>
          }
          action={
            <Stack direction="row">
              {product?.published && (
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
          <Grid container spacing={1}>
            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <Grid container spacing={1}>
                <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                  <Item>
                    <Marker mark={content}>
                      <Typography variant="h5" sx={{ m: 1 }}>
                        {langContent?.name}
                      </Typography>
                    </Marker>
                  </Item>
                </Grid>

                <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                  <Item>
                    <Marker mark={content}>
                      <Typography variant="body1" sx={{ m: 1 }}>
                        {langContent?.description}
                      </Typography>
                    </Marker>
                  </Item>
                </Grid>
              </Grid>
            </Grid>

            <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
              <CarouselAnimation
                data={product?.images.map((i) => ({ id: i, image: i }))}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions disableSpacing>
          {/* Published Info */}
          {product?.published && (
            <Tooltip title="Published">
              <Iconify icon="noto:locked" sx={{ m: 1 }} />
            </Tooltip>
          )}

          {/* Unpublish */}
          {product?.published && (
            <Tooltip title="Unpublish">
              <IconButton onClick={() => {}}>
                <Iconify icon="mdi:lock-open-outline" color="#ff2889" />
              </IconButton>
            </Tooltip>
          )}

          {/* Edit */}
          {!product?.published && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => navigate(PATH_DASHBOARD.product.edit(productId))}
              >
                <Iconify icon="fluent-color:edit-16" />
              </IconButton>
            </Tooltip>
          )}

          {/* Publish */}
          {!product?.published &&
            user.labels.findIndex(
              (label) => label === labels.founder || label === labels.admin
            ) !== -1 && (
              <Tooltip title="Publish">
                <IconButton
                  disabled={product?.published}
                  onClick={() => setOpenPublishDialog(true)}
                >
                  <Iconify icon="ic:round-publish" color="#ff2889" />
                </IconButton>
              </Tooltip>
            )}

          {/* Delete */}
          {!product?.published &&
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

          {/* Language Management */}
          <Tooltip
            title={hasLanguageAssigned() ? "View Languages" : "Assign Language"}
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
        </CardActions>

        <CardContent>
          <ProductMetadata product={product} />

          <Box sx={{ m: 1 }} />

          <ProductMockTest mockTestList={product?.mockTest} />
        </CardContent>
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
                If you click AGREE, product will be published. After that there
                won't be any edit entertained. You can click DISAGREE, if you
                feel that the product is not needed to be published.
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
                onClick={publishProduct}
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

      {/* Delete Product Dialog */}
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
                If you click AGREE, product will be deleted.
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
                onClick={deleteProduct}
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
          Languages for Product {product?.productId}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="language-dialog-description" sx={{ mb: 2 }}>
            {hasLanguageAssigned()
              ? `Primary language: ${lang[product.lang]?.level}`
              : "No language assigned to this product."}
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
                    {lang[product.lang]?.symbol}
                  </Typography>
                  <Typography variant="h6">
                    {lang[product.lang]?.level}
                  </Typography>
                  <Chip
                    label="Primary"
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </Stack>

                {currLang !== product?.lang && (
                  <LoadingButton
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setLangContent({
                        name: product?.name,
                        description: product?.description,
                      });
                      setOpenLanguageDialog(false);
                      setCurrLang(product?.lang);
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
          {product?.translatedLang && product.translatedLang.length > 0 && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" color="success.main">
                Available Translations
              </Typography>

              <Stack spacing={1}>
                {product.translatedLang.map((langCode) => (
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
                              name: product[langCode]?.name,
                              description: product[langCode]?.description,
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
                              PATH_DASHBOARD.product.translate(
                                productId,
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
                              APPWRITE_API.collections.translatedProducts,
                              ID.unique(),
                              { productId: productId, lang: langCode }
                            );
                            const c = product?.translatedLang || [];
                            await appwriteDatabases.updateDocument(
                              APPWRITE_API.databaseId,
                              APPWRITE_API.collections.products,
                              productId,
                              { translatedLang: [...c, langCode] }
                            );
                            setTranslating(false);
                            navigate(
                              PATH_DASHBOARD.product.translate(
                                productId,
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
                (!product?.translatedLang ||
                  product.translatedLang.length === 0) &&
                hasLanguageAssigned() && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    All available languages have been translated for this
                    product.
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
          Assign Language for Product {product?.productId}
        </DialogTitle>
        {user.labels.findIndex(
          (label) => label === labels.founder || label === labels.admin
        ) !== -1 ? (
          <Fragment>
            <DialogContent dividers>
              <DialogContentText id="language-assignment-dialog-description">
                This product doesn't have a language assigned. Please select a
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
