import React, { useState, useEffect } from 'react';
import { Key, User, Eye, EyeOff, Save, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import gitlabApi from '../lib/gitlabApi';

export default function GitLabSettings() {
  const [gitlabUsername, setGitlabUsername] = useState('');
  const [gitlabToken, setGitlabToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // TODO: replace this with the real current user id from auth context
  const USER_ID = 1;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const creds = await gitlabApi.getCredentials(USER_ID);
        if (!mounted) return;
        if (creds && (creds.gitlab_username || creds.gitlab_token)) {
          setGitlabUsername(creds.gitlab_username ?? '');
          setGitlabToken(creds.gitlab_token ?? '');
          setIsSaved(Boolean(creds.gitlab_username && creds.gitlab_token));
        }
      } catch (e) {
        // ignore errors for now
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    if (!gitlabUsername.trim() || !gitlabToken.trim()) {
      setSaveMessage('Prosím vyplňte všetky polia');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    try {
      await gitlabApi.saveCredentials(USER_ID, gitlabUsername, gitlabToken);
      setIsSaved(true);
      setSaveMessage('Prihlasovacie údaje boli úspešne uložené');
    } catch (e) {
      setSaveMessage('Uloženie zlyhalo');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleClear = async () => {
    try {
      await gitlabApi.deleteCredentials(USER_ID);
      setGitlabUsername('');
      setGitlabToken('');
      setIsSaved(false);
      setSaveMessage('Prihlasovacie údaje boli odstránené');
    } catch (e) {
      setSaveMessage('Vymazanie zlyhalo');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">GitLab Nastavenia ⚙️</h2>
        <p className="text-base sm:text-lg text-gray-600">Spravujte svoje GitLab prihlasovacie údaje pre klonovanie projektov</p>
      </div>

      {/* Main Card */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                GitLab Prihlasovacie Údaje
              </h3>
              <p className="text-gray-600">
                Tieto údaje budú použité na autentifikáciu pri klonovaní vašich projektov z GitLab repozitárov.
              </p>
            </div>
          </div>

          {/* Status Message */}
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg border-2 flex items-center gap-3 ${
              saveMessage.includes('úspešne') 
                ? 'bg-green-50 border-green-300 text-green-900' 
                : saveMessage.includes('odstránené')
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              {saveMessage.includes('úspešne') && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {saveMessage.includes('odstránené') && <AlertCircle className="w-5 h-5 text-blue-600" />}
              {!saveMessage.includes('úspešne') && !saveMessage.includes('odstránené') && <AlertCircle className="w-5 h-5 text-red-600" />}
              <span className="font-semibold">{saveMessage}</span>
            </div>
          )}

          {/* Current Status */}
          {isSaved && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-900 mb-1">Prihlasovacie údaje sú uložené</p>
                  <p className="text-sm text-green-800">
                    Pri klonovaní projektov nebudete musieť znova vyplňovať tieto údaje.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <label htmlFor="gitlab-username" className="block text-sm font-bold text-gray-700">
                  GitLab Používateľské meno
                </label>
              </div>
              <input
                id="gitlab-username"
                type="text"
                value={gitlabUsername}
                onChange={(e) => setGitlabUsername(e.target.value)}
                placeholder="Vaše GitLab používateľské meno (bez @tuke.sk)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E5A712] font-mono text-sm"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-gray-600" />
                <label htmlFor="gitlab-token" className="block text-sm font-bold text-gray-700">
                  GitLab Personal Access Token
                </label>
              </div>
              <div className="relative">
                <input
                  id="gitlab-token"
                  type={showToken ? 'text' : 'password'}
                  value={gitlabToken}
                  onChange={(e) => setGitlabToken(e.target.value)}
                  placeholder="Váš GitLab Personal Access Token"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E5A712] font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:from-[#D4951A] hover:to-[#C4851A] transition-all shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                Uložiť údaje
              </button>
              {isSaved && (
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                  Odstrániť údaje
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-900">
            <p className="font-bold mb-2">Ako vytvoriť Personal Access Token:</p>
            
            <ol className="list-decimal list-inside space-y-1 sm:space-y-2 ml-1 sm:ml-2">
              <li>Otvorte GitLab a prihláste sa</li>
              <li className="break-words">
                Kliknite na vašu profilovú ikonku → <strong>User Settings</strong>
              </li>
              <li>V ľavom menu vyberte <strong>Access Tokens</strong></li>
              <li className="break-words">Vyplňte formulár:
                <ul className="list-disc list-inside ml-2 sm:ml-4 mt-1 space-y-1">
                  <li><strong>Token name:</strong> OS Platform</li>
                  <li className="break-words"><strong>Expiration:</strong> koniec semestra</li>
                  <li className="break-words"><strong>Scopes:</strong> iba ✅ <strong>read_repository</strong></li>
                </ul>
              </li>
              <li className="break-words">Kliknite <strong>Create personal access token</strong></li>
              <li className="break-words">⚠️ <strong>Dôležité:</strong> Okamžite skopírujte token!</li>
            </ol>

            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-xs text-amber-900">
                <strong>Bezpečnosť:</strong> Token je uložený len v prehliadači. Nikdy ho nezdieľajte.
              </p>
            </div>

            <p className="mt-2 sm:mt-3 text-xs text-gray-700 break-words">
              <strong>Servery:</strong> gitlab.com, git.kpi.fei.tuke.sk, git.tuke.sk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}