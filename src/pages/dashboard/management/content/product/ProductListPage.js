import {
  Button,
  Card,
  Container,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import Scrollbar from "../../../../../components/scrollbar/Scrollbar";
import {
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "../../../../../components/table";
import { useSettingsContext } from "../../../../../components/settings";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Iconify from "../../../../../components/iconify";
import { APPWRITE_API } from "../../../../../config-global";
import ProductTableRow from "../../../../../sections/@dashboard/management/content/product/component/ProductTableRow";
import { Query } from "appwrite";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";

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
  const [searchParams] = useSearchParams();
  const row = parseInt(searchParams.get("row")) || 5;
  const page = parseInt(searchParams.get("page")) || 0;

  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [update, setUpdate] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [totalSize, setTotalSize] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      setUpdate(true);
      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [
          Query.orderDesc("$createdAt"),
          Query.offset(page * row),
          Query.limit(row),
        ]
      );
      setAllProducts(x.documents);
      setTotalSize(x.total);
      setUpdate(false);
    };
    fetchData();
  }, [row, page]);

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
                  <TableHeadCustom headLabel={TABLE_HEAD} />

                  <TableBody>
                    {allProducts.map((row) => {
                      return <ProductTableRow key={row.$id} row={row} />;
                    })}

                    <TableEmptyRows height={72} />
                  </TableBody>
                </Table>
              )}
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalSize}
            page={page}
            rowsPerPage={row}
            onPageChange={(event, changedPage) =>
              navigate(
                PATH_DASHBOARD.product.list +
                  "?page=" +
                  changedPage +
                  "&row=" +
                  row
              )
            }
            onRowsPerPageChange={(event) =>
              navigate(
                PATH_DASHBOARD.product.list +
                  "?page=0&row=" +
                  event.target.value
              )
            }
          />
        </Card>
      </Container>
    </React.Fragment>
  );
}
