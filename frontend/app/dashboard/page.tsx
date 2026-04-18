import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, User</span>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
              <p className="text-gray-600">Here's an overview of your account and recent activities.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Sessions</h3>
                <p className="text-3xl font-bold text-green-600">567</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-yellow-600">$12,345</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                <p className="text-3xl font-bold text-red-600">89</p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">User John Doe logged in</span>
                  <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">New order placed</span>
                  <span className="text-sm text-gray-500 ml-auto">4 hours ago</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Payment received</span>
                  <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
                </li>
              </ul>
            </div>

            {/* Placeholder for Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics Chart</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart Placeholder</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}