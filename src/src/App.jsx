import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are Kaya, the friendly booking agent for Villa Keys — a unique collection of rustic, solar-powered log cabins tucked into a conservation area in Wilderness, Western Cape, South Africa.

## About Villa Keys
- 4 lofted log cabin units at 1224 Cedric Avenue, Wilderness
- Solar-powered, eco-friendly, set in a conservation area
- Only 850m (8-minute walk) to the nearest beach
- 20 minutes from George International Airport — shuttle service available
- Owners: Warren and Trudie Keys | Phone: +27 83 327 0072 | Email: villakeys.wilderness@gmail.com
- Website: www.villakeys.co.za | Office hours: 08:00–18:00

## Each Cabin includes:
- King or Queen bed in loft with en-suite bathroom (shower only)
- Double sleeper couch downstairs
- Kitchenette with fridge and induction/gas cooker
- TV with streaming + uncapped Wi-Fi
- Outside braai or Weber
- Cabin 1 & 2: inside fireplace + sea or mountain views
- Cabin 3: woodfire hot tub 🛁🔥 (very popular!)
- Cabin 1: microwave only (no full cooker)

## Pricing
- Out of season: R1,200/night per cabin (sleeps 2 adults + 2 children, or 3 adults)
- School holidays (Mar/Apr & Sep): R1,500/night
- Peak season (7 Dec – 10 Jan): R2,000/night

## Your Role
You warmly engage travellers who are looking for self-catering accommodation. Your goal is to:
1. Greet them and understand what kind of holiday they're dreaming of
2. Ask about travel dates, group size, and interests (beach, hiking, relaxing, family, romance, etc.)
3. Match them to the right cabin — especially highlight Cabin 3 if they mention romance or hot tubs
4. Share exciting things to do: hiking in the Garden Route, kayaking on the lagoon, whale watching, dining out, beach walks
5. Naturally guide them to book at www.villakeys.co.za/booking or enquire via villakeys.wilderness@gmail.com or +27 83 327 0072
6. Collect their name, email and phone number
7. When you have dates + group size + contact info, present a friendly summary and direct them to the booking page

## Tone
Warm, enthusiastic, knowledgeable about Wilderness. Paint a picture — crackling fireplaces, hot tub under the stars, wine on the deck, forest birdsong at sunrise. Be conversational and concise (2-4 sentences per reply). Ask one or two questions at a time.

