import ApplicationSelect from "@/components/ApplicationSelect";
import Button from "../../../components/Button";
import { UploadBox } from "./UploadBox";

interface Props {
  file1: File | null;
  file2: File | null;
  onFile1: () => void;
  onFile2: () => void;
  onCancelFile1: () => void;   // NEW
  onCancelFile2: () => void;   // NEW
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
  onCancelFile1,
  onCancelFile2,
  onGenerate,
  isGenerating,
  // applicationId,
  // changeApplicationId
}) => (
  <div className="bg-white p-8 rounded-lg border shadow-sm w-4/5 mx-auto mb-7">

    <div className="w-64 mb-7 mx-auto">
      <ApplicationSelect />
    </div>


    <div className="flex items-center justify-center gap-8 mb-8">
      <UploadBox file={file1} label="Upload HAR 1" onClick={onFile1} onCancel={onCancelFile1} />
      <span className="text-xl font-bold text-gray-300">+</span>
      <UploadBox file={file2} label="Upload HAR 2" onClick={onFile2} onCancel={onCancelFile2} />
    </div>


    {/* <div className="flex items-center justify-center gap-8 mb-8">

  {/* HAR 1 
  <div className="relative">
    <UploadBox file={file1} label="Upload HAR 1" onClick={onFile1} />

    {file1 && (
      <button
        onClick={onCancelFile1}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-sm font-bold px-3 py-2"
        title="Remove file"
      >
        ✕
      </button>
    )}
  </div>

  <span className="text-xl font-bold text-gray-300">+</span>

  {/* HAR 2
  <div className="relative">
    <UploadBox file={file2} label="Upload HAR 2" onClick={onFile2} />

    {file2 && (
      <button
        onClick={onCancelFile2}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-sm font-bold px-3 py-2"
        title="Remove file"
      >
        ✕
      </button>
    )}
  </div>

</div> */}


{/* <div className="flex flex-wrap items-center justify-center gap-6 mb-8 w-full">

  <div className="relative flex-1 min-w-[100px] max-w-[420px]">
    <UploadBox
      file={file1}
      label="Upload HAR 1"
      onClick={onFile1}
    />

    {file1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancelFile1();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-sm font-bold"
        title="Remove file"
      >
        ✕
      </button>
    )}
  </div>

  <div className="text-xl font-bold text-gray-300 select-none">
    +
  </div>

  <div className="relative flex-1 min-w-[100px] max-w-[420px]">
    <UploadBox
      file={file2}
      label="Upload HAR 2"
      onClick={onFile2}
    />

    {file2 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancelFile2();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-sm font-bold"
        title="Remove file"
      >
        ✕
      </button>
    )}
  </div>

</div> */}

    <div className="flex justify-center">
      <Button
        onClick={onGenerate}
        disabled={!file1 || !file2 || isGenerating}
        className="w-64 py-3"
      >
        {isGenerating ? "Generating..." : "Generate JMX"}
      </Button>
    </div>

    <div
      className="mt-3 p-3 text-blue-400 text-sm font-medium  transition text-center"
    >
      <p
        onClick={() => window.open("https://chromewebstore.google.com/detail/jmeter-script-generator/daibnekodmaolmhcnllhhckngmglhljd", "_blank")}
        className="cursor-pointer hover:text-blue-600 hover:underline transition">Click here to create a HAR file using the Chrome plugin</p>

    </div>
  </div>
);
