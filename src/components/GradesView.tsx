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
    grade: 'A',
    completedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'CopyMaster Programming Assignment',
    status: 'in-progress',
    score: 65,
    grade: 'D',
    completedDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Classic Oral Examination',
    status: 'completed',
    score: 92,
    grade: 'A',
    completedDate: '2024-01-22'
  }
];

export default function GradesView() {
  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-600';
    if (grade === 'A') return 'text-green-600';
    if (grade === 'B') return 'text-[#E5A712]';
    if (grade === 'C') return 'text-orange-600';
    if (grade === 'D' || grade === 'E') return 'text-red-600';
    if (grade === 'FX') return 'text-red-700';
    return 'text-gray-600';
  };

  const getGradeBg = (grade?: string) => {
    if (!grade) return 'bg-gray-100';
    if (grade === 'A') return 'bg-green-100';
    if (grade === 'B') return 'bg-[#E5A712]/20';
    if (grade === 'C') return 'bg-orange-100';
    if (grade === 'D' || grade === 'E') return 'bg-red-100';
    if (grade === 'FX') return 'bg-red-200';
    return 'bg-gray-100';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'completed': { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-300', 
        label: 'Dokončené', 
        icon: CheckCircle2 
      },
      'in-progress': { 
        bg: 'bg-orange-50', 
        text: 'text-orange-700', 
        border: 'border-orange-300', 
        label: 'Prebieha', 
        icon: Clock 
      },
      'not-started': { 
        bg: 'bg-gray-50', 
        text: 'text-gray-600', 
        border: 'border-gray-300', 
        label: 'Nezačaté', 
        icon: AlertCircle 
      }
    };
    return configs[status as keyof typeof configs];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Vaše Hodnotenia</h2>
        <p className="text-sm sm:text-base text-gray-600">Prehľad výsledkov skúšok</p>
      </div>

      {/* Exam Results */}
      <div className="space-y-3">
        {examGrades.map((exam) => {
          const statusConfig = getStatusConfig(exam.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div 
              key={exam.id} 
              className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-lg transition-shadow"
            >
              {/* Mobile Layout */}
              <div className="sm:hidden space-y-3">
                {/* Name and Status */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-bold text-gray-900 flex-1">{exam.name}</h4>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Date */}
                {exam.completedDate && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(exam.completedDate).toLocaleDateString('sk-SK', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Score and Grade */}
                {exam.score !== undefined && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-3xl font-bold text-gray-900">{exam.score}%</span>
                    {exam.grade && (
                      <div className={`w-14 h-14 rounded-xl ${getGradeBg(exam.grade)} flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${getGradeColor(exam.grade)}`}>
                          {exam.grade}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-6">
                {/* Left: Name and Date */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-1.5">{exam.name}</h4>
                  {exam.completedDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(exam.completedDate).toLocaleDateString('sk-SK', { 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Score, Grade, Status */}
                <div className="flex items-center gap-4">
                  {/* Score and Grade */}
                  {exam.score !== undefined && (
                    <>
                      <span className="text-4xl font-bold text-gray-900">{exam.score}%</span>
                      {exam.grade && (
                        <div className={`w-16 h-16 rounded-xl ${getGradeBg(exam.grade)} flex items-center justify-center`}>
                          <span className={`text-3xl font-bold ${getGradeColor(exam.grade)}`}>
                            {exam.grade}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} font-bold text-sm whitespace-nowrap`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {examGrades.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Zatiaľ žiadne hodnotenia</h3>
          <p className="text-sm sm:text-base text-gray-600">Dokončite svoju prvú skúšku!</p>
        </div>
      )}
    </div>
  );
}
