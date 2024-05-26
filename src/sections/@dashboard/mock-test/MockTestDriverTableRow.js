import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import Label from "../../../components/label";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function MockTestDriverTableRow({ row }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState();
  const [mockTests, setMockTests] = useState([]);
  const [cnt, setCnt] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        [
          Query.equal("mockTestDriverId", row.mtdId),
          Query.limit(100),
          Query.orderDesc("$createdAt"),
        ]
      );
      setMockTests(x.documents);
      setCnt(x.total);
    };
    fetchData();
  }, [row]);

  return (
    <React.Fragment>
      <TableRow selected={open} hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.mtdId}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.standardIds}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.subjectIds}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.chapterIds}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap paragraph>
            {row.conceptIds}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap paragraph>
            {cnt}
          </Typography>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Mock-Test
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Description</TableCell>
                    <TableCell align="right">Published</TableCell>
                    <TableCell align="center">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTests.map((mockTest) => (
                    <TableRow hover key={mockTest.$id}>
                      <TableCell component="th" scope="row">
                        {mockTest.mtId}
                      </TableCell>
                      <TableCell>{mockTest.name}</TableCell>
                      <TableCell align="right">
                        {mockTest.description}
                      </TableCell>
                      <TableCell align="right">
                        <Label
                          variant="soft"
                          color={
                            (mockTest?.published === false && "error") ||
                            "success"
                          }
                          sx={{ textTransform: "capitalize" }}
                        >
                          {mockTest?.published ? "Published" : "Unpublished"}
                        </Label>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(PATH_DASHBOARD.mockTest.view(mockTest.$id))
                          }
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
