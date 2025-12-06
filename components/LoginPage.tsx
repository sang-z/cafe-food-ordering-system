import React, { useState } from 'react';
import { UserRole } from '../types';
import { EyeIcon, EyeOffIcon, SunIcon, MoonIcon } from './Icons';

interface LoginPageProps {
  onLogin: (role: UserRole, id: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'student') {
      // Mock student login - allow any ID
      if (username.trim().length < 3) {
        setError('Please enter a valid Student ID');
        return;
      }
      onLogin('student', username);
    } else {
      // Mock admin login
      if (username === 'admin' && password === 'admin') {
        onLogin('admin', 'admin');
      } else {
        setError('Invalid admin credentials. (Try admin/admin)');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors duration-200">
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform dark:text-yellow-400 text-indigo-600"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors duration-200">
        <div className="bg-indigo-600 dark:bg-indigo-700 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">LoL cafe</h1>
          <p className="text-indigo-200">Canteen Ordering System</p>
        </div>

        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => { setActiveTab('student'); setError(''); setUsername(''); setPassword(''); }}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${
              activeTab === 'student' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); setUsername(''); setPassword(''); }}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${
              activeTab === 'admin' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {activeTab === 'student' ? 'Student ID' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'student' ? 'e.g. 21BCS001' : 'admin'}
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {activeTab === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 active:transform active:scale-95 transition-all shadow-md"
          >
            {activeTab === 'student' ? 'Start Ordering' : 'Access Dashboard'}
          </button>
          
          {activeTab === 'student' && (
             <p className="text-center text-xs text-gray-400 mt-4">
               No password required for demo student access.
             </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;