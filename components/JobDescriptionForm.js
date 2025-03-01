import { useState } from 'react';

export default function JobDescriptionForm({ onSubmit, loading }) {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">
          Paste Job Description:
        </label>
        <textarea 
          className="w-full h-64 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here. The more details included, the better the resume optimization will be."
          required
          disabled={loading}
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        disabled={loading || !jobDescription.trim()}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Resume...
          </span>
        ) : 'Generate Resume'}
      </button>
    </form>
  );
}