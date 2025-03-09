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
import { LoadingButton } from "@mui/lab";
import PermissionDeniedComponent from "components/sub-component/PermissionDeniedComponent";
import IndexView from "sections/@dashboard/management/content/question/component/IndexView";
import { Marker } from "react-mark.js";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { CarouselAnimation } from "components/carousel";
import MockTestRowComponent from "sections/@dashboard/management/content/mock-test/component/MockTestRowComponent";

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

export default function ProductRowComponent({ productId }) {
  const { productsData, updateProduct } = useContent();
  let product = productsData[productId];

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [publishing, setPublishing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      if (product === undefined) {
        setIsDataLoading(true);
        await updateProduct(productId);
        setIsDataLoading(false);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.products,
              productId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== product?.$updatedAt;
        if (isChanged) {
          setIsDataLoading(true);
          await updateProduct(productId);
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
                label={
                  product?.productId +
                  " (" +
                  timeAgo.format(
                    Date.parse(
                      product?.lastSynced || "2000-01-01T00:00:00.000+00:00"
                    )
                  ) +
                  ")"
                }
                color="success"
                icon={<Iconify icon="fluent-emoji:money-bag" />}
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
                    await updateProduct(productId);
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
                        {product?.name}
                      </Typography>
                    </Marker>
                  </Item>
                </Grid>

                <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                  <Item>
                    <Marker mark={content}>
                      <Typography variant="body1" sx={{ m: 1 }}>
                        {product?.description}
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
          {product?.published ? (
            <Tooltip title="Published">
              <Iconify icon="noto:locked" sx={{ m: 1 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Publish">
              <IconButton
                disabled={product?.published}
                onClick={() => setOpenPublishDialog(true)}
              >
                <Iconify icon="ic:round-publish" color="#ff2889" />
              </IconButton>
            </Tooltip>
          )}

          {!product?.published && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => navigate(PATH_DASHBOARD.product.edit(productId))}
              >
                <Iconify icon="fluent-color:edit-16" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>

        <CardContent>
          <Accordion>
            <AccordionSummary>
              <Chip
                label="Metadata"
                color="error"
                icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
              />
            </AccordionSummary>

            <AccordionDetails>
              <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Index →</Typography>
                      <IndexView id={product?.bookIndex?.$id} />
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">
                        System Generated Id →
                      </Typography>
                      <Typography variant="body2">{productId}</Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">MRP →</Typography>
                      <Typography variant="body2">{`₹ ${product?.mrp}`}</Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Selling Price →</Typography>
                      <Typography variant="body2">
                        {`₹ ${product?.sellPrice}`}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Sarthak Id →</Typography>
                      <Typography variant="body2">
                        {product?.productId}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Status →</Typography>
                      <Typography variant="body2">
                        {product?.published ? "Published" : "Draft"}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Created By →</Typography>
                      <Typography variant="body2">
                        {product?.creator}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Created At →</Typography>
                      <Tooltip title={product?.$createdAt}>
                        <Typography variant="body2">
                          {timeAgo.format(
                            Date.parse(
                              product?.$createdAt ||
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
                        {product?.updater}
                      </Typography>
                    </Stack>
                  </Item>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Item>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body1">Updated At →</Typography>
                      <Tooltip title={product?.$updatedAt}>
                        <Typography variant="body2">
                          {timeAgo.format(
                            Date.parse(
                              product?.$updatedAt ||
                                "2000-01-01T00:00:00.000+00:00"
                            )
                          )}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Item>
                </Grid>

                {product?.published && (
                  <Fragment>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Approved By →</Typography>
                          <Typography variant="body2">
                            {product?.approver}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Item>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body1">Approved At →</Typography>
                          <Tooltip title={product?.approvedAt}>
                            <Typography variant="body2">
                              {timeAgo.format(
                                Date.parse(
                                  product?.approvedAt ||
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
                label={"Mock Tests (" + product?.mockTest?.length + ")"}
                color="error"
                icon={<Iconify icon="fluent-color:chat-bubbles-question-16" />}
              />
            </AccordionSummary>

            <AccordionDetails>
              {product?.mockTest.map((test, index) => (
                <MockTestRowComponent
                  key={index}
                  mockTestId={test}
                  defaultExpanded={false}
                />
              ))}
            </AccordionDetails>
          </Accordion>
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
    </Fragment>
  );
}
