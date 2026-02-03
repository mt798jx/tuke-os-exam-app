import React, { useState } from 'react';
import { 
  ArrowLeft, User, Mail, Calendar, GitBranch, Award, 
  CheckCircle2, Clock, Code2, FileText, MessageSquare,
  ChevronDown, ChevronUp, TrendingUp, Target
} from 'lucide-react';

interface ExamAttempt {
  id: string;
  examType: 'IPC' | 'CopyMaster' | 'Classic';
  date: string;
  score: number;
  grade: string;
  status: 'completed' | 'in-progress';
  questions: ExamQuestion[];
  repository?: {
    url: string;
    branch: string;
    lastCommit: string;
  };
}

interface ExamQuestion {
  id: string;
  question: string;
  studentAnswer?: string;
  correctAnswer?: string;
  aiEvaluation?: string;
  score: number;
  maxScore: number;
  codeSnippet?: string;
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  labGroup: string;
  gitlabUsername?: string;
  gitlabConfigured: boolean;
  exams: ExamAttempt[];
  averageScore: number;
  completedExams: number;
  totalExams: number;
}

interface StudentDetailViewProps {
  studentId: string;
  onBack: () => void;
}

// Mock data - v reálnej aplikácii by sa tieto dáta načítali z API
const mockStudent: StudentDetail = {
  id: '1',
  name: 'Ján Novák',
  email: 'jan.novak@tuke.sk',
  enrolledDate: '2024-09-15',
  labGroup: 'Lab Group A',
  gitlabUsername: 'jnovak',
  gitlabConfigured: true,
  completedExams: 2,
  totalExams: 3,
  averageScore: 85,
  exams: [
    {
      id: 'e1',
      examType: 'IPC',
      date: '2024-01-15',
      score: 88,
      grade: 'A',
      status: 'completed',
      repository: {
        url: 'https://gitlab.com/jnovak/ipc-assignment',
        branch: 'main',
        lastCommit: 'Fixed memory leak in shared memory handler'
      },
      questions: [
        {
          id: 'q1',
          question: 'Explain how your implementation handles shared memory synchronization between multiple processes.',
          studentAnswer: 'I used semaphores to synchronize access to shared memory. Each process waits on a semaphore before accessing the shared region and signals when done. This prevents race conditions.',
          correctAnswer: 'Good use of semaphores for synchronization.',
          aiEvaluation: 'Excellent explanation. Student demonstrates clear understanding of semaphore-based synchronization and race condition prevention.',
          score: 18,
          maxScore: 20,
          codeSnippet: `sem_wait(&shm_sem);
// Critical section - access shared memory
shared_data->counter++;
sem_post(&shm_sem);`
        },
        {
          id: 'q2',
          question: 'What happens in your code when message queue is full? How do you handle this edge case?',
          studentAnswer: 'I check if msgsnd returns -1 with errno EAGAIN. In that case, I wait 100ms and retry up to 5 times before giving up and logging an error.',
          correctAnswer: 'Proper error handling with retry mechanism.',
          aiEvaluation: 'Good approach with retry logic. Could be improved with exponential backoff.',
          score: 16,
          maxScore: 20
        },
        {
          id: 'q3',
          question: 'Describe your process cleanup strategy. What resources need to be freed?',
          studentAnswer: 'In my cleanup function, I detach and remove shared memory segments using shmdt() and shmctl(). I also destroy semaphores with sem_destroy() and remove message queues with msgctl().',
          aiEvaluation: 'Complete and correct cleanup procedure. All IPC resources properly handled.',
          score: 20,
          maxScore: 20
        },
        {
          id: 'q4',
          question: 'How did you test for race conditions in your implementation?',
          studentAnswer: 'I created a test script that spawns 10 concurrent processes all trying to increment a shared counter. Without synchronization it failed, with semaphores it always produced correct results.',
          aiEvaluation: 'Practical testing approach demonstrates understanding.',
          score: 17,
          maxScore: 20
        },
        {
          id: 'q5',
          question: 'What would happen if a process crashes while holding a semaphore? How could you prevent deadlock?',
          studentAnswer: 'The semaphore would stay locked causing deadlock. I could use SEM_UNDO flag with semop() so the OS releases the semaphore automatically if process terminates.',
          aiEvaluation: 'Excellent answer showing advanced understanding of IPC edge cases.',
          score: 19,
          maxScore: 20
        }
      ]
    },
    {
      id: 'e2',
      examType: 'Classic',
      date: '2024-01-22',
      score: 82,
      grade: 'B',
      status: 'completed',
      questions: [
        {
          id: 'q1',
          question: 'Explain the difference between a thread and a process.',
          studentAnswer: 'A process is an independent execution unit with its own memory space, while threads share memory within the same process. Processes are more isolated but heavier, threads are lightweight but less isolated.',
          aiEvaluation: 'Correct and concise explanation covering the key differences.',
          score: 18,
          maxScore: 20
        },
        {
          id: 'q2',
          question: 'What is a deadlock and what are the four necessary conditions for it to occur?',
          studentAnswer: 'Deadlock is when processes wait forever for resources. The four conditions are: mutual exclusion, hold and wait, no preemption, and circular wait.',
          aiEvaluation: 'All four conditions correctly identified.',
          score: 20,
          maxScore: 20
        },
        {
          id: 'q3',
          question: 'Describe the purpose of virtual memory and how paging works.',
          studentAnswer: 'Virtual memory allows programs to use more memory than physically available. Paging divides memory into fixed-size blocks (pages). The OS maps virtual pages to physical frames using page tables.',
          aiEvaluation: 'Good explanation but could include more detail on page faults.',
          score: 16,
          maxScore: 20
        },
        {
          id: 'q4',
          question: 'What is the difference between preemptive and non-preemptive scheduling?',
          studentAnswer: 'Preemptive scheduling allows the OS to interrupt running processes to switch to another. Non-preemptive lets the process run until it finishes or blocks.',
          aiEvaluation: 'Clear and accurate distinction.',
          score: 18,
          maxScore: 20
        },
        {
          id: 'q5',
          question: 'Explain the producer-consumer problem and one solution to it.',
          studentAnswer: 'Multiple producers create data and consumers process it using a shared buffer. Solution uses semaphores: empty (counts free slots), full (counts items), and mutex (protects buffer access).',
          aiEvaluation: 'Correct problem description and semaphore-based solution.',
          score: 19,
          maxScore: 20
        }
      ]
    },
    {
      id: 'e3',
      examType: 'CopyMaster',
      date: '2024-01-20',
      score: 0,
      grade: '-',
      status: 'in-progress',
      repository: {
        url: 'https://gitlab.com/jnovak/copymaster',
        branch: 'main',
        lastCommit: 'Initial implementation of basic copy'
      },
      questions: []
    }
  ]
};

