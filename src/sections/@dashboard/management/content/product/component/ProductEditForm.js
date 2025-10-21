import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuthContext } from "auth/useAuthContext";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { Fragment, useCallback, useEffect, useState } from "react";
import { appwriteDatabases, appwriteStorage } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { ID, Query } from "appwrite";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import { LoadingButton } from "@mui/lab";
import { Reorder } from "framer-motion";
import MockTestRowComponent from "sections/@dashboard/management/content/mock-test/component/MockTestRowComponent";
import { Upload } from "components/upload";
import Image from "components/image";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { lang } from "assets/data/lang";

export default function ProductEditForm({ productId }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const { getProduct } = useContent();
  const { user } = useAuthContext();

  const [dragStarted, setDragStarted] = useState(false);
  const [product, setProduct] = useState(
    localStorage.getItem(`product_${productId}`)
      ? JSON.parse(localStorage.getItem(`product_${productId}`))
      : {}
  );
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [availableLangEntries, setAvailableLangEntries] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allMockTests, setAllMockTests] = useState({
    loadedOnce: false,
    loading: true,
    total: 0,
    mockTests: [],
    lastSyncId: null,
    selected: [],
  });
  const [selectedMockTests, setSelectedMockTests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [deletedImage, setDeletedImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const x = await getProduct(productId);
        setProduct(x);
        setSavedImages(x?.images || []);
        setSelectedMockTests(x?.mockTest || []);
        setSelectedLanguage(x?.lang || "");
        setAvailableLangEntries(
          Object.entries(require("assets/data/lang").lang).filter(
            ([code]) => !(x?.translatedLang || []).includes(code)
          )
        );
      } catch (error) {
        console.log(error);
      }
      setIsDataLoading(false);
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadMockTests = async (lastSyncId) => {
    setAllMockTests({ ...allMockTests, loading: true });
    let query = [];
    if (lastSyncId !== null) {
      query.push(Query.cursorAfter(lastSyncId));
    }
    query.push(Query.limit(10));
    query.push(Query.select("$id"));
    query.push(Query.orderDesc("$createdAt"));
    query.push(Query.equal("published", true));
    query.push(
      Query.or([
        Query.equal("bookIndexId", product?.bookIndexId),
        Query.equal("standardId", product?.bookIndexId),
        Query.equal("subjectId", product?.bookIndexId),
      ])
    );
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      query
    );
    if (x.total !== 0) {
      let tempAllMockTests = allMockTests.mockTests.concat(
        x.documents.map((q) => q.$id)
      );
      let tempSelected = allMockTests.selected.concat(
        new Array(x.documents.length).fill(false)
      );
      product.mockTest.forEach((question) => {
        const x = tempAllMockTests.findIndex((q) => q === question);
        if (x !== -1) {
          tempSelected[x] = true;
        }
      });
      setAllMockTests({
        loadedOnce: true,
        loading: false,
        total: x.total,
        mockTests: tempAllMockTests,
        lastSyncId: x.documents[x.documents.length - 1].$id,
        selected: tempSelected,
      });
    }
  };

  const saveProduct = async () => {
    // Frontend validations
    const name = (product?.name || "").toString().trim();
    const description = (product?.description || "").toString().trim();
    const mrp = parseFloat(product?.mrp);
    const sellPrice = parseFloat(product?.sellPrice);
    const langSelected = selectedLanguage || product?.lang || null;

    if (!name) {
      enqueueSnackbar("Please enter a name for the product", {
        variant: "error",
      });
      return;
    }

    if (!description) {
      enqueueSnackbar("Please enter a description for the product", {
        variant: "error",
      });
      return;
    }

    if (!Number.isFinite(mrp) || mrp <= 0) {
      enqueueSnackbar("Please enter a valid MRP", { variant: "error" });
      return;
    }

    if (!Number.isFinite(sellPrice) || sellPrice < 0) {
      enqueueSnackbar("Please enter a valid selling price", {
        variant: "error",
      });
      return;
    }

    if (!langSelected) {
      enqueueSnackbar("Please select a language for the product", {
        variant: "error",
      });
      return;
    }

    // Images validation: either existing savedImages or newly added files
    const totalImages = (savedImages || []).length + (files || []).length;
    if (totalImages === 0) {
      enqueueSnackbar("Please add at least one image for the product", {
        variant: "error",
      });
      return;
    }

    // Mock tests validation: at least one mock test should be selected
    const mockTests = Array.isArray(selectedMockTests) ? selectedMockTests : [];
    if (mockTests.length === 0) {
      enqueueSnackbar("Please add at least one mock test for the product", {
        variant: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Delete remove files
      for (let i in deletedImage) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          deletedImage[i].split("/")[8]
        );
      }
      // Upload Files first
      const arrUploadedFiles = savedImages.map((img) => img.value);
      for (let i in files) {
        arrUploadedFiles.push(
          (
            await appwriteStorage.createFile(
              APPWRITE_API.buckets.sarthakDatalakeBucket,
              ID.unique(),
              files[i]
            )
          ).$id
        );
      }

      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        productId,
        {
          name: product?.name,
          description: product?.description,
          mockTest: selectedMockTests,
          images: arrUploadedFiles,
          updater: user.$id,
          lang: langSelected,
          mrp: parseFloat(product?.mrp),
          sellPrice: parseFloat(product?.sellPrice),
        }
      );

      enqueueSnackbar("Successfully Updated the product - " + product?.$id, {
        variant: "success",
      });

      navigate(PATH_DASHBOARD.product.view(productId));
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
    setIsSaving(false);
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
      (fileFiltered) => fileFiltered !== inputFile
    );
    const x = deletedImage;
    x.push(inputFile);
    setDeletedImage(x);
    setSavedImages(filesFiltered);
  };

  if (isDataLoading) {
    return (
      <Fragment>
        <Divider>
          <Chip label={product?.productId || productId} color="info" />
        </Divider>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Product Details" />
          <CardContent>
            <Skeleton variant="rounded" height={100} />
          </CardContent>
        </Card>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Images" />
          <CardContent>
            <Skeleton variant="rounded" height={120} />
          </CardContent>
        </Card>

        <Card sx={{ m: 1 }}>
          <CardHeader title="Mock Tests" />
          <CardContent>
            <Skeleton variant="rounded" height={150} />
          </CardContent>
        </Card>
      </Fragment>
    );
  }

  if (product?.published) {
    navigate(PATH_DASHBOARD.product.view(productId));
  }

  return (
    <Fragment>
      <Stack alignItems="center" justifyContent="space-between" direction="row">
        <IndexView id={product.bookIndexId} />

        <LoadingButton
          variant="contained"
          loading={isSaving}
          onClick={saveProduct}
        >
          Save
        </LoadingButton>
      </Stack>

      <Divider sx={{ mb: 3 }}>
        <Chip label={product?.productId} color="info" />
      </Divider>

      {/* Language selection block */}
      <Box component="section" sx={{ p: 2, border: "1px dashed grey", m: 2 }}>
        <Fragment>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Box sx={{ bgcolor: "secondary.lighter", borderRadius: 2, p: 1 }}>
              <Iconify icon="mdi:translate" width={36} height={36} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Select Language</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select a language for this product.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="product-lang-select-label">
                    Language
                  </InputLabel>
                  <Select
                    labelId="product-lang-select-label"
                    value={selectedLanguage}
                    label="Language"
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <MenuItem value="">(None)</MenuItem>
                    {availableLangEntries.map(([code, info]) => (
                      <MenuItem key={code} value={code}>
                        {info.level} ({code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Chip
                  label={
                    selectedLanguage
                      ? `${lang[selectedLanguage]?.level} (${selectedLanguage})`
                      : "No Language selected"
                  }
                  size="small"
                  color={selectedLanguage ? "primary" : "default"}
                />
              </Stack>
            </Box>
          </Stack>
        </Fragment>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} padding={1}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 100 }}
                id="product-name"
                label="Product Name"
                value={product?.name}
                onChange={(event) =>
                  setProduct({ ...product, name: event.target.value })
                }
                helperText="Enter a unique name"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                type="number"
                id="product-mrp"
                label="Product MRP"
                value={product?.mrp}
                onChange={(event) =>
                  setProduct({ ...product, mrp: event.target.value })
                }
                helperText="Enter the MRP"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                type="number"
                id="product-sell-price"
                label="Product Sell Price"
                value={product?.sellPrice}
                onChange={(event) =>
                  setProduct({ ...product, sellPrice: event.target.value })
                }
                helperText="Enter the Sell Price"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            fullWidth
            multiline
            rows={5.3}
            inputProps={{ maxLength: 500 }}
            id="product-description"
            label="Description"
            value={product?.description}
            onChange={(event) =>
              setProduct({ ...product, description: event.target.value })
            }
            helperText="Describe this product"
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
      </Grid>

      <Divider sx={{ m: 2 }}>
        <Chip label="Images" />
      </Divider>

      <Grid container spacing={1}>
        {savedImages.map((img) => (
          <Grid item key={img} xs={6} sm={6} md={4} lg={3} xl={3}>
            <Image
              disabledEffect
              alt={img}
              src={img}
              ratio="4/3"
              sx={{
                borderRadius: 1,
                width: "calc(100% - 10px)",
                height: "calc(100% - 10px)",
              }}
            />

            <IconButton sx={{ mt: -8 }} onClick={() => removeSavedFile(img)}>
              <Iconify icon="mdi:remove-box" sx={{ color: "#e70d0d" }} />
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

      <Divider sx={{ m: 2 }}>
        <Chip label="Mock Tests" />
      </Divider>

      <Reorder.Group
        values={selectedMockTests}
        onReorder={setSelectedMockTests}
        as="ol"
      >
        {selectedMockTests.map((mockTest) => (
          <Reorder.Item
            value={mockTest}
            key={mockTest}
            onDragStart={() => setDragStarted(true)}
            onDragEnd={() => setDragStarted(false)}
          >
            <Box sx={{ m: 1, cursor: dragStarted ? "grabbing" : "grab" }}>
              <MockTestRowComponent
                mockTestId={mockTest}
                defaultExpanded={false}
              />
            </Box>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button
        fullWidth
        variant="outlined"
        sx={{ height: 80 }}
        onClick={async () => {
          setDrawerOpen(true);
          if (!allMockTests.loadedOnce) {
            await loadMockTests(allMockTests.lastSyncId);
          }
        }}
      >
        Add / Remove Mock Test
      </Button>

      <Drawer
        anchor={"right"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Alert
          severity="info"
          sx={{ m: 2 }}
          icon={<Iconify icon="oui:app-index-rollup" />}
        >
          <Stack spacing={1} direction="row">
            <Typography sx={{ fontWeight: "bold" }}>
              {"All published mock tests under index  :-  "}
            </Typography>
            <IndexView id={product.bookIndexId} />
          </Stack>
        </Alert>

        <Fab
          sx={{ width: 110, borderRadius: 1, ml: 2 }}
          onClick={() => {
            setSelectedMockTests(
              allMockTests.mockTests.filter(
                (q, index) => allMockTests.selected[index]
              )
            );
            setDrawerOpen(false);
          }}
        >
          <KeyboardDoubleArrowLeftIcon sx={{ mr: 1 }} />
          Update
        </Fab>

        {allMockTests.mockTests.map((mockTest, index) => (
          <Box
            key={mockTest}
            component="section"
            sx={{
              width: 900,
              p: 1,
              m: 1,
              border: "1px solid grey",
              backgroundColor: allMockTests.selected[index]
                ? alpha(theme.palette.primary.light, 0.5)
                : theme.palette.background.default,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <Checkbox
                  checked={allMockTests.selected[index]}
                  onChange={(event, checked) => {
                    allMockTests.selected[index] = checked;
                    setAllMockTests({
                      ...allMockTests,
                      selected: allMockTests.selected,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={11}>
                <MockTestRowComponent
                  mockTestId={mockTest}
                  defaultExpanded={false}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {allMockTests.mockTests.length !== allMockTests.total && (
          <Button
            fullWidth
            disabled={allMockTests.loading}
            startIcon={<KeyboardDoubleArrowDownIcon />}
            endIcon={<KeyboardDoubleArrowDownIcon />}
            onClick={async () => await loadMockTests(allMockTests.lastSyncId)}
            sx={{ mb: 5 }}
          >
            {"Loaded " +
              allMockTests.mockTests.length +
              " out of " +
              allMockTests.total +
              "! Load More"}
          </Button>
        )}
      </Drawer>
    </Fragment>
  );
}
