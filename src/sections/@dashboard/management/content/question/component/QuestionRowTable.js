import { Skeleton, TableCell, TableRow } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { Marker } from "react-mark.js";
import ReactKatex from "@pkasila/react-katex";
import Label from "components/label";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { Query } from "appwrite";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function QuestionRowTable({ id, searchId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRow(
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.questions,
          id,
          [Query.select(["qnId", "contentQuestion", "creator", "published"])]
        )
      );
      setLoading(false);
    };
    fetchData().then(() => {});
  }, [id]);

  if (loading) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      onClick={() => {
        navigate(
          PATH_DASHBOARD.question.view(id) +
            "?searchId=" +
            searchId +
            (content === "" ? "" : "&content=" + content)
        );
      }}
      hover
      role="checkbox"
      tabIndex={-1}
      sx={{
        cursor: "pointer",
      }}
    >
      <TableCell>{row["qnId"]}</TableCell>
      <TableCell>
        <Marker mark={content}>
          <ReactKatex>{row?.contentQuestion}</ReactKatex>
        </Marker>
      </TableCell>
      <TableCell>{row?.creator}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={(row?.published === false && "error") || "success"}
          sx={{ textTransform: "capitalize" }}
        >
          {row?.published ? "Published" : "Draft"}
        </Label>
      </TableCell>
    </TableRow>
  );
}
