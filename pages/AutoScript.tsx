import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2, Download, Zap } from 'lucide-react';
import Button from '../components/Button';
import { autoScriptApi } from '../services/api';
import { JMXRecord } from '../types';

const AutoScript: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<JMXRecord[]>([]);

  const fileInput1 = useRef<HTMLInputElement>(null);
  const fileInput2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await autoScriptApi.getHistory();
      setHistory(data);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file1 || !file2) return;
    setIsGenerating(true);
    try {
      await autoScriptApi.generate(file1, file2);
      await loadHistory(); // Refresh table
      setFile1(null);
      setFile2(null);
    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await autoScriptApi.deleteJmx(id);
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const UploadBox = ({ 
    file, 
    onClick, 
    label 
  }: { file: File | null, onClick: () => void, label: string }) => (
    <div 
      onClick={onClick}
      className={`
        border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 h-48 w-64
        ${file 
          ? 'bg-blue-50 border-blue-400 text-blue-800' 
          : 'bg-transparent border-gray-300 text-gray-500 hover:border-blue-300 hover:bg-gray-50'}
      `}
    >
      {file ? (
        <>
          <FileText size={40} className="mb-3 text-blue-600" />
          <p className="font-medium text-center break-all text-sm px-2">{file.name}</p>
          <p className="text-xs text-blue-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          AutoScript Generator
        </h1>
        <p className="text-gray-500 mt-1">Upload HAR files to generate JMX performance scripts automatically.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <input 
            type="file" 
            ref={fileInput1} 
            onChange={(e) => handleFileChange(e, setFile1)} 
            className="hidden" 
            accept=".har"
          />
          <UploadBox file={file1} onClick={() => fileInput1.current?.click()} label="Upload HAR 1" />

          <div className="text-gray-300 font-bold text-xl">+</div>

          <input 
            type="file" 
            ref={fileInput2} 
            onChange={(e) => handleFileChange(e, setFile2)} 
            className="hidden" 
            accept=".har"
          />
          <UploadBox file={file2} onClick={() => fileInput2.current?.click()} label="Upload HAR 2" />
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleGenerate} 
            disabled={!file1 || !file2 || isGenerating}
            className="w-64 py-3 text-lg shadow-lg"
          >
            {isGenerating ? 'Generating Script...' : 'Generate JMX'}
          </Button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Generated JMX Scripts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">File Name</th>
                <th className="px-6 py-3">Date Generated</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                    No scripts generated yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center">
                      <FileText size={16} className="mr-2 text-blue-500" />
                      {item.fileName}
                    </td>
                    <td className="px-6 py-4">{item.generatedAt}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutoScript;