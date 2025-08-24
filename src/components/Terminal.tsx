'use client'

import { useState, useEffect, useRef } from 'react'
import InfoTerminal from './InfoTerminal'

interface FileSystem {
  [key: string]: string | FileSystem
}

const fileSystem: FileSystem = {
  'about-me.txt': `hello! 👋 my name is jonah clemente, and i'm an undergrad at uc berkeley, originally from los angeles. in my free time i play counterstrike, run/lift weights, and make sourdough.

feel free to explore my projects and experiences using the terminal commands, and enjoy your stay :)`,
  
  projects: {
    'spot.md': `# spot | mongoDB, react, tailwindCSS, flask
• built full-stack parking marketplace with flask rest api and mongodb, with location based search functionality.
• developed responsive react frontend with authentication and interactive maps.`,
    
    'pintos.md': `# pintOS | c, x86, gdb
• implemented essential os system calls for process control, file operations, and subdirectories
• developed posix thread library mapping user/kernel threads with alarm clock and
  strict priority scheduler`,
    
    'secure-file-sharing.md': `# secure file sharing system | golang, cryptography
• architected end-to-end encrypted file storage system with zero-knowledge architecture, 
  and 95% security test success rate.
• implemented aes-256 encryption, hmac authentication, and rsa key exchange for secure
  multi-user file sharing`,
    
    'web-portfolio.md': `# personal portfolio website | next.js, typeScript, tailwindCSS
• built with next.js, typescript, and tailwindcss
• features interactive terminal interface`
  }
}

