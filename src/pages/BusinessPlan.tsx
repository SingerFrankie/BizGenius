import React, { useState } from 'react';
import { FileText, Download, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface BusinessPlan {
  id: string;
  title: string;
  industry: string;
  lastModified: Date;
  status: 'draft' | 'complete';
}

export default function BusinessPlan() {
  const [plans, setPlans] = useState<BusinessPlan[]>([
    {
      id: '1',
      title: 'Tech Startup Business Plan',
      industry: 'Technology',
      lastModified: new Date('2024-01-15'),
      status: 'complete'
    },
    {
      id: '2',
      title: 'Restaurant Business Plan',
      industry: 'Food & Beverage',
      lastModified: new Date('2024-01-10'),
      status: 'draft'
    }
  ]);
  
  const [showGenerator, setShowGenerator] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    businessType: '',
    targetMarket: '',
    fundingNeeded: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Food & Beverage',
    'Education', 'Manufacturing', 'Real Estate', 'Consulting', 'Other'
  ];

  const businessTypes = [
    'Startup', 'Small Business', 'Enterprise', 'Non-Profit', 'Franchise'
  ];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newPlan: BusinessPlan = {
      id: Date.now().toString(),
      title: `${formData.businessName} Business Plan`,
      industry: formData.industry,
      lastModified: new Date(),
      status: 'complete'
    };
    
    setPlans(prev => [newPlan, ...prev]);
    setShowGenerator(false);
    setFormData({
      businessName: '',
      industry: '',
      businessType: '',
      targetMarket: '',
      fundingNeeded: ''
    });
    setIsGenerating(false);
  };

  const exportPlan = (planId: string, format: 'pdf' | 'docx' | 'pptx') => {
    // Simulate export functionality
    console.log(`Exporting plan ${planId} as ${format}`);
  };

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  if (showGenerator) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">AI Business Plan Generator</h2>
              <p className="text-gray-600 mt-2">Provide some details and our AI will create a comprehensive business plan for you</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
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
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Market
                </label>
                <textarea
                  value={formData.targetMarket}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your target customers..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Needed
                </label>
                <input
                  type="text"
                  value={formData.fundingNeeded}
                  onChange={(e) => setFormData(prev => ({ ...prev, fundingNeeded: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $50,000"
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => setShowGenerator(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePlan}
                  disabled={!formData.businessName || !formData.industry || isGenerating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Plans</h1>
          <p className="text-gray-600 mt-1">Create and manage your business plans with AI assistance</p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.title}</h3>
                  <p className="text-sm text-gray-600">{plan.industry}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  plan.status === 'complete'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {plan.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Last modified: {plan.lastModified.toLocaleDateString()}
              </p>

              <div className="flex items-center space-x-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <div className="relative group">
                  <button className="px-3 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => exportPlan(plan.id, 'pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => exportPlan(plan.id, 'docx')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Word
                    </button>
                    <button
                      onClick={() => exportPlan(plan.id, 'pptx')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export PPT
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

      {plans.length === 0 && (
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