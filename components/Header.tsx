
import React from 'react';
import { Layers, Github, Share2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto group">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:rotate-6 transition-transform">
          <Layers className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Aether<span className="text-blue-500">3D</span></h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">Generative Systems</p>
        </div>
      </div>

      <div className="flex gap-4 pointer-events-auto">
        <button className="w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Github size={18} />
        </button>
        <button className="w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Share2 size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
