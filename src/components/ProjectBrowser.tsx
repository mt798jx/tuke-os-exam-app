import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Github, Code2, FileText, Download, ExternalLink, GitBranch, Loader2, AlertCircle, Key, User, Eye, EyeOff, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: string;
  lastModified?: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface Project {
  id: string;
  name: string;
  displayName: string;
  type: 'ipc' | 'copymaster';
  repoUrl?: string;
  repoPath?: string;
  repoFolder?: string;
  lastSync?: string;
  branch?: string;
  status: 'not-configured' | 'cloning' | 'ready' | 'error';
  files?: FileNode[];
  errorMessage?: string;
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'student-ipc-assignment',
    displayName: 'IPC Assignment',
    type: 'ipc',
    status: 'not-configured'
  },
  {
    id: '2',
    name: 'student-copymaster',
    displayName: 'CopyMaster Assignment',
    type: 'copymaster',
    status: 'not-configured'
  }
];

type NavView = 'exams' | 'grades' | 'projects' | 'settings';

export default function ProjectBrowser({ onNavigate, activeView, focusType }: { onNavigate?: (view: NavView) => void, activeView?: NavView, focusType?: string | null } ) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project>(initialProjects[0]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'include']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [gitlabUrl, setGitlabUrl] = useState('');
  const [gitlabUsername, setGitlabUsername] = useState('');
  const [gitlabToken, setGitlabToken] = useState('');
  const [rememberCredentials, setRememberCredentials] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [urlError, setUrlError] = useState('');

  // derive current user id from auth (stored on login)
  const userId: number | undefined = (() => {
    try {
      const s = localStorage.getItem('user-id');
      const n = s ? parseInt(s, 10) : NaN;
      return Number.isFinite(n) ? n : undefined;
    } catch (e) {
      return undefined;
    }
  })();

  // Load credentials and discover repos whenever the Projects view becomes active
  useEffect(() => {
    let mounted = true;
    if (activeView !== 'projects' || !userId) return;
    (async () => {
      try {
        const { getCredentials, getTree, getRepos } = await import('../lib/gitlabApi');
        const creds = await getCredentials(userId);
        if (!mounted) return;
        if (creds && (creds.gitlab_username || creds.gitlab_token)) {
          setGitlabUsername(creds.gitlab_username ?? '');
          setGitlabToken(creds.gitlab_token ?? '');
          setRememberCredentials(Boolean(creds.gitlab_username && creds.gitlab_token));
        }
        // Discover repos on the server and map them to our initial projects.
        let newProjects = [...initialProjects];
        let firstReadySelected: Project | null = null;
        const repos = await getRepos(userId); // [{name, path}, ...]
        const checks = await Promise.all(repos.map(async (r: any) => {
          try {
            const tree = await getTree(r.name);
            if (tree && Array.isArray(tree) && tree.length > 0) {
              return { repo: r, files: tree };
            }
          } catch (err) {
            // ignore individual failures
          }
          return null;
        }));

        // Apply results to projects state by attempting to match repo names to initial projects
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const r of checks) {
          if (!r) continue;
          const repoName: string = String(r.repo.name);
          let matched = newProjects.find(p => p.name === repoName);
          if (!matched) matched = newProjects.find(p => repoName.includes(normalize(p.name)) || normalize(p.name).includes(repoName));
          if (!matched) matched = newProjects.find(p => repoName.includes(p.type));
          if (matched) {
            const repoPath = r.repo?.path ?? undefined;
            const repoFolder = repoPath ? String(repoPath).split('/').pop() : undefined;
            newProjects = newProjects.map(p => p.id === matched!.id ? { ...p, status: 'ready' as const, files: r.files, repoUrl: (r.repo?.repo_url ?? p.repoUrl), repoPath, repoFolder } : p);
            if (!firstReadySelected) firstReadySelected = newProjects.find(p => p.id === matched!.id)!;
          }
        }
        if (mounted) {
          setProjects(newProjects);
          if (firstReadySelected) {
            setSelectedProject(firstReadySelected);
            // auto-select first file
            const findFirstFile = (nodes: FileNode[]): FileNode | null => {
              for (const n of nodes) {
                if (n.type === 'file') return n;
                if (n.type === 'folder' && n.children) {
                  const found = findFirstFile(n.children);
                  if (found) return found;
                }
              }
              return null;
            };
            const first = findFirstFile(firstReadySelected.files ?? []);
            if (first) {
              setSelectedFile(first);
              const parts = first.path.split('/').slice(0, -1);
              const prefixes: string[] = [];
              for (let i = 0; i < parts.length; i++) prefixes.push(parts.slice(0, i + 1).join('/'));
              setExpandedFolders(new Set(prefixes.length ? prefixes : ['src', 'include']));
            }
          }
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [activeView]);

  // Listen for credential changes made in Settings and update local state immediately
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const detail = ce?.detail || {};
      setGitlabUsername(detail.gitlab_username ?? '');
      setGitlabToken(detail.gitlab_token ?? '');
      setRememberCredentials(Boolean(detail.gitlab_username && detail.gitlab_token));
    };
    window.addEventListener('gitlabCredentialsChanged', handler as EventListener);
    return () => {
      window.removeEventListener('gitlabCredentialsChanged', handler as EventListener);
    };
  }, []);

  // If parent requests focus on a specific project type/id, select it
  useEffect(() => {
    if (!focusType) return;
    // try find by type or id
    const found = projects.find(p => p.type === focusType || p.id === focusType || p.displayName === focusType || p.name === focusType);
    if (found) {
      setSelectedProject(found);
      setSelectedFile(null);
      setExpandedFolders(new Set(['src', 'include']));
    }
  }, [focusType]);

  const validateGitLabUrl = (url: string): boolean => {
    // Check if URL is a valid GitLab URL
    const gitlabPattern = /^https?:\/\/(gitlab\.com|git\.kpi\.fei\.tuke\.sk|git\.tuke\.sk)\/.+\/.+\.git$/i;
    return gitlabPattern.test(url) || url.includes('gitlab.com') || url.includes('git.kpi.fei.tuke.sk') || url.includes('git.tuke.sk');
  };

  const handleCloneProject = async () => {
    setUrlError('');
    
    if (!gitlabUrl.trim()) {
      setUrlError('Prosím zadajte GitLab URL');
      return;
    }

    if (!gitlabUsername.trim()) {
      setUrlError('Prosím zadajte GitLab používateľské meno');
      return;
    }

    if (!gitlabToken.trim()) {
      setUrlError('Prosím zadajte GitLab Personal Access Token');
      return;
    }

    if (!validateGitLabUrl(gitlabUrl)) {
      setUrlError('Neplatná GitLab URL. Použite formát: https://git.kpi.fei.tuke.sk/username/repo.git');
      return;
    }

    // Save credentials to backend if checkbox is checked
      try {
        const gitlabApi = (await import('../lib/gitlabApi')).default;
        if (rememberCredentials && userId) {
          await gitlabApi.saveCredentials(userId, gitlabUsername, gitlabToken);
        }

      // mark project cloning
      const updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? { ...p, status: 'cloning' as const, repoUrl: gitlabUrl } : p
      );
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id)!);

      // call backend to clone
      const res = await gitlabApi.cloneRepo(gitlabUrl, rememberCredentials ? undefined : gitlabUsername, rememberCredentials ? undefined : gitlabToken, userId);

      const clonedFiles: FileNode[] = res.files ?? [];

      const finalProjects = projects.map(p =>
        p.id === selectedProject.id
          ? {
              ...p,
              status: 'ready' as const,
              repoUrl: res.repo_url ?? gitlabUrl,
              lastSync: res.lastSync ?? new Date().toISOString(),
              branch: res.branch ?? 'main',
              files: clonedFiles,
              repoPath: `${userId ?? 'unknown'}/${res.repo_name}`,
              repoFolder: res.repo_name,
            }
          : p
      );
      setProjects(finalProjects);

      const finalSelected = finalProjects.find(p => p.id === selectedProject.id)!;
      setSelectedProject(finalSelected);
      setGitlabUrl('');

      // If we have files returned, expand folders and auto-select the first file for preview
      const findFirstFile = (nodes: FileNode[]): FileNode | null => {
        for (const n of nodes) {
          if (n.type === 'file') return n;
          if (n.type === 'folder' && n.children) {
            const found = findFirstFile(n.children);
            if (found) return found;
          }
        }
        return null;
      };

      const first = findFirstFile(clonedFiles);
      if (first) {
        setSelectedFile(first);
        // build expanded folder set from file path prefixes
        const parts = first.path.split('/').slice(0, -1); // exclude filename
        const prefixes: string[] = [];
        for (let i = 0; i < parts.length; i++) {
          prefixes.push(parts.slice(0, i + 1).join('/'));
        }
        setExpandedFolders(new Set(prefixes.length ? prefixes : ['src', 'include']));
      } else {
        setExpandedFolders(new Set(['src', 'include']));
        setSelectedFile(null);
      }
    } catch (e: any) {
      // mark error
      const finalProjects = projects.map(p =>
        p.id === selectedProject.id ? { ...p, status: 'error' as const, errorMessage: e?.message ?? String(e) } : p
      );
      setProjects(finalProjects);
      setSelectedProject(finalProjects.find(p => p.id === selectedProject.id)!);
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-all ${
            selectedFile?.path === node.path ? 'bg-[#E5A712]/10 border-l-4 border-[#E5A712]' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              setSelectedFile(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.path) ? (
                <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
              <Folder className="w-4 h-4 text-[#E5A712] flex-shrink-0" />
            </>
          ) : (
            <>
              <File className="w-4 h-4 text-gray-400 ml-5 flex-shrink-0" />
            </>
          )}
          <span className={`text-sm flex-1 min-w-0 truncate ${node.type === 'folder' ? 'font-semibold' : ''}`}>
            {node.name}
          </span>
          {node.size && (
            <span className="text-xs text-gray-400 flex-shrink-0">{node.size}</span>
          )}
        </div>
        {node.type === 'folder' && expandedFolders.has(node.path) && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Vaše Projekty 📁</h2>
        <p className="text-base sm:text-lg text-gray-600">Spravujte GitLab repozitáre pre programovacie úlohy</p>
      </div>

      {/* Project Selector */}
      <div className="flex flex-wrap gap-3">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              setSelectedFile(null);
              setGitlabUrl('');
              setUrlError('');
            }}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base relative ${
              selectedProject.id === project.id
                ? 'bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#E5A712]'
            }`}
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{project.displayName}</span>
              {project.status === 'ready' && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
              {project.status === 'cloning' && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Not Configured State */}
      {selectedProject.status === 'not-configured' && (() => {
        // Credentials are loaded into component state from backend on mount
        const savedUsername = gitlabUsername || '';
        const savedToken = gitlabToken || '';
        const hasCredentials = Boolean(savedUsername && savedToken);

        return (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {selectedProject.displayName}
                  </h3>
                  <p className="text-gray-600">
                    Zadajte GitLab URL vášho repozitára pre túto programovaciu úlohu
                  </p>
                </div>
              </div>

              {hasCredentials && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-green-900 mb-1">GitLab prihlasovacie údaje sú uložené</p>
                      <p className="text-sm text-green-800">
                        Používateľ: <strong>{savedUsername}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (onNavigate) return onNavigate('settings');
                        window.location.hash = '#settings';
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-green-700 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-all font-semibold text-xs"
                    >
                      <SettingsIcon className="w-3 h-3" />
                      Zmeniť
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="gitlab-url" className="block text-sm font-bold text-gray-700 mb-2">
                    GitLab Repository URL
                  </label>
                  <input
                    id="gitlab-url"
                    type="text"
                    value={gitlabUrl}
                    onChange={(e) => {
                      setGitlabUrl(e.target.value);
                      setUrlError('');
                    }}
                    placeholder="https://git.kpi.fei.tuke.sk/os-zadania/2023/...repository.git"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E5A712] font-mono text-sm"
                  />
                  {urlError && (
                    <div className="flex items-start gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{urlError}</span>
                    </div>
                  )}
                </div>

                {!hasCredentials && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <label htmlFor="gitlab-username" className="block text-sm font-bold text-gray-700">
                          GitLab Používateľské meno
                        </label>
                      </div>
                      <input
                        id="gitlab-username"
                        type="text"
                        value={gitlabUsername}
                        onChange={(e) => setGitlabUsername(e.target.value)}
                        placeholder="Váš GitLab používateľské meno"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E5A712] font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
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

                    <div className="flex items-center gap-2">
                      <input
                        id="remember-credentials"
                        type="checkbox"
                        checked={rememberCredentials}
                        onChange={(e) => setRememberCredentials(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#E5A712] focus:ring-[#E5A712]"
                      />
                      <label htmlFor="remember-credentials" className="text-sm text-gray-700">
                        Zapamätať si prihlasovacie údaje
                      </label>
                    </div>
                  </>
                )}

                <button
                  onClick={handleCloneProject}
                  disabled={!gitlabUrl.trim() || (!hasCredentials && (!gitlabUsername.trim() || !gitlabToken.trim()))}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black rounded-xl font-bold hover:from-[#D4951A] hover:to-[#C4851A] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Klonuj Projekt
                </button>

                {!hasCredentials && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-blue-900">
                        <p className="font-bold mb-2">Ako získať prihlasovacie údaje:</p>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <p className="font-semibold mb-1">📋 Repository URL:</p>
                            <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                              <li>Otvorte váš projekt na GitLab</li>
                              <li>Kliknite na tlačidlo "Clone"</li>
                              <li>Skopírujte HTTPS URL</li>
                            </ol>
                          </div>

                          <div>
                            <p className="font-semibold mb-1">👤 Používateľské meno:</p>
                            <p className="ml-1 sm:ml-2 text-xs sm:text-sm">Vaše GitLab meno (bez @tuke.sk)</p>
                          </div>

                          <div>
                            <p className="font-semibold mb-1">🔑 Personal Access Token:</p>
                            <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm">
                              <li>GitLab → <strong>User Settings</strong></li>
                              <li>Menu → <strong>Access Tokens</strong></li>
                              <li className="break-words">
                                <strong>Scopes:</strong> iba ✅ <strong>read_repository</strong>
                              </li>
                              <li className="break-words">⚠️ Skopírujte token hneď!</li>
                            </ol>
                          </div>
                        </div>

                        <div className="mt-2 sm:mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                          <p className="text-xs text-amber-900">
                            <strong>Tip:</strong> Uložte údaje v <strong>Settings</strong> pre jednoduchšie použitie.
                          </p>
                        </div>

                        <p className="mt-2 sm:mt-3 text-xs text-gray-600 break-words">
                          Servery: <strong>gitlab.com</strong>, <strong>git.kpi.fei.tuke.sk</strong>, <strong>git.tuke.sk</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Cloning State */}
      {selectedProject.status === 'cloning' && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-black animate-spin" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Klonovanie projektu...
            </h3>
            <p className="text-gray-600 mb-2">
              Sťahujem súbory z GitLab repozitára
            </p>
            <p className="text-sm text-gray-500 font-mono">
              {selectedProject.repoUrl}
            </p>
            <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#E5A712] to-[#D4951A] h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Ready State - Show File Browser */}
      {selectedProject.status === 'ready' && selectedProject.files && (
        <>
          {/* Project Info */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{selectedProject.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Branch: {selectedProject.branch}
                    </span>
                    <span>•</span>
                    <span>Posledná sync: {selectedProject.lastSync}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Otvoriť na GitLab</span>
                  <span className="sm:hidden">GitLab</span>
                </a>
                <button
                  onClick={async () => {
                    // attempt to delete repo on server
                    try {
                      const { deleteRepo } = await import('../lib/gitlabApi');
                      const repoNameToDelete = selectedProject.repoFolder ?? (selectedProject.repoPath ? String(selectedProject.repoPath).split('/').pop() : selectedProject.name);
                       if (userId) {
                        await deleteRepo(userId, repoNameToDelete ?? selectedProject.name);
                      } else {
                        console.warn('No user id available, skipping server-side delete');
                      }
                    } catch (err: any) {
                      // show error briefly (for now, console)
                      console.error('Failed to delete repo', err);
                      // still continue to remove from UI
                    }

                    const updatedProjects = projects.map(p => 
                      p.id === selectedProject.id 
                        ? { ...p, status: 'not-configured' as const, repoUrl: undefined, files: undefined, lastSync: undefined, branch: undefined }
                        : p
                    );
                    setProjects(updatedProjects);
                    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id)!);
                    setSelectedFile(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold text-sm whitespace-nowrap"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Odstrániť</span>
                </button>
              </div>
            </div>
          </div>

          {/* File Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* File Tree */}
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b-2 border-gray-200">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-[#E5A712]" />
                  <span>Súbory</span>
                </h4>
              </div>
              <div className="p-2 max-h-96 sm:max-h-[600px] overflow-y-auto">
                {renderFileTree(selectedProject.files)}
              </div>
            </div>

            {/* File Preview */}
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b-2 border-gray-200">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#E5A712]" />
                  <span className="truncate">{selectedFile ? selectedFile.name : 'Vyberte súbor'}</span>
                </h4>
              </div>
              <div className="p-4 max-h-96 sm:max-h-[600px] overflow-y-auto">
                {selectedFile ? (
                  <>
                    {/* File Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Veľkosť:</span>
                        <span>{selectedFile.size || 'N/A'}</span>
                      </div>
                      {selectedFile.lastModified && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-semibold">Upravené:</span>
                            <span>{selectedFile.lastModified}</span>
                          </div>
                        </>
                      )}
                      {selectedFile.language && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-semibold">Jazyk:</span>
                            <span className="uppercase">{selectedFile.language}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* File Content */}
                    {selectedFile.content ? (
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100 font-mono">
                          <code>{selectedFile.content}</code>
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <File className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Náhľad súboru nie je dostupný</p>
                        <p className="text-sm mt-1">Tento súbor nebol ešte načítaný</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 sm:py-20 text-gray-500">
                    <File className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-base sm:text-lg">Vyberte súbor pre náhľad</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {selectedProject.files.reduce((acc, node) => {
                  const countFiles = (n: FileNode): number => {
                    if (n.type === 'file') return 1;
                    return (n.children || []).reduce((sum, child) => sum + countFiles(child), 0);
                  };
                  return acc + countFiles(node);
                }, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">Súbory</div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {selectedProject.files.filter(n => n.type === 'folder').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">Priečinky</div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">C</div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">Jazyk</div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#E5A712] mb-1">✓</div>
              <div className="text-xs sm:text-sm text-gray-600 font-semibold">Synchronizované</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}