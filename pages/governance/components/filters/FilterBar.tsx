import { Paper, Select, MenuItem, TextField, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export const FilterBar = () => {
  return (
    <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <Select size="small" defaultValue="waynautic-1" sx={{ minWidth: 200 }}>
          <MenuItem value="waynautic-1">Waynautic-1 (Project)</MenuItem>
          <MenuItem value="atlas">Atlas Core</MenuItem>
        </Select>
        
        <Select size="small" defaultValue="prod" sx={{ minWidth: 150 }}>
          <MenuItem value="prod">Production</MenuItem>
          <MenuItem value="stage">Staging</MenuItem>
        </Select>

        <DatePicker label="Range" slotProps={{ textField: { size: 'small' } }} />
      </Stack>
    </Paper>
  );
};