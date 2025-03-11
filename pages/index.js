import { useState } from 'react';
import Layout from '../components/Layout';
import JobDescriptionForm from '../components/JobDescriptionForm';
import ResumePreview from '../components/ResumePreview';
import FileUploadSection from '../components/FileUploadSection';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  
  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
  };
  
  const handleSubmit = async (jobDescription) => {
    if (!uploadedFiles || !uploadedFiles.resume) {
      setError('Please upload your current resume first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Create FormData to send files
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('resume', uploadedFiles.resume);
    
    // Add reference files if any
    uploadedFiles.references.forEach((file, index) => {
      formData.append(`reference_${index}`, file);
    });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData, // Send as FormData instead of JSON
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }
      
      const data = await response.json();
      setResumeData(data.resumeData);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ATS-Optimized Resume Generator
        </h1>
        
        {!uploadedFiles && (
          <FileUploadSection onFilesUploaded={handleFilesUploaded} />
        )}
        
        {uploadedFiles && (
          <>
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">
                <span className="font-medium">Resume:</span> {uploadedFiles.resume.name}
                {uploadedFiles.references.length > 0 && (
                  <span> | <span className="font-medium">References:</span> {uploadedFiles.references.length} files</span>
                )}
                <button 
                  onClick={() => setUploadedFiles(null)}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change Files
                </button>
              </p>
            </div>
            
            <JobDescriptionForm 
              onSubmit={handleSubmit} 
              loading={loading}
            />
          </>
        )}
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {resumeData && !loading && (
          <ResumePreview resumeData={resumeData} />
        )}
      </div>
    </Layout>
  );
}