import React, { useEffect, useRef, useState } from "react";

// 👇 Add this before your component imports in ChatUIEnhancements.tsx
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface ISpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    onresult: ((event: any) => void) | null;
    onstart: (() => void) | null;
    onend: (() => void) | null;
  }
}


/* ---------- Types ---------- */
type MessageType = {
  id: number;
  author: string;
  text: string;
  user?: boolean;
  reaction?: string;
};

type Theme = {
  id: string;
  name: string;
  css: string;
};

type ChatUIEnhancementsProps = {
  onSendMessage?: (text: string) => Promise<string> | string;
};

/* ---------- Helpers ---------- */
const defaultThemes: Theme[] = [
  { id: "ocean", name: "Ocean", css: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "sunset", name: "Sunset", css: "bg-gradient-to-r from-pink-400 via-rose-500 to-yellow-400" },
  { id: "neon", name: "Neon", css: "bg-gradient-to-r from-fuchsia-500 via-violet-600 to-sky-400" },
];

/* ---------- Avatar ---------- */
function Avatar({ src, name, active }: { src: string; name: string; active: boolean }) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-lg ${
          active ? "animate-pulse-slow ring-4 ring-opacity-30" : ""
        }`}
        style={{
          boxShadow: active
            ? "0 8px 30px rgba(99,102,241,0.25)"
            : "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" />
        {active && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.25)" }}
          />
        )}
      </div>
      <div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}

/* ---------- Typing Indicator ---------- */
function TypingIndicator() {
  return (
    <div className="inline-flex items-center px-3 py-2 bg-white/30 backdrop-blur-sm rounded-full shadow-sm">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Message with reactions ---------- */
function Message({
  author,
  text,
  isUser,
  onReact,
}: {
  author: string;
  text: string;
  isUser?: boolean;
  onReact?: (reaction: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const reactions = ["👍", "❤️", "😂", "🔥", "🤔"];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && <Avatar src={`https://i.pravatar.cc/40?u=${author}`} name={author} active={false} />}
      <div className="max-w-[65%]">
        <div
          className={`rounded-2xl px-4 py-3 shadow-md text-white ${
            isUser
              ? "bg-linear-to-r from-cyan-400 to-blue-400"
              : "bg-linear-to-r from-pink-500 to-rose-500"
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>

        {showReactions && (
          <div className="mt-1 flex space-x-2">
            {reactions.map((r) => (
              <button
                key={r}
                className="p-1 text-sm rounded bg-white/10 hover:bg-white/20"
                onClick={() => onReact && onReact(r)}
                aria-label={`React ${r}`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="ml-3">
          <Avatar src={`https://i.pravatar.cc/40?u=user`} name="You" active={false} />
        </div>
      )}
    </div>
  );
}

/* ---------- Simple Canvas Confetti ---------- */
function ConfettiCanvas({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0 && p.y < h + 50);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!trigger) return;
    const x = window.innerWidth - 120;
    const y = window.innerHeight - 80;
    const colors = ["#ff6b6b", "#ffd166", "#6bf0c7", "#a78bfa", "#60a5fa"];

    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -8 - 2,
        life: Math.random() * 60 + 60,
        size: Math.random() * 6 + 4,
        color: colors[(Math.random() * colors.length) | 0],
      });
    }
  }, [trigger]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />;
}

/* ---------- Voice Mode ---------- */
function useVoice({
  onResult,
  onStart,
  onEnd,
}: {
  onResult?: (text: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const recogRef = useRef<any | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

   recog.onresult = (e: any) => {
  const text = e.results[0][0].transcript;
  onResult?.(text);
};

    recog.onstart = () => onStart?.();
    recog.onend = () => onEnd?.();
    recogRef.current = recog;

    return () => {
      try {
        recog.stop?.();
      } catch {
        /* ignore */
      }
    };
  }, [onResult, onStart, onEnd]);

  const start = () => recogRef.current?.start?.();
  const stop = () => recogRef.current?.stop?.();
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return { start, stop, speak };
}

