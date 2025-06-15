import { useState } from 'react';
import { useHackathon } from '../../contexts/HackathonContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AddHackathonForm = () => {
  const { addHackathon } = useHackathon();
  const { user } = useUser();
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
    organizer: user.organization,
    organizerModel: 'Organization',
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
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.minTeamSize > formData.maxTeamSize) newErrors.teamSize = 'Min team size cannot be greater than max';
    
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Create New Hackathon</h1>
                <p className="mt-3 text-indigo-100 max-w-2xl">
                  Fill in the details to create your hackathon. All fields marked with * are required.
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Section 1: Basic Information */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Basic Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-3">
                  <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                    Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                      errors.title ? 'border-red-500' : 'border'
                    }`}
                    placeholder="Hackathon name"
                  />
                  {errors.title && <p className="mt-2 text-base text-red-600">{errors.title}</p>}
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="mode" className="block text-lg font-medium text-gray-700">
                    Mode*
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-lg"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                    errors.description ? 'border-red-500' : 'border'
                  }`}
                  placeholder="Describe your hackathon..."
                />
                {errors.description && <p className="mt-2 text-base text-red-600">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                <div className="space-y-3">
                  <label htmlFor="startDate" className="block text-lg font-medium text-gray-700">
                    Start Date*
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                      errors.startDate ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.startDate && <p className="mt-2 text-base text-red-600">{errors.startDate}</p>}
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="endDate" className="block text-lg font-medium text-gray-700">
                    End Date*
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                      errors.endDate ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.endDate && <p className="mt-2 text-base text-red-600">{errors.endDate}</p>}
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="registrationDeadline" className="block text-lg font-medium text-gray-700">
                    Registration Deadline*
                  </label>
                  <input
                    type="datetime-local"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                      errors.registrationDeadline ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.registrationDeadline && <p className="mt-2 text-base text-red-600">{errors.registrationDeadline}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-3">
                  <label htmlFor="location" className="block text-lg font-medium text-gray-700">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                      errors.location ? 'border-red-500' : 'border'
                    }`}
                    placeholder="Physical location or online platform"
                  />
                  {errors.location && <p className="mt-2 text-base text-red-600">{errors.location}</p>}
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="tags" className="block text-lg font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="block w-full rounded-l-xl border-r-0 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                      placeholder="Add a tag (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="inline-flex items-center rounded-r-xl border border-l-0 border-gray-300 bg-gray-50 px-5 text-gray-500 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-base font-medium text-indigo-800">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          <svg className="h-4 w-4" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section 2: Team Information */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </span>
                  Team Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-3">
                  <label htmlFor="minTeamSize" className="block text-lg font-medium text-gray-700">
                    Minimum Team Size*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="minTeamSize"
                      name="minTeamSize"
                      min="1"
                      max={formData.maxTeamSize}
                      value={formData.minTeamSize}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 pl-12"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-2xl">≥</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="maxTeamSize" className="block text-lg font-medium text-gray-700">
                    Maximum Team Size*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="maxTeamSize"
                      name="maxTeamSize"
                      min={formData.minTeamSize}
                      max="10"
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 pl-12"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-2xl">≤</span>
                    </div>
                  </div>
                </div>
              </div>
              {errors.teamSize && (
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-lg text-red-800">{errors.teamSize}</p>
                </div>
              )}
            </div>
            
            {/* Section 3: Timeline */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Timeline*
                </h2>
              </div>
              
              <div className="space-y-6">
                {formData.timeline.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold text-gray-800 text-xl">Milestone {index + 1}</h3>
                      {formData.timeline.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimelineItem(index)}
                          className="text-red-600 hover:text-red-800 flex items-center text-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label htmlFor={`timelineTitle${index}`} className="block text-lg font-medium text-gray-700">
                          Title*
                        </label>
                        <input
                          type="text"
                          id={`timelineTitle${index}`}
                          value={item.title}
                          onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                          className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                            errors[`timelineTitle${index}`] ? 'border-red-500' : 'border'
                          }`}
                          placeholder="Milestone name"
                        />
                        {errors[`timelineTitle${index}`] && <p className="mt-2 text-base text-red-600">{errors[`timelineTitle${index}`]}</p>}
                      </div>
                      
                      <div className="space-y-3">
                        <label htmlFor={`timelineDate${index}`} className="block text-lg font-medium text-gray-700">
                          Date*
                        </label>
                        <input
                          type="datetime-local"
                          id={`timelineDate${index}`}
                          value={item.date}
                          onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                          className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                            errors[`timelineDate${index}`] ? 'border-red-500' : 'border'
                          }`}
                        />
                        {errors[`timelineDate${index}`] && <p className="mt-2 text-base text-red-600">{errors[`timelineDate${index}`]}</p>}
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <label htmlFor={`timelineDesc${index}`} className="block text-lg font-medium text-gray-700">
                        Description*
                      </label>
                      <textarea
                        id={`timelineDesc${index}`}
                        rows={3}
                        value={item.description}
                        onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 ${
                          errors[`timelineDesc${index}`] ? 'border-red-500' : 'border'
                        }`}
                        placeholder="Describe this milestone..."
                      />
                      {errors[`timelineDesc${index}`] && <p className="mt-2 text-base text-red-600">{errors[`timelineDesc${index}`]}</p>}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="inline-flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-indigo-500 hover:text-indigo-700 text-lg font-medium"
                >
                  <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Milestone
                </button>
              </div>
            </div>
            
            {/* Section 4: Rules */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Rules
                </h2>
              </div>
              
              <div className="space-y-5">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-3">
                      <div className="bg-indigo-200 border-2 border-indigo-300 rounded-xl w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                        className="block w-full rounded-xl border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                        placeholder={`Rule #${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('rules', index)}
                      className={`text-gray-400 hover:text-red-600 mt-3 ${formData.rules.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={formData.rules.length <= 1}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('rules')}
                  className="inline-flex items-center text-lg text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Rule
                </button>
              </div>
            </div>
            
            {/* Section 5: Policies */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Policies
                </h2>
              </div>
              
              <div className="space-y-5">
                {formData.policies.map((policy, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-3">
                      <div className="bg-purple-200 border-2 border-purple-300 rounded-xl w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={policy}
                        onChange={(e) => handleArrayChange('policies', index, e.target.value)}
                        className="block w-full rounded-xl border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                        placeholder={`Policy #${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('policies', index)}
                      className={`text-gray-400 hover:text-red-600 mt-3 ${formData.policies.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={formData.policies.length <= 1}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('policies')}
                  className="inline-flex items-center text-lg text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Policy
                </button>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="pt-8">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/hackathons')}
                  className="rounded-xl border-2 border-gray-300 bg-white py-3 px-8 text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-8 text-lg font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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