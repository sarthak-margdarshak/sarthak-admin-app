import { Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function IndexView({ id }) {
  const { getBookIndex } = useContent();
  const [label, setLabel] = useState(
    localStorage.getItem(`bookIndex_${id}`)
      ? JSON.parse(localStorage.getItem(`bookIndex_${id}`)).label
      : {}
  );
  const [loading, setLoading] = useState(
    localStorage.getItem(`bookIndex_${id}`) ? false : true
  );

  useEffect(() => {
    const fetchData = async () => {
      const x = await getBookIndex(id);
      setLabel(x.label);
      setLoading(false);
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBookIndex, id]);

  if (loading) {
    return <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />;
  }

  return <Typography>{label}</Typography>;
}
