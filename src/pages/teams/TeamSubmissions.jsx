import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useHackathon } from '../../contexts/HackathonContext';
import { useDropzone } from 'react-dropzone';
import { Spinner, Alert, AlertIcon, Box, Heading, Text, List, ListItem, Link } from '@chakra-ui/react';

const TeamSubmissions = () => {
  const { hackathonId } = useParams();
  const { currentTeam, uploadResume, loading, error, getUserTeamForHackathon } = useTeam();
  const { selectedHackathon, fetchHackathonById } = useHackathon();
  const [successMessage, setSuccessMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Fetch hackathon details and user's team
  useEffect(() => {
    const initializePage = async () => {
      try {
        await fetchHackathonById(hackathonId);
        await getUserTeamForHackathon(hackathonId);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    
    initializePage();
  }, [hackathonId, fetchHackathonById, getUserTeamForHackathon]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && currentTeam?._id) {
      try {
        const result = await uploadResume(currentTeam._id, hackathonId, file);
        setResumeUrl(result.resumeUrl);
        setSuccessMessage('Resume uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }, [currentTeam, hackathonId, uploadResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  if (!selectedHackathon || !currentTeam) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading hackathon and team information...</Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="0 auto" p={6}>
      <Heading as="h1" size="xl" mb={8} color="blue.600">
        {selectedHackathon.name} - Team Resume Upload
      </Heading>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert status="success" mb={6} borderRadius="md">
          <AlertIcon />
          {successMessage}
        </Alert>
      )}

      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        borderRadius="lg"
        p={8}
        textAlign="center"
        cursor="pointer"
        backgroundColor={isDragActive ? 'blue.50' : 'white'}
        opacity={loading ? 0.6 : 1}
        transition="all 0.2s"
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <Box>
            <Spinner thickness="4px" speed="0.65s" size="xl" mb={4} />
            <Text fontSize="lg" color="gray.600">Uploading your resume...</Text>
          </Box>
        ) : (
          <Box>
            <Text fontSize="6xl" mb={4}>📄</Text>
            <Text fontSize="lg" color="gray.600">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop PDF resume, or click to select'}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              PDF only • Max size 5MB • Team: {currentTeam.name}
            </Text>
          </Box>
        )}
      </Box>

      {resumeUrl && (
        <Box mt={6} p={4} bg="green.50" borderRadius="md">
          <Text color="green.600">
            ✅ Upload successful! View your resume: {' '}
            <Link href={resumeUrl} isExternal color="green.700" textDecoration="underline">
              Open PDF
            </Link>
          </Text>
        </Box>
      )}

      <Box mt={8} bg="orange.50" p={4} borderRadius="md">
        <Text fontWeight="bold" color="orange.800" mb={2}>Important Notes:</Text>
        <List spacing={2} styleType="disc" pl={5}>
          <ListItem>Ensure your resume includes up-to-date contact information</ListItem>
          <ListItem>File name should follow: YourName_Team_Resume.pdf</ListItem>
          <ListItem>Only team members can upload resumes</ListItem>
          <ListItem>Submission deadline: {new Date(selectedHackathon.submissionDeadline).toLocaleDateString()}</ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default TeamSubmissions;