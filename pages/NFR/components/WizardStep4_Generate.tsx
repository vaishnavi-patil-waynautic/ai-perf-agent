import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { setInstructions, resetWizard } from '../slices/nfrWizardSlice';
import { addStrategy } from '../slices/nfrListSlice';
import { generateStrategy } from '../../../services/nfr/generateService';
import { RootState } from '../../../store/store'; 
import { useNavigate } from 'react-router-dom';

const WizardStep4_Generate: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wizardState = useSelector((state: RootState) => state.nfrWizard);
  
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
        const strategy = await generateStrategy(wizardState);
        
        // Add User defaults
        const completeStrategy = {
            ...strategy,
            createdBy: 'Current User', // Mock auth
            appName: strategy.appName || 'Unknown App'
        } as any;

        dispatch(addStrategy(completeStrategy));
        
        setTimeout(() => {
            dispatch(resetWizard());
            setLoading(false);
            navigate('/nfr');
        }, 1500); // Slight delay to show the modal
    } catch (error) {
        setLoading(false);
        alert("Generation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Final Instructions</h3>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Any specific focus areas for the AI model..."
            variant="outlined"
            value={wizardState.additionalInstructions}
            onChange={(e) => dispatch(setInstructions(e.target.value))}
            className="bg-white"
          />
      </div>

      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Ready to Generate?</h2>
          <p className="text-gray-600 mb-6">We have collected {wizardState.selectedItems.length} items and {wizardState.uploadedFiles.length} documents.</p>
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 py-3 px-8 text-lg"
          >
            {loading ? 'Processing...' : 'Generate Performance Strategy'}
          </Button>
      </div>

      <Dialog open={loading}>
        <div className="p-8 flex flex-col items-center">
            <CircularProgress size={50} className="mb-4" />
            <DialogTitle>Generation Started...</DialogTitle>
            <DialogContent>Please wait while we analyze your documents.</DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WizardStep4_Generate;