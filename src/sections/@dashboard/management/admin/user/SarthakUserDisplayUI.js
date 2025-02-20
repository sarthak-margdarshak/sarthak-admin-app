import { useEffect, useState } from "react";
import { CustomAvatar } from "components/custom-avatar";
import { Skeleton, Stack, Typography } from "@mui/material";
import { appwriteFunctions, appwriteStorage } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { sarthakAPIPath } from "assets/data";

export default function SarthakUserDisplayUI({ userId }) {
  const [user, setUser] = useState();
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId && userId !== "") {
          let response = await appwriteFunctions.createExecution(
            APPWRITE_API.functions.sarthakAPI,
            JSON.stringify({ userId: userId }),
            false,
            sarthakAPIPath.user.fetch.id
          );
          response = JSON.parse(response.responseBody);

          if (response.status === "success") {
            setUser(response.user);

            if (
              response.user.prefs?.photo &&
              response.user.prefs?.photo !== ""
            ) {
              const tempSrc = appwriteStorage.getFilePreview(
                APPWRITE_API.buckets.sarthakDatalakeBucket,
                response.user.prefs?.photo,
                undefined,
                undefined,
                undefined,
                20
              ).href;
              setSrc(tempSrc);
            }
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
