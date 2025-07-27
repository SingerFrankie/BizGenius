import React, { useState } from 'react';
import { FileText, Download, Plus, Eye, Edit, Trash2, Loader2, AlertCircle, MessageSquare } from 'lucide-react';
import { businessPlanGenerator, type BusinessPlanInput, type GeneratedBusinessPlan } from '../lib/businessPlanGenerator';

export default function BusinessPlan() {
  const [plans, setPlans] = useState<GeneratedBusinessPlan[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPlanView, setShowPlanView] = useState<GeneratedBusinessPlan | null>(null);
  const [showEditMode, setShowEditMode] = useState(false);
  const [showModifyMode, setShowModifyMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState<GeneratedBusinessPlan | null>(null);
  const [modificationRequest, setModificationRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BusinessPlanInput>({
    businessName: '',
    industry: '',
    businessType: '',
    location: '',
    targetAudience: '',
    uniqueValue: '',
    revenueModel: '',
    goals: ''
  });

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Food & Beverage',
    'Education', 'Manufacturing', 'Real Estate', 'Consulting', 'Renewable Energy',
    'Agriculture', 'Transportation', 'Entertainment', 'Tourism', 'Other'
  ];

  const businessTypes = [
    'Startup', 'Small Business', 'Enterprise', 'Non-Profit', 'Franchise', 'Partnership'
  ];

  const targetAudiences = [
    'Investors', 'Lenders', 'Partners', 'Internal Team', 'Government Grants', 'Customers'
  ];

  const handleInputChange = (field: keyof BusinessPlanInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof BusinessPlanInput)[] = [
      'businessName', 'industry', 'businessType', 'location', 'targetAudience', 'uniqueValue'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    return true;
  };

  const handleGeneratePlan = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedPlan = await businessPlanGenerator.generateBusinessPlan(formData);
      setPlans(prev => [generatedPlan, ...prev]);
      setShowGenerator(false);
      setFormData({
        businessName: '',
        industry: '',
        businessType: '',
        location: '',
        targetAudience: '',
        uniqueValue: '',
        revenueModel: '',
        goals: ''
      });
    } catch (error) {
      console.error('Business Plan Generation Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate business plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPlan = (plan: GeneratedBusinessPlan, format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      businessPlanGenerator.exportToPDF(plan);
    } else {
      businessPlanGenerator.exportToWord(plan);
    }
  };

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const handleEditPlan = (plan: GeneratedBusinessPlan) => {
    setEditedPlan({ ...plan });
    setShowEditMode(true);
    setShowPlanView(null);
  };

  const handleSaveEdit = () => {
    if (editedPlan) {
      setPlans(prev => prev.map(plan => 
        plan.id === editedPlan.id ? editedPlan : plan
      ));
      setShowEditMode(false);
      setShowPlanView(editedPlan);
      setEditedPlan(null);
    }
  };

  const handleCancelEdit = () => {
    setShowEditMode(false);
    setEditedPlan(null);
    if (showPlanView) {
      // Return to plan view if we were editing from there
      return;
    }
  };

  const handleModifyRequest = async () => {
    if (!showPlanView || !modificationRequest.trim()) return;
    
    setIsModifying(true);
    setError(null);
    
    try {
      const modifiedPlan = await businessPlanGenerator.modifyBusinessPlan(
        showPlanView, 
        modificationRequest
      );
      
      setPlans(prev => [modifiedPlan, ...prev]);
      setShowPlanView(modifiedPlan);
      setShowModifyMode(false);
      setModificationRequest('');
    } catch (error) {
      console.error('Business Plan Modification Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to modify business plan');
    } finally {
      setIsModifying(false);
    }
  };

  const updateEditedSection = (sectionIndex: number, newContent: string) => {
    if (editedPlan) {
      const updatedSections = [...editedPlan.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        content: newContent
      };
      setEditedPlan({
        ...editedPlan,
        sections: updatedSections
      });
    }
  };

  // Edit Mode Component
  if (showEditMode && editedPlan) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Business Plan</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Title Edit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Plan Title
              </label>
              <input
                type="text"
                value={editedPlan.title}
                onChange={(e) => setEditedPlan({ ...editedPlan, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sections Edit */}
            <div className="space-y-6">
              {editedPlan.sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {section.title}
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateEditedSection(index, e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
                    placeholder={`Enter content for ${section.title}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Plan Viewer Component
  if (showPlanView) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowPlanView(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Plans
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEditPlan(showPlanView)}
                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => setShowModifyMode(!showModifyMode)}
                className="px-3 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">AI Modify</span>
              </button>
              <button
                onClick={() => exportPlan(showPlanView, 'pdf')}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button
                onClick={() => exportPlan(showPlanView, 'docx')}
                className="px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Word</span>
              </button>
            </div>
          </div>

          {/* AI Modification Panel */}
          {showModifyMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Request AI Modifications
              </h3>
              <div className="space-y-4">
                <textarea
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  placeholder="Describe what you'd like to modify in your business plan. For example: 'Add more details about our marketing strategy' or 'Update the financial projections to be more conservative'"
                  rows={3}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleModifyRequest}
                    disabled={!modificationRequest.trim() || isModifying}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isModifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Modifying...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" />
                        <span>Apply Modifications</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowModifyMode(false);
                      setModificationRequest('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{showPlanView.title}</h1>
              <p className="text-gray-600">Industry: {showPlanView.industry}</p>
              <p className="text-sm text-gray-500">Created: {showPlanView.createdAt.toLocaleDateString()}</p>
            </div>

            <div className="space-y-8">
              {showPlanView.sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph.split('\n').map((line, lIndex) => (
                          <span key={lIndex}>
                            {line}
                            {lIndex < paragraph.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generator Form
  if (showGenerator) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AI Business Plan Generator</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Provide details about your business and our AI will create a comprehensive, professional business plan
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SunPower Tech"
                />
              </div>

              {/* Industry & Business Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Tanzania, East Africa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select audience</option>
                    {targetAudiences.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unique Value Proposition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unique Value Proposition *
                </label>
                <textarea
                  value={formData.uniqueValue}
                  onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., We provide affordable, solar-powered smart systems for rural homes"
                />
              </div>

              {/* Revenue Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Model
                </label>
                <input
                  type="text"
                  value={formData.revenueModel}
                  onChange={(e) => handleInputChange('revenueModel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Product sales and maintenance contracts"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Expand to East African markets in 3 years"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  onClick={() => setShowGenerator(false)}
                  className="flex-1 px-6 py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    'Generate Business Plan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Plans List
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Business Plans</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create professional business plans with AI assistance
          </p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">New Plan</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{plan.title}</h3>
                    <p className="text-sm text-gray-600">{plan.industry}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {plan.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Created: {plan.createdAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {plan.sections.length} sections
                </p>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowPlanView(plan)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button 
                    onClick={() => handleEditPlan(plan)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <div className="relative group">
                    <button className="px-3 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => exportPlan(plan, 'pdf')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => exportPlan(plan, 'docx')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export Word
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No business plans yet</h3>
          <p className="text-gray-600 mb-6">Create your first AI-powered business plan to get started</p>
          <button
            onClick={() => setShowGenerator(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      )}
    </div>
  );
}