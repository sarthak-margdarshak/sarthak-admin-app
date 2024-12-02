import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import {
  StandardDisplayUI,
  SubjectDisplayUI,
  ConceptDisplayUI,
  ChapterDisplayUI,
} from "../question/view";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../../../components/iconify";

export default function MockTestDriverTableRow({
  id,
  mtdId,
  standardIds,
  subjectIds,
  chapterIds,
  conceptIds,
}) {
  const [cnt, setCnt] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        [Query.equal("mockTestDriverId", mtdId), Query.limit(1)]
      );
      setCnt(x.total);
    };
    fetchData();
  }, [mtdId, standardIds, subjectIds, chapterIds, conceptIds]);

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {mtdId}
          </Typography>
        </TableCell>

        <TableCell>
          {standardIds?.map((id) => (
            <StandardDisplayUI id={id} key={id} />
          ))}
        </TableCell>

        <TableCell>
          {subjectIds?.map((id) => (
            <SubjectDisplayUI id={id} key={id} />
          ))}
        </TableCell>

        <TableCell>
          {chapterIds?.map((id) => (
            <ChapterDisplayUI id={id} key={id} />
          ))}
        </TableCell>

        <TableCell>
          {conceptIds?.map((id) => (
            <ConceptDisplayUI id={id} key={id} />
          ))}
        </TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2" noWrap paragraph>
            {cnt}
          </Typography>
        </TableCell>

        <TableCell>
          <IconButton
            to={PATH_DASHBOARD.mockTest.list(mtdId)}
            component={RouterLink}
            target="_blank"
          >
            <Iconify icon="fa-solid:external-link-alt" />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
