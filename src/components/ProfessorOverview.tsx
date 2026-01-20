import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, Clock, Eye, Download, LogOut, Users, TrendingUp, Activity, Settings, Menu, X as CloseIcon } from 'lucide-react';
import ExamManagement from './ExamManagement';
import GroupManagement from './GroupManagement';

interface ProfessorOverviewProps {
  onLogout: () => void;
  userName: string;
}

type ActiveView = 'overview' | 'exam-management' | 'group-management';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  labGroup: string;
  ipcStatus: 'completed' | 'in-progress' | 'not-started' | 'analyzing';
  copymasterStatus: 'completed' | 'in-progress' | 'not-started' | 'analyzing';
  classicStatus: 'completed' | 'in-progress' | 'not-started';
  ipcScore?: number;
  copymasterScore?: number;
  classicScore?: number;
  overallGrade?: string;
  flagged: boolean;
  flagReason?: string;
  lastActivity: Date;
  completionRate: number;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@tuke.sk',
    studentId: 's287654',
    labGroup: 'Lab Group A',
    ipcStatus: 'in-progress',
    copymasterStatus: 'analyzing',
    classicStatus: 'in-progress',
    classicScore: 78,
    completionRate: 40,
    flagged: false,
    lastActivity: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@tuke.sk',
    studentId: 's291234',
    labGroup: 'Lab Group A',
    ipcStatus: 'completed',
    copymasterStatus: 'completed',
    classicStatus: 'completed',
    ipcScore: 88,
    copymasterScore: 85,
    classicScore: 92,
    overallGrade: 'A',
    completionRate: 100,
    flagged: false,
    lastActivity: new Date(Date.now() - 86400000)
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james.wilson@tuke.sk',
    studentId: 's289876',
    labGroup: 'Lab Group B',
    ipcStatus: 'completed',
    copymasterStatus: 'in-progress',
    classicStatus: 'not-started',
    ipcScore: 65,
    completionRate: 35,
    flagged: true,
    flagReason: 'Inconsistent understanding of shared memory implementation.',
    lastActivity: new Date(Date.now() - 1800000)
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@tuke.sk',
    studentId: 's290123',
    labGroup: 'Lab Group B',
    ipcStatus: 'completed',
    copymasterStatus: 'completed',
    classicStatus: 'in-progress',
    ipcScore: 94,
    copymasterScore: 89,
    classicScore: 86,
    completionRate: 75,
    flagged: false,
    lastActivity: new Date(Date.now() - 600000)
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@tuke.sk',
    studentId: 's288765',
    labGroup: 'Lab Group C',
    ipcStatus: 'completed',
    copymasterStatus: 'not-started',
    classicStatus: 'not-started',
    ipcScore: 72,
    completionRate: 33,
    flagged: true,
    flagReason: 'Weak explanation of error handling.',
    lastActivity: new Date(Date.now() - 3600000)
  },
  {
    id: '6',
    name: 'Emma Schmidt',
    email: 'emma.schmidt@tuke.sk',
    studentId: 's292345',
    labGroup: 'Lab Group C',
    ipcStatus: 'analyzing',
    copymasterStatus: 'not-started',
    classicStatus: 'not-started',
    completionRate: 5,
    flagged: false,
    lastActivity: new Date(Date.now() - 7200000)
  },
  {
    id: '7',
    name: 'Lucas Silva',
    email: 'lucas.silva@tuke.sk',
    studentId: 's289123',
    labGroup: 'Lab Group A',
    ipcStatus: 'completed',
    copymasterStatus: 'completed',
    classicStatus: 'completed',
    ipcScore: 91,
    copymasterScore: 87,
    classicScore: 89,
    overallGrade: 'A-',
    completionRate: 100,
    flagged: false,
    lastActivity: new Date(Date.now() - 172800000)
  },
  {
    id: '8',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@tuke.sk',
    studentId: 's290876',
    labGroup: 'Lab Group C',
    ipcStatus: 'completed',
    copymasterStatus: 'in-progress',
    classicStatus: 'not-started',
    ipcScore: 82,
    completionRate: 45,
    flagged: false,
    lastActivity: new Date(Date.now() - 900000)
  }
];

