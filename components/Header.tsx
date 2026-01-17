
import React from 'react';
import { Layers, Github, Dribbble } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto group">
        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all duration-500">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
            Aether<span className="text-blue-500">OS</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-black tracking-[0.4em] uppercase mt-1">Neural Geometry V2</p>
        </div>
      </div>

      <div className="flex gap-4 pointer-events-auto">
        <a href="#" className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <Github size={20} />
        </a>
        <a href="#" className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <Dribbble size={20} />
        </a>
      </div>
    </header>
  );
};

export default Header;
