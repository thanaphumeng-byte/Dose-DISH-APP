import React, { useState, useEffect } from 'react';
import { UserProfile, AnalysisResult, ScanMode, MOCK_LAB_DATA, Language, ChatMessage } from './types';
import ProfileForm from './components/ProfileForm';
import Scanner from './components/Scanner';
import LabChart from './components/LabChart';
import InteractionChecker from './components/InteractionChecker';
import ChatInterface from './components/ChatInterface';
import { analyzeHealthData, checkSpecificInteraction, sendChatMessage } from './services/geminiService';
import { TRANSLATIONS } from './constants';
import { LayoutDashboard, User, Activity, ShieldAlert, CheckCircle2, AlertTriangle, Menu, X, Pill, Zap, Search, Globe, MessageCircle, Utensils } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'PROFILE' | 'FDI_CHECK' | 'CHAT'>('DASHBOARD');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load profile and language
  useEffect(() => {
    const savedProfile = localStorage.getItem('doseDish_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setView('PROFILE');
    }
  }, []);

  const t = TRANSLATIONS[language];

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('doseDish_profile', JSON.stringify(newProfile));
    setView('DASHBOARD');
  };

  const handleScan = async (data: { type: 'IMAGE' | 'TEXT', content: string }, mode: ScanMode) => {
    if (!profile) {
      alert(t.common.alertProfile);
      setView('PROFILE');
      return;
    }

    setIsLoading(true);
    setLastAnalysis(null);

    const resultText = await analyzeHealthData(
      { type: data.type, data: data.content }, 
      mode, 
      profile,
      language
    );
      
    // Heuristic to determine risk level from text
    let risk: AnalysisResult['riskLevel'] = 'INFO';
    const lowerText = resultText.toLowerCase();
    if (resultText.includes('⚠️') || lowerText.includes('dangerous') || lowerText.includes('danger') || lowerText.includes('อันตราย') || lowerText.includes('危险')) {
      risk = 'DANGER';
    } else if (lowerText.includes('caution') || lowerText.includes('avoid') || lowerText.includes('ระวัง') || lowerText.includes('注意')) {
      risk = 'CAUTION';
    } else if (lowerText.includes('safe') || lowerText.includes('recommended') || lowerText.includes('ปลอดภัย') || lowerText.includes('安全')) {
      risk = 'SAFE';
    }

    setLastAnalysis({
      text: resultText,
      riskLevel: risk,
      timestamp: Date.now(),
      mode: mode
    });
    setIsLoading(false);
  };

  const handleInteractionCheck = async (food: string, drug: string) => {
    // Allow usage without profile (Guest Mode)
    // We create a temporary empty profile context if one doesn't exist
    const contextProfile: UserProfile = profile || {
        name: 'Guest',
        age: 0,
        conditions: 'None',
        medications: 'None',
        allergies: 'None'
    };

    setIsLoading(true);
    setLastAnalysis(null);

    const resultText = await checkSpecificInteraction(food, drug, contextProfile, language);

    // Reuse similar heuristic logic
    let risk: AnalysisResult['riskLevel'] = 'INFO';
    const lowerText = resultText.toLowerCase();
    if (resultText.includes('⚠️') || lowerText.includes('dangerous') || lowerText.includes('อันตราย') || lowerText.includes('危险')) {
      risk = 'DANGER';
    } else if (lowerText.includes('caution') || lowerText.includes('ระวัง') || lowerText.includes('注意')) {
      risk = 'CAUTION';
    }

    setLastAnalysis({
        text: resultText,
        riskLevel: risk,
        timestamp: Date.now(),
        mode: 'FDI_CHECK'
    });
    setIsLoading(false);
  }

  const handleSendChatMessage = async (text: string) => {
    if (!profile) {
        alert(t.common.alertProfile);
        setView('PROFILE');
        return;
    }

    const newUserMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    const responseText = await sendChatMessage(chatMessages, text, profile, language);

    const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newAiMsg]);
    setIsChatLoading(false);
  };

  const renderAnalysisResult = () => {
    if (!lastAnalysis) return null;

    let borderColor = 'border-slate-200';
    let bgColor = 'bg-white';
    let icon = <Activity className="w-6 h-6 text-slate-500" />;
    let title = t.analysis.result;

    if (lastAnalysis.riskLevel === 'DANGER') {
      borderColor = 'border-red-200';
      bgColor = 'bg-red-50';
      icon = <ShieldAlert className="w-6 h-6 text-red-600" />;
      title = t.analysis.safetyAlert;
    } else if (lastAnalysis.riskLevel === 'CAUTION') {
      borderColor = 'border-amber-200';
      bgColor = 'bg-amber-50';
      icon = <AlertTriangle className="w-6 h-6 text-amber-600" />;
      title = t.analysis.caution;
    } else if (lastAnalysis.riskLevel === 'SAFE') {
      borderColor = 'border-emerald-200';
      bgColor = 'bg-emerald-50';
      icon = <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      title = t.analysis.safe;
    }

    return (
      <div className={`mt-8 rounded-2xl overflow-hidden border ${borderColor} shadow-sm animate-fade-in mb-24`}>
        <div className={`px-6 py-4 ${bgColor} border-b ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {icon}
            <h3 className={`font-bold text-lg ${lastAnalysis.riskLevel === 'DANGER' ? 'text-red-900' : 'text-slate-800'}`}>
              {title}
            </h3>
          </div>
          <button onClick={() => setLastAnalysis(null)} className="p-1 hover:bg-black/5 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 bg-white prose prose-slate max-w-none markdown-content text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lastAnalysis.text}
          </ReactMarkdown>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
             <p className="text-xs text-slate-400 italic">
               {t.analysis.disclaimer}
             </p>
        </div>
      </div>
    );
  };

  return (
    // Mobile Wrapper
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-8 font-inter">
      <div className="w-full md:max-w-[430px] bg-slate-50 min-h-screen md:min-h-[850px] md:h-auto md:rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-slate-900/5">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2.5">
            {/* New FDI Related Logo */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-0.5">
               <Pill className="w-4 h-4 text-white fill-white/10" />
               <Zap className="w-3 h-3 text-amber-300 fill-amber-300 -ml-1 mt-1" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Dose & Dish</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-full p-1">
              <button 
                onClick={() => setLanguage('en')}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${language === 'en' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
              >EN</button>
              <button 
                onClick={() => setLanguage('th')}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${language === 'th' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
              >TH</button>
              <button 
                onClick={() => setLanguage('cn')}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${language === 'cn' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
              >CN</button>
            </div>

            {profile && (
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200">
                <span className="text-teal-700 font-bold text-xs">{profile.name.charAt(0)}</span>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content 
            Logic: If in CHAT mode, use flex col and hide overflow to let ChatInterface handle scrolling internally.
            Add bottom padding to container so Chat input is not covered by Bottom Nav.
        */}
        <main className={`transition-all duration-300 relative ${
            view === 'CHAT' 
            ? 'h-[calc(100vh-4rem)] md:h-[700px] overflow-hidden flex flex-col' 
            : 'h-[calc(100vh-4rem)] md:h-[700px] overflow-y-auto pb-32'
          }`}>
          
          <div className={`px-6 py-6 h-full ${view === 'CHAT' ? 'pb-24' : ''}`}>
            
            {view === 'PROFILE' && (
              <ProfileForm currentProfile={profile} onSave={handleSaveProfile} texts={t.profile} />
            )}

            {view === 'FDI_CHECK' && (
              <div className="space-y-6 animate-fade-in">
                 <InteractionChecker onCheck={handleInteractionCheck} isLoading={isLoading} texts={t.fdi} />
                 {renderAnalysisResult()}
              </div>
            )}

            {view === 'CHAT' && profile && (
                <div className="h-full animate-fade-in">
                    <ChatInterface 
                        messages={chatMessages} 
                        onSendMessage={handleSendChatMessage} 
                        isLoading={isChatLoading} 
                        texts={t.chat}
                        profile={profile}
                    />
                </div>
            )}
            
            {view === 'CHAT' && !profile && (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
                    <div className="bg-slate-100 p-4 rounded-full">
                        <User className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">{t.common.alertProfile}</h3>
                    <p className="text-sm text-slate-500">Please setup your profile to chat with the AI Pharmacist.</p>
                    <button 
                        onClick={() => setView('PROFILE')}
                        className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
                    >
                        Go to Profile
                    </button>
                 </div>
            )}

            {view === 'DASHBOARD' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                {!lastAnalysis && (
                  <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-[60px] opacity-20 transform translate-x-10 -translate-y-10"></div>
                    <h2 className="text-2xl font-bold mb-1">{t.dashboard.hello} {profile?.name.split(' ')[0] || t.dashboard.guest}</h2>
                    <p className="text-slate-400 text-sm mb-4">
                      {t.dashboard.subtitle}
                    </p>
                    <div className="flex gap-2 text-xs font-medium text-teal-400">
                       <span className="bg-white/10 px-2 py-1 rounded-full">{t.dashboard.tagAllergies}</span>
                       <span className="bg-white/10 px-2 py-1 rounded-full">{t.dashboard.tagMeds}</span>
                    </div>
                  </div>
                )}

                {/* Scanner Section */}
                {!lastAnalysis && (
                   <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                      <Scanner onScan={handleScan} isLoading={isLoading} texts={t.scanner} />
                    </div>
                )}

                {/* Analysis Result - Overlays scanner when active */}
                {renderAnalysisResult()}

                {/* Charts Section */}
                {!lastAnalysis && (
                  <div className="pb-6">
                     <LabChart data={MOCK_LAB_DATA} title={t.dashboard.labTitle} noDataText={t.dashboard.noLabData} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-20 px-6 flex justify-between items-center z-40 pb-2">
          <button 
            onClick={() => { setView('DASHBOARD'); setLastAnalysis(null); }}
            className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'DASHBOARD' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1 rounded-full ${view === 'DASHBOARD' ? 'bg-slate-100' : ''}`}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">{t.nav.home}</span>
          </button>

           <button 
            onClick={() => { setView('FDI_CHECK'); setLastAnalysis(null); }}
            className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'FDI_CHECK' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1 rounded-full ${view === 'FDI_CHECK' ? 'bg-slate-100' : ''}`}>
               <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">{t.nav.fdi}</span>
          </button>

          <button 
            onClick={() => { setView('CHAT'); setLastAnalysis(null); }}
            className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'CHAT' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
             <div className={`p-1 rounded-full ${view === 'CHAT' ? 'bg-slate-100' : ''}`}>
               <MessageCircle className="w-6 h-6" />
             </div>
            <span className="text-[10px] font-bold">{t.nav.chat}</span>
          </button>

          <button 
            onClick={() => { setView('PROFILE'); setLastAnalysis(null); }}
            className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'PROFILE' ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
             <div className={`p-1 rounded-full ${view === 'PROFILE' ? 'bg-slate-100' : ''}`}>
               <User className="w-6 h-6" />
             </div>
            <span className="text-[10px] font-bold">{t.nav.profile}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;