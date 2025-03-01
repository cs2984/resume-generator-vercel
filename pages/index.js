import { useState } from 'react';
import Layout from '../components/Layout';
import JobDescriptionForm from '../components/JobDescriptionForm';
import ResumePreview from '../components/ResumePreview';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (jobDescription) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
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
        
        <JobDescriptionForm 
          onSubmit={handleSubmit} 
          loading={loading}
        />
        
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