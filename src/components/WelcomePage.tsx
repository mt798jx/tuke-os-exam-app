import React, { useState } from 'react';
import { GraduationCap, Users, Code2, ArrowRight, Sparkles, Shield } from 'lucide-react';

interface WelcomePageProps {
  onLogin: (role: 'student' | 'professor', name: string) => void;
}

export default function WelcomePage({ onLogin }: WelcomePageProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | null>(null);
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (selectedRole && name.trim()) {
      onLogin(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Operating Systems Exam Platform
            </h1>
            <p className="text-xl text-gray-600 mb-2">AI-Powered Oral Examinations</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Technical University of Košice</span>
            </div>
          </div>

          {!selectedRole ? (
            /* Role Selection */
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in">
              {/* Student Card */}
              <button
                onClick={() => setSelectedRole('student')}
                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Student</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Take your programming assignment exams and classic oral examinations with AI guidance.
                  </p>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600">✓</span>
                      </div>
                      <span>Code analysis & questions</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600">✓</span>
                      </div>
                      <span>Theory examinations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600">✓</span>
                      </div>
                      <span>Instant AI feedback</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all">
                    <span>Continue as Student</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Professor Card */}
              <button
                onClick={() => setSelectedRole('professor')}
                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-violet-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Professor</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Monitor student progress, review exam results, and identify areas needing attention.
                  </p>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-600">✓</span>
                      </div>
                      <span>Real-time monitoring</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-600">✓</span>
                      </div>
                      <span>Detailed analytics</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-600">✓</span>
                      </div>
                      <span>Flag suspicious patterns</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
                    <span>Continue as Professor</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Name Input */
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    selectedRole === 'student' 
                      ? 'from-indigo-500 to-violet-500' 
                      : 'from-violet-500 to-purple-500'
                  } rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    {selectedRole === 'student' ? (
                      <GraduationCap className="w-8 h-8 text-white" />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome, {selectedRole === 'student' ? 'Student' : 'Professor'}!
                  </h2>
                  <p className="text-gray-600">Please enter your name to continue</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                      placeholder={selectedRole === 'student' ? 'e.g., Alex Chen' : 'e.g., Dr. Sarah Mitchell'}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedRole(null);
                        setName('');
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={!name.trim()}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r ${
                        selectedRole === 'student'
                          ? 'from-indigo-600 to-violet-600'
                          : 'from-violet-600 to-purple-600'
                      } text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {!selectedRole && (
            <div className="mt-20 text-center animate-fade-in animation-delay-200">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Platform Features</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Code Analysis</h4>
                  <p className="text-sm text-gray-600">Intelligent analysis of your GitHub repositories</p>
                </div>
                <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-6 h-6 text-violet-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personalized Questions</h4>
                  <p className="text-sm text-gray-600">Questions tailored to your implementation</p>
                </div>
                <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Instant Feedback</h4>
                  <p className="text-sm text-gray-600">Real-time evaluation and guidance</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
