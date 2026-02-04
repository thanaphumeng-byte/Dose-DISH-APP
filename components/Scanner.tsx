import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Loader2, Pill, Soup, FileText, Type, Send, X, Circle, SwitchCamera, Search, Zap } from 'lucide-react';
import { ScanMode, InputMethod } from '../types';

interface ScannerProps {
  onScan: (data: { type: 'IMAGE' | 'TEXT', content: string }, mode: ScanMode) => void;
  isLoading: boolean;
  texts: any;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading, texts }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedMode, setSelectedMode] = useState<ScanMode>(ScanMode.MEDICATION);
  const [inputMethod, setInputMethod] = useState<InputMethod>('CAMERA');
  const [textInput, setTextInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      
      // Allow video element to update ref
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);

    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please allow permissions or use upload.");
      // Fallback to file picker if camera fails
      // fileInputRef.current?.click(); 
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64String = dataUrl.split(',')[1];
        
        stopCamera();
        setPreview(dataUrl);
        onScan({ type: 'IMAGE', content: base64String }, selectedMode);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        onScan({ type: 'IMAGE', content: base64String }, selectedMode);
      };
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onScan({ type: 'TEXT', content: textInput }, selectedMode);
  };

  const triggerFileSelect = () => {
    stopCamera(); // Ensure live camera is off
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
    setTextInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    stopCamera();
  };

  // Switch tabs -> close camera
  const handleModeChange = (mode: ScanMode) => {
    setSelectedMode(mode);
    clearPreview();
  };

  const modes = [
    { id: ScanMode.MEDICATION, label: texts.medication, icon: Pill, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { id: ScanMode.MEAL, label: texts.meal, icon: Soup, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
    { id: ScanMode.LAB_RESULT, label: texts.lab, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  ];

  const getPlaceholder = () => {
    let modeLabel = texts.medication.toLowerCase();
    if (selectedMode === ScanMode.MEAL) modeLabel = texts.meal.toLowerCase();
    if (selectedMode === ScanMode.LAB_RESULT) modeLabel = texts.lab.toLowerCase();
    return texts.typePlaceholder.replace('{mode}', modeLabel);
  };

  return (
    <div className="w-full">
      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Mode Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{texts.title}</h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => {
                setInputMethod('CAMERA');
                setPreview(null);
            }}
            className={`p-2 rounded-md transition-all ${inputMethod === 'CAMERA' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-400'}`}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
                setInputMethod('TEXT');
                stopCamera();
            }}
            className={`p-2 rounded-md transition-all ${inputMethod === 'TEXT' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-400'}`}
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 ${
                isSelected 
                  ? 'border-slate-900 dark:border-slate-500 bg-slate-50 dark:bg-slate-800' 
                  : 'border-transparent bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className={`p-2 rounded-full mb-1 ${mode.bg}`}>
                <Icon className={`w-5 h-5 ${mode.color}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="relative">
        {isLoading ? (
          <div className="w-full h-80 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
            {/* Background Pulse */}
            <div className="absolute w-64 h-64 bg-teal-500/5 rounded-full animate-ping"></div>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              {/* Rotating Container for Food & Drug */}
              <div className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]">
                 {/* Pill Item */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm transform -translate-y-1/2">
                   <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 {/* Food Item */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm transform translate-y-1/2">
                   <Soup className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                 </div>
              </div>

              {/* Central Search Icon (The Observer) - Replaced Glasses */}
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 z-10 relative">
                <Search className="w-8 h-8 text-slate-700 dark:text-slate-200" />
                {/* Small Zap icon appearing to show 'checking' */}
                <div className="absolute -top-1 -right-1 bg-amber-100 dark:bg-amber-900 rounded-full p-1 animate-pulse">
                   <Zap className="w-3 h-3 text-amber-500" />
                </div>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-200 font-bold text-lg animate-pulse">{texts.analyzing}</p>
            <p className="text-slate-400 text-sm">Checking for Food-Drug Interactions...</p>
          </div>
        ) : inputMethod === 'CAMERA' ? (
          // Camera Mode
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            {isCameraActive ? (
                // Live Camera View
                <div className="relative w-full h-80 bg-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                    <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Scanner Overlay */}
                    <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none">
                        <div className="w-full h-full border-2 border-white/50 rounded-lg relative">
                             <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal-500 -mt-1 -ml-1"></div>
                             <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal-500 -mt-1 -mr-1"></div>
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal-500 -mb-1 -ml-1"></div>
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal-500 -mb-1 -mr-1"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 w-full flex justify-center items-center gap-6 z-10">
                         <button 
                            onClick={stopCamera}
                            className="bg-black/50 text-white p-3 rounded-full backdrop-blur hover:bg-black/70"
                         >
                            <X className="w-6 h-6" />
                         </button>
                         <button 
                            onClick={captureImage}
                            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur hover:bg-white/40 transition-all"
                         >
                            <div className="w-12 h-12 bg-white rounded-full"></div>
                         </button>
                    </div>
                </div>
            ) : preview ? (
              // Captured/Uploaded Preview
              <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
                <img src={preview} alt="Scan preview" className="w-full h-full object-cover" />
                <button 
                  onClick={clearPreview}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {texts.retake}
                </button>
              </div>
            ) : (
              // Initial State: Start Camera Button
              <div className="w-full h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center group relative overflow-hidden transition-colors">
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center w-full h-full hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors z-10"
                >
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Camera className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{texts.tapToScan}</h3>
                    <p className="text-sm text-slate-400">Real-time AI Analysis</p>
                </button>
                
                {/* Fallback Upload Link */}
                <button 
                    onClick={triggerFileSelect}
                    className="absolute bottom-4 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-teal-600 dark:hover:text-teal-400 z-20 flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600"
                >
                    <Upload className="w-3 h-3" /> {texts.orUpload}
                </button>
                
                {cameraError && (
                    <div className="absolute top-4 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100">
                        {cameraError}
                    </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Text Mode
          <div className="w-full h-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col transition-colors">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="flex-1 w-full resize-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-lg bg-transparent"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors font-semibold"
              >
                <Send className="w-5 h-5" />
                {texts.analyzeBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;