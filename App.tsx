
import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Float, Stars } from '@react-three/drei';
import { Sparkles, Info, Cpu, Layers } from 'lucide-react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ShapeType, ShapeConfig, AIResponse } from './types';
import { GoogleGenAI, Type } from "@google/genai";

const App: React.FC = () => {
  const [config, setConfig] = useState<ShapeConfig>({
    type: ShapeType.TORUS_KNOT,
    color: '#3b82f6',
    wireframe: false,
    roughness: 0.1,
    metalness: 0.8,
    rotationSpeed: 0.5,
    distortion: 0.4,
    wobble: 0.2,
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIResponse['analysis'] | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleAiAction = async (actionType: 'generate' | 'analyze') => {
    setIsBusy(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let systemPrompt = "";
      if (actionType === 'generate') {
        systemPrompt = `You are a 3D generative engine. Based on the user prompt "${prompt}", generate a mathematical 3D configuration.
        Valid ShapeTypes: BOX, SPHERE, TORUS_KNOT, ICOSAHEDRON, OCTAHEDRON.
        Colors must be HEX.
        Values: metalness (0-1), roughness (0-1), distortion (0-1), wobble (0-1).
        Also provide a creative title and description.`;
      } else {
        systemPrompt = `Analyze this current 3D configuration: ${JSON.stringify(config)}. 
        Provide a deep mathematical and artistic analysis.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              config: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  color: { type: Type.STRING },
                  metalness: { type: Type.NUMBER },
                  roughness: { type: Type.NUMBER },
                  distortion: { type: Type.NUMBER },
                  wobble: { type: Type.NUMBER },
                }
              },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mathematicalSignificance: { type: Type.STRING },
                  creativeInsight: { type: Type.STRING },
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const data: AIResponse = JSON.parse(response.text);
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
        if (data.analysis) {
          setAiAnalysis(data.analysis);
        }
      }
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const updateConfig = useCallback((newConfig: Partial<ShapeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans">
      <Header />
      
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
            <OrbitControls 
              enablePan={false} 
              minDistance={3} 
              maxDistance={12} 
              autoRotate={true}
              autoRotateSpeed={config.rotationSpeed * 2}
            />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color={config.color} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Scene config={config} />
            </Float>

            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.3} 
              scale={15} 
              blur={3} 
              far={4.5} 
              color={config.color}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col md:flex-row justify-between p-4 md:p-8 z-10 overflow-y-auto md:overflow-hidden">
        <Sidebar 
          config={config} 
          updateConfig={updateConfig} 
          onAction={handleAiAction}
          isBusy={isBusy}
          prompt={prompt}
          setPrompt={setPrompt}
        />
        
        <div className="w-full md:w-96 pointer-events-auto mt-4 md:mt-0">
          {aiAnalysis && (
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-right duration-700">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-blue-400" />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-[10px] text-blue-400/80">Neural Insights</h3>
              </div>
              <h2 className="text-2xl font-black mb-4 text-white tracking-tight">{aiAnalysis.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 border-l-2 border-blue-500/30 pl-4">{aiAnalysis.description}</p>
              
              <div className="space-y-5">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Mathematical Logic</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis.mathematicalSignificance}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Artist Perspective</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{aiAnalysis.creativeInsight}"</p>
                </div>
              </div>
            </div>
          )}
          
          {!aiAnalysis && !isBusy && (
            <div className="bg-white/[0.02] backdrop-blur-lg border border-white/5 p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={28} className="text-blue-500/40" />
              </div>
              <h3 className="text-slate-200 font-bold text-lg mb-2">Neural Link Ready</h3>
              <p className="text-sm text-slate-500 px-4 leading-relaxed">Describe a vision to the left, or manually adjust parameters to begin generation.</p>
            </div>
          )}

          {isBusy && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-12 rounded-3xl flex flex-col items-center justify-center text-center h-64">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full scale-150 animate-ping"></div>
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-xs text-blue-400 uppercase tracking-[0.3em] font-black animate-pulse">Syncing Geometry</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-8 text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black z-10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
          Core Online
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-slate-600" />
          {config.type}
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-slate-600" />
          GEMINI PRO-3
        </div>
      </div>
    </div>
  );
};

export default App;
