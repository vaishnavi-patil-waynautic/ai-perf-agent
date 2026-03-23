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