import { Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";

export default function IndexView({ id }) {
  const { getBookIndex } = useContent();
  const [label, setLabel] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLabel(await getBookIndex(id));
      setLoading(false);
    };
    fetchData();
  }, [getBookIndex, id]);

  if (loading) {
    return <Skeleton variant="text" width={100} sx={{ fontSize: "1rem" }} />;
  }

  return <Typography variant='body2'>{label}</Typography>;
}
