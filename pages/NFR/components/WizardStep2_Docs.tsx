import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDocuments } from '../services/documentService';
import { setUploadedFiles, removeUploadedFile } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store';
import { X } from "lucide-react";

const LOCAL_STORAGE_KEY = "NFR_Wizard_Files";

interface StoredFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

const WizardStep2_Docs: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = useSelector(
    (state: RootState) => state.nfrWizard.uploadedFiles
  );

  files.map((file) => console.log("File : ",file))



  const allowedExtensions = ["pdf", "doc", "docx"];

  // Convert File → Base64
  const fileToBase64 = (file: File): Promise<StoredFile> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
        });
      reader.onerror = (error) => reject(error);
    });

  // Convert Base64 → File
  const base64ToFile = (storedFile: StoredFile): File => {
    const byteString = atob(storedFile.data.split(",")[1]);
    const mimeString = storedFile.data.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], storedFile.name, {
      type: mimeString || storedFile.type,
    });
  };

  // Load files from localStorage on mount
  useEffect(() => {

    const storedFiles = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedFiles) {
      try {
        const parsedFiles: StoredFile[] = JSON.parse(storedFiles);
        const restoredFiles = parsedFiles.map(base64ToFile);
        dispatch(setUploadedFiles(restoredFiles));
      } catch (error) {
        console.error("Error restoring files:", error);
      }
    }
  }, [dispatch]);

  // Save files to localStorage whenever they change
  useEffect(() => {

    const saveFilesToLocalStorage = async () => {
      if (files.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }

      const storedFiles = await Promise.all(
        files.map((file) => fileToBase64(file))
      );

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(storedFiles)
      );
    };

    saveFilesToLocalStorage();
  }, [files]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles: File[] = [];

    selectedFiles.forEach((newFile) => {
      const extension = newFile.name.split(".").pop()?.toLowerCase();

      // Validate file extension
      if (!extension || !allowedExtensions.includes(extension)) {
        alert(`Invalid file type: ${newFile.name}`);
        return;
      }

      // Check for duplicates
      const isDuplicate = files.some((existingFile) => {
        const existingExtension = existingFile.name
          .split(".")
          .pop()
          ?.toLowerCase();

        return (
          existingFile.name === newFile.name &&
          existingExtension === extension &&
          existingFile.size === newFile.size
        );
      });

      if (isDuplicate) {
        alert(`Duplicate file skipped: ${newFile.name}`);
        return;
      }

      validFiles.push(newFile);
    });

    if (validFiles.length > 0) {
      dispatch(setUploadedFiles([...files, ...validFiles]));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    dispatch(removeUploadedFile(index));
  };

  return (
    <div className="flex flex-col items-center justify-center py-5 space-y-6">
      <div
        className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-5 flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUploadIcon
          style={{ fontSize: 60 }}
          className="text-blue-500 mb-2"
        />
        <p className="text-gray-700 font-medium">
          Click to Upload Documents
        </p>
        <p className="text-gray-500 text-sm">
          Support: .pdf, .doc, .docx
        </p>
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
        <h4 className="text-lg font-semibold mb-1">
          Attached Files:
        </h4>
        <List dense className="bg-white">
          {files.length === 0 && (
            <ListItem sx={{ justifyContent: "center" }}>
              <ListItemText
                primary="No files selected"
                className="text-gray-400 text-center"
              />
            </ListItem>
          )}

          {files.map((f, idx) => (
            <div key={idx} className="my-1">
              <ListItem
                className="border rounded-md flex items-center"
                secondaryAction={
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                }
              >
                <ListItemIcon>
                  <InsertDriveFileIcon className="text-blue-500" />
                </ListItemIcon>

                <ListItemText
                  primary={f.name}
                  primaryTypographyProps={{
                    className: "truncate",
                  }}
                />
              </ListItem>
            </div>
          ))}
        </List>
      </div>
    </div>
  );
};


export default WizardStep2_Docs;