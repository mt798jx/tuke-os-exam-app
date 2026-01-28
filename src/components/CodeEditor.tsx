import React from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
}

export default function CodeEditor({ code, language }: CodeEditorProps) {
  // Simple syntax highlighting for C code
  const highlightCode = (code: string) => {
    const lines = code.split('\n');
    
    return lines.map((line, index) => {
      let highlightedLine = line;
      
      // Comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={index} className="code-line">
            <span className="line-number">{index + 1}</span>
            <span className="text-gray-500 italic">{line}</span>
          </div>
        );
      }
      
      // Preprocessor directives
      if (line.trim().startsWith('#')) {
        return (
          <div key={index} className="code-line">
            <span className="line-number">{index + 1}</span>
            <span className="text-purple-600">{line}</span>
          </div>
        );
      }
      
      // Keywords
      const keywords = ['int', 'void', 'char', 'return', 'if', 'const', 'static'];
      let processedLine = line;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        processedLine = processedLine.replace(
          regex,
          `<span class="text-blue-600 font-medium">${keyword}</span>`
        );
      });
      
      // Function names (simple pattern)
      processedLine = processedLine.replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
        '<span class="text-amber-600">$1</span>('
      );
      
      // Strings
      processedLine = processedLine.replace(
        /"([^"]*)"/g,
        '<span class="text-green-600">"$1"</span>'
      );
      
      return (
        <div key={index} className="code-line">
          <span className="line-number">{index + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
        </div>
      );
    });
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <pre className="p-4 text-sm font-mono leading-relaxed">
        <code>{highlightCode(code)}</code>
      </pre>
      <style>{`
        .code-line {
          display: flex;
          gap: 1rem;
        }
        .code-line:hover {
          background-color: rgba(229, 231, 235, 0.5);
        }
        .line-number {
          display: inline-block;
          width: 3rem;
          text-align: right;
          color: #9ca3af;
          user-select: none;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
