import { Link, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Question } from "../../../../auth/AppwriteContext";
import { Link as RouterLink } from 'react-router-dom';

export default function SubjectDisplayUI({ id }) {
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id && id !== '') {
          const data = await Question.getSubjectName(id);
          setName(data);
        }
      } catch (error) {
        console.log(error)
      }
      setLoading(false);
    }
    fetchData()
  }, [id])

  if (loading) {
    return <Skeleton variant="text" width={100} sx={{ fontSize: '1rem' }} />
  }

  return (
    <Link component={RouterLink} onClick={() => window.open(window.location.origin + '/dashboard/question/list?subjectId=' + id, '_self')}>
      <Typography variant="body2">{name}</Typography>
    </Link>
  )
}