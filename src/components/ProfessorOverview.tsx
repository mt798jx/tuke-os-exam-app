import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, Eye, Download, LogOut, Users, TrendingUp, Activity, X } from 'lucide-react';

interface ProfessorOverviewProps {
  onLogout: () => void;
  userName: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
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
    email: 'alex.chen@student.polito.it',
    studentId: 's287654',
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
    email: 'maria.rodriguez@student.polito.it',
    studentId: 's291234',
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
    email: 'james.wilson@student.polito.it',
    studentId: 's289876',
    ipcStatus: 'completed',
    copymasterStatus: 'in-progress',
    classicStatus: 'not-started',
    ipcScore: 65,
    completionRate: 35,
    flagged: true,
    flagReason: 'Inconsistent understanding of shared memory implementation. Unable to explain synchronization logic.',
    lastActivity: new Date(Date.now() - 1800000)
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@student.polito.it',
    studentId: 's290123',
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
    email: 'david.kim@student.polito.it',
    studentId: 's288765',
    ipcStatus: 'completed',
    copymasterStatus: 'not-started',
    classicStatus: 'not-started',
    ipcScore: 72,
    completionRate: 33,
    flagged: true,
    flagReason: 'Weak explanation of error handling. Possible code understanding issues.',
    lastActivity: new Date(Date.now() - 3600000)
  },
  {
    id: '6',
    name: 'Emma Schmidt',
    email: 'emma.schmidt@student.polito.it',
    studentId: 's292345',
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
    email: 'lucas.silva@student.polito.it',
    studentId: 's289123',
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
    email: 'yuki.tanaka@student.polito.it',
    studentId: 's290876',
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
      className: 'bg-green-50 text-green-700 border-green-200',
      text: score ? `${score}%` : 'Done'
    },
    'in-progress': {
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      text: 'In Progress'
    },
    'analyzing': {
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'Analyzing'
    },
    'not-started': {
      className: 'bg-gray-50 text-gray-600 border-gray-200',
      text: 'Not Started'
    }
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-lg border text-xs font-medium ${config.className}`}>
      {config.text}
    </div>
  );
};

export default function ProfessorOverview({ onLogout, userName }: ProfessorOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'in-progress' | 'completed'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
    
    return matchesSearch && matchesFilter;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">OS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Operating Systems Exam Platform</h1>
              <p className="text-xs text-gray-500">Professor Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Professor</p>
                <p className="font-semibold text-gray-900">{userName}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-indigo-700">Total Students</span>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-green-700">Completed All</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              <p className="text-xs text-green-600 mt-1">
                {Math.round((stats.completed / stats.total) * 100)}% of class
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-700">In Progress</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.inProgress}</p>
              <p className="text-xs text-blue-600 mt-1">Active students</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-amber-700">Flagged</span>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.flagged}</p>
              <p className="text-xs text-amber-600 mt-1">Needs review</p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-violet-700">Avg Progress</span>
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-violet-900">{stats.averageCompletion}%</p>
              <p className="text-xs text-violet-600 mt-1">Overall completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'in-progress', 'completed', 'flagged'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter as any)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    filterStatus === filter
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    IPC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CopyMaster
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Classic
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.flagged && (
                          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        )}
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-700">{student.studentId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.ipcStatus} score={student.ipcScore} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.copymasterStatus} score={student.copymasterScore} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.classicStatus} score={student.classicScore} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all"
                            style={{ width: `${student.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10">
                          {student.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(student.lastActivity)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                  <p className="text-indigo-100">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Flag Warning */}
              {selectedStudent.flagged && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-amber-900 text-lg mb-2">⚠️ Flagged for Review</div>
                    <div className="text-amber-800">{selectedStudent.flagReason}</div>
                  </div>
                </div>
              )}

              {/* Overall Grade */}
              {selectedStudent.overallGrade && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">{selectedStudent.overallGrade}</div>
                  <div className="text-sm text-green-700 font-medium">Overall Grade</div>
                </div>
              )}

              {/* Exam Statuses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Examination Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-900">IPC Programming Assignment</span>
                      {selectedStudent.ipcScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.ipcScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.ipcStatus} score={selectedStudent.ipcScore} />
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-900">CopyMaster Assignment</span>
                      {selectedStudent.copymasterScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.copymasterScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.copymasterStatus} score={selectedStudent.copymasterScore} />
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-900">Classic Oral Exam</span>
                      {selectedStudent.classicScore && (
                        <p className="text-sm text-gray-600 mt-1">Score: {selectedStudent.classicScore}%</p>
                      )}
                    </div>
                    <StatusBadge status={selectedStudent.classicStatus} score={selectedStudent.classicScore} />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                  <span className="text-2xl font-bold text-indigo-600">{selectedStudent.completionRate}%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 h-3 rounded-full transition-all"
                    style={{ width: `${selectedStudent.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg">
                  <Eye className="w-5 h-5" />
                  View Full Transcript
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                  <Download className="w-5 h-5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}