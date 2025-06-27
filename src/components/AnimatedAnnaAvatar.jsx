import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Mic } from 'lucide-react';

const AnimatedAnnaAvatar = ({ isVisible, onToggle, lang }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef(null);
  const speechQueueRef = useRef([]);
  const isProcessingRef = useRef(false);

  // Text-Vorverarbeitung für bessere Sprachausgabe
  const preprocessText = (text) => {
    // Entferne Emojis
    let cleanText = text.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '');
    
    // Entferne zusätzliche Emoji-Zeichen
    cleanText = cleanText.replace(/[⛷️🎿🏞️🏔️🏨✅📧📄📎✨💡📍🗓️📅📂👤🎒🧒🧑👩‍💼⭐️🏂⛑️☂️]/g, '');
    
    // Entferne Klammern und deren Inhalt
    cleanText = cleanText.replace(/\([^)]*\)/g, '');
    cleanText = cleanText.replace(/\[[^\]]*\]/g, '');
    
    // Ersetze Sonderzeichen
    cleanText = cleanText.replace(/€/g, 'Euro');
    cleanText = cleanText.replace(/\+/g, 'plus');
    cleanText = cleanText.replace(/&/g, 'und');
    cleanText = cleanText.replace(/@/g, 'at');
    cleanText = cleanText.replace(/#/g, 'Nummer');
    cleanText = cleanText.replace(/%/g, 'Prozent');
    
    // Bereinige mehrfache Leerzeichen
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    // Entferne leere Sätze
    cleanText = cleanText.replace(/\.\s*\./g, '.');
    
    return cleanText;
  };

  // IMPROVED: Stop all current speech immediately
  const stopAllSpeech = () => {
    // Clear queue completely
    speechQueueRef.current = [];
    isProcessingRef.current = false;
    
    // Stop current audio immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to beginning
      audioRef.current = null;
    }
    
    // Stop browser TTS
    window.speechSynthesis.cancel();
    
    // Reset states
    setIsSpeaking(false);
    setIsLoading(false);
  };

  // Process speech queue
  const processQueue = async () => {
    if (isProcessingRef.current || speechQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const text = speechQueueRef.current.shift();

    try {
      await speakWithAzure(text);
    } catch (error) {
      console.error('Speech error:', error);
    }

    isProcessingRef.current = false;
    
    // Process next item in queue
    if (speechQueueRef.current.length > 0) {
      setTimeout(processQueue, 100); // Shorter delay
    }
  };

  // Azure TTS - Haupt-Sprachfunktion
  const speakWithAzure = async (text) => {
    const cleanedText = preprocessText(text);
    
    if (!cleanedText || cleanedText.length < 2) {
      console.log('Text zu kurz oder leer nach Bereinigung');
      return;
    }
    
    setIsSpeaking(true);
    setIsLoading(true);

    try {
      console.log(`🎙️ Azure TTS für: "${cleanedText.substring(0, 50)}..."`);
      
      const response = await fetch('http://localhost:3001/api/tts/azure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanedText,
          lang: lang
        })
      });

      if (!response.ok) {
        throw new Error(`Azure TTS request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.audio) {
        // Check if we should still play (queue might have been cleared)
        if (speechQueueRef.current.length === 0 || isProcessingRef.current) {
          // Audio abspielen
          const audio = new Audio(data.audio);
          audioRef.current = audio;
          
          audio.volume = isMuted ? 0 : 1;
          
          audio.onended = () => {
            setIsSpeaking(false);
            audioRef.current = null;
          };
          
          audio.onerror = (error) => {
            console.error('Audio playback error:', error);
            setIsSpeaking(false);
            audioRef.current = null;
          };
          
          // Check again before playing
          if (isProcessingRef.current) {
            await audio.play();
            console.log(`✅ Azure TTS erfolgreich - Stimme: ${data.voice}`);
          }
        }
        
      } else {
        throw new Error('Azure TTS returned no audio data');
      }
      
    } catch (error) {
      console.error('🚨 Azure TTS Error:', error);
      
      // Fallback zu Browser-TTS nur wenn wir noch aktiv sind
      if (isProcessingRef.current) {
        console.log('🔄 Fallback zu Browser-TTS...');
        fallbackToBrowserTTS(cleanedText);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback Browser-TTS
  const fallbackToBrowserTTS = (text) => {
    // Check if we should still speak
    if (!isProcessingRef.current) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Bessere Stimmenauswahl für Österreich/Deutschland
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(voice => 
      (lang === 'de' && (voice.lang.includes('de') || voice.lang.includes('at'))) ||
      (lang === 'en' && voice.lang.includes('en'))
    );
    
    if (preferredVoices.length > 0) {
      // Bevorzuge weibliche Stimmen
      const femaleVoice = preferredVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('anna') ||
        voice.name.toLowerCase().includes('maria') ||
        voice.name.toLowerCase().includes('ingrid')
      );
      
      utterance.voice = femaleVoice || preferredVoices[0];
    }
    
    utterance.lang = lang === 'de' ? 'de-AT' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    // Check once more before speaking
    if (isProcessingRef.current) {
      window.speechSynthesis.speak(utterance);
    }
  };

  // IMPROVED: Public speak function with immediate stop
  const speak = (text) => {
    // FIRST: Stop everything immediately
    stopAllSpeech();
    
    // Wait a bit for cleanup, then add new text
    setTimeout(() => {
      speechQueueRef.current = [text]; // Replace queue completely
      processQueue();
    }, 50);
  };

  // Expose speak function
  useEffect(() => {
    window.annaAvatar = { speak };
  }, [isMuted, lang]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="bg-[#ec0008] text-white rounded-full p-4 shadow-2xl hover:bg-[#d00007] transition-all transform hover:scale-110"
          aria-label={lang === 'de' ? 'Avatar einblenden' : 'Show avatar'}
        >
          <span className="text-3xl">👩‍💼</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Schließen Button */}
      <button
        onClick={onToggle}
        className="absolute top-0 right-0 bg-[#ec0008] text-white rounded-full p-2 shadow-lg hover:bg-[#d00007] transition-all z-10"
        aria-label={lang === 'de' ? 'Avatar ausblenden' : 'Hide avatar'}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Avatar ohne Rahmen - direkt und größer */}
      <div className="relative">
        {/* Avatar Bild */}
        <div className={`relative ${isSpeaking ? 'animate-gentle-float' : ''}`}>
          <img 
            src="/assets/anna-avatar.png" 
            alt="Anna - Sport2000" 
            className="w-96 h-96 object-contain filter drop-shadow-2xl"
            style={{
              filter: isSpeaking 
                ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 30px rgba(236, 0, 8, 0.5))' 
                : 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          {/* Fallback Avatar wenn Bild fehlt */}
          <div className="fallback-avatar absolute inset-0 flex items-center justify-center">
            <div className={`bg-gradient-to-br from-[#ec0008] to-[#d00007] rounded-full p-16 shadow-2xl ${isSpeaking ? 'animate-pulse' : ''}`}
                 style={{
                   boxShadow: isSpeaking 
                     ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 40px rgba(236, 0, 8, 0.6)' 
                     : '0 25px 50px rgba(0, 0, 0, 0.3)'
                 }}>
              <span className="text-8xl">👩‍💼</span>
            </div>
          </div>
        </div>

        {/* Anna Name Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-lg">
            <span className="text-sm font-bold text-gray-800">Anna</span>
          </div>
        </div>

        {/* Speaking/Loading Indicator - NUR wenn aktiv */}
        {(isSpeaking || isLoading) && (
          <div className="absolute top-4 right-4">
            <div className={`${isLoading ? 'bg-blue-500' : 'bg-green-500'} rounded-full p-3 shadow-lg animate-pulse`}>
              <Mic className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* REMOVED: Alle technischen Badges entfernt! */}
        
        {/* Sport2000 Logo klein unten links */}
        <div className="absolute bottom-4 left-4">
          <img src="/assets/Sport_2000_rgb.png" alt="Sport2000" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        {/* Control Buttons - Vereinfacht */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {isSpeaking && (
            <button
              onClick={stopAllSpeech}
              className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              aria-label={lang === 'de' ? 'Stoppen' : 'Stop'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={toggleMute}
            className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label={isMuted ? (lang === 'de' ? 'Ton einschalten' : 'Unmute') : (lang === 'de' ? 'Ton ausschalten' : 'Mute')}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAnnaAvatar;