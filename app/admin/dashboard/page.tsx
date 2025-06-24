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

interface RealStats {
  totalSubscribers: number;
  activeUsers: number;
  totalLogins: number;
  totalCredentials: number;
}

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<RealStats>({
    totalSubscribers: 0,
    activeUsers: 0,
    totalLogins: 0,
    totalCredentials: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from multiple endpoints
        const [subscribersRes, usersRes, loginsRes, credentialsRes] = await Promise.all([
          fetch('/api/admin/subscribers'),
          fetch('/api/admin/check-users'),
          fetch('/api/admin/logins'),
          fetch('/api/admin/credentials')
        ]);

        const subscribersData = await subscribersRes.json();
        const usersData = await usersRes.json();
        const loginsData = await loginsRes.json();
        const credentialsData = await credentialsRes.json();

        setStats({
          totalSubscribers: subscribersData.subscribers?.length || 0,
          activeUsers: usersData.adminUsers?.filter((u: any) => u.status === 'active').length || 0,
          totalLogins: loginsData.logins?.length || 0,
          totalCredentials: credentialsData.credentials?.length || 0
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching real stats:', error);
        setError('Failed to load statistics from database');
        // Set to zero if database fails
        setStats({
          totalSubscribers: 0,
          activeUsers: 0,
          totalLogins: 0,
          totalCredentials: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchRealStats();
    }
  }, [mounted]);

  const handleExportSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/subscribers');
      const data = await response.json();
      
      if (!data.subscribers || data.subscribers.length === 0) {
        alert('No subscribers found to export.');
        return;
      }

      // Generate CSV content from real data
      const csvContent = [
        ['Email', 'Status', 'Created At'],
        ...data.subscribers.map((sub: any) => [
          sub.email,
          sub.status || 'active',
          new Date(sub.createdAt).toISOString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      alert(`Exported ${data.subscribers.length} real subscribers!`);
    } catch (error) {
      alert('Error exporting subscribers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (stats.totalSubscribers === 0) {
      alert('No subscribers found in database. Add some subscribers first.');
      return;
    }

    setLoading(true);
    try {
      // Simulate newsletter sending to real subscriber count
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Newsletter would be sent to ${stats.totalSubscribers} real subscribers from database!`);
    } catch (error) {
      alert('Error sending newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const reportContent = `
ADMIN DASHBOARD REPORT (REAL DATA)
Generated: ${new Date().toLocaleString()}

ACTUAL DATABASE STATISTICS
==========================
Total Subscribers: ${stats.totalSubscribers}
Active Users: ${stats.activeUsers}
Total Login Records: ${stats.totalLogins}
Total Credentials: ${stats.totalCredentials}

SUMMARY
=======
All data pulled from live MongoDB database
Report generated on ${new Date().toLocaleString()}
      `.trim();
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `real-admin-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      
      alert('Real data report generated successfully!');
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
      description: 'Admin Credentials for where logins are stored',
      href: '/admin/credentials',
      icon: KeyIcon,
      count: stats.totalCredentials,
      color: 'bg-orange-500'
    }
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900 dark:text-white">
            Loading theme...
          </p>
        </div>
      </div>
    );
  }

  if (loading && stats.totalSubscribers === 0) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading real data from MongoDB...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Admin Dashboard - Real Data
              </h1>
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error} - Showing database counts (may be 0 if no data exists)
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                User Management
              </Link>
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className={`${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } overflow-hidden shadow rounded-lg transition-colors duration-200`}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${section.color} p-3 rounded-md`}>
                        <section.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                          {section.title}
                        </dt>
                        <dd>
                          <div className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {section.count.toLocaleString()}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {section.description}
                    </div>
                    <div className="mt-1">
                      <span className="text-blue-600 text-sm font-medium">
                        {section.count > 0 ? `${section.count}` : '0'} 
                        <span className="text-xs ml-1">View all →</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportSubscribers}
              disabled={loading || stats.totalSubscribers === 0}
              className={`w-full px-4 py-3 rounded-md text-sm font-medium ${
                loading || stats.totalSubscribers === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Loading...' : `Export ${stats.totalSubscribers} Real Subscribers`}
            </button>
            
            <button
              onClick={handleSendNewsletter}
              disabled={loading || stats.totalSubscribers === 0}
              className={`w-full px-4 py-3 rounded-md text-sm font-medium ${
                loading || stats.totalSubscribers === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Loading...' : `Send Newsletter to ${stats.totalSubscribers} Real Subscribers`}
            </button>
            
            <Link
              href="/admin"
              className={`w-full px-4 py-3 rounded-md text-sm font-medium text-center ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              User Management Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 