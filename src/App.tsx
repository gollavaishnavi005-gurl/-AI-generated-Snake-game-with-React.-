import { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Layers } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-50 border-b border-cyan-500/20 bg-black/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-[#0a0a1a] rounded-[6px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-mono font-black tracking-tighter leading-none">
                SYNTH<span className="text-cyan-500">SNAKE</span>
              </h1>
              <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mt-1">Experimental Audio-Visual Lab</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-white/60">
            <a href="#" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <Gamepad2 className="w-4 h-4" /> Arcade
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
              <Music className="w-4 h-4" /> Studio
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Side Info Panel - Desktop */}
          <div className="hidden lg:block lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm"
            >
              <h2 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Laboratory Notes</h2>
              <p className="text-sm text-white/80 leading-relaxed font-light">
                Integration of classic 8-bit mechanics with modern spectral audio delivery.
                The snake moves in sync with your pulse.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm"
            >
              <h2 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Current Session</h2>
              <div className="space-y-4 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-white/40">ELAPSED</span>
                  <span className="text-sm text-cyan-500">REALTIME</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-white/40">LATENCY</span>
                  <span className="text-sm text-purple-500">0.04ms</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Snake Game Center */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 flex flex-col items-center gap-8"
          >
            <SnakeGame onScoreChange={setScore} />
            
            {/* Mobile Music Player Trigger or Tiny Preview */}
            <div className="lg:hidden w-full">
              <MusicPlayer />
            </div>
          </motion.div>

          {/* Music Player Side - Right */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block lg:col-span-3 sticky top-32"
          >
            <MusicPlayer />
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
            &copy; 2026 SYNTHSNAKE_LABS // ALL SYSTEMS NOMINAL
          </p>
          <div className="flex gap-6">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
          </div>
        </div>
      </footer>
    </div>
  );
}
