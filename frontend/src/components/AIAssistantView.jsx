import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle, Shield, ArrowRight, CornerDownLeft, RefreshCw, Award, CheckCircle2 } from 'lucide-react';

export default function AIAssistantView({ setActiveTab }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your ClaimShield Nexus SIU AI Intelligence Assistant. I am trained on all 10 FWA schemes, doctor license verification databases, Peer Twin counterfactual math, Phoenix entity resolutions, and statutory Responsible AI guardrails. Ask me any investigative question about providers, claims, or detection logic.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'How do we verify if a doctor is real or a fake ghost clinic?',
    'Why is Ring-07 flagged for level-5 upcoding and referral loops?',
    'Explain the Phoenix resolution match between P090 and P101',
    'How does the Peer Twin calculate risk-adjusted overpayment in dollars?',
    'What are the 5 innocent clinical explanations tested before escalation?'
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = textToSend.toLowerCase();

      if (q.includes('fake') || q.includes('doctor') || q.includes('real') || q.includes('license') || q.includes('board') || q.includes('npi')) {
        reply = `**Doctor Medical Board Certification & Legitimacy Audit:**\n\nClaimShield Nexus audits each provider across 5 independent regulatory registries:\n\n1. **State Medical Board Licensing:** Verifies active medical license number (e.g. *IL-MD-19482701* for Dr. Arthur Vance vs *Vacant Commercial Warehouse* for P301 DME).\n2. **National Provider Identifier (NPI) Registry:** Validates Type 1 (Individual Clinician) vs Type 2 (Organizational Entity) enrollment history.\n3. **DEA Registration:** Checks active schedule II-V prescription privileges.\n4. **Physical Location Verification:** Detects shell addresses, UPS store boxes, or co-located multi-tenant syndicates (e.g. 5 clinics registered to Suite 400 at 12 MG Road).\n5. **Secretary of State Corporate Filings:** Unmasks hidden beneficial owners (e.g. *OWN-77* controlling 5 distinct clinic entities).\n\n*Result:* Real practitioners (e.g. P101, P104) are confirmed active, while phantom suppliers (e.g. P301) are flagged as **NON-EXISTING GHOST PREMISES**.`;
      } else if (q.includes('ring') || q.includes('upcoding') || q.includes('101')) {
        reply = `**Ring-07 (Coordinated Referral Syndicate & Upcoding):**\n\n- **1. Level-5 Upcoding:** Provider P101 abruptly jumped from 10% to 92% Level-5 (CPT 99215) on **2026-02-16** (z-score: +4.82 vs 18% peer average).\n- **2. Velocity Anomaly:** Billed 38 Level-5 visits in a single day on **2026-03-02** (~25.3 clinician hours).\n- **3. Circular Referrals:** Rotates 40 patients (\`M0501 - M0540\`) in a closed loop: **P101 ➔ P102 (Rehab) ➔ P103 (Pain) ➔ P101**.\n- **4. Beneficial Owner:** All entities 100% owned by *Apex Syndicate Group LLC (OWN-77)* at 12 MG Road.\n\n*Innocent Defense Result:* Sicker patient population **RULED OUT** because Patient Morbidity Risk Index is 1.02 (standard baseline).`;
      } else if (q.includes('phoenix') || q.includes('090') || q.includes('reincarnat')) {
        reply = `**Phoenix Entity Resolution (Score: 0.88 / 1.00):**\n\nPredecessor clinic **Harborview Primary Care (P090)** shuttered on **2025-11-30** following a payer audit. Just 12 days later on **2025-12-12**, **Metro Internal Medicine (P101)** enrolled under the exact same beneficial owner (**OWN-77**).\n\nKey corroborating signals:\n- **90% cosine similarity** in billing CPT fingerprint.\n- **28 of 40 patients overlap** between the closed and new clinic.\n- **Conclusion:** High-confidence successor entity designed to evade prior clawbacks.`;
      } else if (q.includes('twin') || q.includes('counterfactual') || q.includes('dollar') || q.includes('overpayment') || q.includes('gap')) {
        reply = `**Peer Twin (k=12) Counterfactual Overpayment Calculation:**\n\nInstead of crude specialty peer averages, ClaimShield matches each provider against **k=12 synthetic twins** sharing identical subspecialty, geography, and patient morbidity risk:\n\n- **Actual Paid / Visit:** $210.00 (Patient Risk Index: 1.02)\n- **Synthetic Twin Expected Paid:** $95.00 (Twin Risk Index: 1.00)\n- **Risk-Adjusted Overpayment Gap:** **+$115.00 / Claim** (~$159,000+ total exposure on 206 flagged claims).\n\nThis mathematically isolates fraudulent upcoding from legitimate clinical illness severity.`;
      } else if (q.includes('innocent') || q.includes('defense') || q.includes('safe') || q.includes('fail')) {
        reply = `**The 5 Innocent Clinical & Operational Explanations Engine:**\n\n1. *Sicker Patient Population* (Ruled Out if morbidity risk index is 0.95 - 1.05)\n2. *Independent Shared Medical Plaza* (Ruled Out by corporate beneficial ownership & circular referrals)\n3. *Organic Practice Ramp-Up* (Ruled Out by vertical PELT change-point discontinuity)\n4. *Clearinghouse / EDI Batching Glitch* (Untested; generates action to audit raw 835 remittance files)\n5. *Regional Epidemic / Demand Surge* (Ruled Out by flat regional peer baseline)\n\n*Safe-Fail Guardrail:* If an alert score is &lt; 0.60 and clinical explanations remain plausible, Safe-Fail triggers **INSUFFICIENT_EVIDENCE** (*zero escalation*).`;
      } else {
        reply = `I have analyzed the synthetic FWA benchmark across **50,000 claims**, **1,182 providers**, and **10 planted fraud scenarios**.\n\nYou can inspect individual claim attributes in **Claim Details**, view referral loops in **Network Analysis**, or download the official PDF dossier in **Case & Claim Brief**.`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#8458B3]" /> AI Assistant & Helper
        </h2>
        <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
          Ask any question about doctors, claims, red flags, or how fraud checks work in simple terms.
        </p>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:text-[#8458B3] hover:border-[#8458B3] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#8458B3]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 min-h-[480px] flex flex-col justify-between border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
        {/* Message Thread */}
        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-gradient-to-tr from-[#ec4899] to-[#8458B3] text-white'
                      : 'bg-gradient-to-tr from-[#8458B3] to-[#A0D2EB] text-white shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs max-w-2xl leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white rounded-tr-none font-medium'
                      : 'bg-[#f8fafc] dark:bg-slate-800 text-[#0f172a] dark:text-slate-200 border border-[#e2e8f0] dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose-sm">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8458B3] to-[#A0D2EB] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-[#f8fafc] dark:bg-slate-800 rounded-2xl rounded-tl-none border border-[#e2e8f0] dark:border-slate-700 text-xs text-[#64748b]">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#8458B3] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#8458B3] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#8458B3] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-4 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about doctor board certifications, Phoenix links, Peer Twin formulas, or innocent defenses..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#8458B3]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-5 py-3 btn-primary-gradient text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
