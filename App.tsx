import React from 'react';
import { Scene } from './Scene';
import { useStore } from './store';
import { TreeState } from './types';

function App() {
  const { treeState, toggleTreeState, activeLocketId } = useStore();
  const isTree = treeState === TreeState.TREE_SHAPE;

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div>
             <h1 className="text-4xl font-serif text-[#ffd700] tracking-widest uppercase drop-shadow-lg">
              Arix Signature
            </h1>
            <p className="text-[#00ff88] text-sm tracking-[0.3em] font-light mt-2 uppercase opacity-80">
              Interactive Holiday Experience
            </p>
          </div>
        </header>

        {/* Dynamic Center Interaction Message */}
        {activeLocketId && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="translate-y-48 text-center animate-pulse">
               <p className="text-[#ffd700] text-xs tracking-widest uppercase mb-1">Decembris Collection</p>
               <div className="w-1 h-8 bg-gradient-to-b from-[#ffd700] to-transparent mx-auto"></div>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <footer className="flex justify-center items-end pointer-events-auto pb-8">
          <button
            onClick={toggleTreeState}
            disabled={!!activeLocketId}
            className={`
              group relative px-8 py-3 
              border border-[#ffd700] 
              transition-all duration-700 ease-out
              overflow-hidden
              ${activeLocketId ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ffd700]/10 cursor-pointer'}
            `}
          >
            {/* Background Fill Animation */}
            <span className={`absolute inset-0 bg-[#ffd700] transform origin-left transition-transform duration-500 ease-out ${isTree ? 'scale-x-100' : 'scale-x-0'}`}></span>
            
            {/* Text */}
            <span className={`relative z-10 font-serif tracking-widest uppercase text-sm transition-colors duration-500 ${isTree ? 'text-black' : 'text-[#ffd700]'}`}>
              {isTree ? 'Disperse Elements' : 'Assemble Tree'}
            </span>
          </button>
        </footer>
      </div>
      
      {/* Vignette Overlay for extra depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
    </div>
  );
}

export default App;
