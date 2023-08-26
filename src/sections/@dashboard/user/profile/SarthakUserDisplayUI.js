import { useEffect, useState } from "react"
import { User } from "../../../../auth/AppwriteContext";
import { CustomAvatar } from "../../../../components/custom-avatar";
import { Link, Skeleton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

export default function SarthakUserDisplayUI({ userId }) {
  const [user, setUser] = useState();
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId && userId !== '') {
          const data = await User.getProfileData(userId);
          setUser(data);
          if (data?.photoUrl && data?.photoUrl !== '') {
            const tempSrc = await User.getImageProfileLink(data?.photoUrl);
            setSrc(tempSrc);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(false);
      }
    }
    fetchData();
  }, [userId])

  if (loading) {
    return (
      <Stack direction='row'>
        <Skeleton variant="circular" width={32} height={32} />
        <Stack direction='column' sx={{ ml: 1 }}>
          <Skeleton variant="text" width={100} sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" width={100} sx={{ fontSize: '1rem' }} />
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack direction='row'>
      {error &&
        <CustomAvatar
          key={24}
          alt="Travis Howard"
          name={user?.name}
          src={src}
          sx={{ width: 32, height: 32 }}
        />
      }
      <Link component={RouterLink} to={'/dashboard/user/profile/' + userId}>
        <Stack direction='column' sx={{ ml: 1 }}>
          <Typography variant="caption">{user?.name}</Typography>
          <Typography variant="caption">{user?.empId}</Typography>
        </Stack>
      </Link>
    </Stack>
  )
}