Always end conversations by directing them to: www.villakeys.co.za/booking`;

const LOG = "#8B5E3C";
const FOREST = "#2D5016";
const WARM = "#F5ECD7";
const GOLD = "#C9933A";
const DARK = "#1C1208";
const OCEAN = "#3D8B9E";
const SAGE = "#6B8C5A";

const googleFonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Nunito', sans-serif; background: ${WARM}; min-height: 100vh; }
.app { display: flex; flex-direction: column; height: 100vh; max-width: 800px; margin: 0 auto; overflow: hidden; position: relative; }
.header { background: ${DARK}; padding: 0; flex-shrink: 0; position: relative; overflow: hidden; }
.header-bg { background: linear-gradient(160deg, #2a1a08 0%, #1C1208 40%, #0f2010 100%); padding: 18px 22px 14px; position: relative; }
.header-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 50%, rgba(201,147,58,0.12) 0%, transparent 70%); pointer-events: none; }
.brand-row { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.cabin-icon { width: 52px; height: 52px; background: linear-gradient(135deg, ${GOLD}, #a0702a); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 16px rgba(201,147,58,0.4); flex-shrink: 0; }
.brand-text h1 { font-family: 'Playfair Display', serif; color: #fff; font-size: 1.45rem; letter-spacing: 0.01em; line-height: 1.2; }
.brand-text .tagline { color: ${GOLD}; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 2px; }
.status-row { display: flex; align-items: center; justify-content: space-between; }
.status { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: rgba(255,255,255,0.55); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #6fcf97; animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
.visit-btn { background: ${GOLD}; color: ${DARK}; border: none; border-radius: 20px; padding: 5px 14px; font-size: 0.73rem; font-weight: 700; font-family: 'Nunito', sans-serif; cursor: pointer; text-decoration: none; display: inline-block; letter-spacing: 0.02em; transition: background 0.2s; }
.visit-btn:hover { background: #e0a83d; }
.cabins-strip { background: rgba(201,147,58,0.12); border-top: 1px solid rgba(201,147,58,0.2); padding: 8px 22px; display: flex; gap: 6px; overflow-x: auto; }
.cabins-strip::-webkit-scrollbar { display: none; }
.cabin-pill { background: rgba(255,255,255,0.07); border: 1px solid rgba(201,147,58,0.3); border-radius: 20px; padding: 4px 12px; font-size: 0.7rem; color: rgba(255,255,255,0.75); white-space: nowrap; flex-shrink: 0; }
.cabin-pill strong { color: ${GOLD}; }
.chat { flex: 1; overflow-y: auto; padding: 18px 18px 10px; display: flex; flex-direction: column; gap: 13px; background: ${WARM}; }
.chat::-webkit-scrollbar { width: 4px; }
.chat::-webkit-scrollbar-thumb { background: ${SAGE}; border-radius: 2px; }
.msg { display: flex; gap: 9px; animation: pop 0.28s ease; }
.msg.user { flex-direction: row-reverse; }
@keyframes pop { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
.avatar { width: 33px; height: 33px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; align-self: flex-end; }
.avatar.kaya { background: linear-gradient(135deg, ${LOG}, ${GOLD}); box-shadow: 0 2px 10px rgba(139,94,60,0.3); }
.avatar.user { background: linear-gradient(135deg, ${SAGE}, ${FOREST}); }
.bubble { max-width: 73%; padding: 11px 15px; border-radius: 16px; font-size: 0.875rem; line-height: 1.65; color: ${DARK}; }
.bubble.kaya { background: #fff; border-bottom-left-radius: 4px; box-shadow: 0 1px 6px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.06); }
.bubble.user { background: linear-gradient(135deg, ${FOREST}, #1a2e0e); color: #fff; border-bottom-right-radius: 4px; }
.bubble a { color: ${GOLD}; font-weight: 700; }
.bubble.kaya a { color: ${LOG}; }
.typing { display:flex; gap:5px; padding: 13px 15px; background:#fff; border-radius:16px; border-bottom-left-radius:4px; width:fit-content; box-shadow: 0 1px 6px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.06); }
.typing span { width:7px; height:7px; background:${LOG}; border-radius:50%; animation:bounce 1.2s infinite; }
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
.qr-wrap { display:flex; flex-wrap:wrap; gap:7px; padding:4px 18px 12px; }
.qr { background:#fff; border:1.5px solid ${LOG}; color:${LOG}; border-radius:20px; padding:5px 13px; font-size:0.77rem; font-family:'Nunito',sans-serif; font-weight:600; cursor:pointer; transition:all .15s; }
.qr:hover { background:${LOG}; color:#fff; }
.input-wrap { padding: 12px 16px; background: #fff; border-top: 1px solid rgba(0,0,0,0.08); display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0; }
.input-wrap textarea { flex:1; border:1.5px solid #ddd4c0; border-radius:12px; padding:10px 14px; font-family:'Nunito',sans-serif; font-size:0.875rem; color:${DARK}; background:${WARM}; resize:none; outline:none; line-height:1.5; max-height:100px; transition:border-color .2s; }
.input-wrap textarea:focus { border-color:${LOG}; }
.input-wrap textarea::placeholder { color:#b5a88e; }
.send { width:42px; height:42px; background: linear-gradient(135deg, ${LOG}, ${GOLD}); border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .15s, opacity .15s; box-shadow: 0 2px 10px rgba(139,94,60,0.35); }
.send:hover { transform:scale(1.06); }
.send:disabled { opacity:.4; cursor:not-allowed; transform:none; }
.send svg { fill:white; }
.leads-panel { position:absolute; top:0; right:-310px; width:290px; height:100%; background:#fff; border-left:1px solid #e0d4be; transition:right .3s ease; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.leads-panel.open { right:0; }
.leads-header { background:${DARK}; color:#fff; padding:15px 16px; font-family:'Playfair Display',serif; font-size:0.95rem; display:flex; justify-content:space-between; align-items:center; }
.close-panel { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:1.2rem; }
.leads-body { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:9px; }
.lead-card { background:${WARM}; border:1px solid #ddd4be; border-radius:10px; padding:10px 12px; font-size:0.78rem; color:${DARK}; }
.lead-name { font-weight:700; color:${LOG}; font-size:0.85rem; margin-bottom:4px; }
.empty { text-align:center; color:#b5a88e; font-size:0.82rem; padding:30px 10px; }
.leads-toggle { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); color:#fff; border-radius:8px; padding:4px 10px; font-size:0.71rem; font-family:'Nunito',sans-serif; cursor:pointer; transition:background .2s; }
.leads-toggle:hover { background:rgba(255,255,255,0.22); }
`;

const QUICK = [
  "Tell me about the cabins 🏡",
  "Which cabin has a hot tub? 🛁",
  "Family holiday with kids 👨‍👩‍👧",
  "Romantic getaway for 2 💑",
  "What's the price? 💰",
  "How far from the beach? 🏖️",
];

