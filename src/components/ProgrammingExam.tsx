import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Code2, FileCode, CheckCircle2, AlertCircle, Github, Menu } from 'lucide-react';
import { Question, Answer } from '../App';

interface ProgrammingExamProps {
  examType: 'ipc' | 'copymaster';
  onExit: () => void;
}

type ExamPhase = 'analyzing' | 'ready' | 'in-progress' | 'completed';

const generateQuestions = (examType: 'ipc' | 'copymaster'): Question[] => {
  if (examType === 'ipc') {
    return [
      {
        id: 'q1',
        text: 'I see you implemented shared memory using shmget and shmat. Can you explain why you chose the specific permissions (0666) for your shared memory segment? What security implications does this have?',
        relatedFile: 'src/shared_memory.c',
        relatedFunction: 'init_shared_memory()',
        codeSnippet: 'int shmid = shmget(key, SHM_SIZE, IPC_CREAT | 0666);'
      },
      {
        id: 'q2',
        text: 'In your attach_shared_memory function, you check if shmat returns -1. What happens if multiple processes try to attach to the same shared memory segment simultaneously? How does your implementation handle this?',
        relatedFile: 'src/shared_memory.c',
        relatedFunction: 'attach_shared_memory()',
        codeSnippet: 'if (shm_ptr == (void *) -1) { perror("shmat failed"); return NULL; }'
      },
      {
        id: 'q3',
        text: 'I noticed you use strcpy to write data to shared memory. What problems could occur if the data length exceeds SHM_SIZE? How would you improve this to be more robust?',
        relatedFile: 'src/shared_memory.c',
        relatedFunction: 'write_to_shared_memory()',
        codeSnippet: 'strcpy((char *)shm_ptr, data);'
      },
      {
        id: 'q4',
        text: 'Your code uses semaphores for synchronization. Can you explain the difference between binary semaphores and counting semaphores, and which one is more appropriate for your IPC implementation?',
        relatedFile: 'src/semaphore.c',
        relatedFunction: 'semaphore_wait()'
      },
      {
        id: 'q5',
        text: 'Looking at your message queue implementation, what happens if the queue is full when a process tries to send a message? How does your error handling address this scenario?',
        relatedFile: 'src/message_queue.c',
        relatedFunction: 'send_message()'
      }
    ];
  } else {
    return [
      {
        id: 'q1',
        text: 'In your file copy implementation, you use a buffer of 4096 bytes. Why did you choose this specific buffer size? How does buffer size affect performance?',
        relatedFile: 'src/copy.c',
        relatedFunction: 'copy_file()',
        codeSnippet: 'char buffer[4096];'
      },
      {
        id: 'q2',
        text: 'I see you handle EINTR in your read loop. Can you explain what causes EINTR and why it\'s important to handle it when working with system calls?',
        relatedFile: 'src/copy.c',
        relatedFunction: 'safe_read()',
        codeSnippet: 'if (errno == EINTR) continue;'
      },
      {
        id: 'q3',
        text: 'Your implementation checks for sparse files. How do you detect if a file is sparse, and what optimization does this enable in your copy operation?',
        relatedFile: 'src/copy.c',
        relatedFunction: 'copy_file()'
      },
      {
        id: 'q4',
        text: 'What happens if the destination file already exists? Walk me through how your code handles file permissions and ownership during the copy process.',
        relatedFile: 'src/copy.c',
        relatedFunction: 'copy_file()'
      },
      {
        id: 'q5',
        text: 'I notice you use open() with O_CREAT | O_WRONLY | O_TRUNC. What would happen if you used O_APPEND instead of O_TRUNC? When would each flag be appropriate?',
        relatedFile: 'src/copy.c',
        relatedFunction: 'copy_file()'
      }
    ];
  }
};

