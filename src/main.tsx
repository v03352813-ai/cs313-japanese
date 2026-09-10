import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Vercel 官方 Web Analytics 实时访客统计与 Speed Insights 性能监测 (与七宗罪项目保持一致)
if (typeof window !== 'undefined') {
  (window as any).va = (window as any).va || function () { ((window as any).vaq = (window as any).vaq || []).push(arguments); };
  (window as any).si = (window as any).si || function () { ((window as any).siq = (window as any).siq || []).push(arguments); };
  
  if (!document.querySelector('script[src*="/_vercel/insights"]')) {
    const vaScript = document.createElement('script');
    vaScript.defer = true;
    vaScript.src = '/_vercel/insights/script.js';
    document.head.appendChild(vaScript);

    const siScript = document.createElement('script');
    siScript.defer = true;
    siScript.src = '/_vercel/speed-insights/script.js';
    document.head.appendChild(siScript);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
