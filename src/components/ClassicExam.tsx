import React, { useState } from 'react';
import { X, Send, Loader2, BookOpen, CheckCircle2, Clock, Menu } from 'lucide-react';
import { Question, Answer } from '../App';

interface ClassicExamProps {
  onExit: () => void;
}

const classicQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Explain the difference between a process and a thread. In what scenarios would you choose to use multiple threads within a single process rather than creating multiple processes?'
  },
  {
    id: 'q2',
    text: 'Describe how virtual memory works. What is the role of the page table, and what happens during a page fault? Explain the benefits of virtual memory for both the operating system and application programs.'
  },
  {
    id: 'q3',
    text: 'What is a deadlock? Describe the four necessary conditions for deadlock to occur. Choose one of these conditions and explain a practical strategy an operating system can use to prevent deadlocks by breaking that condition.'
  },
  {
    id: 'q4',
    text: 'Compare and contrast the different CPU scheduling algorithms: First-Come-First-Served (FCFS), Shortest Job First (SJF), and Round Robin. What are the advantages and disadvantages of each? Which algorithm would be best for an interactive system and why?'
  },
  {
    id: 'q5',
    text: 'Explain the concept of inter-process communication (IPC). Compare shared memory and message passing as IPC mechanisms. Based on your IPC and CopyMaster assignments, describe a situation where you would prefer one method over the other.'
  }
];

type ExamPhase = 'ready' | 'in-progress' | 'completed';

