import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { 
  MessageSquare, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Award,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export default function Home() {
  const { progress } = useProgress();

  const quickActions = [
    {
      title: 'Ask AI Assistant',
      description: 'Get instant business advice',
      icon: MessageSquare,
      link: '/assistant',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Business Plan',
      description: 'Generate professional plans',
      icon: FileText,
      link: '/business-plan',
      color: 'bg-teal-500'
    },
    {
      title: 'Continue Learning',
      description: 'Pick up where you left off',
      icon: BookOpen,
      link: '/learning',
      color: 'bg-purple-500'
    },
    {
      title: 'View Analytics',
      description: 'Track your progress',
      icon: TrendingUp,
      link: '/analytics',
      color: 'bg-amber-500'
    }
  ];

  const stats = [
    {
      title: 'Courses Completed',
      value: `${progress.coursesCompleted}/${progress.totalCourses}`,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Business Plans',
      value: progress.businessPlansCreated,
      icon: FileText,
      color: 'text-teal-600'
    },
    {
      title: 'AI Interactions',
      value: progress.aiInteractions,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Learning Streak',
      value: `${progress.learningStreak} days`,
      icon: Zap,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100 mb-6">Ready to take your business knowledge to the next level?</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>5 min learning session</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>3 courses remaining</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>{progress.achievements.length} achievements</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Completed "Marketing Fundamentals"</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Generated new business plan</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Asked AI about financial projections</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-3">
            {progress.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-gray-900">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}