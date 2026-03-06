import { Upload, FileText, X } from "lucide-react";

interface Props {
  file: File | null;
  label: string;
  onClick: () => void;
  onCancel?: () => void; 
}

export const UploadBox: React.FC<Props> = ({ file, label, onClick, onCancel }) => {
  
  return (
  // <div
  //   onClick={onClick}
  //   className={`
  //     border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer
  //     transition-all h-48 w-64
  //     ${file
  //       ? "bg-blue-50 border-blue-400 text-blue-800"
  //       : "border-gray-300 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}
  //   `}
  // >

  <div
  onClick={onClick}
  className={`
    relative
    w-full h-48
    border-2 border-dashed rounded-xl
    flex flex-col items-center justify-center
    cursor-pointer transition-all p-8
    ${file
      ? "bg-blue-50 border-blue-400 text-blue-800"
      : "border-gray-300 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}
  `}
>


        {/* {file && onCancel && ( */}
      
    {/* )} */}
    
    {file ? (
      <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition"
        title="Remove file"
      >
        <X size={16} />
      </button>
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
)};