const StatusBadge = ({ status, score }: { status: 'completed' | 'in-progress' | 'not-started' | 'analyzing'; score?: number }) => {
  const configs = {
    'completed': {
      className: 'bg-green-50 text-green-700 border-green-300',
      text: score ? `${score}%` : 'Done'
    },
    'in-progress': {
      className: 'bg-orange-50 text-orange-700 border-orange-300',
      text: 'In Progress'
    },
    'analyzing': {
      className: 'bg-amber-50 text-amber-700 border-amber-300',
      text: 'Analyzing'
    },
    'not-started': {
      className: 'bg-gray-50 text-gray-600 border-gray-300',
      text: 'Not Started'
    }
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-lg border-2 text-xs font-bold ${config.className}`}>
      {config.text}
    </div>
  );
};

export default function ProfessorOverview({ onLogout, userName }: ProfessorOverviewProps) {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'in-progress' | 'completed'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'flagged' && student.flagged) ||
                         (filterStatus === 'in-progress' && (
                           student.ipcStatus === 'in-progress' ||
                           student.copymasterStatus === 'in-progress' ||
                           student.classicStatus === 'in-progress'
                         )) ||
                         (filterStatus === 'completed' && 
                           student.ipcStatus === 'completed' &&
                           student.copymasterStatus === 'completed' &&
                           student.classicStatus === 'completed');
    
    const matchesGroup = !selectedGroup || student.labGroup === selectedGroup;
    
    return matchesSearch && matchesFilter && matchesGroup;
  });

  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const stats = {
    total: mockStudents.length,
    completed: mockStudents.filter(s => 
      s.ipcStatus === 'completed' && 
      s.copymasterStatus === 'completed' && 
      s.classicStatus === 'completed'
    ).length,
    inProgress: mockStudents.filter(s => 
      s.ipcStatus === 'in-progress' || 
      s.copymasterStatus === 'in-progress' || 
      s.classicStatus === 'in-progress'
    ).length,
    flagged: mockStudents.filter(s => s.flagged).length,
    averageCompletion: Math.round(
      mockStudents.reduce((sum, s) => sum + s.completionRate, 0) / mockStudents.length
    )
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#E5A712] font-bold text-lg">OS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-black">Operating Systems Platform</h1>
                <p className="text-xs text-black/70">Professor Dashboard • TU Košice</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'overview'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveView('exam-management')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'exam-management'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Exams
              </button>
              <button
                onClick={() => setActiveView('group-management')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'group-management'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Groups
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-black/10 rounded-lg">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-[#E5A712] font-bold text-sm">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs text-black/70">Professor</p>
                  <p className="font-bold text-black text-sm">{userName}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-black text-[#E5A712] rounded-lg hover:bg-black/90 transition-all font-bold text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-black hover:bg-black/10 rounded-lg"
              >
                {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 border-t-2 border-black/10 pt-4">
              <button
                onClick={() => {
                  setActiveView('overview');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'overview'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                👥 Students Overview
              </button>
              <button
                onClick={() => {
                  setActiveView('exam-management');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'exam-management'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                ⚙️ Exam Management
              </button>
              <button
                onClick={() => {
                  setActiveView('group-management');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'group-management'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                📚 Lab Groups
              </button>
              <div className="pt-2 border-t-2 border-black/10 mt-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#E5A712] font-bold">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-black/70">Professor</p>
                    <p className="font-bold text-black">{userName}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-black text-[#E5A712] rounded-lg hover:bg-black/90 transition-all font-bold">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {activeView === 'overview' && (
          <>
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Student Overview 👥
              </h2>
              <p className="text-base sm:text-lg text-gray-600">Monitor student progress and exam results</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl p-4 sm:p-6 text-black shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold">Total</span>
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Completed</span>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Active</span>
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Flagged</span>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.flagged}</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Avg Progress</span>
                  <TrendingUp className="w-5 h-5 text-[#E5A712]" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.averageCompletion}%</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6 shadow-sm">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  {['all', 'in-progress', 'completed', 'flagged'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterStatus(filter as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        filterStatus === filter
                          ? 'bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Group Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-gray-700 self-center mr-2">Group:</span>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      !selectedGroup
                        ? 'bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {['Lab Group A', 'Lab Group B', 'Lab Group C'].map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        selectedGroup === group
                          ? 'bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {group.replace('Lab Group ', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Cards */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Student Info */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {student.flagged && (
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                      )}
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-lg flex items-center justify-center text-black font-bold flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{student.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{student.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="font-mono">{student.studentId}</span>
                          <span>•</span>
                          <span>{student.labGroup}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(student.lastActivity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exam Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">IPC</span>
                      <StatusBadge status={student.ipcStatus} score={student.ipcScore} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">CopyMaster</span>
                      <StatusBadge status={student.copymasterStatus} score={student.copymasterScore} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">Classic</span>
                      <StatusBadge status={student.classicStatus} score={student.classicScore} />
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t-2 border-gray-100">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] h-2 rounded-full transition-all"
                          style={{ width: `${student.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-12">
                        {student.completionRate}%
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="px-4 py-2 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>

                  {/* Flag Warning */}
                  {student.flagged && (
                    <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        <strong>⚠ Flagged:</strong> {student.flagReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No students found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        {activeView === 'exam-management' && (
          <ExamManagement onClose={() => setActiveView('overview')} />
        )}

        {activeView === 'group-management' && (
          <GroupManagement onClose={() => setActiveView('overview')} />
        )}
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#E5A712] to-[#D4951A] px-6 sm:px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/10 rounded-xl flex items-center justify-center text-black font-bold text-xl">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-black">{selectedStudent.name}</h2>
                  <p className="text-black/70 text-sm">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-black hover:bg-black/10 rounded-lg p-2 transition-all"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Flag Warning */}
              {selectedStudent.flagged && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 sm:p-6 flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-amber-900 text-lg mb-2">⚠️ Flagged for Review</div>
                    <div className="text-amber-800">{selectedStudent.flagReason}</div>
                  </div>
                </div>
              )}

              {/* Overall Grade */}
              {selectedStudent.overallGrade && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">{selectedStudent.overallGrade}</div>
                  <div className="text-sm text-green-700 font-semibold">Overall Grade</div>
                </div>
              )}

              {/* Exam Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Examination Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900">IPC Assignment</span>
                      {selectedStudent.ipcScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.ipcScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.ipcStatus} score={selectedStudent.ipcScore} />
                  </div>
                  <div className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900">CopyMaster</span>
                      {selectedStudent.copymasterScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.copymasterScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.copymasterStatus} score={selectedStudent.copymasterScore} />
                  </div>
                  <div className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div>
                      <span className="font-bold text-gray-900">Classic Exam</span>
                      {selectedStudent.classicScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.classicScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.classicStatus} score={selectedStudent.classicScore} />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Overall Progress</h3>
                  <span className="text-2xl font-bold text-[#E5A712]">{selectedStudent.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] h-3 rounded-full transition-all"
                    style={{ width: `${selectedStudent.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all">
                  <Eye className="w-5 h-5" />
                  View Transcript
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
