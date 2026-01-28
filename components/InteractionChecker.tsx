import React, { useState } from 'react';
import { Pill, Utensils, Search, AlertTriangle } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
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
          className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-pulse">{texts.checking}</span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              {texts.checkBtn}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InteractionChecker;