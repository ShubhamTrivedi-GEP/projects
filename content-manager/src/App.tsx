import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  Camera,
  Settings, 
  User, 
  Moon, 
  Sun, 
  Home,
  ThumbsUp,
  MessageSquare,
  Share2,
  Eye,
  Clock,
  ChevronDown,
  Plus,
  X,
  Check,
  Search
} from 'lucide-react';

const sampleData = {
  posts: [
    {
      id: 1,
      title: "10 Tips for Better Content",
      type: "article",
      date: "2025-05-15",
      likes: 245,
      comments: 37,
      shares: 82,
      views: 3240,
      platform: "blog"
    },
    {
      id: 2,
      title: "Creator Economy in 2025",
      type: "video",
      date: "2025-05-10",
      likes: 512,
      comments: 64,
      shares: 128,
      views: 5840,
      platform: "youtube"
    },
    {
      id: 3,
      title: "Behind the Scenes",
      type: "image",
      date: "2025-05-05",
      likes: 873,
      comments: 92,
      shares: 134,
      views: 4320,
      platform: "instagram"
    },
    {
      id: 4,
      title: "Quick Update",
      type: "text",
      date: "2025-05-01",
      likes: 327,
      comments: 41,
      shares: 53,
      views: 2980,
      platform: "twitter"
    },
    {
      id: 5,
      title: "Industry Interview",
      type: "podcast",
      date: "2025-04-27",
      likes: 189,
      comments: 26,
      shares: 45,
      views: 1560,
      platform: "spotify"
    },
    {
      id: 6,
      title: "How-to Tutorial",
      type: "video",
      date: "2025-04-22",
      likes: 765,
      comments: 104,
      shares: 203,
      views: 8760,
      platform: "youtube"
    },
    {
      id: 7,
      title: "Product Review",
      type: "article",
      date: "2025-04-18",
      likes: 423,
      comments: 78,
      shares: 91,
      views: 3670,
      platform: "blog"
    }
  ],
  notifications: [
    {
      id: 1,
      message: "Your post 'How-to Tutorial' reached 10,000 total views!",
      date: "2025-05-18",
      read: false,
      type: "milestone"
    },
    {
      id: 2,
      message: "Your engagement is up 23% this week",
      date: "2025-05-17",
      read: false,
      type: "analytics"
    },
    {
      id: 3,
      message: "5 new comments on 'Creator Economy in 2025'",
      date: "2025-05-16",
      read: true,
      type: "engagement"
    },
    {
      id: 4,
      message: "Scheduled post 'Summer Content Ideas' is due tomorrow",
      date: "2025-05-15",
      read: true,
      type: "reminder"
    },
    {
      id: 5,
      message: "Your post 'Behind the Scenes' was shared by @influencer",
      date: "2025-05-14",
      read: true,
      type: "mention"
    }
  ],
  scheduledPosts: [
    {
      id: 1,
      title: "Summer Content Ideas",
      type: "article",
      scheduledDate: "2025-05-20",
      platform: "blog",
      status: "scheduled"
    },
    {
      id: 2,
      title: "New Equipment Review",
      type: "video",
      scheduledDate: "2025-05-25",
      platform: "youtube",
      status: "scheduled"
    },
    {
      id: 3,
      title: "5-Minute Tips Series: Part 1",
      type: "video",
      scheduledDate: "2025-06-01",
      platform: "instagram",
      status: "draft"
    }
  ]
};

// Generate time series data for charts
const generateTimeSeriesData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Create fluctuating but trending upward metrics
    const dayFactor = 1 + (days - i) / days;
    const randomVariation = () => 0.7 + Math.random() * 0.6;
    
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(150 * dayFactor * randomVariation()),
      comments: Math.floor(25 * dayFactor * randomVariation()),
      shares: Math.floor(40 * dayFactor * randomVariation()),
      views: Math.floor(1200 * dayFactor * randomVariation()),
    });
  }
  
  return data;
};

