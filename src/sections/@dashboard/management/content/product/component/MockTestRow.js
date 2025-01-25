import { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../../config-global";
import { Query } from "appwrite";
import { Card, CardHeader, IconButton, Skeleton } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../../../routes/paths";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../../../../../../components/iconify";

export default function MockTestRow({ id }) {
  const [mockTest, setMockTest] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      var tmpMockTest = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        id,
        [Query.select(["name", "description", "mtId", "$id"])]
      );
      setMockTest(tmpMockTest);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <Card
      variant="outlined"
      sx={{
        m: 1,
        pb: 2.5,
        mr: 2,
      }}
    >
      {loading ? (
        <Skeleton height={70} />
      ) : (
        <CardHeader
          title={mockTest?.name + " (" + mockTest?.mtId + ")"}
          subheader={mockTest?.description}
          action={
            <IconButton
              to={PATH_DASHBOARD.mockTest.view(id)}
              component={RouterLink}
              target="_blank"
            >
              <Iconify icon="fa-solid:external-link-alt" />
            </IconButton>
          }
        />
      )}
    </Card>
  );
}
