import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, GraduationCap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'AI Business Assistant',
      description: 'Get instant business advice and answers to your questions',
      icon: Brain,
      link: '/assistant',
      color: 'bg-blue-500'
    },
    {
      title: 'Business Plan Generator',
      description: 'Create professional business plans with AI assistance',
      icon: FileText,
      link: '/plan',
      color: 'bg-teal-500'
    },
    {
      title: 'Learning Hub',
      description: 'Access courses and tutorials to grow your business skills',
      icon: GraduationCap,
      link: '/learn',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl lg:text-5xl">
            Welcome to BizGenius
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto sm:text-lg lg:text-xl">
            Your AI-powered business learning platform. Get expert advice, create professional 
            business plans, and master essential business skills all in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 text-left sm:p-8"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform sm:w-14 sm:h-14`}>
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:text-xl">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}