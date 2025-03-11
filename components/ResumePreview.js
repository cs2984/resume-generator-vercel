import { useRef } from 'react';

export default function ResumePreview({ resumeData }) {
  const resumeRef = useRef(null);
  
  const generatePDF = async () => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    // Dynamically import html2pdf only when the button is clicked
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = resumeRef.current;
    if (!element) return;
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'optimized_resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };
  
  // Handle rendering of potentially complex data
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    if (typeof value === 'object') {
      // If it's an object, convert to string representation
      return JSON.stringify(value);
    }
    return '';
  };
  
  // Graceful handling if resumeData is malformed
  if (!resumeData) {
    return (
      <div className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded">
        No resume data received. Please try again.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Resume Preview</h2>
        <button 
          onClick={generatePDF}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
        >
          Download PDF
        </button>
      </div>
      
      <div 
        ref={resumeRef} 
        className="bg-white border shadow-sm p-8 mb-4 prose max-w-none"
        style={{ minHeight: '11in', width: '8.5in', maxWidth: '100%', margin: '0 auto' }}
      >
        {/* Resume Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold m-0">
            {resumeData.personal_information?.name || resumeData.name || 'Name Missing'} 
            {resumeData.personal_information?.surname || ''}
          </h1>
          <p className="text-sm mt-2">
            {[
              resumeData.personal_information?.phone_prefix && resumeData.personal_information?.phone
                ? `${resumeData.personal_information.phone_prefix}${resumeData.personal_information.phone}`
                : resumeData.phone || '',
              resumeData.personal_information?.email || resumeData.email || '',
              resumeData.personal_information?.linkedin || resumeData.linkedin || ''
            ].filter(Boolean).join(' | ')}
          </p>
        </div>
        
        {/* Professional Summary */}
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p>{resumeData.professional_summary || resumeData.summary || 'Summary Missing'}</p>
        </div>
        
        {/* Core Competencies */}
        {(resumeData.core_competencies || resumeData.skills) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
              Core Competencies
            </h2>
            <p>
              {(resumeData.core_competencies || resumeData.skills || []).map(item => 
                typeof item === 'string' ? item : JSON.stringify(item)
              ).join(' | ')}
            </p>
          </div>
        )}
        
        {/* Skills (if separate from competencies) */}
        {resumeData.skills && resumeData.core_competencies && (
          <div className="mb-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <p>
              {resumeData.skills.map(item => 
                typeof item === 'string' ? item : JSON.stringify(item)
              ).join(' | ')}
            </p>
          </div>
        )}
        
        {/* Professional Experience */}
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Professional Experience
          </h2>
          
          {(resumeData.professional_experience || resumeData.experience || []).map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <div className="font-bold">
                  {renderValue(exp.title || '')}, {renderValue(exp.company || '')}
                </div>
                <div>
                  {renderValue(exp.dates?.start || (exp.duration && exp.duration.split('-')[0]) || '')} - 
                  {renderValue(exp.dates?.end || (exp.duration && exp.duration.split('-')[1]) || 'Present')}
                </div>
              </div>
              
              <ul className="list-disc pl-5 mt-2">
                {(exp.description || exp.responsibilities || []).map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{renderValue(bullet)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Education */}
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          
          {(resumeData.education || []).map((edu, index) => (
            <div key={index}>
              <div className="font-bold">
                {renderValue(edu.institution || edu.university || '')}, 
                {renderValue(edu.location || '')}
              </div>
              <div>
                {renderValue(edu.education_level || '')} 
                {edu.field_of_study ? `in ${renderValue(edu.field_of_study)}` : renderValue(edu.degree || '')}
                {edu.graduation_year ? ` (${renderValue(edu.graduation_year)})` : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc pl-5">
              {resumeData.certifications.map((cert, index) => (
                <li key={index}>
                  {typeof cert === 'string' 
                    ? cert 
                    : `${cert.name || ''} ${cert.issuer ? `- ${cert.issuer}` : ''} ${cert.date ? `(${cert.date})` : ''}`
                  }
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}