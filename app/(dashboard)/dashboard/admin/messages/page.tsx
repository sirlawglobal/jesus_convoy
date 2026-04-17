"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MailOpen, Mail } from "lucide-react";

interface Message { _id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string; }

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact").then((r) => r.json()).then((d) => { setMessages(d.messages ?? []); setLoading(false); });
  }, []);

  async function markRead(msg: Message) {
    if (msg.read) { setSelected(msg); return; }
    await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: msg._id, read: true }) });
    setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, read: true } : m));
    setSelected({ ...msg, read: true });
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Contact Messages</h1>
        <p className="text-slate-400 mt-1">{unread} unread message{unread !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message list */}
        <div className="glass rounded-2xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500">Loading…</div> : messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No messages yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map((m) => (
                <button key={m._id} onClick={() => markRead(m)} className={`w-full text-left px-5 py-4 hover:bg-white/3 transition-colors ${selected?._id === m._id ? "bg-gold-500/5 border-l-2 border-gold-500" : ""}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.read ? "bg-slate-600" : "bg-gold-400"}`} />
                    <span className={`font-medium text-sm ${m.read ? "text-slate-400" : "text-white"}`}>{m.name}</span>
                    <span className="ml-auto text-slate-500 text-xs">{new Date(m.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</span>
                  </div>
                  <p className="text-slate-500 text-xs truncate pl-5">{m.subject}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="glass rounded-2xl p-6">
          {selected ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-white font-bold">{selected.name.charAt(0)}</div>
                <div>
                  <p className="text-white font-semibold">{selected.name}</p>
                  <p className="text-slate-400 text-sm">{selected.email}</p>
                </div>
                <div className="ml-auto">
                  {selected.read ? <MailOpen className="w-5 h-5 text-slate-500" /> : <Mail className="w-5 h-5 text-gold-400" />}
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{selected.subject}</h3>
              <p className="text-slate-300 leading-relaxed text-sm">{selected.message}</p>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl text-sm font-semibold text-navy-950">
                Reply via Email
              </a>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Mail className="w-10 h-10 mb-2 opacity-30" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