/* ---------- Main Component ---------- */
export default function ChatUIEnhancements({ onSendMessage }: ChatUIEnhancementsProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    { id: 1, author: "ChatFee", text: "Hello! How can I assist you today?" },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultThemes[0]);
  const [customGradient, setCustomGradient] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [listening, setListening] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { start, stop, speak } = useVoice({
    onResult: (text) => {
      setInput((prev) => (prev ? `${prev} ${text}` : text));
      setListening(false);
    },
    onStart: () => setListening(true),
    onEnd: () => setListening(false),
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: MessageType = { id: Date.now(), author: "You", text: input.trim(), user: true };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setConfettiTrigger((t) => !t);

    try {
      const reply = await Promise.resolve(
        onSendMessage ? onSendMessage(input.trim()) : `You said: ${input.trim()}`
      );
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, author: "ChatFee", text: String(reply) },
        ]);
        setTyping(false);
        speak(String(reply));
      }, 700 + Math.random() * 700);
    } catch {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 2, author: "ChatFee", text: "Oops — there was a problem." },
      ]);
      setTyping(false);
    }
  };

  const handleReact = (msgId: number, reaction: string) => {
    setMessages((m) => m.map((x) => (x.id === msgId ? { ...x, reaction } : x)));
  };

  useEffect(() => {
    if (audioRef.current) {
      if (musicOn) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [musicOn]);

  return (
    <div className={`min-h-screen flex ${theme.css} transition-colors duration-400`}>
      <ConfettiCanvas trigger={confettiTrigger} />

      {/* Sidebar */}
      <aside className="w-72 p-6 bg-white/8 backdrop-blur-sm text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">✨ ChatFee AI</h2>
          <p className="text-sm opacity-80">Your friendly assistant</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Theme</label>
          <div className="flex space-x-2">
            {defaultThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t);
                  setCustomGradient("");
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  theme.id === t.id ? "ring-2 ring-white/40" : "opacity-90"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Custom Gradient</label>
          <input
            type="text"
            placeholder="e.g. from-[#123456] to-[#ff7b7b]"
            className="w-full rounded px-3 py-2 text-black"
            value={customGradient}
            onChange={(e) => {
              setCustomGradient(e.target.value);
              setTheme({
                id: "custom",
                name: "Custom",
                css: customGradient ? `bg-gradient-to-r ${customGradient}` : "",
              });
            }}
          />
          <p className="text-xs mt-1 opacity-80">Use Tailwind-style tokens</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Background Music</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMusicOn((v) => !v)}
              className="px-3 py-2 bg-white/20 rounded text-sm"
            >
              {musicOn ? "Turn Off" : "Turn On"}
            </button>
            <audio
              ref={audioRef}
              loop
              src="https://cdn.pixabay.com/download/audio/2022/08/15/audio_3a7b227d22.mp3?filename=ambient-11096.mp3"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm mb-2">Voice</label>
          <div className="flex space-x-2">
            <button onClick={start} className="px-3 py-2 bg-white/20 rounded">
              Start Listening
            </button>
            <button onClick={stop} className="px-3 py-2 bg-white/20 rounded">
              Stop
            </button>
          </div>
          <p className="text-xs mt-2 opacity-80">Use browser speech recognition</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar src="https://i.pravatar.cc/80?u=chatfee" name="ChatFee AI" active={typing} />
              <div>
                <div className="font-semibold">ChatFee AI</div>
                <div className="text-xs opacity-70">Smart conversational assistant</div>
              </div>
            </div>
            {listening && <div className="text-xs bg-red-500 px-2 py-1 rounded">Listening...</div>}
          </div>

          {/* Messages */}
          <div className="h-[60vh] overflow-auto p-4 rounded-lg bg-white/5">
            {messages.map((m) => (
              <div key={m.id}>
                <Message
                  author={m.author}
                  text={m.text}
                  isUser={m.user}
                  onReact={(r) => handleReact(m.id, r)}
                />
                {m.reaction && (
                  <div className="text-sm ml-4 opacity-90">Reaction: {m.reaction}</div>
                )}
              </div>
            ))}
            {typing && (
              <div className="mt-2">
                <TypingIndicator />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mt-4 flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 px-4 py-3 rounded-full bg-white/90 text-black shadow-inner"
              placeholder="Type your message or press Start Listening..."
            />
            <button
              onClick={handleSend}
              className="px-5 py-3 rounded-full text-white font-semibold bg-linear-to-r from-purple-500 to-pink-500 shadow-lg"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
