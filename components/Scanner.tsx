import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2, Pill, Utensils, FileText, Type, Send } from 'lucide-react';
import { ScanMode, InputMethod } from '../types';

interface ScannerProps {
  onScan: (data: { type: 'IMAGE' | 'TEXT', content: string }, mode: ScanMode) => void;
  isLoading: boolean;
  texts: any;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading, texts }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMode, setSelectedMode] = useState<ScanMode>(ScanMode.MEDICATION);
  const [inputMethod, setInputMethod] = useState<InputMethod>('CAMERA');
  const [textInput, setTextInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

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
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
    setTextInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const modes = [
    { id: ScanMode.MEDICATION, label: texts.medication, icon: Pill, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: ScanMode.MEAL, label: texts.meal, icon: Utensils, color: 'text-green-500', bg: 'bg-green-50' },
    { id: ScanMode.LAB_RESULT, label: texts.lab, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const getPlaceholder = () => {
    let modeLabel = texts.medication.toLowerCase();
    if (selectedMode === ScanMode.MEAL) modeLabel = texts.meal.toLowerCase();
    if (selectedMode === ScanMode.LAB_RESULT) modeLabel = texts.lab.toLowerCase();
    return texts.typePlaceholder.replace('{mode}', modeLabel);
  };

  return (
    <div className="w-full">
      {/* Mode Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">{texts.title}</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setInputMethod('CAMERA')}
            className={`p-2 rounded-md transition-all ${inputMethod === 'CAMERA' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={() => setInputMethod('TEXT')}
            className={`p-2 rounded-md transition-all ${inputMethod === 'TEXT' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
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
              onClick={() => {
                setSelectedMode(mode.id);
                clearPreview();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 ${
                isSelected 
                  ? 'border-slate-900 bg-slate-50' 
                  : 'border-transparent bg-white hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-full mb-1 ${mode.bg}`}>
                <Icon className={`w-5 h-5 ${mode.color}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="relative">
        {isLoading ? (
          <div className="w-full h-64 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
            <p className="text-slate-600 font-medium">{texts.analyzing}</p>
          </div>
        ) : inputMethod === 'CAMERA' ? (
          // Camera Mode
          <>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md">
                <img src={preview} alt="Scan preview" className="w-full h-full object-cover" />
                <button 
                  onClick={triggerFileSelect}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {texts.retake}
                </button>
              </div>
            ) : (
              <button
                onClick={triggerFileSelect}
                className="w-full h-64 bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50 transition-all flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{texts.tapToScan}</h3>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  <Upload className="w-3 h-3" /> {texts.orUpload}
                </div>
              </button>
            )}
          </>
        ) : (
          // Text Mode
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="flex-1 w-full resize-none outline-none text-slate-700 placeholder-slate-400"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <Send className="w-4 h-4" />
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