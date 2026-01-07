import ApplicationSelect from "@/components/ApplicationSelect";
import Button from "../../../components/Button";
import { UploadBox } from "./UploadBox";

interface Props {
  file1: File | null;
  file2: File | null;
  onFile1: () => void;
  onFile2: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  // applicationId: number | null;
  // changeApplicationId: (value: number | null) => void;
}

export const UploadSection: React.FC<Props> = ({
  file1,
  file2,
  onFile1,
  onFile2,
  onGenerate,
  isGenerating,
  // applicationId,
  // changeApplicationId
}) => (
  <div className="bg-white p-8 rounded-lg border shadow-sm w-2/3 mx-auto">

    <div className="w-64 mb-7 mx-auto">
      <ApplicationSelect/>
    </div>


    <div className="flex items-center justify-center gap-8 mb-8">
      <UploadBox file={file1} label="Upload HAR 1" onClick={onFile1} />
      <span className="text-xl font-bold text-gray-300">+</span>
      <UploadBox file={file2} label="Upload HAR 2" onClick={onFile2} />
    </div>

    <div className="flex justify-center">
      <Button
        onClick={onGenerate}
        disabled={!file1 || !file2 || isGenerating}
        className="w-64 py-3"
      >
        {isGenerating ? "Generating..." : "Generate JMX"}
      </Button>
    </div>
  </div>
);
