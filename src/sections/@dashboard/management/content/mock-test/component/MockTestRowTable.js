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
  const [isLoadingNew, setIsLoadingNew] = useState(
    localStorage.getItem(`mockTest_${id}`) ? false : true
  );
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);
      setIsLoadingNew(localStorage.getItem(`mockTest_${id}`) ? false : true);
      setRow(
        localStorage.getItem(`mockTest_${id}`)
          ? JSON.parse(localStorage.getItem(`mockTest_${id}`))
          : {}
      );
      setRow(await getMockTest(id));
      setIsLoadingNew(false);
      setIsRefreshing(false);
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoadingNew) {
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
        opacity: isRefreshing ? 0.5 : 1,
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
