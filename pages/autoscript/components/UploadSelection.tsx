import ApplicationSelect from "@/components/ApplicationSelect";
import Button from "../../../components/Button";
import { UploadBox } from "./UploadBox";
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";

interface Props {
  file1: File | null;
  file2: File | null;
  onFile1: () => void;
  onFile2: () => void;
  onCancelFile1: () => void;   // NEW
  onCancelFile2: () => void;   // NEW
  onGenerate: () => void;
  isGenerating: boolean;
  compact: boolean;
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
  compact = false,
  // applicationId,
  // changeApplicationId
}) => {

  const [scriptType, setScriptType] = useState("jmx");

  const handleScriptChange = (event: SelectChangeEvent) => {
    setScriptType(event.target.value);
  };

  return (
    // <div className= `{bg-white p-8 rounded-lg border shadow-sm w-full mx-auto mb-7}`>

    <div
      className={`bg-white p-8 rounded-lg border shadow-sm mx-auto mb-7 ${compact ? "w-full" : "w-4/5"
        }`}
    >
      <div className="w-64 mb-7 mx-auto">
        <ApplicationSelect />
      </div>


      <div className="flex items-center justify-center gap-8 mb-8">
        <UploadBox file={file1} label="Upload HAR 1" onClick={onFile1} onCancel={onCancelFile1} />
        <span className="text-xl font-bold text-gray-300">+</span>
        <UploadBox file={file2} label="Upload HAR 2" onClick={onFile2} onCancel={onCancelFile2} />
      </div>

      <div className="w-64 mb-7 mx-auto">


        <FormControl size="small" fullWidth>
          <InputLabel shrink id="script-type-select-label">
            Output Script Type
          </InputLabel>

          <Select
            labelId="script-type-select-label"
            value={scriptType}
            onChange={handleScriptChange}
            input={<OutlinedInput notched label="Output Script Type" />}
            displayEmpty
          >
            <MenuItem value="jmx">
              JMX (JMeter Script)
            </MenuItem>

            <MenuItem value="loadrunner">
              LoadRunner Script
            </MenuItem>
          </Select>
        </FormControl>
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




      <div className="mt-3 p-3 text-sm font-medium text-center">
        <a
          href="https://chromewebstore.google.com/detail/jmeter-script-generator/daibnekodmaolmhcnllhhckngmglhljd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-600 transition"
        >
          Click here to create a HAR file using the Chrome plugin
        </a>
      </div>
    </div>
  )
};
