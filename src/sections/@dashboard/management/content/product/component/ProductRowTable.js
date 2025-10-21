import { PATH_DASHBOARD } from "routes/paths";
import { Skeleton, TableCell, TableRow } from "@mui/material";
import { Marker } from "react-mark.js";
import Label from "components/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function ProductRowTable({ id, searchId }) {
  const { getProduct } = useContent();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const content = searchParams.get("content")
    ? decodeURIComponent(searchParams.get("content"))
    : "";

  const [row, setRow] = useState(
    localStorage.getItem(`product_${id}`)
      ? JSON.parse(localStorage.getItem(`product_${id}`))
      : {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setRow(await getProduct(id));
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
          PATH_DASHBOARD.product.view(id) +
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
      <TableCell>{row?.productId}</TableCell>
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
