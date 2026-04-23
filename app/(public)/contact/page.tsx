"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      return toast.error("Please fill all fields");
    }
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { setSent(true); toast.success("Message sent! We'll get back to you soon."); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed to send message"); }
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-6">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">We&apos;d love to hear from you. Reach out with any questions or prayer requests.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact form */}
        <div className="glass rounded-3xl p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">Message Received!</h2>
              <p className="text-slate-400">We&apos;ll respond to your message within 24-48 hours. God bless you!</p>
            </div>
          ) : (
            <>
              <h2 className="text-white font-bold text-2xl mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1.5 block ml-1">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1.5 block ml-1">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block ml-1">Subject *</label>
                  <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50 transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block ml-1">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message…" className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50 resize-none transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 gradient-gold rounded-xl font-bold text-navy-950 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: MapPin, title: "Visit Us", content: "NTA,Akure, Nigeria" },
            { icon: Phone, title: "Call Us", content: "+234 800 000 0000" },
            { icon: Mail, title: "Email Us", content: "info@jesusconvoy.org" },
            { icon: Clock, title: "Service Times", content: "Sunday: 8am & 10:30am\nWednesday: 6pm" },
          ].map(({ icon: Icon, title, content }) => (
            <div key={title} className="glass rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">{title}</p>
                <p className="text-slate-400 text-sm whitespace-pre-line">{content}</p>
              </div>
            </div>
          ))}

          {/* Map embed */}
          <div className="glass rounded-2xl overflow-hidden h-48">
            <iframe
              src="https://www.google.com/maps?q=Akure%2C%20Ondo%20State%2C%20Nigeria&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
