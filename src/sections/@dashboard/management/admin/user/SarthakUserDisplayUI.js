import { useEffect, useState } from "react";
import { CustomAvatar } from "components/custom-avatar";
import { Skeleton, Stack, Typography } from "@mui/material";
import { appwriteDatabases, appwriteStorage } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";

export default function SarthakUserDisplayUI({ userId }) {
  const [user, setUser] = useState();
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId && userId !== "") {
          const data = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.adminUsers,
            userId
          );
          setUser(data);
          if (data?.photoUrl && data?.photoUrl !== "") {
            const tempSrc = appwriteStorage.getFilePreview(
              APPWRITE_API.buckets.adminUserImage,
              data?.photoUrl,
              undefined,
              undefined,
              undefined,
              20
            ).href;
            setSrc(tempSrc);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Stack direction="row">
        <Skeleton variant="circular" width={32} height={32} />
        <Stack direction="column" sx={{ ml: 1 }}>
          <Skeleton variant="text" width={100} sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" width={100} sx={{ fontSize: "1rem" }} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row">
      {error && (
        <CustomAvatar
          key={24}
          alt="Travis Howard"
          name={user?.name}
          src={src}
          sx={{ width: 32, height: 32 }}
        />
      )}
      <Stack direction="column" sx={{ ml: 1 }}>
        <Typography variant="caption">{user?.name}</Typography>
        <Typography variant="caption">{user?.$id}</Typography>
      </Stack>
    </Stack>
  );
}
