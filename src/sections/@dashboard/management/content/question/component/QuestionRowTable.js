import { Skeleton, TableCell, TableRow } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import { Marker } from "react-mark.js";
import ReactKatex from "@pkasila/react-katex";
import Label from "components/label";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function QuestionRowTable({ id, searchId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getQuestion } = useContent();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [row, setRow] = useState(
    localStorage.getItem(`question_${id}`)
      ? JSON.parse(localStorage.getItem(`question_${id}`))
      : {}
  );
  const [isLoadingNew, setIsLoadingNew] = useState(
    localStorage.getItem(`question_${id}`) ? false : true
  );
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);
      setIsLoadingNew(localStorage.getItem(`question_${id}`) ? false : true);
      setRow(
        localStorage.getItem(`question_${id}`)
          ? JSON.parse(localStorage.getItem(`question_${id}`))
          : {}
      );
      setRow(await getQuestion(id));
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
        opacity: isRefreshing ? 0.5 : 1,
      }}
    >
      <TableCell>{row?.qnId}</TableCell>
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
