import { Skeleton, TableCell, TableRow } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { Marker } from "react-mark.js";
import Label from "components/label";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function MockTestRowTable({ id, searchId }) {
  const { getMockTest } = useContent();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [row, setRow] = useState(
    localStorage.getItem(`mockTest_${id}`)
      ? JSON.parse(localStorage.getItem(`mockTest_${id}`))
      : {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setRow(await getMockTest(id));
      setLoading(false);
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          PATH_DASHBOARD.mockTest.view(id) +
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
      <TableCell>{row?.mtId}</TableCell>
      <TableCell>
        <Marker mark={content}>{row.name}</Marker>
      </TableCell>
      <TableCell>
        <Marker mark={content}>{row.description}</Marker>
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={(row.published === false && "error") || "success"}
          sx={{ textTransform: "capitalize" }}
        >
          {row.published ? "Published" : "Draft"}
        </Label>
      </TableCell>
    </TableRow>
  );
}
