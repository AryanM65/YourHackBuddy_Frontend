import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaExclamationCircle, FaCheckCircle, FaEye } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { toast } from 'react-toastify';

const AdminComplaintsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Get base URL from environment variable
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/');
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v1/admin/view-complaints`, {
          withCredentials: true,
        });
        setComplaints(res.data?.complaints || []);
      } catch (err) {
        toast.error('Failed to fetch complaints');
        console.error(err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user, navigate, baseUrl]);

  const filteredComplaints = complaints.filter((complaint) => {
    // Search filter
    const matchesSearch =
      complaint.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.from?.name &&
        complaint.from.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === 'all' || complaint.againstType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <MdPendingActions className="text-yellow-500" />;
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaExclamationCircle className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolveComplaint = async () => {
    if (!selectedComplaint) return;
    
    // Validate response text
    if (!responseText.trim()) {
      setValidationError('Please add a response before resolving the complaint');
      return;
    }

    try {
      const complaintId = selectedComplaint._id;
      await axios.patch(
        `${baseUrl}/api/v1/resolve/${complaintId}`,
        { adminResponse: responseText },
        { withCredentials: true }
      );
      
      // Update local state
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, status: 'resolved', adminResponse: responseText } 
            : c
        )
      );
      
      setResponseText('');
      setValidationError('');
      setSelectedComplaint(null);
      toast.success('Complaint resolved successfully');
    } catch (err) {
      toast.error('Failed to resolve complaint');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <br></br>
          <br></br>
          <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-gray-600 mt-2">
            Review and manage user complaints
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="User">User</option>
                <option value="Team">Team</option>
                <option value="Hackathon">Hackathon</option>
                <option value="System">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <FaExclamationCircle className="w-full h-full" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no complaints to display.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No complaints match your filters
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                              {complaint.from?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {complaint.from?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {complaint.from?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {complaint.againstType}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <div className="text-sm text-gray-900 truncate">
                            {complaint.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            <div className="flex items-center">
                              {getStatusIcon(complaint.status)}
                              <span className="ml-1">{complaint.status}</span>
                            </div>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setResponseText('');
                              setValidationError('');
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    Complaint Details
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedComplaint(null);
                      setResponseText('');
                      setValidationError('');
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <FaExclamationCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      From
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedComplaint.from?.name || 'Unknown'} (
                      {selectedComplaint.from?.email || 'No email'})
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Type
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedComplaint.againstType}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Status
                    </h4>
                    <p className="mt-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          selectedComplaint.status
                        )}`}
                      >
                        <div className="flex items-center">
                          {getStatusIcon(selectedComplaint.status)}
                          <span className="ml-1">
                            {selectedComplaint.status}
                          </span>
                        </div>
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Date Submitted
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedComplaint.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Message
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedComplaint.message}
                    </p>
                  </div>

                  {selectedComplaint.adminResponse && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Admin Response
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedComplaint.adminResponse}
                      </p>
                    </div>
                  )}

                  {selectedComplaint.status === 'pending' && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Add Response
                      </h4>
                      <textarea
                        rows={4}
                        className={`mt-1 block w-full border ${
                          validationError ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                        placeholder="Enter your response..."
                        value={responseText}
                        onChange={(e) => {
                          setResponseText(e.target.value);
                          // Clear validation error when user types
                          if (validationError) setValidationError('');
                        }}
                      />
                      {validationError && (
                        <p className="mt-1 text-sm text-red-600">{validationError}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponseText('');
                    setValidationError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                
                {selectedComplaint.status === 'pending' && (
                  <button
                    type="button"
                    onClick={handleResolveComplaint}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Resolve Complaint
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsPage;