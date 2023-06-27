import PropTypes from 'prop-types';
// @mui
import { Box, TablePagination } from '@mui/material';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};

export default function TablePaginationCustom({
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination rowsPerPageOptions={rowsPerPageOptions} component="div" {...other} />
    </Box>
  );
}
