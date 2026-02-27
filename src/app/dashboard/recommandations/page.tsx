"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { parcelService } from "@/features/parcels/services/parcelService";
import { terrainService } from "@/features/terrains/services/terrainService";
import { recommendationService } from "@/features/recommendations/services/recommendationService";
import { sensorDataService } from "@/features/sensors/services/sensorDataService";
import { useTranslation } from "@/providers/TranslationProvider";
import { Bot, User, Loader2, Send, Sparkles, MapPin, ChevronRight, MessageSquare, Search } from "lucide-react";



export default function RecommandationsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialParcelId = searchParams.get('parcelId');
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [filteredParcelles, setFilteredParcelles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [latestSoilData, setLatestSoilData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Petit scroll vers le bas uniquement lors de l'ajout de nouveaux messages
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  useEffect(() => {
    const loadParcelles = async () => {
      try {
        const parcellesData = await parcelService.getParcelles();
        setParcelles(parcellesData);
        setFilteredParcelles(parcellesData);

        // Auto-select parcel if parcelId is in URL
        if (initialParcelId) {
          const parcelToSelect = parcellesData.find(p => String(p.id) === String(initialParcelId));
          if (parcelToSelect) {
            handleParcelSelect(initialParcelId);
          }
        }
      } catch (e) {
        console.error("Error loading parcelles:", e);
      }
    };
    loadParcelles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredParcelles(parcelles);
    } else {
      setFilteredParcelles(parcelles.filter(p =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.culturePredite && p.culturePredite.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    }
  }, [searchTerm, parcelles]);

  const handleParcelSelect = async (id: string) => {
    if (!id) { setSelectedParcel(null); setMessages([]); return; }
    const parcel = parcelles.find(p => String(p.id) === String(id));
    if (selectedParcel?.id === parcel?.id) {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      return;
    }

    setSelectedParcel(parcel);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    // Charger les messages sauvegardés pour cette parcelle depuis sessionStorage
    const savedMessages = sessionStorage.getItem(`chat_messages_${id}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
        setLoading(false);

        // Charger quand même les données du sol en arrière-plan
        sensorDataService.getMeasurementsByParcelle(parcel.id).then(measurements => {
          const latest = measurements[0];
          if (latest) {
            setLatestSoilData({
              N: latest.azote || 0,
              P: latest.phosphore || 0,
              K: latest.potassium || 0,
              temperature: latest.temperature || 0,
              humidity: latest.humidity || 0,
              ph: latest.ph || 0
            });
          }
        }).catch(err => console.error("Error loading soil data:", err));

        return; // Sortir ici si on a des messages sauvegardés
      } catch (e) {
        console.error("Error loading saved messages:", e);
      }
    }

    // Si pas de messages sauvegardés, continuer avec le message d'accueil
    setMessages([]);
    setLoading(true);

    try {
      const measurements = await sensorDataService.getMeasurementsByParcelle(parcel.id);
      const latest = measurements[0];

      if (latest) {
        const soilData = {
          N: latest.azote || 0,
          P: latest.phosphore || 0,
          K: latest.potassium || 0,
          temperature: latest.temperature || 0,
          humidity: latest.humidity || 0,
          ph: latest.ph || 0
        };
        setLatestSoilData(soilData);

        // Message d'accueil au lieu d'appeler l'API immédiatement
        const cultureName = parcel.culturePredite && parcel.culturePredite !== "Non définie"
          ? parcel.culturePredite
          : "cette parcelle";

        const welcomeMessages = [{
          agent: "Système Expert",
          message: `Bonjour ! Je suis votre assistant agronomique pour ${cultureName}. Posez-moi vos questions sur l'irrigation, la fertilisation, les maladies, ou tout autre sujet agricole.`,
          type: "bot"
        }];

        setMessages(welcomeMessages);
        sessionStorage.setItem(`chat_messages_${id}`, JSON.stringify(welcomeMessages));
      } else {
        const noDataMessages = [{
          agent: "Assistant",
          message: "Aucune donnée de capteur disponible pour cette parcelle. Vous pouvez quand même me poser vos questions agricoles !",
          type: "bot"
        }];

        setMessages(noDataMessages);
        sessionStorage.setItem(`chat_messages_${id}`, JSON.stringify(noDataMessages));
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customMessage?: string) => {
    if (e) e.preventDefault();
    const textToSend = customMessage || inputMessage;

    if (!textToSend.trim() || !selectedParcel) return;

    if (!customMessage) setInputMessage("");
    const userMessage = { agent: t('recommandations.user_label'), message: textToSend, type: "user" };
    setMessages(prev => {
      const updated = [...prev, userMessage];
      // Sauvegarder immédiatement le message utilisateur
      if (selectedParcel) {
        sessionStorage.setItem(`chat_messages_${selectedParcel.id}`, JSON.stringify(updated));
      }
      return updated;
    });
    setIsTyping(true);

    try {
      const res: any = await recommendationService.askQuestion(
        selectedParcel.id,
        textToSend,
        selectedParcel.culturePredite
      );
      setMessages(prev => {
        const updated = [...prev, {
          agent: res.agent,
          message: res.message || "Je n'ai pas pu générer de réponse spécifique.",
          type: "bot"
        }];
        // Sauvegarder dans sessionStorage
        sessionStorage.setItem(`chat_messages_${selectedParcel.id}`, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      setMessages(prev => {
        const updated = [...prev, {
          agent: "Système",
          message: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          type: "bot"
        }];
        sessionStorage.setItem(`chat_messages_${selectedParcel.id}`, JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <div className="flex relative z-20 pt-0 h-[calc(100vh-96px)] lg:h-[calc(100vh-60px)] lg:px-6 lg:pb-6 lg:gap-6">
        {/* SIDEBAR - Elite Floating Panel */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:relative z-[60] lg:z-10 w-full max-w-[320px] md:max-w-96 bg-white lg:bg-white/40 backdrop-blur-3xl border-r lg:border lg:border-white/40 lg:shadow-2xl lg:shadow-emerald-900/5 rounded-[32px] m-4 h-[calc(100vh-6rem)] lg:m-0 lg:h-full lg:rounded-[32px] border-emerald-50 flex flex-col transition-all duration-500 overflow-hidden`}>
          <div className="p-8 md:p-10 pb-6 border-b border-emerald-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#052E16]/30 mb-2">Choisir une</h2>
              <h1 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter leading-none">Parcelle.</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-3 bg-white rounded-2xl text-emerald-600">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 pb-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/30 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Filtrer les parcelles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-50/50 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-[#052E16] outline-none focus:bg-white focus:border-emerald-200 focus:shadow-lg transition-all placeholder:text-emerald-900/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {filteredParcelles.length > 0 ? (
              filteredParcelles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleParcelSelect(p.id)}
                  className={`w-full text-left p-4 md:p-6 rounded-[24px] md:rounded-[32px] transition-all flex items-center gap-4 group ${selectedParcel?.id === p.id
                    ? "bg-[#052E16] text-white shadow-2xl shadow-emerald-900/40"
                    : "hover:bg-white/60 border border-transparent hover:border-emerald-50"
                    }`}
                >
                  <div className={`p-3 rounded-2xl transition-colors ${selectedParcel?.id === p.id ? "bg-lime-400 text-[#052E16]" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                    }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black tracking-tight truncate ${selectedParcel?.id === p.id ? "text-white" : "text-[#052E16]"}`}>
                      {p.nom}
                    </p>
                    {p.culturePredite && (
                      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedParcel?.id === p.id ? "text-lime-400/70" : "text-[#052E16]/30"}`}>
                        {p.culturePredite}
                      </p>
                    )}
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedParcel?.id === p.id ? "text-lime-400 translate-x-0" : "text-[#052E16]/10 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                {parcelles.length === 0 ? (
                  <>
                    <Loader2 className="w-8 h-8 text-emerald-200 animate-spin mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#052E16]/20">Chargement...</p>
                  </>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#052E16]/40">Aucune parcelle trouvée</p>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[55] bg-emerald-950/20 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* MAIN CHAT AREA - Elite Floating Panel */}
        <main className="flex-1 flex flex-col min-h-0 bg-transparent lg:bg-white/20 lg:backdrop-blur-xl lg:rounded-[32px] lg:border lg:border-white/40 lg:shadow-2xl lg:shadow-emerald-900/5 overflow-hidden transition-all duration-500">
          {/* Elite Chat Header */}
          <div className="px-6 md:px-10 py-6 md:py-8 bg-white/20 backdrop-blur-md border-b border-emerald-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-5">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#052E16] border border-emerald-50"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[24px] shadow-xl flex items-center justify-center text-emerald-600 border border-emerald-50">
                <Bot className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#052E16] tracking-tighter leading-none">
                  AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Expert.</span>
                </h1>
                <p className="text-[#052E16]/40 text-[10px] md:text-xs font-medium italic mt-1">Intelligence conversationnelle agronomique.</p>
              </div>
            </div>
            {selectedParcel && (
              <div className="px-4 md:px-6 py-2 md:py-3 bg-[#052E16] rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 shadow-xl self-start md:self-auto">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-lime-400 animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[150px]">Active: {selectedParcel.nom}</span>
              </div>
            )}
          </div>

          {/* Chat Bubble Zone */}
          <div className="flex-1 overflow-y-auto p-4 md:p-0 custom-scrollbar relative">
            <div className="max-w-4xl mx-auto h-full flex flex-col p-4 md:p-10 space-y-6 md:space-y-8">
              {!selectedParcel ? (
                <div className="h-full flex flex-col items-center justify-center text-[#052E16]/10 px-6 text-center">
                  <MessageSquare size={window?.innerWidth < 768 ? 80 : 120} strokeWidth={0.5} className="mb-6 md:mb-8" />
                  <h3 className="text-xl md:text-2xl font-black tracking-tighter">Sélectionnez une zone</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 px-10">Pour démarrer le diagnostic intelligent et recevoir vos recommandations personnalisées.</p>
                </div>
              ) : loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 animate-spin" />
                  <p className="mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#052E16]/40 animate-pulse">Chargement de l'expertise...</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 md:gap-6 ${msg.type === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}>
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-[20px] flex items-center justify-center shrink-0 shadow-lg border border-white ${msg.type === 'user' ? 'bg-[#052E16] text-white' : 'bg-white text-emerald-600'}`}>
                        {msg.type === 'user' ? <User size={24} /> : <Bot size={24} />}
                      </div>
                      <div className={`p-5 md:p-8 rounded-[24px] md:rounded-[40px] max-w-[85%] md:max-w-[80%] shadow-2xl relative ${msg.type === 'user'
                        ? 'bg-[#052E16] text-white rounded-tr-none shadow-emerald-900/10'
                        : 'bg-white/80 backdrop-blur-xl text-[#052E16] rounded-tl-none border border-emerald-50 shadow-emerald-900/5'
                        }`}>
                        <div className={`flex items-center gap-2 mb-2 md:mb-3 opacity-30 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">{msg.agent}</span>
                        </div>
                        <p className="text-sm md:text-base font-medium leading-relaxed tracking-tight">{msg.message}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4 md:gap-6 animate-fadeIn">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-[20px] bg-white text-emerald-600 flex items-center justify-center shadow-lg border border-emerald-50 animate-pulse">
                        <Bot size={24} />
                      </div>
                      <div className="bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-[24px] md:rounded-[32px] rounded-tl-none flex gap-1.5 md:gap-2 border border-emerald-50 items-center">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} className="h-4 md:h-10" />
                </>
              )}
            </div>
          </div>

          {/* Elite Input Area */}
          <div className="p-4 md:p-10 bg-white/40 backdrop-blur-2xl border-t border-emerald-50/50">
            <form onSubmit={(e) => handleSendMessage(e)} className="max-w-4xl mx-auto flex gap-3 md:gap-4">
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-emerald-400 group-focus-within:text-emerald-600 transition-colors">
                  <Sparkles size={20} />
                </div>
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={!selectedParcel}
                  placeholder={window.innerWidth < 768 ? "Message..." : t('recommandations.input_placeholder')}
                  className="w-full bg-white/80 backdrop-blur-xl pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 rounded-[20px] md:rounded-[32px] outline-none border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-sm md:text-base text-[#052E16] disabled:opacity-50 transition-all shadow-xl shadow-emerald-900/5 placeholder:text-emerald-100"
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || !selectedParcel}
                className="bg-[#052E16] text-white w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[32px] flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition-all disabled:opacity-30 shadow-2xl shadow-emerald-900/40 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Send size={28} className="relative z-10" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
