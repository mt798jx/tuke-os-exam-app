import React from 'react';
import { Award, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ExamGrade {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  grade?: string;
  completedDate?: string;
}

const examGrades: ExamGrade[] = [
  {
    id: '1',
    name: 'IPC Programming Assignment',
    status: 'completed',
    score: 88,
    grade: 'A-',
    completedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'CopyMaster Programming Assignment',
    status: 'in-progress',
    score: 65,
    completedDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Classic Oral Exam',
    status: 'completed',
    score: 92,
    grade: 'A',
    completedDate: '2024-01-22'
  }
];

export default function GradesView() {
  const completedExams = examGrades.filter(e => e.status === 'completed');
  const averageScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((sum, e) => sum + (e.score || 0), 0) / completedExams.length)
    : 0;

  const getGradeColor = (score?: number) => {
    if (!score) return 'text-gray-600';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-[#E5A712]';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      'completed': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', label: 'Completed', icon: CheckCircle2 },
      'in-progress': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', label: 'In Progress', icon: Clock },
      'not-started': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300', label: 'Not Started', icon: AlertCircle }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${config.bg} ${config.text} ${config.border} font-bold text-xs sm:text-sm`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Grades 🏆</h2>
        <p className="text-base sm:text-lg text-gray-600">Track your exam performance</p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl p-6 sm:p-8 text-black shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm sm:text-base font-bold">Average Score</span>
          <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-black" />
          </div>
        </div>
        <p className="text-5xl sm:text-6xl font-bold mb-2">{averageScore}%</p>
        <p className="text-sm opacity-80">{completedExams.length} of {examGrades.length} exams completed</p>
      </div>

      {/* Exam List */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Exam Results</h3>
        
        {examGrades.map((exam) => (
          <div key={exam.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{exam.name}</h4>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{exam.completedDate ? new Date(exam.completedDate).toLocaleDateString() : 'Not completed'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(exam.status)}
              </div>
            </div>
            
            {exam.score !== undefined && (
              <div className="flex items-baseline gap-3 mt-4 pt-4 border-t-2 border-gray-100">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900">{exam.score}%</span>
                {exam.grade && (
                  <span className={`text-3xl sm:text-4xl font-bold ${getGradeColor(exam.score)}`}>
                    {exam.grade}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {examGrades.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-lg sm:text-xl text-gray-500">No grades yet. Complete your first exam!</p>
        </div>
      )}
    </div>
  );
}
