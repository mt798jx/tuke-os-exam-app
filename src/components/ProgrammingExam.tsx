import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Code2, FileCode, CheckCircle2, AlertCircle, Github } from 'lucide-react';
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-2xl w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Repository</h2>
            <p className="text-lg text-gray-600 mb-8">
              AI is cloning and analyzing <span className="font-mono font-semibold text-indigo-600">{repoName}</span>
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">Repository cloned successfully</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">Code structure analyzed</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 animate-spin" />
                <span className="text-sm text-blue-800">Generating personalized questions...</span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="text-sm text-gray-500 hover:text-gray-700"
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-3xl w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Complete!</h2>
              <p className="text-lg text-gray-600">
                I've prepared {questions.length} personalized questions based on your code.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Github className="w-5 h-5 text-indigo-600" />
                Repository: {repoName}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Questions will focus on your specific implementation</p>
                <p>• Each question relates to a particular file and function</p>
                <p>• Take your time to explain your reasoning clearly</p>
                <p>• You can reference line numbers and code snippets</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStartExam}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Examination ({questions.length} Questions)
              </button>
              <button
                onClick={onExit}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
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
    const grade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : 'D';

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-3xl w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exam Completed!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Great job! You've completed all {questions.length} questions.
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-2">{grade}</div>
              <div className="text-2xl font-semibold text-gray-700 mb-1">{finalScore}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{answers.length}</div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">~35m</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg"
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
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">{examTitle}</h1>
              <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Side - Question */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Code Context */}
            {currentQuestion.relatedFile && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentQuestion.relatedFile}</p>
                    {currentQuestion.relatedFunction && (
                      <p className="text-xs text-gray-500">{currentQuestion.relatedFunction}</p>
                    )}
                  </div>
                </div>
                {currentQuestion.codeSnippet && (
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <code className="text-gray-800">{currentQuestion.codeSnippet}</code>
                  </div>
                )}
              </div>
            )}

            {/* Question */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-8 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Question</h2>
                  <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.text}</p>
                </div>
              </div>
            </div>

            {/* Answer Area */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed answer here... Explain your reasoning and reference specific parts of your code."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                disabled={showEvaluation}
              />
              
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  {currentAnswer.length} characters
                </p>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim() || showEvaluation}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
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
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Good answer!</h4>
                    <p className="text-sm text-green-800">
                      Your explanation demonstrates understanding of the concept. Moving to next question...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Progress */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
          
          <div className="space-y-2 mb-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  idx === currentQuestionIndex
                    ? 'bg-indigo-50 border-2 border-indigo-500'
                    : idx < currentQuestionIndex
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {idx < currentQuestionIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    idx === currentQuestionIndex ? 'text-indigo-900' : 'text-gray-700'
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

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Tips</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>• Be specific about your implementation</li>
              <li>• Explain your reasoning clearly</li>
              <li>• Reference code when relevant</li>
              <li>• Consider edge cases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
