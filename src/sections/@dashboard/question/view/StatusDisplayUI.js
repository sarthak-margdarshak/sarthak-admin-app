import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

export default function StatusDisplayUI({ status }) {
  return (
    <Link component={RouterLink} onClick={() => window.open(window.location.origin+'/dashboard/question/list?status=' + status, '_self')}>
      <Typography variant="body2">{status}</Typography>
    </Link>
  )
}