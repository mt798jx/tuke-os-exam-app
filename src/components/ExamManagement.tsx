import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Lock, Unlock, Save, ArrowLeft, MessageSquare, X } from 'lucide-react';

interface ExamConfig {
  id: string;
  name: string;
  type: 'ipc' | 'copymaster' | 'classic';
  enabled: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  customQuestions?: CustomQuestion[];
}

interface CustomQuestion {
  id: string;
  text: string;
  type: 'theory' | 'code-specific';
}

interface ExamManagementProps {
  onClose: () => void;
}

export default function ExamManagement({ onClose }: ExamManagementProps) {
  const [exams, setExams] = useState<ExamConfig[]>([
    {
      id: '1',
      name: 'IPC Programming Assignment',
      type: 'ipc',
      enabled: true,
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'CopyMaster Programming Assignment',
      type: 'copymaster',
      enabled: false,
      availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Classic Oral Exam',
      type: 'classic',
      enabled: false,
      customQuestions: [
        { id: '1', text: 'Explain the difference between a process and a thread.', type: 'theory' },
        { id: '2', text: 'What is virtual memory and how does it work?', type: 'theory' }
      ]
    }
  ]);

  const [managingQuestionsFor, setManagingQuestionsFor] = useState<ExamConfig | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  const [questionText, setQuestionText] = useState('');

  const toggleExamAccess = (examId: string) => {
    setExams(exams.map(exam => 
      exam.id === examId ? { ...exam, enabled: !exam.enabled } : exam
    ));
  };

  const openQuestionManager = (exam: ExamConfig) => {
    setManagingQuestionsFor(exam);
    setEditingQuestion(null);
    setQuestionText('');
  };

  const closeQuestionManager = () => {
    setManagingQuestionsFor(null);
    setEditingQuestion(null);
    setQuestionText('');
  };

  const addQuestion = () => {
    if (!questionText.trim() || !managingQuestionsFor) return;

    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      text: questionText,
      type: 'theory'
    };

    setExams(exams.map(exam =>
      exam.id === managingQuestionsFor.id
        ? { ...exam, customQuestions: [...(exam.customQuestions || []), newQuestion] }
        : exam
    ));

    setQuestionText('');
  };

  const updateQuestion = () => {
    if (!questionText.trim() || !editingQuestion || !managingQuestionsFor) return;

    setExams(exams.map(exam =>
      exam.id === managingQuestionsFor.id
        ? {
            ...exam,
            customQuestions: exam.customQuestions?.map(q =>
              q.id === editingQuestion.id ? { ...q, text: questionText } : q
            )
          }
        : exam
    ));

    setEditingQuestion(null);
    setQuestionText('');
  };

  const deleteQuestion = (questionId: string) => {
    if (!managingQuestionsFor) return;
    
    setExams(exams.map(exam =>
      exam.id === managingQuestionsFor.id
        ? { ...exam, customQuestions: exam.customQuestions?.filter(q => q.id !== questionId) }
        : exam
    ));
  };

  const startEditQuestion = (question: CustomQuestion) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setQuestionText('');
  };

  // Question Manager Modal
  if (managingQuestionsFor) {
    const currentExam = exams.find(e => e.id === managingQuestionsFor.id);
    const questions = currentExam?.customQuestions || [];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] px-6 sm:px-8 py-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-black truncate">Question Bank</h2>
                <p className="text-sm text-black/70 truncate">{managingQuestionsFor.name}</p>
              </div>
            </div>
            <button
              onClick={closeQuestionManager}
              className="p-2 hover:bg-black/10 rounded-lg transition-all flex-shrink-0"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Add/Edit Question Form */}
            <div className="bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-[#E5A712]/30">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                {editingQuestion ? '✏️ Edit Question' : '➕ Add New Question'}
              </h3>
              <div className="space-y-4">
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question here... Be specific and clear."
                  className="w-full h-32 sm:h-40 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent text-sm sm:text-base"
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  {editingQuestion && (
                    <button
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={editingQuestion ? updateQuestion : addQuestion}
                    disabled={!questionText.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Questions ({questions.length})
                </h3>
              </div>

              {questions.length > 0 ? (
                <div className="space-y-3">
                  {questions.map((question, idx) => (
                    <div
                      key={question.id}
                      className={`bg-white border-2 rounded-xl p-4 sm:p-5 transition-all ${
                        editingQuestion?.id === question.id
                          ? 'border-[#E5A712] bg-[#E5A712]/5'
                          : 'border-gray-200 hover:border-[#E5A712]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-black font-bold text-sm sm:text-base">{idx + 1}</span>
                        </div>
                        <p className="flex-1 text-gray-800 text-sm sm:text-base leading-relaxed pt-1">
                          {question.text}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEditQuestion(question)}
                            className="p-2 text-[#E5A712] hover:bg-[#E5A712]/10 rounded-lg transition-all"
                            title="Edit question"
                          >
                            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">No questions yet. Add your first question above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 p-6 sm:p-8 bg-gray-50 flex-shrink-0">
            <button
              onClick={closeQuestionManager}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Exam Management ⚙️</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 truncate">Configure exams and access control</p>
        </div>
      </div>

      {/* Exams List */}
      <div className="space-y-4 sm:space-y-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
            {/* Exam Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col gap-4">
                {/* Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{exam.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExamAccess(exam.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        exam.enabled
                          ? 'bg-green-50 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                      }`}
                    >
                      {exam.enabled ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span className="hidden sm:inline">Enabled</span>
                          <span className="sm:hidden">On</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="hidden sm:inline">Disabled</span>
                          <span className="sm:hidden">Off</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                      Available From
                    </label>
                    <input
                      type="datetime-local"
                      value={exam.availableFrom ? new Date(exam.availableFrom).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        setExams(exams.map(ex =>
                          ex.id === exam.id
                            ? { ...ex, availableFrom: new Date(e.target.value) }
                            : ex
                        ));
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                      Available Until
                    </label>
                    <input
                      type="datetime-local"
                      value={exam.availableUntil ? new Date(exam.availableUntil).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        setExams(exams.map(ex =>
                          ex.id === exam.id
                            ? { ...ex, availableUntil: new Date(e.target.value) }
                            : ex
                        ));
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Question Management */}
                {exam.type === 'classic' ? (
                  <div className="pt-4 border-t-2 border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Custom Questions</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {exam.customQuestions?.length || 0} question{exam.customQuestions?.length !== 1 ? 's' : ''} configured
                        </p>
                      </div>
                      <button
                        onClick={() => openQuestionManager(exam)}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-lg hover:shadow-lg transition-all font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Manage Questions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t-2 border-gray-100">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        <strong>🤖 AI-Generated Questions:</strong> Questions for this exam are automatically created based on student repository analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-200">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
