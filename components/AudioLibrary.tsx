import React, { useState, useRef } from 'react';
import { UserSettings, AudioTrack, Language } from '../types';
import { UI_TEXT, AUDIO_TRACKS } from '../constants';
import { Play, Pause, BookOpen, HeartHandshake } from 'lucide-react';

interface Props {
  settings: UserSettings;
}

const AudioLibrary: React.FC<Props> = ({ settings }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const t = UI_TEXT[settings.language];
  const isArabic = settings.language === Language.ARABIC;

  const handlePlay = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Wait for React to update the ref source
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    }
  };

  const getIcon = (category: string) => {
    switch(category) {
      case 'quran': return <BookOpen size={18} />;
      case 'dua': return <HeartHandshake size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'quran': return t.quran;
      case 'dua': return t.dua;
      default: return category;
    }
  };

  return (
    <div className={`p-4 pb-24 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <h1 className="text-2xl font-bold text-emerald-900 mb-2">{t.audio}</h1>

      {/* Now Playing Card */}
      {currentTrack && (
        <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-1">{t.nowPlaying}</p>
              <h3 className="text-xl font-bold font-serif mb-1">
                {isArabic ? currentTrack.titleAr : currentTrack.titleEn}
              </h3>
              <p className="text-emerald-200 text-sm">
                {isArabic ? currentTrack.artistAr : currentTrack.artistEn}
              </p>
            </div>
            
            <button 
              onClick={() => handlePlay(currentTrack)}
              className="w-12 h-12 bg-white text-emerald-900 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-50 transition-colors"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <audio 
            ref={audioRef}
            src={currentTrack.url}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="hidden" 
          />
        </div>
      )}

      {/* Track List */}
      <div className="space-y-4">
        {['quran', 'dua'].map(category => {
          const categoryTracks = AUDIO_TRACKS.filter(track => track.category === category);
          if (categoryTracks.length === 0) return null;

          return (
            <div key={category}>
               <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
                 {getIcon(category)}
                 {getCategoryName(category)}
               </h3>
               <div className="bg-white rounded-xl shadow-sm border border-emerald-50 divide-y divide-emerald-50">
                 {categoryTracks.map(track => {
                   const isActive = currentTrack?.id === track.id;
                   
                   return (
                     <button
                       key={track.id}
                       onClick={() => handlePlay(track)}
                       className={`w-full p-4 flex items-center gap-4 hover:bg-emerald-50/50 transition-colors text-left ${isArabic ? 'text-right' : ''}`}
                     >
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive && isPlaying ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isActive && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                       </div>
                       
                       <div className="flex-1">
                          <p className={`font-medium ${isActive ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {isArabic ? track.titleAr : track.titleEn}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isArabic ? track.artistAr : track.artistEn}
                          </p>
                       </div>
                       
                       {track.duration && (
                         <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                           {track.duration}
                         </span>
                       )}
                     </button>
                   );
                 })}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioLibrary;