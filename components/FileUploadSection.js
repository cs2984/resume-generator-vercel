// components/FileUploadSection.js
import { useRef, useState } from 'react';

export default function FileUploadSection({ onFilesUploaded }) {
  const [files, setFiles] = useState({
    resume: null,
    references: []
  });
  const [uploading, setUploading] = useState(false);
  
  const handleResumeUpload = (e) => {
    if (e.target.files.length > 0) {
      setFiles(prev => ({
        ...prev,
        resume: e.target.files[0]
      }));
    }
  };
  
  const handleReferenceUpload = (e) => {
    if (e.target.files.length > 0) {
      setFiles(prev => ({
        ...prev,
        references: [...prev.references, ...Array.from(e.target.files)]
      }));
    }
  };
  
  const handleRemoveReference = (index) => {
    setFiles(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };
  
  return (
    <div className="space-y-4 mb-8 p-4 border rounded">
      <h2 className="text-xl font-semibold">Upload Resume & Reference Files</h2>
      
      {/* Resume Upload */}
      <div>
        <label className="block mb-2 font-medium">
          Current Resume (YAML or PDF)
        </label>
        <input
          type="file"
          accept=".yaml,.yml,.pdf,.docx,.doc"
          onChange={handleResumeUpload}
          className="block w-full text-sm border rounded p-2"
        />
        {files.resume && (
          <p className="mt-1 text-sm text-green-600">
            Uploaded: {files.resume.name}
          </p>
        )}
      </div>
      
      {/* Reference Documents Upload */}
      <div>
        <label className="block mb-2 font-medium">
          Reference Documents (optional)
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md"
          onChange={handleReferenceUpload}
          multiple
          className="block w-full text-sm border rounded p-2"
        />
      </div>
      
      {/* Display uploaded reference files */}
      {files.references.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-1">Uploaded References:</h3>
          <ul className="text-sm">
            {files.references.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-1">
                <span>{file.name}</span>
                <button 
                  onClick={() => handleRemoveReference(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button
        onClick={() => onFilesUploaded(files)}
        disabled={!files.resume}
        className={`w-full py-2 px-4 rounded ${
          !files.resume 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Continue with These Files
      </button>
    </div>
  );
}