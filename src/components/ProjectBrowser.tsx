import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Github, Code2, FileText, Download, ExternalLink } from 'lucide-react';

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
  repoUrl: string;
  lastSync: string;
  branch: string;
  files: FileNode[];
}

const projects: Project[] = [
  {
    id: '1',
    name: 'student-ipc-assignment',
    repoUrl: 'https://github.com/alexchen/student-ipc-assignment',
    lastSync: '2024-01-20 14:32',
    branch: 'main',
    files: [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        children: [
          {
            name: 'main.c',
            type: 'file',
            path: 'src/main.c',
            size: '2.4 KB',
            lastModified: '2024-01-18',
            language: 'c',
            content: `#include <stdio.h>\n#include "ipc.h"\n\nint main(int argc, char *argv[]) {\n    printf("IPC Assignment - Main\\n");\n    \n    // Initialize IPC mechanisms\n    init_shared_memory();\n    init_message_queue();\n    \n    return 0;\n}`
          },
          {
            name: 'shared_memory.c',
            type: 'file',
            path: 'src/shared_memory.c',
            size: '3.8 KB',
            lastModified: '2024-01-19',
            language: 'c',
            content: `#include <sys/ipc.h>\n#include <sys/shm.h>\n#include "ipc.h"\n\n#define SHM_SIZE 1024\n\nint init_shared_memory() {\n    key_t key = ftok("shmfile", 65);\n    int shmid = shmget(key, SHM_SIZE, 0666|IPC_CREAT);\n    return shmid;\n}`
          },
          {
            name: 'message_queue.c',
            type: 'file',
            path: 'src/message_queue.c',
            size: '2.1 KB',
            lastModified: '2024-01-17',
            language: 'c'
          },
          {
            name: 'semaphore.c',
            type: 'file',
            path: 'src/semaphore.c',
            size: '1.9 KB',
            lastModified: '2024-01-16',
            language: 'c'
          }
        ]
      },
      {
        name: 'include',
        type: 'folder',
        path: 'include',
        children: [
          {
            name: 'ipc.h',
            type: 'file',
            path: 'include/ipc.h',
            size: '0.8 KB',
            lastModified: '2024-01-15',
            language: 'c',
            content: `#ifndef IPC_H\n#define IPC_H\n\nint init_shared_memory();\nint init_message_queue();\nvoid cleanup_ipc();\n\n#endif`
          }
        ]
      },
      {
        name: 'Makefile',
        type: 'file',
        path: 'Makefile',
        size: '0.5 KB',
        lastModified: '2024-01-14',
        content: `CC=gcc\nCFLAGS=-Wall -Wextra\n\nall: ipc_main\n\nipc_main: src/*.c\n\t$(CC) $(CFLAGS) -o ipc_main src/*.c`
      },
      {
        name: 'README.md',
        type: 'file',
        path: 'README.md',
        size: '1.2 KB',
        lastModified: '2024-01-13',
        content: `# IPC Programming Assignment\n\nImplementation of Inter-Process Communication mechanisms.\n\n## Features\n- Shared Memory\n- Message Queues\n- Semaphores`
      }
    ]
  },
  {
    id: '2',
    name: 'student-copymaster',
    repoUrl: 'https://github.com/alexchen/student-copymaster',
    lastSync: '2024-01-19 09:15',
    branch: 'main',
    files: [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        children: [
          {
            name: 'copy.c',
            type: 'file',
            path: 'src/copy.c',
            size: '4.2 KB',
            lastModified: '2024-01-18',
            language: 'c'
          },
          {
            name: 'main.c',
            type: 'file',
            path: 'src/main.c',
            size: '1.5 KB',
            lastModified: '2024-01-17',
            language: 'c'
          }
        ]
      },
      {
        name: 'README.md',
        type: 'file',
        path: 'README.md',
        size: '0.9 KB',
        lastModified: '2024-01-15'
      }
    ]
  }
];

export default function ProjectBrowser() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'include']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Projects 📁</h2>
        <p className="text-base sm:text-lg text-gray-600">Browse your GitHub repositories synced for exams</p>
      </div>

      {/* Project Selector */}
      <div className="flex flex-wrap gap-3">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              setSelectedFile(null);
            }}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
              selectedProject.id === project.id
                ? 'bg-gradient-to-r from-[#E5A712] to-[#D4951A] text-black shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#E5A712]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{project.name}</span>
              <span className="sm:hidden">{project.name.split('-')[1]}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Project Info */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E5A712] to-[#D4951A] rounded-xl flex items-center justify-center flex-shrink-0">
              <Github className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{selectedProject.name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Branch: {selectedProject.branch}
                </span>
                <span>•</span>
                <span>Last sync: {selectedProject.lastSync}</span>
              </div>
            </div>
          </div>
          <a
            href={selectedProject.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open on GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>
      </div>

      {/* File Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* File Tree */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b-2 border-gray-200">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#E5A712]" />
              <span>Files</span>
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
              <span className="truncate">{selectedFile ? selectedFile.name : 'Select a file'}</span>
            </h4>
          </div>
          <div className="p-4 max-h-96 sm:max-h-[600px] overflow-y-auto">
            {selectedFile ? (
              <>
                {/* File Info */}
                <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">Size:</span>
                    <span>{selectedFile.size || 'N/A'}</span>
                  </div>
                  {selectedFile.lastModified && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Modified:</span>
                        <span>{selectedFile.lastModified}</span>
                      </div>
                    </>
                  )}
                  {selectedFile.language && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Language:</span>
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
                    <p>File preview not available</p>
                    <p className="text-sm mt-1">This file hasn't been fetched yet</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 sm:py-20 text-gray-500">
                <File className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-base sm:text-lg">Select a file to preview its contents</p>
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
          <div className="text-xs sm:text-sm text-gray-600 font-semibold">Files</div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {selectedProject.files.filter(n => n.type === 'folder').length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-semibold">Folders</div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">C</div>
          <div className="text-xs sm:text-sm text-gray-600 font-semibold">Language</div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#E5A712] mb-1">✓</div>
          <div className="text-xs sm:text-sm text-gray-600 font-semibold">Synced</div>
        </div>
      </div>
    </div>
  );
}