// Generate platform distribution data
const platformData = [
  { name: 'YouTube', value: 35 },
  { name: 'Instagram', value: 25 },
  { name: 'Blog', value: 20 },
  { name: 'Twitter', value: 15 },
  { name: 'Spotify', value: 5 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [contentType, setContentType] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(sampleData.notifications);
  const [posts, setPosts] = useState(sampleData.posts);
  const [scheduledPosts, setScheduledPosts] = useState(sampleData.scheduledPosts);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    type: 'article',
    scheduledDate: '',
    platform: 'blog',
    status: 'draft'
  });
  const [customizableMetrics, setCustomizableMetrics] = useState(['likes', 'comments', 'shares', 'views']);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [availableMetrics] = useState(['likes', 'comments', 'shares', 'views', 'clicks', 'conversions', 'watch time']);
  
  // Update theme based on dark mode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Generate time series data on mount and when filters change
  useEffect(() => {
    let days = 30;
    
    switch (timeRange) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
    }
    
    setTimeSeriesData(generateTimeSeriesData(days));
  }, [timeRange]);
  
  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // Handle creating a new scheduled post
  const handleSchedulePost = () => {
    if (!newPost.title || !newPost.scheduledDate) return;
    
    const post = {
      id: scheduledPosts.length + 1,
      ...newPost
    };
    
    setScheduledPosts([...scheduledPosts, post]);
    setShowScheduleModal(false);
    setNewPost({
      title: '',
      type: 'article',
      scheduledDate: '',
      platform: 'blog',
      status: 'draft'
    });
  };
  
  // Toggle metrics in customizable dashboard
  const toggleMetric = (metric) => {
    if (customizableMetrics.includes(metric)) {
      setCustomizableMetrics(customizableMetrics.filter(m => m !== metric));
    } else {
      setCustomizableMetrics([...customizableMetrics, metric]);
    }
  };

  // Get filtered posts based on content type
  const getFilteredPosts = () => {
    if (contentType === 'all') return posts;
    return posts.filter(post => post.type === contentType);
  };
  
  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Calculate total metrics
  const totals = getFilteredPosts().reduce((acc, post) => {
    acc.likes += post.likes;
    acc.comments += post.comments;
    acc.shares += post.shares;
    acc.views += post.views;
    return acc;
  }, { likes: 0, comments: 0, shares: 0, views: 0 });
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2">ContentPulse</h1>
          <span className={`text-xs px-2 py-1 rounded-md ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>Pro</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className={`hidden md:flex items-center rounded-md px-3 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`ml-2 outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-700"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute right-0 mt-2 w-80 overflow-hidden rounded-md shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} z-50`}
                >
                  <div className="p-3 font-medium border-b border-gray-700">Notifications</div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:bg-opacity-10 hover:bg-gray-700 cursor-pointer flex items-start`}
                        >
                          <div className={`h-2 w-2 mt-1.5 rounded-full flex-shrink-0 ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                          <div className="ml-2">
                            <p className={notification.read ? 'text-gray-400' : ''}>{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">No notifications</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* User */}
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
              <User size={16} className={darkMode ? 'text-white' : 'text-indigo-600'} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-16 md:w-56 h-screen fixed ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="py-4 px-2 md:px-4 flex flex-col h-full">
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center w-full p-2 rounded-md ${activeTab === 'dashboard' ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') : ''}`}
                  >
                    <Home size={20} className="flex-shrink-0" />
                    <span className="ml-3 hidden md:block">Dashboard</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('metrics')}
                    className={`flex items-center w-full p-2 rounded-md ${activeTab === 'metrics' ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') : ''}`}
                  >
                    <ThumbsUp size={20} className="flex-shrink-0" />
                    <span className="ml-3 hidden md:block">Metrics</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`flex items-center w-full p-2 rounded-md ${activeTab === 'schedule' ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') : ''}`}
                  >
                    <Calendar size={20} className="flex-shrink-0" />
                    <span className="ml-3 hidden md:block">Schedule</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center w-full p-2 rounded-md ${activeTab === 'settings' ? (darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800') : ''}`}
                  >
                    <Settings size={20} className="flex-shrink-0" />
                    <span className="ml-3 hidden md:block">Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="hidden md:block pt-4 mt-auto">
              <div className={`p-3 rounded-md text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="font-medium">Pro Plan</p>
                <p className="mt-1 text-gray-500">Renews on Jun 19, 2025</p>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="ml-16 md:ml-56 p-6 flex-1">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-2xl font-bold mb-4 sm:mb-0">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'metrics' && 'Detailed Metrics'}
              {activeTab === 'schedule' && 'Content Schedule'}
              {activeTab === 'settings' && 'Account Settings'}
            </h2>
            
            {(activeTab === 'dashboard' || activeTab === 'metrics') && (
              <div className="flex flex-wrap gap-2">
                <div className={`inline-flex rounded-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <button 
                    onClick={() => setTimeRange('7d')} 
                    className={`px-3 py-1.5 text-sm ${timeRange === '7d' ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-500 text-white') : ''}`}
                  >
                    7 Days
                  </button>
                  <button 
                    onClick={() => setTimeRange('30d')} 
                    className={`px-3 py-1.5 text-sm ${timeRange === '30d' ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-500 text-white') : ''}`}
                  >
                    30 Days
                  </button>
                  <button 
                    onClick={() => setTimeRange('90d')} 
                    className={`px-3 py-1.5 text-sm ${timeRange === '90d' ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-500 text-white') : ''}`}
                  >
                    90 Days
                  </button>
                </div>
                
                <select 
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className={`rounded-md border-0 py-1.5 pl-3 pr-8 text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                >
                  <option value="all">All Content</option>
                  <option value="article">Articles</option>
                  <option value="video">Videos</option>
                  <option value="image">Images</option>
                  <option value="podcast">Podcasts</option>
                  <option value="text">Text</option>
                </select>
              </div>
            )}
          </div>
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-500">Total Likes</h3>
                    <ThumbsUp size={18} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold">{totals.likes.toLocaleString()}</p>
                  <p className="text-sm text-green-500 mt-2">+12.5% vs previous period</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-500">Comments</h3>
                    <MessageSquare size={18} className="text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold">{totals.comments.toLocaleString()}</p>
                  <p className="text-sm text-green-500 mt-2">+8.3% vs previous period</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-500">Shares</h3>
                    <Share2 size={18} className="text-green-500" />
                  </div>
                  <p className="text-2xl font-bold">{totals.shares.toLocaleString()}</p>
                  <p className="text-sm text-green-500 mt-2">+15.7% vs previous period</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-500">Views</h3>
                    <Eye size={18} className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold">{totals.views.toLocaleString()}</p>
                  <p className="text-sm text-green-500 mt-2">+23.1% vs previous period</p>
                </motion.div>
              </div>
              
              {/* Main Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Engagement Over Time</h3>
                  <button 
                    onClick={() => setShowCustomizeModal(true)}
                    className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Customize
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="date" 
                        stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                      <Legend />
                      {customizableMetrics.includes('likes') && (
                        <Line type="monotone" dataKey="likes" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      )}
                      {customizableMetrics.includes('comments') && (
                        <Line type="monotone" dataKey="comments" stroke="#eab308" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      )}
                      {customizableMetrics.includes('shares') && (
                        <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      )}
                      {customizableMetrics.includes('views') && (
                        <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* Secondary Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Engagement by Content Type</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: 'Article', likes: 668, comments: 115, shares: 173 },
                          { type: 'Video', likes: 1277, comments: 168, shares: 331 },
                          { type: 'Image', likes: 873, comments: 92, shares: 134 },
                          { type: 'Podcast', likes: 189, comments: 26, shares: 45 },
                          { type: 'Text', likes: 327, comments: 41, shares: 53 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="type" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                        <Legend />
                        <Bar dataKey="likes" fill="#3b82f6" />
                        <Bar dataKey="comments" fill="#eab308" />
                        <Bar dataKey="shares" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Platform Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
              
              {/* Recent Content Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-4">Recent Content Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Type</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Likes</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Comments</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Shares</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Views</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {getFilteredPosts().slice(0, 5).map((post) => (
                        <tr key={post.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{post.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap capitalize">{post.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.likes}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.comments}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.shares}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Detailed metrics charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Likes Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                        <Area type="monotone" dataKey="likes" stroke="#3b82f6" fill="#3b82f680" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Comments Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                        <Area type="monotone" dataKey="comments" stroke="#eab308" fill="#eab30880" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Shares Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                        <Area type="monotone" dataKey="shares" stroke="#10b981" fill="#10b98180" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className="font-medium mb-4">Views Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="date" 
                          stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: 'white' } : {}} />
                        <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="#8b5cf680" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
              
              {/* All Content Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-4">All Content Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Type</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Platform</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Likes</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Comments</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Shares</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Views</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {getFilteredPosts().map((post) => (
                        <tr key={post.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{post.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap capitalize">{post.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap capitalize">{post.platform}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.likes}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.comments}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.shares}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{post.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Calendar Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Content Calendar</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plan and schedule your upcoming content</p>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className={`px-4 py-2 rounded-md font-medium flex items-center ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                >
                  <Plus size={16} className="mr-1" />
                  Schedule Post
                </button>
              </div>
              
              {/* Scheduled Posts */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-4">Upcoming Posts</h3>
                <div className="space-y-3">
                  {scheduledPosts.length > 0 ? (
                    scheduledPosts.map(post => (
                      <div 
                        key={post.id}
                        className={`p-3 rounded-md border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-between`}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-md ${
                            post.type === 'article' ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}` :
                            post.type === 'video' ? `${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'}` :
                            post.type === 'image' ? `${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}` :
                            `${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`
                          }`}>
                            {post.type === 'article' && <MessageSquare size={16} />}
                            {post.type === 'video' && <Eye size={16} />}
                            {post.type === 'image' && <Camera size={16} />}
                            {post.type === 'podcast' && <MessageSquare size={16} />}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{post.title}</p>
                            <div className="flex items-center text-sm space-x-2">
                              <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{post.platform}</span>
                              <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                <Clock size={14} className="inline mr-1" />
                                {post.scheduledDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className={`p-2 rounded-md transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={`p-2 rounded-md transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <Settings size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar size={24} className="mx-auto mb-2" />
                      <p>No scheduled posts yet</p>
                      <button 
                        onClick={() => setShowScheduleModal(true)}
                        className={`mt-2 px-4 py-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        Schedule your first post
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Content Preview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-4">Content Calendar (Preview)</h3>
                <div className={`border rounded-md ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {/* Calendar header */}
                  <div className={`flex justify-between items-center p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <ChevronDown size={18} />
                    </button>
                    <h4 className="font-medium">May 2025</h4>
                    <div className="flex space-x-1">
                      <button className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <ChevronDown size={18} className="rotate-90" />
                      </button>
                      <button className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <ChevronDown size={18} className="-rotate-90" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Weekdays */}
                  <div className="grid grid-cols-7 text-center border-b border-gray-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div key={i} className={`p-2 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day}</div>
                    ))}
                  </div>
                  
                  {/* Calendar grid - just showing a sample week */}
                  <div className="grid grid-cols-7 text-center border-b border-gray-700">
                    {/* Week 1 */}
                    <div className={`p-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>28</div>
                    <div className={`p-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>29</div>
                    <div className={`p-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>30</div>
                    <div className="p-3">1</div>
                    <div className="p-3">2</div>
                    <div className="p-3">3</div>
                    <div className="p-3">4</div>
                  </div>
                  
                  {/* Week 2 */}
                  <div className="grid grid-cols-7 text-center border-b border-gray-700">
                    <div className="p-3">5</div>
                    <div className="p-3">6</div>
                    <div className="p-3">7</div>
                    <div className="p-3">8</div>
                    <div className="p-3">9</div>
                    <div className="p-3">10</div>
                    <div className="p-3">11</div>
                  </div>
                  
                  {/* Week 3 */}
                  <div className="grid grid-cols-7 text-center border-b border-gray-700">
                    <div className="p-3">12</div>
                    <div className="p-3">13</div>
                    <div className="p-3">14</div>
                    <div className="p-3">15</div>
                    <div className="p-3">16</div>
                    <div className="p-3">17</div>
                    <div className="p-3">18</div>
                  </div>
                  
                  {/* Current Week */}
                  <div className="grid grid-cols-7 text-center">
                    <div className="p-3">19</div>
                    <div className={`p-3 relative`}>
                      20
                      <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}></div>
                    </div>
                    <div className="p-3">21</div>
                    <div className="p-3">22</div>
                    <div className="p-3">23</div>
                    <div className="p-3">24</div>
                    <div className="p-3">25</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-6">Account Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="Content Creator" 
                      className={`px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="creator@example.com" 
                      className={`px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm mb-3 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Theme Preference</label>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => setDarkMode(false)} 
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition ${!darkMode ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`}
                      >
                        <Sun size={16} />
                        <span>Light</span>
                      </button>
                      <button 
                        onClick={() => setDarkMode(true)} 
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition ${darkMode ? 'border-indigo-500 bg-indigo-900 bg-opacity-20 text-indigo-400' : 'border-gray-300'}`}
                      >
                        <Moon size={16} />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`text-sm mb-3 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notification Preferences</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked id="notif1" className="rounded" />
                        <label htmlFor="notif1" className="ml-2">Content performance alerts</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked id="notif2" className="rounded" />
                        <label htmlFor="notif2" className="ml-2">Scheduled post reminders</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked id="notif3" className="rounded" />
                        <label htmlFor="notif3" className="ml-2">Weekly performance digests</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="notif4" className="rounded" />
                        <label htmlFor="notif4" className="ml-2">Platform updates and tips</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className={`px-4 py-2 rounded-md font-medium ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="font-medium mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">Y</div>
                      <div className="ml-3">
                        <p className="font-medium">YouTube</p>
                        <p className="text-xs text-gray-500">Connected as @creator</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      Disconnect
                    </button>
                  </div>
                  
                  <div className={`p-3 rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">I</div>
                      <div className="ml-3">
                        <p className="font-medium">Instagram</p>
                        <p className="text-xs text-gray-500">Connected as @creator</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      Disconnect
                    </button>
                  </div>
                  
                  <div className={`p-3 rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">T</div>
                      <div className="ml-3">
                        <p className="font-medium">Twitter</p>
                        <p className="text-xs text-gray-500">Connected as @creator</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      Disconnect
                    </button>
                  </div>
                  
                  <button className={`flex items-center justify-center w-full p-3 mt-2 rounded-md border border-dashed ${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`}>
                    <Plus size={16} className="mr-2" />
                    Connect New Account
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Schedule Post Modal */}
          <AnimatePresence>
            {showScheduleModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <button 
                    onClick={() => setShowScheduleModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                  
                  <h3 className="text-lg font-medium mb-4">Schedule New Post</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Post Title</label>
                      <input 
                        type="text" 
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Enter post title"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Content Type</label>
                      <select 
                        value={newPost.type}
                        onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                        className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="podcast">Podcast</option>
                        <option value="text">Text</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Platform</label>
                      <select 
                        value={newPost.platform}
                        onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                        className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="blog">Blog</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                        <option value="spotify">Spotify</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Schedule Date</label>
                      <input 
                        type="date" 
                        value={newPost.scheduledDate}
                        onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                        className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</label>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setNewPost({...newPost, status: 'draft'})}
                          className={`flex-1 py-2 rounded-md border ${
                            newPost.status === 'draft'
                              ? (darkMode ? 'bg-indigo-900 border-indigo-700 text-indigo-200' : 'bg-indigo-100 border-indigo-300 text-indigo-800')
                              : (darkMode ? 'border-gray-600' : 'border-gray-300')
                          }`}
                        >
                          Draft
                        </button>
                        <button 
                          onClick={() => setNewPost({...newPost, status: 'scheduled'})}
                          className={`flex-1 py-2 rounded-md border ${
                            newPost.status === 'scheduled'
                              ? (darkMode ? 'bg-indigo-900 border-indigo-700 text-indigo-200' : 'bg-indigo-100 border-indigo-300 text-indigo-800')
                              : (darkMode ? 'border-gray-600' : 'border-gray-300')
                          }`}
                        >
                          Scheduled
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex space-x-2">
                      <button 
                        onClick={() => setShowScheduleModal(false)}
                        className={`flex-1 py-2 rounded-md border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSchedulePost}
                        className={`flex-1 py-2 rounded-md ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Customize Metrics Modal */}
          <AnimatePresence>
            {showCustomizeModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <button 
                    onClick={() => setShowCustomizeModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                  
                  <h3 className="text-lg font-medium mb-4">Customize Metrics</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select the metrics you want to display on your dashboard charts.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {availableMetrics.map(metric => (
                      <div 
                        key={metric}
                        onClick={() => toggleMetric(metric)}
                        className="flex items-center cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                          customizableMetrics.includes(metric)
                            ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500')
                            : (darkMode ? 'border border-gray-600' : 'border border-gray-300')
                        }`}>
                          {customizableMetrics.includes(metric) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <span className="capitalize">{metric}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowCustomizeModal(false)}
                      className={`px-4 py-2 rounded-md ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                    >
                      Apply Changes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}