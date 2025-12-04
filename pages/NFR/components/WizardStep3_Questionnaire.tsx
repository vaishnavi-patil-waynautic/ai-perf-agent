import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, MenuItem } from '@mui/material';
import { updateQuestionnaire } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store'; 

const WizardStep3_Questionnaire: React.FC = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.nfrWizard.questionnaire);

  const handleChange = (field: string, value: string) => {
    dispatch(updateQuestionnaire({ [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Strategy Requirements</h3>
      
      <TextField
        fullWidth
        label="Target Concurrent Users"
        type="number"
        variant="outlined"
        value={data.targetUsers}
        onChange={(e) => handleChange('targetUsers', e.target.value)}
        helperText="Estimated peak users"
      />

      <TextField
        fullWidth
        label="Expected Peak Load (Requests/Sec)"
        variant="outlined"
        value={data.peakLoad}
        onChange={(e) => handleChange('peakLoad', e.target.value)}
      />

      <TextField
        select
        fullWidth
        label="Target Environment"
        value={data.environment}
        onChange={(e) => handleChange('environment', e.target.value)}
      >
        <MenuItem value="QA">QA Staging</MenuItem>
        <MenuItem value="Pre-Prod">Pre-Production</MenuItem>
        <MenuItem value="Prod">Production</MenuItem>
      </TextField>
    </div>
  );
};

export default WizardStep3_Questionnaire;