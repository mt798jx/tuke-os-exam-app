import React, { useState } from 'react';
import { Github, LogOut, CheckCircle2, Clock, AlertCircle, Code2, BookOpen, Loader2, Award, FolderOpen, Menu, X as CloseIcon, GitBranch, Settings as SettingsIcon } from 'lucide-react';
import { ExamMode } from '../App';
import GradesView from './GradesView';
import ProjectBrowser from './ProjectBrowser';
import GitLabSettings from './GitLabSettings';

interface StudentDashboardProps {
  onStartExam: (examType: ExamMode) => void;
  onLogout: () => void;
  userName: string;
}

type ExamStatus = 'ready' | 'analyzing' | 'in-progress' | 'completed';
type ActiveView = 'exams' | 'grades' | 'projects' | 'settings';

interface ExamCard {
  id: ExamMode;
  title: string;
  shortTitle: string;
  description: string;
  status: ExamStatus;
  requiresProject?: boolean;
  projectConfigured?: boolean;
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
    requiresProject: true,
    projectConfigured: false,
    estimatedTime: '30-45 min',
    icon: Code2
  },
  {
    id: 'copymaster',
    title: 'CopyMaster Programming Assignment',
    shortTitle: 'CopyMaster',
    description: 'File system utility with advanced copy operations. AI will examine your implementation of system calls, file descriptors, error handling, and edge cases.',
    status: 'ready',
    requiresProject: true,
    projectConfigured: false,
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
  const configs: Record<ExamStatus, { icon: React.ElementType; text: string; className: string; animate?: boolean }> = {
    'ready': {
      icon: CheckCircle2,
      text: 'Ready to Start',
      className: 'bg-green-50 text-green-700 border-green-300'
    },
    'analyzing': {
      icon: Loader2,
      text: 'AI Analyzing...',
      className: 'bg-amber-50 text-amber-700 border-amber-300',
      animate: true
    },
    'in-progress': {
      icon: Clock,
      text: score || 'In Progress',
      className: 'bg-orange-50 text-orange-700 border-orange-300'
    },
    'completed': {
      icon: CheckCircle2,
      text: score || 'Completed',
      className: 'bg-gray-50 text-gray-700 border-gray-300'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm font-bold ${config.className}`}>
      <Icon className={`w-4 h-4 ${config.animate ? 'animate-spin' : ''}`} />
      {config.text}
    </div>
  );
};

export default function StudentDashboard({ onStartExam, onLogout, userName }: StudentDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('exams');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <p className="text-xs text-black/70">TU Košice</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveView('exams')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'exams'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Exams
              </button>
              <button
                onClick={() => setActiveView('grades')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'grades'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Grades
              </button>
              <button
                onClick={() => setActiveView('projects')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'projects'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  activeView === 'settings'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Settings
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-black/10 rounded-lg">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-[#E5A712] font-bold text-sm">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs text-black/70">Student</p>
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
                  setActiveView('exams');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'exams'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                📝 Exams
              </button>
              <button
                onClick={() => {
                  setActiveView('grades');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'grades'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                🏆 Grades
              </button>
              <button
                onClick={() => {
                  setActiveView('projects');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'projects'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                📁 Projects
              </button>
              <button
                onClick={() => {
                  setActiveView('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold text-left transition-all ${
                  activeView === 'settings'
                    ? 'bg-black text-[#E5A712]'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                ⚙️ Settings
              </button>
              <div className="pt-2 border-t-2 border-black/10 mt-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#E5A712] font-bold">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-black/70">Student</p>
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
        {activeView === 'exams' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Welcome back, {userName.split(' ')[0]}! 👋
              </h2>
              <p className="text-base sm:text-lg text-gray-600">Select an examination to begin or continue your assessment.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
              <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Total Exams</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#E5A712]/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5A712]" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">3</p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Completed</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">In Progress</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">1</p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-600">Avg. Score</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#E5A712]/10 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5A712]" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">-</p>
              </div>
            </div>

            {/* Exam Cards */}
            <div className="space-y-4 sm:space-y-6">
              {examCards.map((exam) => {
                const Icon = exam.icon;
                return (
                  <div
                    key={exam.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-4 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{exam.description}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={exam.status} score={exam.score} />
                        </div>
                      </div>

                      {/* Project Configuration Alert */}
                      {exam.requiresProject && !exam.projectConfigured && (
                        <div className="mb-4 sm:mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-amber-900 mb-1">
                                GitLab projekt nie je nakonfigurovaný
                              </p>
                              <p className="text-sm text-amber-800 mb-3">
                                Pre spustenie tejto skúšky musíte najprv naklonovat váš GitLab repozitár v sekcii Projects.
                              </p>
                              <button
                                onClick={() => setActiveView('projects')}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-bold text-sm"
                              >
                                <GitBranch className="w-4 h-4" />
                                Prejsť na Projects
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Project Info for configured projects */}
                      {exam.requiresProject && exam.projectConfigured && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl mb-4 sm:mb-6 border-2 border-green-200">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-green-600 mb-0.5">GitLab Projekt</p>
                            <p className="text-sm font-bold text-green-900">Nakonfigurovaný a pripravený</p>
                          </div>
                          <button
                            onClick={() => setActiveView('projects')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white text-green-700 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-all font-semibold text-xs"
                          >
                            <FolderOpen className="w-3 h-3" />
                            Zobraziť
                          </button>
                        </div>
                      )}

                      {/* Duration for non-project exams */}
                      {!exam.requiresProject && (
                        <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-4 sm:mb-6 border-2 border-gray-200">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                            <p className="text-sm font-bold text-gray-900">{exam.estimatedTime}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        {/* Show button only if project is configured OR exam doesn't require project */}
                        {(!exam.requiresProject || exam.projectConfigured) && (
                          <button
                            onClick={() => onStartExam(exam.id)}
                            disabled={exam.status === 'analyzing'}
                            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:from-[#D4951A] hover:to-[#C4851A] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                          >
                            {exam.status === 'in-progress' ? 'Continue Exam' : 
                             exam.status === 'analyzing' ? 'Please Wait...' : 
                             exam.status === 'completed' ? 'Review Exam' : 'Start Exam'}
                          </button>
                        )}
                        {exam.status === 'analyzing' && (
                          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                            AI is analyzing your code repository...
                          </p>
                        )}
                        {exam.status === 'completed' && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-green-50 rounded-lg border-2 border-green-200">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-bold text-green-700">Score: {exam.score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help Section */}
            <div className="mt-8 sm:mt-12 bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E5A712] rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">How It Works</h3>
                  <div className="space-y-2 text-sm sm:text-base text-gray-700">
                    <p><strong>Programming Assignments:</strong> First configure your GitLab repository in the Projects section. The AI examiner will then analyze your code and prepare personalized questions about your implementation.</p>
                    <p><strong>Classic Exam:</strong> Answer 5 theory questions about operating systems concepts. The AI will evaluate your answers and provide immediate feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'grades' && <GradesView />}
        <div style={{ display: activeView === 'projects' ? 'block' : 'none' }}>
          <ProjectBrowser onNavigate={(v) => setActiveView(v)} />
        </div>
        {activeView === 'settings' && <GitLabSettings />}
      </main>
    </div>
  );
}