import { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import {
    Card,
    Table,
    TableBody,
    Container,
    TableContainer,
    Button,
    LinearProgress,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import { useSettingsContext } from "../../../../components/settings";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import Iconify from "../../../../components/iconify/Iconify";
// sections
import CreateCouponModal from "./CreateCoupon";

import {
    useTable,
    getComparator,
    emptyRows,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from "../../../../components/table";
import Scrollbar from "../../../../components/scrollbar";
import { UserTableRow } from "../../../../sections/@dashboard/team/list";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "sn", label: "S.no", align: "left" },
    { id: "coupon_id", label: "Coupon ID", align: "left" },
    { id: "coupon", label: "Coupon", align: "left" },
    { id: "valid_from", label: "Valid From", align: "left" },
    { id: "valid_to", label: "Valid To", align: "center" },
];

// ----------------------------------------------------------------------

export default function CouponsListPage() {
    const { themeStretch } = useSettingsContext();
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(false);

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    return (
        <>
            <Helmet>
                <title> Coupon List | Sarthak Admin</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Coupons"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: "Coupons",
                            href: PATH_DASHBOARD.root,
                        },
                    ]}
                    action={
                        <Button
                            onClick={() => setOpen(!open)}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Coupon
                        </Button>
                    }
                />
                {open ? (
                    <CreateCouponModal open={open} setOpen={setOpen} />
                ) : null}

                <Card>
                    <TableContainer
                        sx={{ position: "relative", overflow: "unset" }}
                    >
                        <Scrollbar>
                            {update ? (
                                <LinearProgress />
                            ) : (
                                <Table size={"medium"} sx={{ minWidth: 800 }}>
                                    <TableHeadCustom
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        onSort={onSort}
                                    />

                                    <TableBody>
                                        <TableEmptyRows
                                            height={5}
                                            emptyRows={emptyRows(1, 5, 30)}
                                        />
                                    </TableBody>
                                </Table>
                            )}
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={30}
                        page={5}
                        rowsPerPage={5}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                    />
                </Card>
                {/* <QuestionNewCreateForm /> */}
            </Container>
        </>
    );
}

/*
action={
                        <Button
                            onClick={() =>
                                window.open(
                                    PATH_DASHBOARD.question.new,
                                    "_self"
                                )
                            }
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Coupon
                        </Button>
                    } */
