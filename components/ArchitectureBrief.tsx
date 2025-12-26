
import React from 'react';

export const ArchitectureBrief: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border-white/10 mt-12 max-w-4xl mx-auto">
      <h3 className="text-xl font-display font-bold mb-4 gold-gradient">System Architecture Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-400">
        <div>
          <h4 className="text-white font-semibold mb-2">Core Pipeline</h4>
          <ul className="space-y-2 list-disc pl-4">
            <li><span className="text-zinc-200">Face Synthesis:</span> Utilizing Gemini Veo 3.1 for high-fidelity temporal consistency and realistic facial texture.</li>
            <li><span className="text-zinc-200">Expression Mapping:</span> Prompt-guided emotional weighting to ensure natural micro-expressions.</li>
            <li><span className="text-zinc-200">Gesture Engine:</span> Parametric control of torso and hand movement via Gemini's video latent space.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Production Stack</h4>
          <ul className="space-y-2 list-disc pl-4">
            <li><span className="text-zinc-200">API:</span> Google GenAI SDK (Veo 3.1 Fast Preview).</li>
            <li><span className="text-zinc-200">Frontend:</span> React 18, TypeScript, Tailwind CSS.</li>
            <li><span className="text-zinc-200">Scaling:</span> Asynchronous operation polling with exponential backoff for large-batch processing.</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="italic text-xs text-zinc-500">
          Note: This MVP utilizes the Gemini Veo 3.1 model for end-to-end video synthesis. 
          In a production environment, frame-accurate lip-sync is typically refined using a dedicated audio-to-motion GAN 
          (e.g., Wav2Lip-HD or SadTalker) as an intermediate step within the Vertex AI pipeline.
        </p>
      </div>
    </div>
  );
};
