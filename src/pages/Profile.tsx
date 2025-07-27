import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Award,
  BookOpen,
  Clock,
  Target
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'Tech Startup Inc.',
    position: 'Founder & CEO',
    bio: 'Passionate entrepreneur focused on building innovative solutions and continuous learning.'
  });

  const handleSave = () => {
    // In a real app, this would update the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      company: 'Tech Startup Inc.',
      position: 'Founder & CEO',
      bio: 'Passionate entrepreneur focused on building innovative solutions and continuous learning.'
    });
    setIsEditing(false);
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{formData.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">{formData.position} at {formData.company}</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {formData.location}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            <span className="sm:hidden">{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">{formData.bio}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h2>
              {isEditing && (
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formData.name}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formData.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {progress.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <Award className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{achievement}</p>
                    <p className="text-xs text-gray-600">Earned recently</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Courses Completed</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{progress.coursesCompleted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-teal-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Business Plans</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{progress.businessPlansCreated}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Learning Streak</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{progress.learningStreak} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Achievements</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{progress.achievements.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Learning Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round((progress.coursesCompleted / progress.totalCourses) * 100)}%</span>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(progress.coursesCompleted / progress.totalCourses) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-blue-100 mt-4">
                Keep up the great work! You're making excellent progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}