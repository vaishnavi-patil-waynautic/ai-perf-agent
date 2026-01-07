import { Upload, FileText } from "lucide-react";

interface Props {
  file: File | null;
  label: string;
  onClick: () => void;
}

export const UploadBox: React.FC<Props> = ({ file, label, onClick }) => (
  <div
    onClick={onClick}
    className={`
      border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer
      transition-all h-48 w-64
      ${file
        ? "bg-blue-50 border-blue-400 text-blue-800"
        : "border-gray-300 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}
    `}
  >
    {file ? (
      <>
        <FileText size={40} className="mb-3 text-blue-600" />
        <p className="text-sm font-medium break-all">{file.name}</p>
        <p className="text-xs text-blue-500 mt-1">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </>
    ) : (
      <>
        <Upload size={40} className="mb-3 text-gray-400" />
        <p className="font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-1">Click to browse</p>
      </>
    )}
  </div>
);
