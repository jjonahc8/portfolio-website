'use client'

import { useRef, useEffect } from 'react'

interface InfoTerminalProps {
  isVisible: boolean
  onClose: () => void
}

export default function InfoTerminal({ isVisible, onClose }: InfoTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus handling when terminal becomes visible
  useEffect(() => {
    if (isVisible && terminalRef.current) {
      terminalRef.current.focus()
    }
  }, [isVisible])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-[#fefbf8] z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl mx-auto"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div 
          className="bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden"
          style={{
            border: '1px solid var(--terminal-border)',
          }}
        >
          {/* Terminal Header */}
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27ca3f]"></div>
              <span 
                className="ml-4 text-sm text-gray-400 font-mono cursor-pointer hover:text-[#d4a27f] transition-colors"
              >
                jonah@portfolio:~/simple-view
              </span>
            </div>
            
            {/* Close Button and Social Links */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                ✕
              </button>
              <a 
                href="mailto:jjonah.c@berkeley.edu"
                className="text-gray-400 hover:text-[#d4a27f] transition-colors"
                title="Email"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/jonah-clemente/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#d4a27f] transition-colors"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                </svg>
              </a>
              
              <a 
                href="https://github.com/jjonahc8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#d4a27f] transition-colors"
                title="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="p-6 font-mono text-sm min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d4a27f] scrollbar-track-[#2d2d2d] hover:scrollbar-thumb-[#e6b894] relative"
          >
            <div className="space-y-6">
              {/* About Section */}
              <div>
                <div className="text-[#87ceeb] font-bold mb-2">$ cat about-me.txt</div>                 
                <div className="text-[#e5e5e5] leading-relaxed mb-4">                   
                  hello! 👋 my name is jonah clemente, and i&apos;m an undergrad at uc berkeley, originally from los angeles. in my free time i play counterstrike, run/lift weights, and make sourdough.                   
                  <br /><br />                   
                  feel free to explore my projects and experiences using the terminal commands, and enjoy your stay :)                 
                </div>               
              </div>
              
              {/* Projects Section */}
              <div>
                <div className="text-[#87ceeb] font-bold mb-2">$ ls projects/</div>
                <div className="text-[#d4a27f] mb-3">spot.md  pintos.md  secure-file-sharing.md  web-portfolio.md</div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-[#87ceeb] font-bold mb-1">$ cat projects/spot.md | spot, mongodb, react, tailwindcss, flask</div>
                    <div className="text-sm ml-2">
                      <div className="text-[#e5e5e5]">• built full-stack parking marketplace with flask rest api and mongodb</div>
                      <div className="text-[#e5e5e5] mt-1">• developed responsive react frontend with authentication and interactive maps</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[#87ceeb] font-bold mb-1">$ cat projects/pintos.md | pintos, c, x86</div>
                    <div className="text-sm ml-2">
                      <div className="text-[#e5e5e5]">• implemented essential os system calls for process control, file operations, and subdirectories</div>
                      <div className="text-[#e5e5e5] mt-1">• developed posix thread library mapping user/kernel threads with alarm clock and strict priority scheduler</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[#87ceeb] font-bold mb-1">$ cat projects/secure-file-sharing.md | golang </div>
                    <div className="text-sm ml-2">
                      <div className="text-[#e5e5e5]">• architected end-to-end encrypted file storage system with zero-knowledge architecture, 95% security test success rate</div>
                      <div className="text-[#e5e5e5] mt-1">• implemented aes-256 encryption, hmac authentication, and rsa key exchange for secure multi-user file sharing</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[#87ceeb] font-bold mb-1">$ cat projects/web-portfolio.md</div>
                    <div className="text-sm ml-2">
                      <div className="text-[#e5e5e5]">• built with next.js, typescript, and tailwindcss</div>
                      <div className="text-[#e5e5e5] mt-1">• features interactive terminal interface</div>
    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}