export default function ClassicExam({ onExit }: ClassicExamProps) {
  const [phase, setPhase] = useState<ExamPhase>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const currentQuestion = classicQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / classicQuestions.length) * 100;

  const handleStartExam = () => {
    setPhase('in-progress');
  };

  const evaluateAnswer = (answer: string): { feedback: string; score: number } => {
    // Simple mock evaluation based on answer length and keywords
    const wordCount = answer.trim().split(/\s+/).length;
    const hasKeywords = answer.toLowerCase().includes('process') || 
                       answer.toLowerCase().includes('thread') ||
                       answer.toLowerCase().includes('memory') ||
                       answer.toLowerCase().includes('virtual') ||
                       answer.toLowerCase().includes('deadlock');

    if (wordCount > 100 && hasKeywords) {
      return {
        feedback: 'Excellent answer! You demonstrated a comprehensive understanding of the concept with detailed explanations and relevant examples.',
        score: 90 + Math.floor(Math.random() * 10)
      };
    } else if (wordCount > 50) {
      return {
        feedback: 'Good answer. You covered the main points, though some aspects could be explained in more detail.',
        score: 75 + Math.floor(Math.random() * 15)
      };
    } else {
      return {
        feedback: 'Your answer is correct but brief. Consider providing more detailed explanations and examples to demonstrate deeper understanding.',
        score: 60 + Math.floor(Math.random() * 15)
      };
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const evaluation = evaluateAnswer(currentAnswer);
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      text: currentAnswer,
      timestamp: new Date()
    };

    setAnswers([...answers, newAnswer]);
    setEvaluationFeedback(evaluation.feedback);
    setShowEvaluation(true);

    // Auto advance after showing evaluation
    setTimeout(() => {
      setShowEvaluation(false);
      setCurrentAnswer('');
      setEvaluationFeedback('');
      
      if (currentQuestionIndex < classicQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setPhase('completed');
      }
    }, 4000);
  };

  if (phase === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 p-4 sm:p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Classic Oral Examination 📚</h2>
              <p className="text-base sm:text-lg text-gray-600">
                Answer {classicQuestions.length} theory questions about Operating Systems
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Examination Format</h3>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5A712] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Theory Questions</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Answer questions about core OS concepts including processes, memory, scheduling, and synchronization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5A712] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Plain Text Answers</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Type detailed explanations in plain text. Be thorough and reference concepts from your assignments when relevant</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5A712] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">AI Evaluation</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Each answer will be evaluated by AI immediately. You'll receive feedback before moving to the next question</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{classicQuestions.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">45-60m</div>
                <div className="text-xs sm:text-sm text-gray-600">Est. Duration</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleStartExam}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Begin Examination
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
    const averageScore = Math.floor(70 + Math.random() * 25);
    const grade = averageScore >= 90 ? 'A' : averageScore >= 80 ? 'A-' : averageScore >= 70 ? 'B' : 'C';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 p-4 sm:p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Examination Complete! 🎉</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              You've successfully answered all {classicQuestions.length} theory questions.
            </p>

            <div className="bg-gradient-to-br from-[#E5A712]/20 to-[#D4951A]/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
              <div className="text-5xl sm:text-7xl font-bold text-[#E5A712] mb-2">{grade}</div>
              <div className="text-xl sm:text-2xl font-semibold text-gray-700 mb-1">{averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{classicQuestions.length}/{classicQuestions.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">~52m</div>
                <div className="text-xs sm:text-sm text-gray-600">Time Taken</div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left">
              <h3 className="font-semibold text-green-900 mb-3 text-sm sm:text-base">Performance Summary</h3>
              <div className="space-y-2 text-xs sm:text-sm text-green-800">
                <p>✓ Strong understanding of process and thread concepts</p>
                <p>✓ Good grasp of memory management principles</p>
                <p>✓ Clear explanations with relevant examples</p>
                <p>✓ Successfully connected theory to practical assignments</p>
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] px-4 sm:px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#E5A712]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-black text-sm sm:text-base truncate">Classic Oral Examination</h1>
              <p className="text-xs text-black/70">Question {currentQuestionIndex + 1} of {classicQuestions.length}</p>
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
        {/* Left Side - Question and Answer */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Question */}
            <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 border-2 border-[#E5A712]/30 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-base sm:text-lg lg:text-xl">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-[#E5A712] mb-2">THEORY QUESTION</div>
                  <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 leading-relaxed">{currentQuestion.text}</p>
                </div>
              </div>
            </div>

            {/* Answer Area */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Answer</h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Take your time</span>
                </div>
              </div>
              
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Write your detailed answer here...&#10;&#10;Tips:&#10;• Explain concepts clearly&#10;• Provide examples when relevant&#10;• Reference your programming assignments if applicable&#10;• Consider multiple aspects of the question"
                className="w-full h-64 sm:h-80 lg:h-96 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-gray-900 leading-relaxed text-sm sm:text-base"
                disabled={showEvaluation}
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 sm:mt-6">
                <div className="text-xs sm:text-sm text-gray-500">
                  <span className="font-medium">{currentAnswer.trim().split(/\s+/).filter(w => w).length}</span> words
                  <span className="mx-2">•</span>
                  <span className="font-medium">{currentAnswer.length}</span> characters
                </div>
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
            {showEvaluation && evaluationFeedback && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">AI Evaluation ✅</h4>
                    <p className="text-xs sm:text-sm text-green-800 leading-relaxed">{evaluationFeedback}</p>
                    <p className="text-xs text-green-700 mt-3">Moving to next question...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Progress */}
        <div className={`
          fixed lg:relative inset-y-0 right-0 z-50 
          w-80 bg-white border-l-2 border-gray-200 p-4 sm:p-6 overflow-y-auto
          transform transition-transform duration-300 lg:transform-none
          ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Examination Progress</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2 mb-6">
            {classicQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  idx === currentQuestionIndex
                    ? 'bg-[#E5A712]/10 border-[#E5A712]'
                    : idx < currentQuestionIndex
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {idx < currentQuestionIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx === currentQuestionIndex
                        ? 'bg-[#E5A712] text-black'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                  )}
                  <span className={`text-sm font-semibold ${
                    idx === currentQuestionIndex ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    Question {idx + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 ml-9">
                  {q.text.split('.')[0]}...
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 rounded-xl p-4 sm:p-5 border-2 border-[#E5A712]/20">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">💡 Writing Tips</h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#E5A712] font-bold">•</span>
                <span>Structure your answer with clear explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5A712] font-bold">•</span>
                <span>Use technical terminology correctly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5A712] font-bold">•</span>
                <span>Provide concrete examples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5A712] font-bold">•</span>
                <span>Reference your assignments when relevant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5A712] font-bold">•</span>
                <span>Aim for 100+ words per answer</span>
              </li>
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
