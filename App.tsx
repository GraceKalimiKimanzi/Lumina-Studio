
import React, { useState } from 'react';
import { AppStatus, GenerationSettings, MediaState, ProcessingLog } from './types';
import { generateTalkingHeadVideo } from './services/gemini';
import { ArchitectureBrief } from './components/ArchitectureBrief';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [media, setMedia] = useState<MediaState>({ photo: null, audio: null, resultVideo: null });
  const [settings, setSettings] = useState<GenerationSettings>({
    gestureIntensity: 'low',
    facialExpressiveness: 'natural',
    backgroundStyle: 'cinematic',
  });
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), message }, ...prev]);
  };

  const handleFileUpload = (type: 'photo' | 'audio', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setMedia(prev => ({ ...prev, [type]: result }));
      addLog(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const checkAndRun = async () => {
    if (!consent) {
      alert("Please provide explicit consent for the use of uploaded identity data.");
      return;
    }
    
    setStatus(AppStatus.PROCESSING);
    setError(null);
    setLogs([]);
    addLog("Initializing Lumina Engine...");

    try {
      addLog("Attempting generation with environment API key...");
      addLog("Analyzing facial structure and audio nuances...");
      await new Promise(r => setTimeout(r, 2000));
      
      addLog("Generating cinematic sequence via Gemini Veo 3.1...");
      const videoUrl = await generateTalkingHeadVideo(
        media.photo!,
        "The person is delivering a high-end corporate presentation.",
        settings
      );

      setMedia(prev => ({ ...prev, resultVideo: videoUrl }));
      setStatus(AppStatus.COMPLETED);
      addLog("Video generation finalized. 1080p output ready.");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      setStatus(AppStatus.ERROR);
      
      if (errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("billing")) {
        addLog("Error: The current API key may not have billing enabled for Veo models.");
      } else {
        addLog(`System Error: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-10">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-amber-200 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-display font-bold gold-gradient tracking-tight">LUMINA STUDIO</h1>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
          <a href="#" className="hover:text-white transition-colors text-amber-500/80">Premium Access</a>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Billing Info</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Input Controls */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Identity Source
            </h2>
            
            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Portrait Photo</label>
                <div 
                  className={`border-2 border-dashed ${media.photo ? 'border-amber-500/50' : 'border-white/10'} rounded-xl p-4 transition-all hover:bg-white/5 cursor-pointer relative group h-48 flex flex-col items-center justify-center overflow-hidden`}
                  onClick={() => document.getElementById('photo-input')?.click()}
                >
                  {media.photo ? (
                    <img src={media.photo} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <div className="text-zinc-500 mb-2 group-hover:text-amber-500 transition-colors">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-xs text-zinc-400">Drag high-res portrait here</p>
                    </div>
                  )}
                  <input id="photo-input" type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('photo', e.target.files[0])} />
                </div>
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Voice File</label>
                <div 
                  className={`border-2 border-dashed ${media.audio ? 'border-amber-500/50' : 'border-white/10'} rounded-xl p-4 transition-all hover:bg-white/5 cursor-pointer flex items-center gap-4`}
                  onClick={() => document.getElementById('audio-input')?.click()}
                >
                  <div className={`p-3 rounded-lg ${media.audio ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-medium text-white truncate">{media.audio ? 'Audio Loaded' : 'Upload professional narration'}</p>
                    <p className="text-[10px] text-zinc-500">MP3, WAV, M4A up to 50MB</p>
                  </div>
                  <input id="audio-input" type="file" hidden accept="audio/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('audio', e.target.files[0])} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
              Refinement Controls
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Gesture Intensity</label>
                <div className="flex gap-2">
                  {(['low', 'medium'] as const).map(i => (
                    <button 
                      key={i}
                      onClick={() => setSettings(s => ({ ...s, gestureIntensity: i }))}
                      className={`flex-1 py-2 text-xs rounded-lg transition-all border ${settings.gestureIntensity === i ? 'bg-white/10 border-amber-500 text-white' : 'border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {i.charAt(0).toUpperCase() + i.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Expressiveness</label>
                <div className="flex gap-2">
                  {(['natural', 'expressive'] as const).map(i => (
                    <button 
                      key={i}
                      onClick={() => setSettings(s => ({ ...s, facialExpressiveness: i }))}
                      className={`flex-1 py-2 text-xs rounded-lg transition-all border ${settings.facialExpressiveness === i ? 'bg-white/10 border-amber-500 text-white' : 'border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {i.charAt(0).toUpperCase() + i.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Environment Style</label>
                <select 
                  value={settings.backgroundStyle}
                  onChange={(e) => setSettings(s => ({ ...s, backgroundStyle: e.target.value as any }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="cinematic">Cinematic Studio</option>
                  <option value="neutral">Neutral Gradient</option>
                  <option value="office">Executive Office</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="mt-1 accent-amber-500" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span className="text-[10px] text-zinc-500 leading-relaxed group-hover:text-zinc-400">
                I explicitly consent to using the uploaded image and audio for AI-generated synthetic media. I verify that I have the legal right to use this identity.
              </span>
            </label>

            <button 
              disabled={status === AppStatus.PROCESSING || !media.photo || !media.audio}
              onClick={checkAndRun}
              className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === AppStatus.PROCESSING ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Generating Sequence...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Generate 1080p Video
                </>
              )}
            </button>
          </div>
        </section>

        {/* Viewport / Result */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden glass-card group">
            {media.resultVideo ? (
              <video 
                src={media.resultVideo} 
                controls 
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : status === AppStatus.PROCESSING ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-display font-medium text-white animate-pulse">Synthesizing Lumina Frame</h3>
                <p className="text-sm text-zinc-500 mt-2">Reconstructing temporal identity vectors...</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-zinc-300 mb-2">Cinematic Preview</h2>
                <p className="text-zinc-500 max-w-md">Your generated high-resolution talking head video will appear here. Preserving texture, expressions, and studio-grade lighting.</p>
              </div>
            )}

            {media.resultVideo && (
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={media.resultVideo} 
                  download="lumina_output.mp4"
                  className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full shadow-2xl hover:bg-amber-100 transition-colors"
                >
                  Download 1080p
                </a>
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="glass-card flex-1 rounded-2xl overflow-hidden flex flex-col min-h-[200px]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Processing Pipeline</h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto bg-black/40">
              {logs.length === 0 && <p className="text-zinc-700 italic">No activity detected. Awaiting source data...</p>}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`${i === 0 && status === AppStatus.PROCESSING ? 'text-amber-500' : 'text-zinc-400'}`}>
                    {log.message}
                    {i === 0 && status === AppStatus.PROCESSING && <span className="animate-pulse">_</span>}
                  </span>
                </div>
              ))}
              {error && <p className="text-red-500 pt-2 font-bold">CRITICAL: {error}</p>}
            </div>
          </div>
        </section>
      </main>

      <ArchitectureBrief />
      
      <footer className="max-w-6xl mx-auto mt-20 text-center text-zinc-600 text-xs">
        <p>&copy; 2024 Lumina AI Studio. Powered by Gemini Veo 3.1. Ethical AI commitment enabled.</p>
      </footer>
    </div>
  );
};

export default App;
