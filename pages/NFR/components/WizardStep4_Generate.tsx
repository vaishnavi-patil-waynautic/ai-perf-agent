import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { setAdditionalInstructions, resetWizard } from '../slices/nfrWizardSlice';
// import { addStrategy } from '../slices/nfrListSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import ApplicationSelect from '@/components/ApplicationSelect';
import { generateNfr } from '../slices/nfr.thunks';
import { WizardState } from '../types/nfrTypes';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';

const WizardStep4_Generate: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const wizardState = useSelector((state: RootState) => state.nfrWizard);

    const { selectedApp, selectedProject } = useSelector((state: RootState) => state.project);

    const [loading, setLoading] = React.useState(false);


    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        type: SnackbarType;
    }>({
        open: false,
        message: '',
        type: 'success',
    });

    const buildGenerateNfrPayload = (
        wizardState: WizardState,
        projectId: number,
        applicationId: number
    ) => {
        const answer = (id: string) =>
            wizardState.questionnaireResponses.find(q => q.questionId === id)?.answer ?? '';

        return {
            projectId,
            applicationId,
            env: answer('environment'),
            sla: answer('sla'),
            wlm: answer('wlm'),
            additionalInput: wizardState.additionalInstructions,
            files: wizardState.uploadedFiles,
        };
    };


    // const handleGenerate = async () => {
    //     setLoading(true);
    //     try {
    //         // ✅ API call
    //         // const strategy = await generateStrategyApi({
    //         //     ...wizardState,
    //         //     applicationId: selectedApp?.id,
    //         //     questionnaireResponses: wizardState.questionnaireResponses,
    //         // });

    //         // ✅ Normalize / enrich before storing
    //         const completeStrategy = {
    //             ...wizardState,
    //             applicationId: selectedApp?.id,
    //             questionnaireResponses: wizardState.questionnaireResponses
    //         };

    //         // ✅ Redux write
    //         dispatch(generateNfr(completeStrategy));

    //         navigate('/strategy/result');
    //     } catch (error) {
    //         console.error(error);
    //         alert('Generation failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleGenerate = async () => {
        if (!selectedApp?.id || !selectedProject?.id) {
            alert('Missing project or application');
            return;
        }

        setLoading(true);

        const payload = buildGenerateNfrPayload(
            wizardState,
            selectedProject.id,
            selectedApp.id
        );

        const result = await dispatch(generateNfr(payload));

        if (generateNfr.fulfilled.match(result)) {
            navigate('/nfr');
            setSnackbar({
                open: true,
                message: 'NFR generation started...',
                type: 'success',
            });
        } else {
            alert(result.payload || 'NFR generation failed');
        }

        setLoading(false);
    };


    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">Additional Instructions</h3>
                <TextField
                    fullWidth
                    multiline
                    minRows={2}          // minimum height
                    maxRows={6}          // optional maximum height
                    placeholder="Any specific focus areas for the AI model..."
                    variant="outlined"
                    value={wizardState.additionalInstructions}
                    onChange={(e) => dispatch(setAdditionalInstructions(e.target.value))}
                    className="bg-white"
                />

            </div>

            <div className="w-full mb-8">
                <ApplicationSelect />
            </div>

            {/* <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
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
      </div> */}


            <div className="p-8 bg-blue-50 border border-gray-200 rounded-xl shadow-sm text-center">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">
                    Generate Performance Strategy
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    You have selected <span className="font-medium">{wizardState.selectedItemIds.length}</span> items and
                    uploaded <span className="font-medium">{wizardState.uploadedFiles.length}</span> documents.
                </p>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerate}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontSize: "0.95rem",
                        padding: "10px 26px",
                        backgroundColor: "#2563eb",
                        "&:hover": { backgroundColor: "#1e40af" },
                        borderRadius: "8px",
                    }}
                >
                    {loading ? "Processing…" : "Generate Strategy"}
                </Button>
            </div>



            <Dialog open={loading}>
                <div className="p-8 flex flex-col items-center">
                    <CircularProgress size={50} className="mb-4" />
                    <DialogTitle>Generation Started...</DialogTitle>
                    <DialogContent>Please wait while we analyze your documents.</DialogContent>
                </div>
            </Dialog>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            />
        </div>
    );
};

export default WizardStep4_Generate;