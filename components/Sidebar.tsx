
import React from 'react';
import { Box, Circle, Triangle, Hexagon, Cpu, Zap, Activity, Eye, EyeOff } from 'lucide-react';
import { ShapeType, ShapeConfig } from '../types';

interface SidebarProps {
  config: ShapeConfig;
  updateConfig: (newConfig: Partial<ShapeConfig>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ config, updateConfig, onAnalyze, isAnalyzing }) => {
  return (
    <div className="w-full md:w-72 flex flex-col gap-4 pointer-events-auto">
      {/* Shape Selector */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity size={14} /> Geometry Type
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { type: ShapeType.BOX, icon: Box },
            { type: ShapeType.SPHERE, icon: Circle },
            { type: ShapeType.TORUS_KNOT, icon: Hexagon },
            { type: ShapeType.ICOSAHEDRON, icon: Triangle },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => updateConfig({ type: item.type })}
              className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                config.type === item.type 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* Visual Controls */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Zap size={14} /> Material Parameters
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>METALNESS</span>
              <span>{Math.round(config.metalness * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={config.metalness}
              onChange={(e) => updateConfig({ metalness: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>ROUGHNESS</span>
              <span>{Math.round(config.roughness * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={config.roughness}
              onChange={(e) => updateConfig({ roughness: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Wireframe</span>
            <button 
              onClick={() => updateConfig({ wireframe: !config.wireframe })}
              className={`p-2 rounded-lg transition-colors ${config.wireframe ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}
            >
              {config.wireframe ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="space-y-3">
             <span className="text-[10px] text-slate-400 font-bold uppercase">Aesthetic Hue</span>
             <div className="flex gap-2">
               {['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                 <button
                   key={color}
                   onClick={() => updateConfig({ color })}
                   className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${config.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 group"
      >
        {isAnalyzing ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Cpu size={18} className="group-hover:rotate-12 transition-transform" />
            Analyze with Gemini
          </>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
