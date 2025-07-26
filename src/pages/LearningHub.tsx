import React, { useState } from 'react';
import { Play, BookOpen, Clock, Star, Bookmark, CheckCircle, Filter } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  students: number;
  thumbnail: string;
  completed: boolean;
  bookmarked: boolean;
  progress: number;
}

export default function LearningHub() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = ['All', 'Marketing', 'Finance', 'Operations', 'Strategy', 'Leadership'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Digital Marketing Fundamentals',
      description: 'Learn the basics of digital marketing including SEO, social media, and content marketing',
      duration: '4h 30m',
      level: 'Beginner',
      category: 'Marketing',
      rating: 4.8,
      students: 1250,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: true,
      bookmarked: false,
      progress: 100
    },
    {
      id: '2',
      title: 'Financial Planning for Startups',
      description: 'Master financial forecasting, budgeting, and funding strategies for new businesses',
      duration: '6h 15m',
      level: 'Intermediate',
      category: 'Finance',
      rating: 4.9,
      students: 890,
      thumbnail: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: false,
      bookmarked: true,
      progress: 65
    },
    {
      id: '3',
      title: 'Operations Management Excellence',
      description: 'Optimize your business operations with lean methodologies and process improvement',
      duration: '5h 45m',
      level: 'Advanced',
      category: 'Operations',
      rating: 4.7,
      students: 634,
      thumbnail: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: false,
      bookmarked: false,
      progress: 0
    },
    {
      id: '4',
      title: 'Strategic Business Planning',
      description: 'Develop comprehensive business strategies and competitive analysis skills',
      duration: '7h 20m',
      level: 'Intermediate',
      category: 'Strategy',
      rating: 4.8,
      students: 1120,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: false,
      bookmarked: true,
      progress: 25
    },
    {
      id: '5',
      title: 'Leadership and Team Management',
      description: 'Build effective leadership skills and learn to manage high-performing teams',
      duration: '4h 10m',
      level: 'Beginner',
      category: 'Leadership',
      rating: 4.6,
      students: 987,
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: false,
      bookmarked: false,
      progress: 0
    },
    {
      id: '6',
      title: 'Advanced Financial Analysis',
      description: 'Deep dive into financial modeling, valuation, and investment analysis',
      duration: '8h 30m',
      level: 'Advanced',
      category: 'Finance',
      rating: 4.9,
      students: 456,
      thumbnail: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
      completed: false,
      bookmarked: false,
      progress: 0
    }
  ]);

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const toggleBookmark = (courseId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggling bookmark for course ${courseId}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600">Expand your business knowledge with expert-led courses</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900">3 / 12</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours Learned</p>
              <p className="text-2xl font-bold text-gray-900">24.5</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates Earned</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Star className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Download available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                  course.level === 'Beginner' ? 'bg-green-500' :
                  course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {course.level}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleBookmark(course.id)}
                  className={`p-2 rounded-full ${
                    course.bookmarked ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'
                  } hover:scale-110 transition-transform`}
                >
                  <Bookmark className="h-4 w-4" fill={course.bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-3 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">{course.progress}% complete</span>
                    {course.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
              </div>
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>{course.progress > 0 ? 'Continue' : 'Start Course'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}