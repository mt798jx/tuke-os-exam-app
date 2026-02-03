import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import StudentDashboard from './components/StudentDashboard';
import ProgrammingExam from './components/ProgrammingExam';
import ClassicExam from './components/ClassicExam';
import ProfessorOverview from './components/ProfessorOverview';

export type ExamMode = 'ipc' | 'copymaster' | 'classic' | null;
export type UserRole = 'student' | 'professor' | null;

export interface ExamState {
  phase: 'analyzing' | 'ready' | 'in-progress' | 'completed';
  questions?: Question[];
  currentQuestionIndex?: number;
  answers?: Answer[];
}

export interface Question {
  id: string;
  text: string;
  relatedFile?: string;
  relatedFunction?: string;
  codeSnippet?: string;
}

export interface Answer {
  questionId: string;
  text: string;
  timestamp: Date;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'exam' | 'professor'>('welcome');
  const [activeExam, setActiveExam] = useState<ExamMode>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');

  const handleLogin = (role: 'student' | 'professor', name: string) => {
    setUserRole(role);
    setUserName(name);
    try {
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-name', name);
    } catch (e) {}
    setCurrentView(role === 'student' ? 'dashboard' : 'professor');
  };

  // persist role/name so reloads keep the user logged in
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = (localStorage.getItem('user-role') as UserRole) || null;
    const name = localStorage.getItem('user-name') || '';
    if (token && role) {
      setUserRole(role);
      setUserName(name);
      setCurrentView(role === 'student' ? 'dashboard' : 'professor');
    }
  }, []);

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    setActiveExam(null);
    setCurrentView('welcome');
    try {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-name');
    } catch (e) {}
  };

  const handleStartExam = (examType: ExamMode) => {
    setActiveExam(examType);
    setCurrentView('exam');
  };

  const handleExitExam = () => {
    setActiveExam(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'welcome' && (
        <WelcomePage onLogin={handleLogin} />
      )}

      {currentView === 'dashboard' && userRole === 'student' && (
        <StudentDashboard 
          onStartExam={handleStartExam} 
          onLogout={handleLogout}
          userName={userName}
        />
      )}

      {currentView === 'exam' && (activeExam === 'ipc' || activeExam === 'copymaster') && (
        <ProgrammingExam examType={activeExam} onExit={handleExitExam} />
      )}

      {currentView === 'exam' && activeExam === 'classic' && (
        <ClassicExam onExit={handleExitExam} />
      )}

      {currentView === 'professor' && userRole === 'professor' && (
        <ProfessorOverview onLogout={handleLogout} userName={userName} />
      )}
    </div>
  );
}
