import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import FilterView from "sections/@dashboard/management/content/layout/filter-view/FilterView";
import { useSettingsContext } from "components/settings";

export default function ProductListPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <Fragment>
      <Helmet>
        <title> Product : List | Sarthak Admin</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Product List"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Product",
            },
          ]}
        />

        <FilterView content="product" />
      </Container>
    </Fragment>
  );
}
