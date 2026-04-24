import type { Metadata } from "next";
import { Heart, BookOpen, Globe, Users, Flame, Zap, TrendingUp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Jesus Convoy – our mission, vision, and leadership team.",
};

const beliefs = [
  { icon: "✝️", title: "The Trinity", desc: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit." },
  { icon: "📖", title: "The Bible", desc: "We believe the Bible is the inspired, infallible Word of God and our supreme authority." },
  { icon: "✨", title: "Salvation", desc: "We believe salvation is by grace through faith in Jesus Christ alone." },
  { icon: "🕊️", title: "The Holy Spirit", desc: "We believe in the present ministry of the Holy Spirit who indwells every believer." },
  { icon: "🌍", title: "The Church", desc: "We believe the Church is the Body of Christ, called to make disciples of all nations." },
  { icon: "👑", title: "Christ Returns", desc: "We believe in the literal, physical return of Jesus Christ to establish His kingdom." },
];

const leaders = [
  { name: "Pastor Anthony Akande", role: "Senior Pastor", img: "", desc: "A devoted shepherd with over 20 years of ministry experience, committed to raising a generation of world-changers." },
  { name: "Pastor Mrs Akande", role: "Associate Pastor", img: "", desc: "Passionate about discipleship and women's ministry, leading with grace and wisdom." },
  { name: "Deacon XXX XXX", role: "Head of Administration", img: "", desc: "A servant leader overseeing church operations and growing ministry impact." },
];

const visionPoints = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Apostolic Propagation",
    desc: "To propagate the Gospel through planting, strengthening, and overseeing churches, apostolic centers, and mission outposts.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Kingdom Mobilization",
    desc: "To raise and mobilize a convoy of Kingdom Carriers, training ministers and missionaries for local and international service.",
  },
  {
    icon: <Flame className="w-6 h-6" />,
    title: "Territorial Revival",
    desc: "To ignite and sustain territorial awakening through crusades, outreaches, home cells, and online prophetic platforms.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Supernatural Demonstration",
    desc: "To demonstrate the power of Jesus through healing, miracles, and supernatural encounters, restoring faith in the living Christ.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "National Transformation",
    desc: "To advance national transformation through influence across the Seven Mountains of society.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Raising Reformers",
    desc: "To raise vibrant young leaders and reformers early, equipping children and teenagers who carry prophetic destiny.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-gold-400 text-sm font-medium mb-6">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img src="/jc-logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Our <span className="gradient-text">Story</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            Jesus Convoy was founded on the conviction that the Church is God&apos;s primary vehicle
            for advancing His Kingdom on earth. We are a community rooted in love, driven by faith,
            and committed to transforming lives.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-[2rem] p-8 md:p-12 border-l-8 border-gold-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                <img src="/jc-logo.jpeg" alt="Mission Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Our Mission</h2>
              <p className="text-slate-400 text-xl leading-relaxed">
                To make devoted followers of Jesus Christ by proclaiming the Gospel, discipling
                believers, and demonstrating God&apos;s love to our community and the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-navy-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
              <BookOpen className="w-4 h-4" />
              Vision of Jesus Convoy
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              Overall: <span className="gradient-text">To Make Heaven</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our vision is rooted in eternal impact, transforming territories and raising
              a generation of Kingdom carriers across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionPoints.map((point, index) => (
              <div
                key={index}
                className="glass rounded-3xl p-8 border border-white/5 card-hover group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-gold-500/10 transition-colors" />
                <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {point.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {point.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="section-padding bg-navy-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">What We Believe</p>
            <h2 className="text-4xl font-black text-white">Core Beliefs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((b) => (
              <div key={b.title} className="glass rounded-3xl p-8 card-hover border border-white/5">
                <span className="text-4xl mb-6 block">{b.icon}</span>
                <h3 className="text-white font-bold text-xl mb-3">{b.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Meet</p>
            <h2 className="text-4xl font-black text-white">Our Leadership</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((l) => (
              <div key={l.name} className="glass rounded-3xl p-10 text-center card-hover border border-white/5">
                <div className="w-24 h-24 gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold-500/30">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">{l.name}</h3>
                <p className="text-gold-400 text-sm font-bold uppercase tracking-widest mb-4">{l.role}</p>
                <p className="text-slate-400 text-base leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
