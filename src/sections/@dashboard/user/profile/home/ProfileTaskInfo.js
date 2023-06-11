import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../../utils/formatNumber';
import { useLocales } from '../../../../../locales';

// ----------------------------------------------------------------------

ProfileTaskInfo.propTypes = {
  task: PropTypes.number,
  question: PropTypes.number,
};

export default function ProfileTaskInfo({ task, question }) {

  const { translate } = useLocales();

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(task)}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('task')}
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(question)}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {translate('question')}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