export default function ProgrammingExam({ examType, onExit }: ProgrammingExamProps) {
  const [phase, setPhase] = useState<ExamPhase>('analyzing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const examTitle = examType === 'ipc' ? 'IPC Programming Assignment' : 'CopyMaster Programming Assignment';
  const repoName = examType === 'ipc' ? 'student-ipc-assignment' : 'student-copymaster';

  useEffect(() => {
    // Simulate repository analysis
    const timer = setTimeout(() => {
      const generatedQuestions = generateQuestions(examType);
      setQuestions(generatedQuestions);
      setPhase('ready');
    }, 3000);

    return () => clearTimeout(timer);
  }, [examType]);

  const handleStartExam = () => {
    setPhase('in-progress');
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const newAnswer: Answer = {
      questionId: questions[currentQuestionIndex].id,
      text: currentAnswer,
      timestamp: new Date()
    };

    setAnswers([...answers, newAnswer]);
    setShowEvaluation(true);

    // Auto advance after showing evaluation
    setTimeout(() => {
      setShowEvaluation(false);
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setPhase('completed');
      }
    }, 3000);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 p-4 sm:p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Analyzing Your Repository</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              AI is cloning and analyzing <span className="font-mono font-semibold text-[#E5A712] break-all">{repoName}</span>
            </p>
            
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-green-800 text-left">Repository cloned successfully</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-green-800 text-left">Code structure analyzed</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#E5A712]/10 rounded-xl">
                <Loader2 className="w-5 h-5 text-[#E5A712] flex-shrink-0 animate-spin" />
                <span className="text-sm sm:text-base text-[#E5A712] font-bold text-left">Generating personalized questions...</span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="text-sm text-gray-500 hover:text-gray-700 transition-all"
            >
              Cancel and return to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 p-4 sm:p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Analysis Complete! ✅</h2>
              <p className="text-base sm:text-lg text-gray-600">
                I've prepared {questions.length} personalized questions based on your code.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Github className="w-5 h-5 text-[#E5A712]" />
                Repository: <span className="font-mono text-[#E5A712]">{repoName}</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                <p>• Questions will focus on your specific implementation</p>
                <p>• Each question relates to a particular file and function</p>
                <p>• Take your time to explain your reasoning clearly</p>
                <p>• You can reference line numbers and code snippets</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleStartExam}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Start Examination ({questions.length} Questions)
              </button>
              <button
                onClick={onExit}
                className="px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'completed') {
    const finalScore = Math.floor(70 + Math.random() * 25); // Mock score 70-95%
    const grade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'A-' : finalScore >= 70 ? 'B' : 'C';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 p-4 sm:p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Exam Completed! 🎉</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Great job! You've completed all {questions.length} questions.
            </p>

            <div className="bg-gradient-to-br from-[#E5A712]/20 to-[#D4951A]/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="text-5xl sm:text-6xl font-bold text-[#E5A712] mb-2">{grade}</div>
              <div className="text-xl sm:text-2xl font-semibold text-gray-700 mb-1">{finalScore}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{questions.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{answers.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Answered</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">~35m</div>
                <div className="text-xs sm:text-sm text-gray-600">Duration</div>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] px-4 sm:px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-[#E5A712]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-black text-sm sm:text-base truncate">{examTitle}</h1>
              <p className="text-xs text-black/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 text-black hover:bg-black/10 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={onExit}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-black hover:bg-black/10 rounded-lg transition-all font-bold text-sm"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-black/20 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Question */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Code Context */}
            {currentQuestion.relatedFile && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileCode className="w-5 h-5 text-[#E5A712] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{currentQuestion.relatedFile}</p>
                    {currentQuestion.relatedFunction && (
                      <p className="text-xs text-gray-500 truncate">{currentQuestion.relatedFunction}</p>
                    )}
                  </div>
                </div>
                {currentQuestion.codeSnippet && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                    <code className="text-gray-800">{currentQuestion.codeSnippet}</code>
                  </div>
                )}
              </div>
            )}

            {/* Question */}
            <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-base sm:text-lg">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Question</h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">{currentQuestion.text}</p>
                </div>
              </div>
            </div>

            {/* Answer Area */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Answer</h3>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed answer here... Explain your reasoning and reference specific parts of your code."
                className="w-full h-48 sm:h-64 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-gray-900 text-sm sm:text-base"
                disabled={showEvaluation}
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 sm:mt-6">
                <p className="text-sm text-gray-500">
                  {currentAnswer.length} characters
                </p>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim() || showEvaluation}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {showEvaluation ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Evaluation Feedback */}
            {showEvaluation && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Good answer! ✅</h4>
                    <p className="text-xs sm:text-sm text-green-800">
                      Your explanation demonstrates understanding of the concept. Moving to next question...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Progress (Desktop) and Mobile Drawer */}
        <div className={`
          fixed lg:relative inset-y-0 right-0 z-50 
          w-80 bg-white border-l-2 border-gray-200 p-4 sm:p-6 overflow-y-auto
          transform transition-transform duration-300 lg:transform-none
          ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Progress</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2 mb-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  idx === currentQuestionIndex
                    ? 'bg-[#E5A712]/10 border-2 border-[#E5A712]'
                    : idx < currentQuestionIndex
                    ? 'bg-green-50 border-2 border-green-300'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {idx < currentQuestionIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === currentQuestionIndex
                      ? 'bg-[#E5A712] text-black'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    idx === currentQuestionIndex ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    Question {idx + 1}
                  </p>
                  {q.relatedFile && (
                    <p className="text-xs text-gray-500 truncate">{q.relatedFile}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 rounded-xl p-4 border-2 border-[#E5A712]/20">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Tips</h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>• Be specific about your implementation</li>
              <li>• Explain your reasoning clearly</li>
              <li>• Reference code when relevant</li>
              <li>• Consider edge cases</li>
            </ul>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </div>
  );
}
