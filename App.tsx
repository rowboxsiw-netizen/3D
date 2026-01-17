
import React, { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import { Box, Sphere, Triangle, Cpu, Sparkles, RefreshCcw, Info, Zap, Layers } from 'lucide-react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ShapeType, ShapeConfig, AIAnalysis } from './types';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [config, setConfig] = useState<ShapeConfig>({
    type: ShapeType.TORUS_KNOT,
    color: '#3b82f6',
    wireframe: false,
    roughness: 0.1,
    metalness: 0.8,
    rotationSpeed: 0.5,
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeShape = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze the following 3D object configuration and provide a creative mathematical and artistic description in JSON format:
      Shape: ${config.type}
      Color: ${config.color}
      Metalness: ${config.metalness}
      Roughness: ${config.roughness}
      
      Return JSON with fields: title, description, mathematicalSignificance, creativeInsight.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setAiAnalysis(data);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateConfig = useCallback((newConfig: Partial<ShapeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans">
      <Header />
      
      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <OrbitControls 
              enablePan={false} 
              minDistance={3} 
              maxDistance={10} 
              autoRotate={true}
              autoRotateSpeed={config.rotationSpeed}
            />
            
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
              <Scene config={config} />
            </Float>

            <ContactShadows 
              position={[0, -2, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2.5} 
              far={4} 
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Panels */}
      <div className="absolute inset-0 pointer-events-none flex flex-col md:flex-row justify-between p-6 z-10">
        <Sidebar 
          config={config} 
          updateConfig={updateConfig} 
          onAnalyze={analyzeShape}
          isAnalyzing={isAnalyzing}
        />
        
        {/* Right side Analysis Panel */}
        <div className="w-full md:w-80 pointer-events-auto">
          {aiAnalysis && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right duration-500">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Sparkles size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">AI Analysis</h3>
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">{aiAnalysis.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{aiAnalysis.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Mathematics</h4>
                  <p className="text-xs text-slate-400 italic">{aiAnalysis.mathematicalSignificance}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Creative Insight</h4>
                  <p className="text-xs text-slate-400 italic">{aiAnalysis.creativeInsight}</p>
                </div>
              </div>
            </div>
          )}
          
          {!aiAnalysis && !isAnalyzing && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info size={24} className="text-blue-400" />
              </div>
              <h3 className="text-slate-300 font-medium mb-2">Initialize Analysis</h3>
              <p className="text-xs text-slate-500">Click the generate button to see how Gemini perceives this mathematical form.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-blue-400 animate-pulse font-medium">Gemini is decoding geometry...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-6 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold z-10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          Engine Online
        </div>
        <div className="flex items-center gap-2">
          <Layers size={12} />
          {config.type} Mode
        </div>
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-yellow-500" />
          R3F Rendering
        </div>
      </div>
    </div>
  );
};

export default App;
