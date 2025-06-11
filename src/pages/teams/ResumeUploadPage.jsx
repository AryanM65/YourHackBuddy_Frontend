import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useHackathon } from '../../contexts/HackathonContext';
import { useUser } from '../../contexts/UserContext';
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaLock } from 'react-icons/fa';

const ResumeUploadPage = () => {
  const { hackathonId } = useParams();
  const { user } = useUser();
  console.log("user22", user);
  const { 
    currentTeam, 
    uploadResume, 
    loading, 
    error, 
    getUserTeamForHackathon, 
    getTeamSubmissions 
  } = useTeam();
  const { selectedHackathon, fetchHackathonById } = useHackathon();
  
  const [successMessage, setSuccessMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    console.log("user33", user);
    const fetchData = async () => {
      try {
        if (!initialized.current && isMounted) {
          initialized.current = true;
          
          // Fetch hackathon details
          await fetchHackathonById(hackathonId);
          
          // Fetch user's team for this hackathon
          const team = await getUserTeamForHackathon(hackathonId);
          console.log(team);
          // Check for existing submissions
          if (team?._id && user?._id) {
            console.log("reaching");
            const submission = await getTeamSubmissions(team._id, hackathonId);
            if (submission?.resumes) {
              const userResume = submission.resumes.find(r => r.user._id === user._id);
              if (userResume) setResumeUrl(userResume.resumeUrl);
            }
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (isMounted) setSubmissionLoading(false);
      }
    };

    if (hackathonId) fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [hackathonId, user?._id, fetchHackathonById, getUserTeamForHackathon, getTeamSubmissions]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (resumeUrl || !currentTeam?._id || !user?._id) return;
    
    const file = acceptedFiles[0];
    try {
      const result = await uploadResume(currentTeam._id, hackathonId, file);
      setResumeUrl(result.resumeUrl);
      setSuccessMessage('Resume uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [currentTeam, hackathonId, uploadResume, resumeUrl, user?._id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: !!resumeUrl || submissionLoading || loading
  });

  if (submissionLoading || !selectedHackathon || !currentTeam) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <FaSpinner className="spinner" />
        <p style={{ marginTop: '1rem' }}>Loading submission information...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '2rem' }}>
        {selectedHackathon.name} - Team Resume Upload
      </h1>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#dc2626'
        }}>
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#16a34a'
        }}>
          <FaCheckCircle />
          <span>{successMessage}</span>
        </div>
      )}

      <div
        {...getRootProps()}
        style={{
          border: '2px dashed',
          borderColor: resumeUrl ? '#94a3b8' : isDragActive ? '#3b82f6' : '#d1d5db',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          cursor: resumeUrl ? 'not-allowed' : 'pointer',
          backgroundColor: resumeUrl ? '#f1f5f9' : isDragActive ? '#eff6ff' : 'white',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        {resumeUrl && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64748b'
          }}>
            <FaLock />
            <span>Submission Locked</span>
          </div>
        )}
        
        <input {...getInputProps()} />
        
        {loading ? (
          <div>
            <FaSpinner className="spinner" style={{ marginBottom: '1rem', fontSize: '1.5rem' }} />
            <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>Uploading your resume...</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            {resumeUrl ? (
              <>
                <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
                  Your resume has already been submitted
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Contact organizers for changes
                </p>
              </>
            ) : (
              <>
                <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop PDF resume, or click to select'}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  PDF only • Max size 5MB • Team: {currentTeam.name}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {resumeUrl && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f0fdf4',
          borderRadius: '0.375rem',
          color: '#16a34a'
        }}>
          ✅ Upload successful! View your resume: {' '}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#15803d', textDecoration: 'underline' }}
          >
            Open PDF
          </a>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        background: '#fffbeb',
        padding: '1rem',
        borderRadius: '0.375rem'
      }}>
        <p style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
          <FaFilePdf style={{ marginRight: '0.5rem' }} />
          Important Notes:
        </p>
        <ul style={{ paddingLeft: '1.25rem', listStyleType: 'disc' }}>
          <li>Ensure your resume includes up-to-date contact information</li>
          <li>File name format: YourName_Team_Resume.pdf</li>
          <li>Only one submission allowed per participant</li>
          <li>Submission deadline: {new Date(selectedHackathon.submissionDeadline).toLocaleDateString()}</li>
        </ul>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ResumeUploadPage;