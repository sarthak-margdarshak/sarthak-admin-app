import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { Container } from "@mui/material";
import { useSettingsContext } from "components/settings";
import { useLocation } from "react-router-dom";
import ProductEditForm from "sections/@dashboard/management/content/product/component/ProductEditForm";

export default function ProductEditPage() {
  const { themeStretch } = useSettingsContext();
  const location = useLocation();
  const [productId, setProductId] = useState(location.pathname.split("/")[3]);

  useEffect(() => {
    setProductId(location.pathname.split("/")[3]);
  }, [location.pathname]);

  return (
    <Fragment>
      <Helmet>
        <title> Product: Edit | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Edit Product"
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

        <ProductEditForm productId={productId} />
      </Container>
    </Fragment>
  );
}
