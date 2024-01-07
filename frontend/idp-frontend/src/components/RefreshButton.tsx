import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';

import { RefreshContainerProps } from '../utils/types';

function RefreshContainer({ onRefresh } : RefreshContainerProps) {
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end', 
        p: 2
      }}
    >
      <IconButton onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
    </Box>
  );
}

export default RefreshContainer;