export default function Terminal() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentLoadingLine, setCurrentLoadingLine] = useState(0)
  const [loadingText, setLoadingText] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [previousPath, setPreviousPath] = useState<string[]>([])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showInfoTerminal, setShowInfoTerminal] = useState(false)

  const loadingLines = [
    "Welcome to my personal website 🎉!",
    "",
    "$ whoami",
    "jon4h@portfolio:~$ computer science undergrad @ uc berkeley",
    "",
    "loading projects and experiences...",
    "",
    "terminal ready 🚀! type 'help' for available commands or click the '?' for a simple view."
  ]

  const getCurrentDirectory = (): FileSystem => {
    let current = fileSystem
    for (const path of currentPath) {
      current = current[path] as FileSystem
    }
    return current
  }

  const executeCommand = (cmd: string) => {
    const args = cmd.trim().split(' ')
    const command = args[0].toLowerCase()
    const pathStr = currentPath.length > 0 ? `/${currentPath.join('/')}` : ''
    
    // Clear terminal before each command
    setHistory([`jon4h@portfolio:~${pathStr}$ ${cmd}`])

    switch (command) {
      case 'more-help':
        setHistory(prev => [...prev, 
          "terminal commands:",
          "  ls                  - list files and directories", 
          "  cat <file>          - display file contents",
          "  cd <dir>            - change directory (supports ~, home, .., -)", 
          "  clear               - clear terminal",
          "  cat about-me.txt    - learn more about me",
          ""
        ])
        break
      case 'help':
        setHistory(prev => [...prev,
          "cat about-me.txt    - to learn more about me",
          "cd projects         - navigate to projects directory",
          "more-help           - terminal commands",
          ""
        ])
        break

      case 'ls':
        const current = getCurrentDirectory()
        const items = Object.keys(current).map(item => {
          const isDir = typeof current[item] === 'object'
          return isDir ? `${item}/` : item
        })
        setHistory(prev => [...prev, items.join('  '), ""])
        break

      case 'cat':
        if (args.length < 2) {
          setHistory(prev => [...prev, "cat: missing file argument", ""])
        } else {
          const filename = args[1]
          const current = getCurrentDirectory()
          if (current[filename] && typeof current[filename] === 'string') {
            setHistory(prev => [...prev, current[filename] as string, ""])
          } else {
            setHistory(prev => [...prev, `cat: ${filename}: No such file`, ""])
          }
        }
        break

      case 'cd':
        if (args.length < 2 || args[1] === '~' || args[1] === 'home') {
          setPreviousPath(currentPath)
          setCurrentPath([])
        } else if (args[1] === '..') {
          setPreviousPath(currentPath)
          setCurrentPath(prev => prev.slice(0, -1))
        } else if (args[1] === '-') {
          const temp = currentPath
          setCurrentPath(previousPath)
          setPreviousPath(temp)
        } else {
          const dirname = args[1]
          const current = getCurrentDirectory()
          if (current[dirname] && typeof current[dirname] === 'object') {
            setPreviousPath(currentPath)
            setCurrentPath(prev => [...prev, dirname])
          } else {
            setHistory(prev => [...prev, `cd: ${dirname}: No such directory`, ""])
          }
        }
        break

      case 'pwd':
        const pwd = currentPath.length > 0 ? `/${currentPath.join('/')}` : '/'
        setHistory(prev => [...prev, pwd, ""])
        break

      case 'clear':
        setHistory([])
        break

      case 'whoami':
        setHistory(prev => [...prev, "kumasta! my name is jonah clemente, and i'm a computer science undergrad at uc berkeley, originally from los angeles. in my free time i play csgo, watch anime, and listen to music.", ""])
        break

      case '':
        setHistory(prev => [...prev, ""])
        break

      default:
        setHistory(prev => [...prev, `${command}: command not found`, ""])
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    }
  }

  // Loading animation effect
  useEffect(() => {
    if (isLoading && currentLoadingLine < loadingLines.length) {
      const timer = setTimeout(() => {
        setLoadingText(prev => [...prev, loadingLines[currentLoadingLine]])
        setCurrentLoadingLine(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (isLoading && currentLoadingLine >= loadingLines.length) {
      // Loading complete, transition to interactive terminal
      const timer = setTimeout(() => {
        setIsLoading(false)
        setHistory(loadingText)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentLoadingLine, isLoading, loadingLines, loadingText])

  // Focus input when terminal becomes interactive
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const pathStr = currentPath.length > 0 ? `/${currentPath.join('/')}` : ''

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div 
        className="bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden"
        style={{
          border: '1px solid var(--terminal-border)',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27ca3f]"></div>
            <span 
              className="ml-4 text-sm text-gray-400 font-mono cursor-pointer hover:text-[#d4a27f] transition-colors"
              onClick={() => window.location.reload()}
            >
              jon4h@portfolio:~{pathStr}
            </span>
          </div>
          
          {/* Question Mark and Social Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInfoTerminal(!showInfoTerminal)}
              className="text-gray-400 hover:text-[#d4a27f] transition-colors text-lg font-bold"
              title="Toggle info terminal"
            >
              ?
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
        <div className="p-6 font-mono text-sm min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d4a27f] scrollbar-track-[#2d2d2d] hover:scrollbar-thumb-[#e6b894]">
          {/* Loading Phase */}
          {isLoading && (
            <>
              {loadingText.map((line, index) => (
                <div 
                  key={index} 
                  className={`mb-1 ${
                    line.startsWith('$') 
                      ? 'text-[#d4a27f] font-semibold' 
                      : line.includes('jon4h@portfolio:~$')
                      ? 'text-[#87ceeb]'
                      : line.includes('🚀') || line.includes('Welcome')
                      ? 'text-[#87ceeb]'
                      : line.includes('Terminal ready')
                      ? 'text-[#87ceeb]'
                      : line.startsWith('•')
                      ? 'text-[#e5e5e5]'
                      : 'text-[#e5e5e5]'
                  }`}
                >
                  {line}
                </div>
              ))}
              
              {/* Loading Cursor */}
              {currentLoadingLine < loadingLines.length && (
                <div className="inline-block w-2 h-5 bg-[#d4a27f] animate-pulse ml-1"></div>
              )}
            </>
          )}

          {/* Interactive Phase */}
          {!isLoading && (
            <>
              {history.map((line, index) => {
                // Check if this is a project title line that needs special formatting
                if (line.startsWith('# ') && line.includes('|')) {
                  console.log('Found title line:', line)
                  const titleMatch = line.match(/^# ([^|]+)\|(.+)$/)
                  console.log('Title match result:', titleMatch)
                  if (titleMatch) {
                    const [, title, tech] = titleMatch
                    console.log('Parsed title:', title, 'tech:', tech)
                    return (
                      <div key={index} className="mb-1 whitespace-pre-wrap">
                        <span className="text-[#87ceeb] font-bold"># {title.trim()}</span>
                        <span className="text-[#e5e5e5]"> | {tech}</span>
                      </div>
                    )
                  }
                }
                
                return (
                  <div 
                    key={index} 
                    className={`mb-1 whitespace-pre-wrap ${
                      line.startsWith('•') || line.includes('•')
                        ? 'text-[#e5e5e5]'
                        : line.startsWith('jon4h@portfolio:~') 
                        ? 'text-[#d4a27f] font-semibold' 
                        : line.includes('Available commands:') || line.includes('Email:') || line.includes('Name:')
                        ? 'text-[#87ceeb]'
                        : line.includes('🚀') || line.includes('Welcome') || line.includes('Terminal ready')
                        ? 'text-[#87ceeb]'
                        : line.startsWith('# ')
                        ? 'text-[#ff0000] font-bold'
                        : line.startsWith('  ') || line.includes(' - ') && (line.includes('cat ') || line.includes('cd ') || line.includes('more-help') || line.includes('terminal commands'))
                        ? 'text-[#d4a27f]'
                        : 'text-[#e5e5e5]'
                    }`}
                  >
                    {line}
                  </div>
                )
              })}
              
              {/* Input Line */}
              <div className="flex items-center text-[#d4a27f] font-semibold">
                <span>jon4h@portfolio:~{pathStr}$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-[#e5e5e5] ml-1"
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="w-2 h-5 bg-[#d4a27f] animate-pulse ml-1"></div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <InfoTerminal 
        isVisible={showInfoTerminal} 
        onClose={() => setShowInfoTerminal(false)} 
      />
    </div>
  )
}