import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDocuments } from '../services/documentService';
import { setUploadedFiles } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store'; 

const WizardStep2_Docs: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = useSelector((state: RootState) => state.nfrWizard.uploadedFiles);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const fileList = Array.from(e.target.files);
  dispatch(setUploadedFiles([...files, ...fileList]));
};


  return (
    <div className="flex flex-col items-center justify-center py-5 space-y-6">
      <div 
        className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-5 flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUploadIcon style={{ fontSize: 60 }} className="text-blue-500 mb-2" />
        <p className="text-gray-700 font-medium">Click to Upload Documents</p>
        <p className="text-gray-500 text-sm">Support: .pdf, .doc, .docx</p>
        <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            multiple 
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
        />
      </div>

      <div className="w-full max-w-md">
        <h4 className="text-lg font-semibold mb-1">Attached Files:</h4>
        <List dense className="bg-white ">
            {files.length === 0 && (
               <ListItem sx={{ justifyContent: "center" }}>
                    <ListItemText
                        primary="No files selected"
                        className="text-gray-400 text-center"
                    />
                </ListItem>

            )}

            {files.map((f, idx) => (
                <div key={idx} className="my-1">   {/* margin between items */}
                <ListItem className="border rounded-md">
                    <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                    <ListItemText primary={f.name} />
                </ListItem>
                </div>
            ))}
        </List>

      </div>
    </div>
  );
};

export default WizardStep2_Docs;