'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  KeyIcon, 
  ClipboardDocumentListIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeUsers: 0,
    totalLogins: 0,
    totalCredentials: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // You can implement API endpoints to get these stats
        // For now, we'll use placeholder data
        setStats({
          totalSubscribers: 150,
          activeUsers: 45,
          totalLogins: 1230,
          totalCredentials: 89
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleExportSubscribers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate CSV content
      const csvContent = [
        ['Email', 'Status', 'Source', 'Created At'],
        ...Array.from({ length: stats.totalSubscribers }, (_, i) => [
          `user${i + 1}@example.com`,
          Math.random() > 0.1 ? 'active' : 'inactive',
          ['website', 'api', 'import', 'referral'][Math.floor(Math.random() * 4)],
          new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      alert('Subscribers exported successfully!');
    } catch (error) {
      alert('Error exporting subscribers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Newsletter sent successfully to ${stats.totalSubscribers} subscribers!`);
    } catch (error) {
      alert('Error sending newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate report data
      const reportData = {
        totalUsers: stats.totalSubscribers + stats.activeUsers,
        totalSubscribers: stats.totalSubscribers,
        activeUsers: stats.activeUsers,
        totalLogins: stats.totalLogins,
        totalCredentials: stats.totalCredentials,
        successRate: ((stats.totalLogins - Math.floor(stats.totalLogins * 0.1)) / stats.totalLogins * 100).toFixed(1),
        generatedAt: new Date().toISOString()
      };
      
      const reportContent = `
ADMIN DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}

OVERVIEW STATISTICS
==================
Total Subscribers: ${reportData.totalSubscribers}
Active Users: ${reportData.activeUsers}
Total Logins: ${reportData.totalLogins}
Total Credentials: ${reportData.totalCredentials}
Login Success Rate: ${reportData.successRate}%

SUMMARY
=======
Total registered users: ${reportData.totalUsers}
Platform engagement: ${reportData.activeUsers}/${reportData.totalUsers} users active
Security: ${reportData.totalCredentials} managed credentials

Report generated on ${new Date().toLocaleString()}
      `.trim();
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      
      alert('Report generated successfully!');
    } catch (error) {
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: 'Subscribers',
      description: 'Manage newsletter subscribers',
      href: '/admin/subscribers',
      icon: UserGroupIcon,
      count: stats.totalSubscribers,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      description: 'View currently active users',
      href: '/admin/active-users',
      icon: UserIcon,
      count: stats.activeUsers,
      color: 'bg-green-500'
    },
    {
      title: 'Login History',
      description: 'View login logs and history',
      href: '/admin/logins',
      icon: ClipboardDocumentListIcon,
      count: stats.totalLogins,
      color: 'bg-purple-500'
    },
    {
      title: 'Credentials',
      description: 'Manage user credentials',
      href: '/admin/credentials',
      icon: KeyIcon,
      count: stats.totalCredentials,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                All Subscribers
              </Link>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/admin/login';
                  } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/admin/login';
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.title}
                  className={`${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } overflow-hidden shadow rounded-lg`}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${section.color} p-3 rounded-md`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          } truncate`}>
                            {section.title}
                          </dt>
                          <dd className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {section.count.toLocaleString()}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  } p-6 rounded-lg shadow-md transition-colors duration-200 cursor-pointer border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`${section.color} p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={`ml-4 text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {section.title}
                    </h3>
                  </div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}>
                    {section.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {section.count.toLocaleString()}
                    </span>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      View all →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className={`mt-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow rounded-lg`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleExportSubscribers}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Exporting...' : 'Export Subscribers'}
                </button>
                <button 
                  onClick={handleSendNewsletter}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Newsletter'}
                </button>
                <button 
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 