export default function StudentDetailView({ studentId, onBack }: StudentDetailViewProps) {
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const student = mockStudent; // V reálnej aplikácii: fetch by studentId

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-green-600';
    if (grade === 'B') return 'text-[#E5A712]';
    if (grade === 'C') return 'text-orange-600';
    if (grade === 'D' || grade === 'E') return 'text-red-600';
    if (grade === 'FX') return 'text-red-700';
    return 'text-gray-600';
  };

  const getGradeBg = (grade: string) => {
    if (grade === 'A') return 'bg-green-100';
    if (grade === 'B') return 'bg-[#E5A712]/20';
    if (grade === 'C') return 'bg-orange-100';
    if (grade === 'D' || grade === 'E') return 'bg-red-100';
    if (grade === 'FX') return 'bg-red-200';
    return 'bg-gray-100';
  };

  const toggleExam = (examId: string) => {
    setExpandedExam(expandedExam === examId ? null : examId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 sm:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-black/10 hover:bg-black/20 rounded-lg transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black truncate">Detail študenta</h1>
              <p className="text-xs sm:text-sm text-black/70 truncate">Kompletný prehľad výsledkov</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        {/* Student Info Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">{student.name}</h2>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-all">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Zapísaný: {new Date(student.enrolledDate).toLocaleDateString('sk-SK')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Skupina: {student.labGroup}</span>
                </div>
              </div>
            </div>
          </div>

          {/* GitLab Info */}
          <div className="w-full">
            {student.gitlabConfigured ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-green-900">GitLab nakonfigurovaný</span>
                </div>
                <p className="text-xs sm:text-sm text-green-700 break-all">
                  Username: <span className="font-mono font-bold">{student.gitlabUsername}</span>
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-amber-900">GitLab nie je nakonfigurovaný</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-700">Študent ešte nenastavil GitLab údaje</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-black shadow-lg">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold">Priemerné skóre</span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-3xl sm:text-4xl font-bold">{student.averageScore}%</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold text-gray-700">Dokončené</span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{student.completedExams}/{student.totalExams}</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold text-gray-700">Celkové body</span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5A712]" />
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {student.exams.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.score, 0)}
            </p>
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 px-1">História skúšok</h3>
          
          {student.exams.map((exam) => (
            <div key={exam.id} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              {/* Exam Header */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 mb-4">
                  {/* Top Row - Icon, Title, Status */}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${getGradeBg(exam.grade)}`}>
                      {exam.examType === 'Classic' ? (
                        <FileText className={`w-6 h-6 sm:w-7 sm:h-7 ${getGradeColor(exam.grade)}`} />
                      ) : (
                        <Code2 className={`w-6 h-6 sm:w-7 sm:h-7 ${getGradeColor(exam.grade)}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 break-words">
                        {exam.examType} Programming Assignment
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {exam.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-green-50 text-green-700 border border-green-300 text-xs sm:text-sm font-bold">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            Dokončené
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-300 text-xs sm:text-sm font-bold">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            Prebieha
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(exam.date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score and Grade */}
                  {exam.status === 'completed' && (
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="text-center sm:text-left">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{exam.score}%</p>
                      </div>
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${getGradeBg(exam.grade)} flex items-center justify-center`}>
                        <span className={`text-2xl sm:text-3xl font-bold ${getGradeColor(exam.grade)}`}>
                          {exam.grade}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Repository Info */}
                {exam.repository && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 sm:p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-gray-900">GitLab Repository</span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="break-all">
                        <span className="font-semibold text-gray-700">URL:</span>{' '}
                        <span className="font-mono text-[#E5A712]">{exam.repository.url}</span>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Branch:</span> <span className="font-mono">{exam.repository.branch}</span>
                      </p>
                      <p className="text-gray-700 break-words">
                        <span className="font-semibold">Last commit:</span> {exam.repository.lastCommit}
                      </p>
                    </div>
                  </div>
                )}

                {/* Expand Button */}
                {exam.questions.length > 0 && (
                  <button
                    onClick={() => toggleExam(exam.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-bold text-gray-700 text-sm sm:text-base"
                  >
                    {expandedExam === exam.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">Skryť otázky</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">Zobraziť otázky ({exam.questions.length})</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Expanded Questions */}
              {expandedExam === exam.id && exam.questions.length > 0 && (
                <div className="border-t-2 border-gray-200 bg-gray-50 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  {exam.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 md:p-5">
                      {/* Question Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#E5A712] rounded-lg flex items-center justify-center text-black font-bold text-xs sm:text-sm flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-gray-900">Otázka {idx + 1}</span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold break-words">{q.question}</p>
                        </div>
                        <div className="text-center sm:text-right flex-shrink-0">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{q.score}</div>
                          <div className="text-xs sm:text-sm text-gray-600">/ {q.maxScore}</div>
                        </div>
                      </div>

                      {/* Code Snippet */}
                      {q.codeSnippet && (
                        <div className="mb-3 sm:mb-4">
                          <p className="text-xs font-bold text-gray-600 mb-2">Relevantný kód z repository:</p>
                          <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
                            <pre className="whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">{q.codeSnippet}</pre>
                          </div>
                        </div>
                      )}

                      {/* Student Answer */}
                      {q.studentAnswer && (
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                            <p className="text-xs sm:text-sm font-bold text-blue-900">Odpoveď študenta:</p>
                          </div>
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-gray-900 break-words">{q.studentAnswer}</p>
                          </div>
                        </div>
                      )}

                      {/* AI Evaluation */}
                      {q.aiEvaluation && (
                        <div className="bg-gradient-to-r from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#E5A712] flex-shrink-0" />
                            <p className="text-xs sm:text-sm font-bold text-gray-900">AI Hodnotenie:</p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-800 break-words">{q.aiEvaluation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {student.exams.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Žiadne skúšky</h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">Tento študent ešte nevykonal žiadnu skúšku.</p>
          </div>
        )}
      </div>
    </div>
  );
}