// Web Speech API 日语标准发音工具，支持语速控制、防死锁队列与多平台发音引擎优化

let cachedJapaneseVoice: SpeechSynthesisVoice | null = null;
let isVoiceInitialized = false;

function initVoices(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 优先级排序查找最佳东京腔日语语音包（优先选用微软/谷歌高质量自然音）
    const jpVoice = 
      voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Nanami') || v.name.includes('Keiko'))) ||
      voices.find(v => v.lang === 'ja-JP' || v.lang.replace('_', '-').toLowerCase() === 'ja-jp') ||
      voices.find(v => v.lang.startsWith('ja') || v.name.toLowerCase().includes('japanese') || v.name.includes('日本語'));

    if (jpVoice) {
      cachedJapaneseVoice = jpVoice;
      isVoiceInitialized = true;
      return jpVoice;
    }
  } catch (e) {
    console.warn('[Speech] Voice init warning:', e);
  }
  return null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    initVoices();
  };
}

let activeTimeout: any = null;

export function speakJapanese(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text || !text.trim()) {
      resolve();
      return;
    }

    try {
      // 1. 清理上一条播放与定时器，防止死锁
      if (activeTimeout) {
        clearTimeout(activeTimeout);
        activeTimeout = null;
      }
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // 2. 获取/刷新日语音包
      const voice = cachedJapaneseVoice || initVoices();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'ja-JP';
      utterance.rate = Math.max(0.6, Math.min(1.8, rate));
      utterance.pitch = 1.0;
      if (voice) {
        utterance.voice = voice;
      }

      let isFinished = false;
      const safeDone = () => {
        if (!isFinished) {
          isFinished = true;
          if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
          }
          resolve();
        }
      };

      utterance.onend = safeDone;
      utterance.onerror = () => {
        safeDone();
      };

      // 3. 兜底安全定时器
      const estimatedMs = Math.max(2500, (text.length / 3) * 1000 * (1.2 / rate));
      activeTimeout = setTimeout(() => {
        safeDone();
      }, estimatedMs + 1500);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[Speech] Speak execution error:', err);
      resolve();
    }
  });
}

// 保持向后兼容别名
export const speakKorean = speakJapanese;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (activeTimeout) {
      clearTimeout(activeTimeout);
      activeTimeout = null;
    }
    window.speechSynthesis.cancel();
  }
}
