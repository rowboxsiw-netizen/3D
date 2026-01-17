
import React from 'react';
import { Box, Circle, Triangle, Hexagon, Zap, Activity, Eye, EyeOff, Send, Sliders } from 'lucide-react';
import { ShapeType, ShapeConfig } from '../types';

interface SidebarProps {
  config: ShapeConfig;
  updateConfig: (newConfig: Partial<ShapeConfig>) => void;
  onAction: (type: 'generate' | 'analyze') => void;
  isBusy: boolean;
  prompt: string;
  setPrompt: (val: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, updateConfig, onAction, isBusy, prompt, setPrompt }) => {
  return (
    <div className="w-full md:w-80 flex flex-col gap-5 pointer-events-auto">
      {/* Generative Prompt Input */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <Zap size={14} /> Neural Generator
        </h3>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a vision... (e.g. 'Liquid obsidian floating in a neon nebula')"
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none transition-all"
          />
          <button
            onClick={() => onAction('generate')}
            disabled={isBusy || !prompt.trim()}
            className="absolute bottom-3 right-3 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all disabled:opacity-30 disabled:hover:bg-blue-600"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Manual Parameters */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex-1 overflow-y-auto max-h-[60vh] md:max-h-none custom-scrollbar">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <Sliders size={14} /> Core Parameters
        </h3>
        
        <div className="space-y-8">
          {/* Shape Selector */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { type: ShapeType.BOX, icon: Box },
              { type: ShapeType.SPHERE, icon: Circle },
              { type: ShapeType.TORUS_KNOT, icon: Hexagon },
              { type: ShapeType.ICOSAHEDRON, icon: Triangle },
              { type: ShapeType.OCTAHEDRON, icon: Zap },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => updateConfig({ type: item.type })}
                className={`flex items-center justify-center p-3 rounded-2xl transition-all ${
                  config.type === item.type 
                  ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <item.icon size={18} />
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <ParameterSlider label="Metalness" value={config.metalness} onChange={(v) => updateConfig({ metalness: v })} />
            <ParameterSlider label="Roughness" value={config.roughness} onChange={(v) => updateConfig({ roughness: v })} />
            <ParameterSlider label="Distortion" value={config.distortion} onChange={(v) => updateConfig({ distortion: v })} />
            <ParameterSlider label="Neural Wobble" value={config.wobble} onChange={(v) => updateConfig({ wobble: v })} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex gap-2">
               {['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#ffffff'].map(color => (
                 <button
                   key={color}
                   onClick={() => updateConfig({ color })}
                   className={`w-6 h-6 rounded-lg transition-all hover:scale-125 ${config.color === color ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0a0a0a] scale-110' : 'opacity-40 hover:opacity-100'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
             <button 
              onClick={() => updateConfig({ wireframe: !config.wireframe })}
              className={`p-3 rounded-xl transition-all ${config.wireframe ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-slate-500'}`}
            >
              {config.wireframe ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAction('analyze')}
        disabled={isBusy}
        className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
      >
        Analyze neural form
      </button>
    </div>
  );
};

const ParameterSlider = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">{label}</span>
      <span className="text-[10px] text-white font-mono">{Math.round(value * 100)}%</span>
    </div>
    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value * 100}%` }}
      />
      <input 
        type="range" min="0" max="1" step="0.01" 
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

export default Sidebar;
