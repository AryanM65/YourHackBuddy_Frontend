import { useState } from 'react';
import { useHackathon } from '../../contexts/HackathonContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AddHackathonForm = () => {
  const { addHackathon } = useHackathon();
  const {user} = useUser();
  console.log("user", user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    mode: 'Online',
    tags: [],
    organizer: user.organization, // This would typically come from auth context
    organizerModel: 'Organization', // Default or from context
    maxTeamSize: 4,
    minTeamSize: 1,
    timeline: [{ title: '', description: '', date: '' }],
    banner: '',
    rules: [''],
    policies: ['']
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const validate = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.minTeamSize > formData.maxTeamSize) newErrors.teamSize = 'Min team size cannot be greater than max';
    
    // Timeline validation
    formData.timeline.forEach((item, index) => {
      if (!item.title) newErrors[`timelineTitle${index}`] = 'Timeline title is required';
      if (!item.description) newErrors[`timelineDesc${index}`] = 'Timeline description is required';
      if (!item.date) newErrors[`timelineDate${index}`] = 'Timeline date is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addHackathon(formData);
      navigate('/hackathons');
    } catch (error) {
      console.error('Error creating hackathon:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData(prev => ({ ...prev, timeline: newTimeline }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { title: '', description: '', date: '' }]
    }));
  };

  const removeTimelineItem = (index) => {
    if (formData.timeline.length <= 1) return;
    const newTimeline = formData.timeline.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, timeline: newTimeline }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length <= 1) return;
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Hackathon</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.title ? 'border-red-500' : 'border'}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border'}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date*
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.startDate ? 'border-red-500' : 'border'}`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date*
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.endDate ? 'border-red-500' : 'border'}`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    Registration Deadline*
                  </label>
                  <input
                    type="datetime-local"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.registrationDeadline ? 'border-red-500' : 'border'}`}
                  />
                  {errors.registrationDeadline && <p className="mt-1 text-sm text-red-600">{errors.registrationDeadline}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.location ? 'border-red-500' : 'border'}`}
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
                
                <div>
                  <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                    Mode*
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove tag</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Team Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minTeamSize" className="block text-sm font-medium text-gray-700">
                    Minimum Team Size*
                  </label>
                  <input
                    type="number"
                    id="minTeamSize"
                    name="minTeamSize"
                    min="1"
                    max={formData.maxTeamSize}
                    value={formData.minTeamSize}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700">
                    Maximum Team Size*
                  </label>
                  <input
                    type="number"
                    id="maxTeamSize"
                    name="maxTeamSize"
                    min={formData.minTeamSize}
                    max="10"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {errors.teamSize && <p className="text-sm text-red-600">{errors.teamSize}</p>}
            </div>
            
            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Timeline*</h3>
              
              {formData.timeline.map((item, index) => (
                <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Timeline Item {index + 1}</h4>
                    {formData.timeline.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`timelineTitle${index}`} className="block text-sm font-medium text-gray-700">
                      Title*
                    </label>
                    <input
                      type="text"
                      id={`timelineTitle${index}`}
                      value={item.title}
                      onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`timelineTitle${index}`] ? 'border-red-500' : 'border'}`}
                    />
                    {errors[`timelineTitle${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`timelineTitle${index}`]}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor={`timelineDesc${index}`} className="block text-sm font-medium text-gray-700">
                      Description*
                    </label>
                    <textarea
                      id={`timelineDesc${index}`}
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`timelineDesc${index}`] ? 'border-red-500' : 'border'}`}
                    />
                    {errors[`timelineDesc${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`timelineDesc${index}`]}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor={`timelineDate${index}`} className="block text-sm font-medium text-gray-700">
                      Date*
                    </label>
                    <input
                      type="datetime-local"
                      id={`timelineDate${index}`}
                      value={item.date}
                      onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`timelineDate${index}`] ? 'border-red-500' : 'border'}`}
                    />
                    {errors[`timelineDate${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`timelineDate${index}`]}</p>}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTimelineItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Timeline Item
              </button>
            </div>
            
            {/* Banner */}
            {/* <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700">
                Banner Image URL
              </label>
              <input
                type="url"
                id="banner"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div> */}
            
            {/* Rules */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Rules</h3>
              
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                    className="flex-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('rules', index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={formData.rules.length <= 1}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('rules')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Rule
              </button>
            </div>
            
            {/* Policies */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Policies</h3>
              
              {formData.policies.map((policy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={policy}
                    onChange={(e) => handleArrayChange('policies', index, e.target.value)}
                    className="flex-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('policies', index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={formData.policies.length <= 1}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('policies')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Policy
              </button>
            </div>
            
            {/* Submit Button */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/hackathons')}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Hackathon
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHackathonForm;