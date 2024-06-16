import {
  Button,
  Card,
  Container,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  emptyRows,
  useTable,
} from "../../../../components/table";
import { useSettingsContext } from "../../../../components/settings";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Iconify from "../../../../components/iconify";
import { AppwriteHelper } from "../../../../auth/AppwriteHelper";
import { APPWRITE_API } from "../../../../config-global";
import ProductTableRow from "../../../../sections/@dashboard/product/ProductTableRow";
import { Query } from "appwrite";

const TABLE_HEAD = [
  { id: "productId", label: "Product Id", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "description", label: "Description", align: "left" },
  { id: "type", label: "Type", align: "left" },
  { id: "mrp", label: "MRP", align: "left" },
  { id: "sellPrice", label: "Sell Price", align: "left" },
  { id: "status", label: "Status", align: "center" },
  { id: "view", label: "View", align: "center" },
];

export default function ProductListPage() {
  const { themeStretch } = useSettingsContext();
  const [update, setUpdate] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    const fetchData = async () => {
      setUpdate(true);
      const x = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [Query.orderDesc("$createdAt")]
      );
      setAllProducts(x);
      setUpdate(false);
    };
    fetchData();
  }, [setUpdate, setAllProducts]);

  return (
    <React.Fragment>
      <Helmet>
        <title> Product | List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Product"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Products",
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              to={PATH_DASHBOARD.product.new}
              component={RouterLink}
            >
              New Product
            </Button>
          }
        />

        <Card>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              {update ? (
                <LinearProgress />
              ) : (
                <Table size={"medium"} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                  />

                  <TableBody>
                    {allProducts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return <ProductTableRow key={row.$id} row={row} />;
                      })}

                    <TableEmptyRows
                      height={72}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        allProducts.length
                      )}
                    />
                  </TableBody>
                </Table>
              )}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={allProducts.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </React.Fragment>
  );
}
