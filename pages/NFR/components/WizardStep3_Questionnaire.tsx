import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, MenuItem } from '@mui/material';
import { upsertQuestionAnswer } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store'; 

const questions: any[] = [
  {
    id: 'concurrentUsers',
    label: 'Target Concurrent Users',
    type: 'number',
    helperText: 'Estimated peak users',
  },
  {
    id: 'peakLoad',
    label: 'Expected Peak Load (Requests/Sec)',
    type: 'text',
  },
  {
    id: 'environment',
    label: 'Target Environment',
    type: 'select',
    options: [
      { label: 'QA Staging', value: 'QA' },
      { label: 'Pre-Production', value: 'Pre-Prod' },
      { label: 'Production', value: 'Prod' },
    ],
  },
];




const WizardStep3_Questionnaire: React.FC = () => {
  const dispatch = useDispatch();
  const outputdata = useSelector((state: RootState) => state.nfrWizard.questionnaireResponses);

  // const handleChange = (field: string, value: string) => {
  //   dispatch(upsertQuestionAnswer({ [field]: value }));
  // };

  // return (
  //   <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded shadow-sm border">
  //     <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Strategy Requirements</h3>
      
  //     <TextField
  //       fullWidth
  //       label="Target Concurrent Users"
  //       type="number"
  //       variant="outlined"
  //       value={data.concurrentUsers}
  //       onChange={(e) => handleChange('concurrentUsers', e.target.value)}
  //       helperText="Estimated peak users"
  //     />

  //     <TextField
  //       fullWidth
  //       label="Expected Peak Load (Requests/Sec)"
  //       variant="outlined"
  //       value={data.peakLoad}
  //       onChange={(e) => handleChange('peakLoad', e.target.value)}
  //     />

  //     <TextField
  //       select
  //       fullWidth
  //       label="Target Environment"
  //       value={data.environment}
  //       onChange={(e) => handleChange('environment', e.target.value)}
  //     >
  //       <MenuItem value="QA">QA Staging</MenuItem>
  //       <MenuItem value="Pre-Prod">Pre-Production</MenuItem>
  //       <MenuItem value="Prod">Production</MenuItem>
  //     </TextField>
  //   </div>
  // );


    const getAnswer = (questionId: string) =>
    outputdata.find(q => q.questionId === questionId)?.answer || '';


  const handleChange = (questionId: string, value: string) => {
    dispatch(
      upsertQuestionAnswer({
        questionId,
        answer: value,
      })
    );


    console.log(" Output Data of questionaire : ", outputdata)
  };



  return (
    <>
      {questions.map(q => (
        <div key={q.id} className="mb-4">
          {q.type === 'select' ? (
            <TextField
              select
              fullWidth
              label={q.label}
              value={getAnswer(q.id)}
              onChange={e => handleChange(q.id, e.target.value)}
            >
              {q.options?.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              label={q.label}
              type={q.type}
              helperText={q.helperText}
              value={getAnswer(q.id)}
              onChange={e => handleChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default WizardStep3_Questionnaire;