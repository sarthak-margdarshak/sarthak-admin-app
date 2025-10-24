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
  const [isLoadingNew, setIsLoadingNew] = useState(
    localStorage.getItem(`bookIndex_${id}`) ? false : true
  );
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);
      setIsLoadingNew(localStorage.getItem(`bookIndex_${id}`) ? false : true);
      setLabel(
        localStorage.getItem(`bookIndex_${id}`)
          ? JSON.parse(localStorage.getItem(`bookIndex_${id}`)).label
          : {}
      );
      const x = await getBookIndex(id);
      setLabel(x.label);
      setIsLoadingNew(false);
      setIsRefreshing(false);
    };
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoadingNew) {
    return <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />;
  }

  return (
    <Typography sx={{ opacity: isRefreshing ? 0.5 : 1 }}>{label}</Typography>
  );
}
