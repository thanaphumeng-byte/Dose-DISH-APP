import React, { useState } from 'react';
import { Pill, Utensils, Search, AlertTriangle, Glasses, Zap } from 'lucide-react';

interface InteractionCheckerProps {
  onCheck: (food: string, drug: string) => void;
  isLoading: boolean;
  texts: any;
}

const InteractionChecker: React.FC<InteractionCheckerProps> = ({ onCheck, isLoading, texts }) => {
  const [food, setFood] = useState('');
  const [drug, setDrug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (food && drug) {
      onCheck(food, drug);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative min-h-[320px] transition-all duration-300">
      
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl z-10 animate-fade-in p-6">
             {/* Animation Block - Increased Size */}
             <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                {/* Background Pulse (Amber for Warning/Check vibe) */}
                <div className="absolute w-60 h-60 bg-amber-500/5 rounded-full animate-ping"></div>

                {/* Rotating Orbit */}
                <div className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]">
                    {/* Pill - Larger */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm transform -translate-y-1/2">
                        <Pill className="w-7 h-7 text-blue-600" />
                    </div>
                    {/* Food - Larger */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm transform translate-y-1/2">
                        <Utensils className="w-7 h-7 text-emerald-600" />
                    </div>
                </div>

                {/* Center Magnifying Glass (Search) - Larger */}
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-50 z-10 relative">
                    <Search className="w-12 h-12 text-slate-800" />
                    <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full p-2 animate-pulse">
                        <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
             </div>
             
             <h3 className="text-slate-800 font-bold text-xl animate-pulse mb-2">{texts.checking}</h3>
             <p className="text-slate-400 text-sm text-center">Comparing <span className="font-medium text-slate-600">{food}</span> vs <span className="font-medium text-slate-600">{drug}</span></p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-50 rounded-full">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{texts.title}</h2>
              <p className="text-slate-500 text-xs">{texts.subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{texts.foodLabel}</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                <Utensils className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder={texts.placeholderFood}
                  className="w-full bg-transparent outline-none text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{texts.drugLabel}</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                <Pill className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  placeholder={texts.placeholderDrug}
                  className="w-full bg-transparent outline-none text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !food || !drug}
              className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/10"
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