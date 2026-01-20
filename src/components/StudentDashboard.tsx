import React from 'react';
import { Github, LogOut, CheckCircle2, Clock, AlertCircle, Code2, BookOpen, Loader2 } from 'lucide-react';
import { ExamMode } from '../App';

interface StudentDashboardProps {
  onStartExam: (examType: ExamMode) => void;
  onLogout: () => void;
  userName: string;
}

type ExamStatus = 'ready' | 'analyzing' | 'in-progress' | 'completed';

interface ExamCard {
  id: ExamMode;
  title: string;
  shortTitle: string;
  description: string;
  status: ExamStatus;
  repoName?: string;
  repoUrl?: string;
  score?: string;
  completedDate?: string;
  estimatedTime: string;
  icon: React.ElementType;
}

const examCards: ExamCard[] = [
  {
    id: 'ipc',
    title: 'IPC Programming Assignment',
    shortTitle: 'IPC Assignment',
    description: 'Inter-Process Communication system implementation. The AI examiner will analyze your repository and ask detailed questions about shared memory, message queues, and synchronization patterns.',
    status: 'ready',
    repoName: 'student-ipc-assignment',
    repoUrl: 'https://github.com/alexchen/student-ipc-assignment',
    estimatedTime: '30-45 min',
    icon: Code2
  },
  {
    id: 'copymaster',
    title: 'CopyMaster Programming Assignment',
    shortTitle: 'CopyMaster',
    description: 'File system utility with advanced copy operations. AI will examine your implementation of system calls, file descriptors, error handling, and edge cases.',
    status: 'analyzing',
    repoName: 'student-copymaster',
    repoUrl: 'https://github.com/alexchen/student-copymaster',
    estimatedTime: '30-45 min',
    icon: Code2
  },
  {
    id: 'classic',
    title: 'Classic Oral Examination',
    shortTitle: 'Theory Exam',
    description: 'Comprehensive theory examination covering operating systems concepts. You will answer 5 questions about core OS principles and your programming assignments.',
    status: 'in-progress',
    estimatedTime: '45-60 min',
    score: '3/5 completed',
    icon: BookOpen
  }
];

const StatusBadge = ({ status, score }: { status: ExamStatus; score?: string }) => {
  const configs = {
    'ready': {
      icon: CheckCircle2,
      text: 'Ready to Start',
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    'analyzing': {
      icon: Loader2,
      text: 'AI Analyzing Code...',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      animate: true
    },
    'in-progress': {
      icon: Clock,
      text: score || 'In Progress',
      className: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    'completed': {
      icon: CheckCircle2,
      text: score || 'Completed',
      className: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${config.className}`}>
      <Icon className={`w-4 h-4 ${config.animate ? 'animate-spin' : ''}`} />
      {config.text}
    </div>
  );
};

export default function StudentDashboard({ onStartExam, onLogout, userName }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">OS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Operating Systems Exam Platform</h1>
              <p className="text-xs text-gray-500">Technical University of Košice</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Student</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome back, {userName.split(' ')[0]}! 👋</h2>
          <p className="text-lg text-gray-600">Select an examination to begin or continue your assessment.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Exams</span>
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Completed</span>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">In Progress</span>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">1</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg. Score</span>
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-violet-600">★</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
        </div>

        {/* Exam Cards */}
        <div className="space-y-6">
          {examCards.map((exam) => {
            const Icon = exam.icon;
            return (
              <div
                key={exam.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                        <p className="text-gray-600 leading-relaxed max-w-3xl">{exam.description}</p>
                      </div>
                    </div>
                    <StatusBadge status={exam.status} score={exam.score} />
                  </div>

                  {exam.repoName && (
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl flex-1">
                        <Github className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Repository</p>
                          <p className="text-sm font-mono font-medium text-gray-900">{exam.repoName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{exam.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!exam.repoName && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-6 inline-flex">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                        <p className="text-sm font-semibold text-gray-900">{exam.estimatedTime}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onStartExam(exam.id)}
                      disabled={exam.status === 'analyzing'}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {exam.status === 'in-progress' ? 'Continue Exam' : 
                       exam.status === 'analyzing' ? 'Please Wait...' : 
                       exam.status === 'completed' ? 'Review Exam' : 'Start Exam'}
                    </button>
                    {exam.status === 'analyzing' && (
                      <p className="text-sm text-gray-500">
                        AI is analyzing your code repository. This may take 1-2 minutes...
                      </p>
                    )}
                    {exam.status === 'completed' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Score: {exam.score}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How It Works</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Programming Assignments:</strong> AI will clone your repository, analyze your code, and prepare personalized questions about your implementation. You'll discuss your code in detail.</p>
                <p><strong>Classic Exam:</strong> Answer 5 theory questions about operating systems concepts. The AI will evaluate your answers and provide immediate feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}