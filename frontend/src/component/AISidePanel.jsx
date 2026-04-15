import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/StudioPage.module.css";
import ChatBubble from "./ChatBubble";
import InputBar from "./InputBar";
 
// ─────────────────────────────────────────────────────────────────
//  MOCK SWITCH
//  Set to false when Spring Boot backend is running
// ─────────────────────────────────────────────────────────────────
const USE_MOCK = true;
 
// ─────────────────────────────────────────────────────────────────
//  MOCK ENGINE
//  Reads keywords from the user prompt and returns a realistic
//  response that matches the shape the real backend will return:
//  { reply: string, specs: object, imageUrl: string }
// ─────────────────────────────────────────────────────────────────
const MOCK_DESIGN_IMAGE = "../assets/Bague.jpg"; // Replace with your local image URL or a placeholder image URL
   // Replace with your local image URL or a placeholder image URL
  // ↑ Replace this with any ring/jewelry image URL you have locally,
  //   e.g. "/assets/sample-ring.png" from your public folder.
  //   Using a placeholder URL here so the image viewer has something to show.
 
const METAL_MAP = {
  "rose gold":  { label: "Rose Gold",  metalKey: "verdigris" },
  "platinum":   { label: "Platinum",   metalKey: "jade"      },
  "silver":     { label: "Silver 925", metalKey: "malachite" },
  "white gold": { label: "Silver 925", metalKey: "malachite" },
};
const DEFAULT_METAL = { label: "18k Gold", metalKey: "emerald" };
 
const STONE_MAP = {
  ruby:     "Ruby",
  sapphire: "Sapphire",
  diamond:  "Diamond",
  emerald:  "Green Emerald",
  pearl:    "Pearl",
  opal:     "Opal",
};
const DEFAULT_STONE = "Green Emerald";
 
const SIZE_REGEX = /\b(size\s*[:#]?\s*)?(\d{1,2}(\.\d)?)\b/i;
 
const AI_REPLIES = [
  "Your design has been generated ✦ You can see the 2D preview on the left. Switch metal finishes to explore variations.",
  "Beautiful choice! I've applied your specifications. Check the preview panel and adjust the finish if you'd like.",
  "Your bespoke piece is ready for preview. Measurements and estimated cost have been updated.",
  "Done ✦ The design reflects your description. Feel free to describe any modifications.",
];
 
function mockGenerate(prompt) {
  const lower = prompt.toLowerCase();
 
  // Detect metal
  let metal = DEFAULT_METAL;
  for (const [keyword, value] of Object.entries(METAL_MAP)) {
    if (lower.includes(keyword)) { metal = value; break; }
  }
 
  // Detect stone
  let stone = DEFAULT_STONE;
  for (const [keyword, label] of Object.entries(STONE_MAP)) {
    if (lower.includes(keyword)) { stone = label; break; }
  }
 
  // Detect size
  const sizeMatch = lower.match(SIZE_REGEX);
  const size = sizeMatch ? sizeMatch[2] : "18";
 
  // Build a short design name from the prompt
  const name = prompt.length > 38 ? prompt.slice(0, 38) + "…" : prompt;
 
  // Estimate weight and cost (very rough mock values)
  const baseWeight = 3.0 + Math.random() * 2;
  const baseCost   = 1800 + Math.random() * 2000;
 
  const specs = {
    name,
    metal:   metal.label,
    metalKey: metal.metalKey,
    stone,
    size,
    weight: `${baseWeight.toFixed(1)} g`,
    cost:   `${baseCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $`,
  };
 
  const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
 
  return { reply, specs, imageUrl: MOCK_DESIGN_IMAGE };
}
 
// ─────────────────────────────────────────────────────────────────
 
const INITIAL_MESSAGES = [
  {
    role: "ai",
    text: "Welcome to PrizmaGold Studio ✦ I can turn your imagination into a bespoke jewellery design.",
  },
  {
    role: "ai",
    text: 'Describe your masterpiece — e.g. "Modern rose gold ring with a floating pear-cut emerald" — and I\'ll generate a 2D preview.',
  },
];
 
const AISidePanel = ({ onDesignUpdate, currentSpecs }) => {
  const sessionId  = useRef(crypto.randomUUID());
  const [messages,   setMessages]   = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading,  setIsLoading]  = useState(false);
  const chatEndRef = useRef(null);
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const handleSend = async () => {
    const prompt = inputValue.trim();
    if (!prompt || isLoading) return;
 
    setInputValue("");
    setMessages(prev => [
      ...prev,
      { role: "user", text: prompt },
      { role: "ai",   text: "",    isTyping: true },
    ]);
    setIsLoading(true);
 
    try {
      let data;
 
      if (USE_MOCK) {
        // ── MOCK PATH: simulate network delay then return fake data ──
        await new Promise(resolve => setTimeout(resolve, 1600));
        data = mockGenerate(prompt);
      } else {
        // ── REAL PATH: call Spring Boot backend ──
        const res = await fetch("http://localhost:8080/api/generate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            sessionId: sessionId.current,
            history: messages.map(m => ({
              role:    m.role === "user" ? "user" : "assistant",
              content: m.text,
            })),
            currentSpecs,
          }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        data = await res.json();
      }
 
      onDesignUpdate?.(data.specs, data.imageUrl);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", text: data.reply },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: "ai",
          text: "⚠️ Error connecting to server. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <section className={styles.aiPanel}>
      <div className={styles.aiOverlay}>
        <h2 className={styles.aiTitle}>What's on your mind!</h2>
 
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>
            {USE_MOCK ? "PrizmaGold AI · Mock Mode" : "PrizmaGold AI · Design Studio"}
          </span>
        </div>
 
        <div className={styles.chatArea}>
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} isTyping={msg.isTyping}>
              {msg.text}
            </ChatBubble>
          ))}
          <div ref={chatEndRef} />
        </div>
 
        <InputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </section>
  );
};
 
export default AISidePanel;