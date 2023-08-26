import { useEffect, useState } from "react";
import { Team } from "../../../../auth/AppwriteContext";
import { CustomAvatar } from "../../../../components/custom-avatar";
import { Link, Skeleton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

export default function SarthakTeamDisplayUI({ teamId }) {
  const [team, setTeam] = useState();
  const [src, setSrc] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (teamId && teamId !== '') {
          const data = await Team.getTeamData(teamId);
          setTeam(data);
          if (data?.cover && data?.cover !== '') {
            const tempSrc = await Team.getTeamCover(data?.cover);
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
  }, [teamId])

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
    <Stack direction='row' >
      {error &&
        <CustomAvatar
          key={24}
          alt="Travis Howard"
          name={team?.name}
          src={src}
          sx={{ width: 32, height: 32 }}
        />
      }
      <Link component={RouterLink} to={'/dashboard/team/' + teamId + '/view'}>
        <Stack direction='column' sx={{ ml: 1 }}>
          <Typography variant="caption">{team?.name}</Typography>
          <Typography variant="caption">{team?.$id}</Typography>
        </Stack>
      </Link>
    </Stack>
  )
}