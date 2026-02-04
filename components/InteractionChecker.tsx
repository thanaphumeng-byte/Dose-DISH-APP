import React, { useState, useRef, useEffect } from 'react';
import { Pill, Search, AlertTriangle, Zap, Camera, X, Loader2, Soup, History } from 'lucide-react';
import { identifyItemFromImage } from '../services/geminiService';
import { Language, UserProfile } from '../types';

interface InteractionCheckerProps {
  onCheck: (food: string, drug: string) => void;
  isLoading: boolean;
  texts: any;
  language: Language;
  profile: UserProfile | null;
}

const InteractionChecker: React.FC<InteractionCheckerProps> = ({ onCheck, isLoading, texts, language, profile }) => {
  const [food, setFood] = useState('');
  const [drug, setDrug] = useState('');
  const [mode, setMode] = useState<'PAIR' | 'PROFILE'>('PROFILE');
  
  // Camera State
  const [activeCamera, setActiveCamera] = useState<'FOOD' | 'DRUG' | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async (type: 'FOOD' | 'DRUG') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setActiveCamera(type);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (err) {
      console.error("Camera Access Error:", err);
      alert("Could not access camera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setActiveCamera(null);
  };

  const captureAndIdentify = async () => {
    if (!videoRef.current || !canvasRef.current || !activeCamera) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      stopCamera();
      setIsIdentifying(true);
      
      // Pass the current language to the identifier service
      const identifiedName = await identifyItemFromImage(base64, activeCamera, language); 
      
      if (identifiedName) {
        if (activeCamera === 'FOOD') setFood(identifiedName);
        else setDrug(identifiedName);
      }
      
      setIsIdentifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'PROFILE' && food) {
        // Checking food against everything in profile (pass empty string as drug to signal profile check)
        onCheck(food, "PROFILE_CHECK");
    } else if (mode === 'PAIR' && food && drug) {
        onCheck(food, drug);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative min-h-[320px] transition-all duration-300 overflow-hidden">
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Overlay */}
      {activeCamera && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
            <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="flex-1 w-full object-cover"
            />
            <div className="absolute top-4 right-4 z-50">
                <button onClick={stopCamera} className="bg-black/50 text-white p-2 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="absolute bottom-6 w-full flex justify-center pb-4">
                 <button 
                    onClick={captureAndIdentify}
                    className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition-all"
                 >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                 </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-2 border-white/50 w-64 h-64 rounded-xl">
                 <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full absolute -top-10 left-1/2 -translate-x-1/2">
                    Scanning {activeCamera}
                 </div>
            </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(isLoading || isIdentifying) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl z-10 animate-fade-in p-6 transition-colors">
             {/* Animation Block - Increased Size */}
             <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <div className="absolute w-60 h-60 bg-amber-500/5 rounded-full animate-ping"></div>

                <div className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm transform -translate-y-1/2">
                        <Pill className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm transform translate-y-1/2">
                        <Soup className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center border border-slate-50 dark:border-slate-700 z-10 relative">
                    <Search className="w-12 h-12 text-slate-800 dark:text-white" />
                    <div className="absolute -top-2 -right-2 bg-amber-100 dark:bg-amber-900 rounded-full p-2 animate-pulse">
                        <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
             </div>
             
             <h3 className="text-slate-800 dark:text-white font-bold text-xl animate-pulse mb-2">
                {isIdentifying ? texts.identifying : texts.checking}
             </h3>
             <p className="text-slate-400 dark:text-slate-500 text-sm text-center">
                 {isIdentifying 
                    ? "AI is reading the label..." 
                    : "Analyzing interactions with your medical history..."
                 }
             </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{texts.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{texts.subtitle}</p>
                </div>
            </div>
          </div>
          
          {/* Toggle Mode */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4 transition-colors">
             <button 
                onClick={() => setMode('PROFILE')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'PROFILE' ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
             >
                Check vs Profile
             </button>
             <button 
                onClick={() => setMode('PAIR')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'PAIR' ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
             >
                Check Pair
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input - Context based */}
            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 block">
                  {mode === 'PROFILE' ? 'What are you taking/eating?' : texts.foodLabel}
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <Soup className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder={mode === 'PROFILE' ? "e.g. Durian or New Med" : texts.placeholderFood}
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-white font-medium h-10 placeholder-slate-400"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => startCamera('FOOD')}
                  className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
                >
                    <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drug Input - Only show in PAIR mode */}
            {mode === 'PAIR' && (
                <div className="relative animate-fade-in">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 block">{texts.drugLabel}</label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <Pill className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                    type="text"
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    placeholder={texts.placeholderDrug}
                    className="w-full bg-transparent outline-none text-slate-800 dark:text-white font-medium h-10 placeholder-slate-400"
                    required
                    />
                    <button 
                    type="button" 
                    onClick={() => startCamera('DRUG')}
                    className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                </div>
            )}
            
            {/* Context Info */}
            {mode === 'PROFILE' && profile && (
                 <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <History className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Checking against history:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {profile.medications.split(',').map((med, i) => (
                            <span key={i} className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded-md text-slate-500 dark:text-slate-300">
                                {med.trim()}
                            </span>
                        ))}
                        {profile.history && profile.history.map((h, i) => (
                             <span key={`h-${i}`} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400">
                                {h.name}
                            </span>
                        ))}
                    </div>
                 </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !food || (mode === 'PAIR' && !drug)}
              className="w-full mt-4 bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/10 dark:shadow-none"
            >
              <Search className="w-4 h-4" />
              {texts.checkBtn}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default InteractionChecker;