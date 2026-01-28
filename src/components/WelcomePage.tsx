import React, { useState } from 'react';
import { GraduationCap, Users, Code2, ArrowRight, Sparkles, Shield, Lock } from 'lucide-react';

interface WelcomePageProps {
  onLogin: (role: 'student' | 'professor', name: string, email: string) => void;
}

export default function WelcomePage({ onLogin }: WelcomePageProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual Tuke Auth
    setTimeout(() => {
      // Mock successful login
      const mockName = selectedRole === 'student' ? 'Alex Chen' : 'Dr. Sarah Mitchell';
      onLogin(selectedRole!, mockName, email);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5A712]/10 via-white to-[#D4951A]/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E5A712]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#D4951A]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-[#E5A712]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform">
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
              Operating Systems Platform
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">AI-Powered Oral Examinations</p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Technical University of Košice</span>
            </div>
          </div>

          {!selectedRole ? (
            /* Role Selection */
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto animate-fade-in">
              {/* Student Card */}
              <button
                onClick={() => setSelectedRole('student')}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#E5A712]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Student</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Take your programming assignment exams and classic oral examinations with AI guidance.
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3 text-left mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Code analysis & questions</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Theory examinations</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Instant AI feedback</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-[#E5A712] font-bold group-hover:gap-4 transition-all text-sm sm:text-base">
                    <span>Login as Student</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </button>

              {/* Professor Card */}
              <button
                onClick={() => setSelectedRole('professor')}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#E5A712]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E5A712]/10 to-[#D4951A]/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Professor</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Manage exams, create questions, and monitor student progress across lab groups.
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3 text-left mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Create custom questions</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Manage exam access</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E5A712]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#E5A712] font-bold">✓</span>
                      </div>
                      <span>Organize by lab groups</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-[#E5A712] font-bold group-hover:gap-4 transition-all text-sm sm:text-base">
                    <span>Login as Professor</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Login Form */
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    {selectedRole === 'student' ? (
                      <GraduationCap className="w-8 h-8 text-black" />
                    ) : (
                      <Users className="w-8 h-8 text-black" />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {selectedRole === 'student' ? 'Student' : 'Professor'} Login
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">Sign in with your university credentials</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      University Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={selectedRole === 'student' ? 'student@tuke.sk' : 'professor@tuke.sk'}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5A712] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedRole(null);
                        setEmail('');
                        setPassword('');
                        setError('');
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Protected by Tuke Auth • <a href="#" className="text-[#E5A712] hover:underline font-semibold">Need help?</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {!selectedRole && (
            <div className="mt-16 sm:mt-20 text-center animate-fade-in animation-delay-200">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#E5A712]" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Platform Features</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border-2 border-gray-200 hover:border-[#E5A712] transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">AI Code Analysis</h4>
                  <p className="text-sm text-gray-600">Intelligent analysis of your GitHub repositories</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border-2 border-gray-200 hover:border-[#E5A712] transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Personalized Questions</h4>
                  <p className="text-sm text-gray-600">Questions tailored to your implementation</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border-2 border-gray-200 hover:border-[#E5A712] transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Instant Feedback</h4>
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