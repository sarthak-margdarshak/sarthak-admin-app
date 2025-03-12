import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSettingsContext } from "components/settings";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProductRowComponent from "sections/@dashboard/management/content/product/component/ProductRowComponent";
import Iconify from "components/iconify";

export default function ProductViewPage() {
  const { themeStretch } = useSettingsContext();
  const [searchParams] = useSearchParams();
  const { loadSearchList, searchList } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const [productId, setProductId] = useState(location.pathname.split("/")[3]);
  const [index, setIndex] = useState(-1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const searchId = searchParams.get("searchId");
  let idList = {};
  if (searchId && searchList[searchId] !== undefined) {
    idList = searchList[searchId];
  }

  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setProductId(id);
    if (searchId && searchList[searchId] !== undefined) {
      setIndex(idList?.list?.findIndex((item) => item === id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
                  {index + 1 + " of " + idList?.total}
                </Typography>

                {loadingNextPage ? (
                  <Iconify icon="line-md:loading-loop" width={40} />
                ) : (
                  <IconButton
                    disabled={index === 0}
                    onClick={() =>
                      navigate(
                        PATH_DASHBOARD.product.view(idList.list[index - 1]) +
                          window.location.search,
                        { replace: true }
                      )
                    }
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                )}

                {loadingNextPage ? (
                  <Iconify icon="line-md:loading-loop" width={40} />
                ) : (
                  <IconButton
                    disabled={index === idList?.total - 1}
                    onClick={async () => {
                      if (idList?.list?.length - 1 === index) {
                        setLoadingNextPage(true);
                        await loadSearchList(
                          searchId,
                          idList?.query,
                          idList?.collection
                        );
                        setLoadingNextPage(false);
                      }
                      idList = searchList[searchId];
                      navigate(
                        PATH_DASHBOARD.product.view(idList.list[index + 1]) +
                          window.location.search,
                        { replace: true }
                      );
                    }}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>

        <ProductRowComponent productId={productId} />
      </Container>
    </Fragment>
  );
}