function extractContact(msgs) {
  const txt = msgs.map(m => m.content).join(" ");
  return {
    email: (txt.match(/[\w.-]+@[\w.-]+\.\w+/) || [])[0] || null,
    phone: (txt.match(/(\+27|0)[6-8]\d[\s-]?\d{3}[\s-]?\d{4}/) || [])[0] || null,
    name: ((txt.match(/(?:my name is|i(?:'m| am)|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) || [])[1]) || null,
  };
}

function linkify(text) {
  return text.replace(
    /(www\.villakeys\.co\.za[^\s]*)/g,
    '<a href="https://$1" target="_blank" rel="noopener">$1</a>'
  ).replace(
    /(\+27[\s\d]+)/g,
    '<a href="tel:+27833270072">$1</a>'
  );
}

export default function VillaKeysAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showLeads, setShowLeads] = useState(false);
  const [sessionId] = useState(() => Date.now());
  const chatRef = useRef(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = googleFonts + css;
    document.head.appendChild(s);
    boot();
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  async function boot() {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: "Hi, I'm looking for self-catering accommodation in Wilderness." }],
        }),
      });
      const d = await res.json();
      const txt = d.content?.map(b => b.text || "").join("") || "";
      setMessages([{ role: "assistant", content: txt }]);
    } catch {
      setMessages([{ role: "assistant", content: "Hi there! 🏡 I'm Kaya, your Villa Keys guide. We have beautiful solar-powered log cabins tucked into a conservation area in Wilderness — just a short walk from the beach. Are you planning a family holiday, romantic escape, or a peaceful retreat? Tell me a bit about your dream stay!" }]);
    }
    setLoading(false);
  }

  async function send(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const apiMsgs = next.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMsgs,
        }),
      });
      const d = await res.json();
      const reply = d.content?.map(b => b.text || "").join("") || "Let me help you find the perfect cabin!";
      const updated = [...next, { role: "assistant", content: reply }];
      setMessages(updated);
      const info = extractContact(updated);
      if (info.email || info.phone) {
        setLeads(prev => {
          if (prev.find(l => l.session === sessionId)) return prev;
          return [...prev, {
            session: sessionId,
            name: info.name || "Traveller",
            email: info.email,
            phone: info.phone,
            time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
            snippet: text.slice(0, 65) + "…",
          }];
        });
      }
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Oops, something went wrong. Please try again or contact us directly at villakeys.wilderness@gmail.com 🙏" }]);
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-bg">
          <div className="brand-row">
            <div className="cabin-icon">🏡</div>
            <div className="brand-text" style={{ flex: 1 }}>
              <h1>Villa Keys</h1>
              <div className="tagline">Log Cabins · Wilderness · Garden Route</div>
            </div>
            <button className="leads-toggle" onClick={() => setShowLeads(!showLeads)}>
              Leads ({leads.length})
            </button>
          </div>
          <div className="status-row">
            <div className="status">
              <div className="dot" />
              <span>Kaya is online · Ready to help you book</span>
            </div>
            <a className="visit-btn" href="https://www.villakeys.co.za" target="_blank" rel="noopener">
              Visit Website ↗
            </a>
          </div>
        </div>
        <div className="cabins-strip">
          <div className="cabin-pill">🌊 850m to beach</div>
          <div className="cabin-pill">☀️ Solar powered</div>
          <div className="cabin-pill">🔥 Cabin 3 hot tub</div>
          <div className="cabin-pill"><strong>R1,200</strong> – R2,000/night</div>
          <div className="cabin-pill">✈️ 20min from George</div>
          <div className="cabin-pill">🌿 Conservation area</div>
        </div>
      </div>
      <div className="chat" ref={chatRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
            <div className={`avatar ${m.role === "user" ? "user" : "kaya"}`}>
              {m.role === "user" ? "👤" : "🏡"}
            </div>
            <div
              className={`bubble ${m.role === "user" ? "user" : "kaya"}`}
              dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? linkify(m.content) : m.content }}
            />
          </div>
        ))}
        {loading && (
          <div className="msg">
            <div className="avatar kaya">🏡</div>
            <div className="typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      {messages.length <= 2 && !loading && (
        <div className="qr-wrap">
          {QUICK.map((q, i) => (
            <button key={i} className="qr" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
      )}
      <div className="input-wrap">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask Kaya about availability, cabins, activities…"
          rows={1}
          disabled={loading}
        />
        <button className="send" onClick={() => send(input)} disabled={!input.trim() || loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
      <div className={`leads-panel ${showLeads ? "open" : ""}`}>
        <div className="leads-header">
          <span>📋 Enquiry Leads</span>
          <button className="close-panel" onClick={() => setShowLeads(false)}>✕</button>
        </div>
        <div className="leads-body">
          {leads.length === 0
            ? <div className="empty"><div style={{ fontSize: "2rem", marginBottom: "8px" }}>🏡</div><p>No leads yet.</p><p style={{ marginTop: "6px" }}>Contact details shared in chat will appear here.</p></div>
            : leads.map((l, i) => (
              <div key={i} className="lead-card">
                <div className="lead-name">👤 {l.name}</div>
                {l.email && <p>✉️ {l.email}</p>}
                {l.phone && <p>📱 {l.phone}</p>}
                <p style={{ color: "#b5a88e", marginTop: "4px" }}>🕐 {l.time}</p>
                <p style={{ fontStyle: "italic", color: "#8B7355", marginTop: "4px" }}>"{l.snippet}"</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
