import {Fragment, useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Container, Grid, IconButton, Stack, Typography} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {PATH_DASHBOARD} from "routes/paths";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {useSettingsContext} from "components/settings";
import {useContent} from "sections/@dashboard/management/content/hook/useContent";
import {useLocation, useNavigate} from "react-router-dom";
import ProductRowComponent
  from "sections/@dashboard/management/content/product/component/ProductRowComponent";

export default function ProductViewPage() {
  const { themeStretch } = useSettingsContext();
  const { searchList } = useContent();
  const navigate = useNavigate();

  const location = useLocation();
  const [productId, setProductId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setIndex(searchList.findIndex((item) => item.$id === id));
    setProductId(location.pathname.split("/")[3]);
  }, [location.pathname, searchList]);

  return (
    <Fragment>
      <Helmet>
        <title> Product: View | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <Grid container>
          <Grid item xs={index !== -1 ? 10 : 12}>
            <CustomBreadcrumbs
              heading="View Product"
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
                },
              ]}
            />
          </Grid>

          {index !== -1 && (
            <Grid item xs={2}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {index + 1 + " of " + searchList.length}
                </Typography>
                <IconButton
                  disabled={index === 0}
                  onClick={() =>
                    navigate(
                      PATH_DASHBOARD.product.view(searchList[index - 1].$id) +
                      window.location.search,
                      { replace: true }
                    )
                  }
                >
                  <ArrowLeftIcon />
                </IconButton>
                <IconButton
                  disabled={index === searchList.length - 1}
                  onClick={() =>
                    navigate(
                      PATH_DASHBOARD.product.view(searchList[index + 1].$id) +
                      window.location.search,
                      { replace: true }
                    )
                  }
                >
                  <ArrowRightIcon />
                </IconButton>
              </Stack>
            </Grid>
          )}
        </Grid>

        <ProductRowComponent productId={productId} />
      </Container>
    </Fragment>
  );
}
