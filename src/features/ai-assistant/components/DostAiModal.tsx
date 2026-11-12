/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Send, Mic, Bot, User, ArrowRight, Camera } from 'lucide-react';
import { ActiveTab, AiChatMessage, Language } from '../../../shared/types';
import { useTranslation } from '../../../shared/i18n';
import { useAppSelector } from '../../../app/store/hooks';
import { selectAuthUser, selectIsAuthenticated } from '../../auth';

interface DostAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
  language?: Language;
  onOpenScan?: () => void;
}

export const DostAiModal: React.FC<DostAiModalProps> = ({
  isOpen,
  onClose,
  setActiveTab = () => {},
  onOpenScan,
}) => {
  const { t, language, currentLanguage } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const farmerName = isAuthenticated && user ? user.name : 'Farmer';

  const getLocalizedGreeting = (): string => {
    const code = language.toLowerCase();
    if (!isAuthenticated || !user) {
      if (code === 'te') {
        return 'నమస్కారం! బంగాళాఖాతం తుఫాను హెచ్చరికలు, పంట తెగుళ్ల నివారణ మరియు మార్కెట్ ధరల గురించి మీకు ఏ వ్యవసాయ సలహా కావాలి?';
      }
      if (code === 'hi') {
        return 'नमस्ते! चक्रवात चेतावनी, फसल रोग निवारण और मंडी भाव के बारे में आज मैं आपकी क्या सहायता कर सकता हूँ?';
      }
      return `Namaste! Ask me about seasonal crop management, cyclone mitigation, pest symptoms, or mandi market prices in ${currentLanguage.nativeName} (${currentLanguage.name}).`;
    }

    if (code === 'te') {
      return `నమస్కారం ${farmerName} గారు! బంగాళాఖాతంలో ఏర్పడిన తుఫాను హెచ్చరికను మరియు మీ ${user.registeredParcelsCount} పంట పొలాల (బాస్మతి వరి, తేజ మిర్చి, హైబ్రిడ్ మొక్కజొన్న, కదిరి వేరుశనగ) స్థితిని నేను పరిశీలించాను. ఈ రోజు మీకు ఏ వ్యవసాయ సలహా కావాలి?`;
    }
    if (code === 'hi') {
      return `नमस्ते ${farmerName} जी! मैंने बंगाल की खाड़ी के चक्रवात और आपके ${user.registeredParcelsCount} सक्रिय खेतों (बासमती धान, तेजा मिर्च, संकर मक्का, कदिरी मूंगफली) का विश्लेषण किया है। आज मैं आपकी क्या सहायता कर सकता हूँ?`;
    }
    if (code === 'ta') {
      return `வணக்கம் ${farmerName}! வங்காள விரிகுடா புயல் எச்சரிக்கை மற்றும் உங்கள் ${user.registeredParcelsCount} பயிர் நிலங்களின் நிலையை நான் ஆய்வு செய்துள்ளேன். இன்று உங்களுக்கு என்ன விவசாய ஆலோசனை தேவை?`;
    }
    if (code === 'kn') {
      return `ನಮಸ್ಕಾರ ${farmerName}! ಬಂಗಾಳ ಕೊಲ್ಲಿ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ ಮತ್ತು ನಿಮ್ಮ ${user.registeredParcelsCount} ಕೃಷಿ ಕ್ಷೇತ್ರಗಳ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಯಾವ ಕೃಷಿ ಸಲಹೆ ಬೇಕು?`;
    }
    if (code === 'mr') {
      return `नमस्कार ${farmerName} जी! मी बंगालच्या उपसागरातील चक्रीवादळ आणि आपल्या ${user.registeredParcelsCount} पिकांच्या स्थितीचे विश्लेषण केले आहे. आज मी आपल्याला काय मदत करू शकेन?`;
    }
    if (code === 'bn') {
      return `নমস্কার ${farmerName}! বঙ্গোপসাগরের ঘূর্ণিঝড় সতর্কতা এবং আপনার ${user.registeredParcelsCount}টি ফসলি জমির অবস্থা বিশ্লেষণ করেছি। আজ আপনাকে কী কৃষি পরামর্শ দিতে পারি?`;
    }
    if (code === 'es') {
      return `¡Hola ${farmerName}! He analizado la alerta de ciclón de la Bahía de Bengala y sus ${user.registeredParcelsCount} parcelas agrícolas activas. ¿Cómo puedo ayudar a su finca hoy?`;
    }
    if (code === 'fr') {
      return `Bonjour ${farmerName} ! J’ai analysé l’alerte cyclonique et l’état de vos ${user.registeredParcelsCount} parcelles agricoles. Comment puis-je vous aider aujourd’hui ?`;
    }
    if (code === 'ar') {
      return `مرحباً ${farmerName}! لقد قمت بتحليل تحذير الإعصار وحالة حقولك الزراعية الأربعة. كيف يمكنني مساعدة مزرعتك اليوم؟`;
    }

    return `Namaste ${farmerName}! I have analyzed your ${user.registeredParcelsCount} active parcels (Basmati Rice, Teja Chilli, Hybrid Maize, Kadiri Groundnut) alongside real-time agro-meteorological advisories. Speaking in ${currentLanguage.nativeName} (${currentLanguage.name}). How can I assist your farm today?`;
  };

  const getLocalizedSuggestions = () => {
    const code = language.toLowerCase();
    if (code === 'te') {
      return [
        { label: 'తుఫాను పంట రక్షణ చర్యలు', tab: 'my-crops' as ActiveTab },
        { label: 'వరి ఎప్పుడు అమ్మాలి?', tab: 'market-prices' as ActiveTab },
        { label: 'BLB తెగులు నివారణ మందుల మోతాదు', tab: 'crop-doctor' as ActiveTab },
      ];
    }
    if (code === 'hi') {
      return [
        { label: 'चक्रवात फसल सुरक्षा नियम', tab: 'my-crops' as ActiveTab },
        { label: 'धान कब बेचना चाहिए?', tab: 'market-prices' as ActiveTab },
        { label: 'BLB रोग उपचार व खुराक', tab: 'crop-doctor' as ActiveTab },
      ];
    }
    if (code === 'ta') {
      return [
        { label: 'புயல் பயிர் பாதுகாப்பு முறைகள்', tab: 'my-crops' as ActiveTab },
        { label: 'நெல் எப்போது விற்க வேண்டும்?', tab: 'market-prices' as ActiveTab },
        { label: 'BLB நோய் மருந்து அளவு', tab: 'crop-doctor' as ActiveTab },
      ];
    }
    if (code === 'es') {
      return [
        { label: 'Protección contra ciclones', tab: 'my-crops' as ActiveTab },
        { label: '¿Cuándo vender el arroz?', tab: 'market-prices' as ActiveTab },
        { label: 'Tratamiento y dosis BLB', tab: 'crop-doctor' as ActiveTab },
      ];
    }
    return [
      { label: 'Cyclone crop protection rules', tab: 'my-crops' as ActiveTab },
      { label: 'When should I sell Paddy?', tab: 'market-prices' as ActiveTab },
      { label: 'Check BLB diagnosis & dosage', tab: 'crop-doctor' as ActiveTab },
    ];
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([]);

  // Refresh greeting when language or auth state changes
  useEffect(() => {
    setMessages([
      {
        id: 'msg-initial',
        sender: 'assistant',
        text: getLocalizedGreeting(),
        timestamp: '08:42 AM',
        actions: getLocalizedSuggestions(),
      },
    ]);
  }, [language, currentLanguage, isAuthenticated, user]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let actions: { label: string; tab?: ActiveTab }[] | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('cyclone') || lower.includes('toofan') || lower.includes('తుఫాను') || lower.includes('चक्रवात') || lower.includes('rain') || lower.includes('వర్షం')) {
        if (language === 'TE') {
          replyText = '⚠️ తుఫాను నివారణ కార్యాచరణ: బాస్మతి ప్లాట్ A లో మురుగు కాలువలను తక్షణమే 30 సెం.మీ లోతు వరకు తీయండి. మిర్చి ప్లాట్ B లో ఈదురుగాలులకు కొమ్మలు విరగకుండా వెదురు బొంగులతో కర్రలు కట్టండి. ఆదివారం వరకు నత్రజని ఎరువుల పిచికారీ నిలిపివేయండి.';
        } else if (language === 'HI') {
          replyText = '⚠️ चक्रवात सुरक्षा कार्ययोजना: बासमती प्लॉट A में जल निकासी नालियों को तुरंत 30 सेमी गहरा करें। मिर्च प्लॉट B में 85-95 किमी/घंटा हवाओं से पौधों को बचाने हेतु खूंटे बांधें। रविवार तक यूरिया/उर्वरक छिड़काव पूर्णतः स्थगित रखें।';
        } else {
          replyText = '⚠️ Cyclone Alert Action Plan: Deepen field outlet trenches to 30 cm depth in Paddy Parcel A immediately. For Chilli Parcel B, secure bamboo stakes to prevent twig breakage under 85-95 km/h gusts. Halt all urea/fertilizer spraying until Sunday clear weather.';
        }
        actions = [
          { label: language === 'TE' ? 'తుఫాను రక్షణ మార్గదర్శకాలు' : language === 'HI' ? 'चक्रवात सुरक्षा चेकलिस्ट' : 'Open Cyclone Plan', tab: 'my-crops' },
          { label: language === 'TE' ? 'పిచికారీ సమయాలు' : language === 'HI' ? 'छिड़काव समय सारणी' : 'Check Spray Window', tab: 'weather' },
        ];
      } else if (lower.includes('paddy') || lower.includes('sell') || lower.includes('mandi') || lower.includes('వరి') || lower.includes('धान') || lower.includes('ధర') || lower.includes('भाव')) {
        if (language === 'TE') {
          replyText = '📈 మార్కెట్ ధర సమాచారం: బాస్మతి వరిని మరో 10-14 రోజులు అమ్మవద్దు. ప్రస్తుతం క్వింటాలుకు ₹3,680 ఉంది, కానీ దీపావళి డిమాండ్ కారణంగా ధర ₹3,860 వరకు పెరిగే అవకాశం (+₹180 లాభం) ఉంది.';
        } else if (language === 'HI') {
          replyText = '📈 मंडी भाव विश्लेषण: बासमती धान को अगले 10-14 दिनों तक रोक कर रखें। वर्तमान मॉडल दर ₹3,680/क्विंटल है, लेकिन दिवाली की मांग से भाव ₹3,860/क्विंटल (+₹180/क्विंटल लाभ) तक जाने का पूर्वानुमान है।';
        } else {
          replyText = '📈 Mandi Price Intelligence: Hold Basmati Paddy for the next 10-14 days. Current modal price is ₹3,680/Qtl, but our AI ML projection forecasts a peak around ₹3,860/Qtl (+₹180/Qtl gain) prior to Deepavali demand surge.';
        }
        actions = [
          { label: language === 'TE' ? 'ధరల ట్రెండ్ చూడండి' : language === 'HI' ? 'भाव रुझान देखें' : 'View Price Forecast', tab: 'market-prices' },
        ];
      } else {
        if (language === 'TE') {
          replyText = isAuthenticated && user
            ? `🌾 ICAR సిఫార్సు: మీ ${user.registeredParcelsCount} పంట పొలాల వాతావరణ మరియు తెగుళ్ల వివరాలను విశ్లేషించాను. ఆకు తెగులు లేదా పురుగు ఉంటే కెమెరా స్కాన్ లేదా క్రాప్ డాక్టర్ ద్వారా మోతాదును తనిఖీ చేయండి.`
            : '🌾 ICAR సిఫార్సు: ప్రాంతీయ వాతావరణ మరియు తెగుళ్ల సమాచారం అందుబాటులో ఉంది. ఆకు తెగులు లేదా పురుగు లక్షణాలను తనిఖీ చేయడానికి క్రాప్ డాక్టర్ స్కానర్ లేదా పంట క్యాలెండర్‌ను ఉపయోగించండి.';
        } else if (language === 'HI') {
          replyText = isAuthenticated && user
            ? `🌾 ICAR वैज्ञानिक सलाह: आपके ${user.registeredParcelsCount} खेतों की मिट्टी और मौसम का विश्लेषण किया गया है। पत्ती पर धब्बे या कीट दिखने पर तुरंत क्रॉप डॉक्टर स्कैनर का उपयोग करें।`
            : '🌾 ICAR वैज्ञानिक सलाह: क्षेत्रीय मौसम और रोग सलाह उपलब्ध है। पत्ती पर धब्बे या कीट की पहचान के लिए क्रॉप डॉक्टर स्कैनर या फसल कैलेंडर देखें।';
        } else {
          replyText = isAuthenticated && user
            ? `🌾 Agronomic Guidance: Your ${user.registeredParcelsCount} parcel records are synced. For leaf lesions, verify with the Crop Doctor scanner or review the seasonal operations calendar.`
            : '🌾 Agronomic Guidance: Regional advisories are active. For leaf lesions, verify with the Crop Doctor scanner or review the seasonal operations calendar.';
        }
        actions = [
          { label: language === 'TE' ? 'క్రాప్ డాక్టర్ తెరవండి' : language === 'HI' ? 'क्रॉप डॉक्टर खोलें' : 'Open Crop Doctor', tab: 'crop-doctor' },
          { label: language === 'TE' ? 'పంట క్యాలెండర్' : language === 'HI' ? 'फसल कैलेंडर' : 'Crop Calendar', tab: 'crop-calendar' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleVoiceSim = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      const voiceQuery =
        language === 'TE'
          ? 'తుఫాను సమయంలో వరి పంటను ఎలా కాపాడాలి?'
          : language === 'HI'
          ? 'चक्रवात में धान की फसल कैसे बचाएं?'
          : 'How to protect paddy crop from incoming cyclone?';
      handleSend(voiceQuery);
    }, 1800);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] flex flex-col shadow-2xl overflow-hidden relative border border-[#d5e7db]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#113e2e] to-[#1b5e40] text-white p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#e5b54f] border border-white/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif">{t('modals.dostAiTitle')}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
                  <span>{currentLanguage.flag || '🌐'}</span>
                  <span>{currentLanguage.nativeName}</span>
                </span>
              </div>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#3fb968] animate-pulse"></span>
                <span>{t('modals.dostAiStatus')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScan && (
              <button
                onClick={onOpenScan}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition"
              >
                <Camera className="w-4 h-4 text-[#e5b54f]" />
                <span>{t('overview.scanAction')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8faf8]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-[#1b5e40] text-white'
                    : 'bg-emerald-100 text-[#113e2e] border border-emerald-200'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#113e2e] text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-tl-xs border border-[#dce7de] shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`mt-1 text-[10px] ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Interactive Action Shortcuts attached to AI message */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#eaf2eb] flex flex-wrap gap-2">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (act.tab) {
                            setActiveTab(act.tab);
                            onClose();
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#f0f7f2] hover:bg-[#e0efe3] text-[#113e2e] text-xs font-semibold border border-[#cbe1d2] transition flex items-center gap-1 group"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#113e2e] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 border border-[#dce7de] flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#113e2e] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#113e2e] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#113e2e] animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px] text-slate-600 font-medium">Dost AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-[#f0f5f1] border-t border-[#e1ece2] flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            {t('modals.quickQuestions')}:
          </span>
          {getLocalizedSuggestions().map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.label)}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#e7f2e8] text-slate-700 hover:text-[#113e2e] text-[11px] font-medium border border-[#d2e2d5] transition shrink-0 shadow-xs"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#dce7de]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceSim}
              className={`p-2.5 rounded-xl border transition ${
                voiceActive
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-[#f0f7f2] hover:bg-[#e4f0e6] text-[#113e2e] border-[#d2e2d5]'
              }`}
              title="Voice Query Simulation"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('modals.dostAiPlaceholder')}
              className="flex-1 bg-[#f8faf8] border border-[#d2e2d5] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#113e2e] focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] disabled:opacity-40 text-white transition shadow-sm"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
