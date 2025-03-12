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
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Stack,
  TextField,
  Typography,
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

export default function ProductEditForm({ productId }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const { productsData, updateProduct } = useContent();
  const { user } = useAuthContext();

  const [dragStarted, setDragStarted] = useState(false);
  const [product, setProduct] = useState(productsData[productId]);
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
    const update = async () => {
      let x = product;
      setIsDataLoading(true);
      if (x === undefined) {
        x = await updateProduct(productId);
      } else {
        const isChanged =
          (
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.products,
              productId,
              [Query.select("$updatedAt")]
            )
          ).$updatedAt !== product.$updatedAt;
        if (isChanged) {
          x = await updateProduct(productId);
        }
      }
      setProduct(x);
      setSavedImages(x?.images);
      setSelectedMockTests(x.mockTest);
      setIsDataLoading(false);
    };
    update().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadMockTests = async (lastSyncId) => {
    setAllMockTests({ ...allMockTests, loading: true });
    let query = [];
    if (lastSyncId !== null) {
      query.push(Query.cursorAfter(lastSyncId));
    }
    query.push(Query.limit(100));
    query.push(Query.select("$id"));
    query.push(Query.orderDesc("$createdAt"));
    query.push(Query.equal("published", true));
    query.push(
      Query.or([
        Query.equal("bookIndex", product?.bookIndex?.$id),
        Query.equal("standard", product?.bookIndex?.$id),
        Query.equal("subject", product?.bookIndex?.$id),
      ])
    );
    const x = await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      query
    );
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
  };

  const saveProduct = async () => {
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
    return <Skeleton height={150} />;
  }

  if (product?.published) {
    navigate(PATH_DASHBOARD.product.view(productId));
  }

  return (
    <Fragment>
      <Stack alignItems="center" justifyContent="space-between" direction="row">
        <Breadcrumbs sx={{ mb: 1, mt: 1 }}>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {product?.standard?.standard}
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            {product?.subject?.subject}
          </Link>
        </Breadcrumbs>
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

      <Divider sx={{ m: 1 }}>
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

      <Divider sx={{ m: 1 }}>
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
            <IndexView id={product.bookIndex.$id} />
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
