import React, { useState } from 'react';
import { Search, ChevronDown, Mail, Phone, MessageSquare, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Help = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: 'What is White Glove Delivery?', a: 'Our white glove service includes personal delivery to your room of choice, professional assembly, and removal of all packaging materials by our expert team.' },
    { q: 'Do you ship internationally?', a: 'Yes, we curate and ship our collections to over 50 countries worldwide. International shipping rates and times vary by destination.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day complimentary return policy for most unused items in their original packaging. Custom-made furniture is excluded.' },
    { q: 'How do I care for my linen furniture?', a: 'We recommend professional cleaning for large pieces. Minor stains can be treated with a damp cloth and mild pH-neutral soap.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-20">
        {/* Search Header */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl font-display">Client <span className="italic">Liaison</span></h1>
          <div className="relative">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-border-luxe" />
            <input 
              placeholder="How can we assist your lifestyle journey?" 
              className="w-full bg-layer-luxe border border-border-luxe/20 rounded-full py-6 pl-16 pr-8 focus:border-primary-luxe outline-none text-lg shadow-inner"
            />
          </div>
          <div className="flex justify-center flex-wrap gap-4 pt-4">
            {['Shipping', 'Returns', 'Materials', 'Warranty'].map(t => (
              <button key={t} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-border-luxe/30 rounded-full hover:bg-primary-luxe hover:text-white transition-all">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: MessageSquare, title: 'Direct Liaison', desc: 'Speak with our concierge for personalized assistance.' },
            { icon: BookOpen, title: 'The Archive Guide', desc: 'Browse detailed articles on assembly and curation.' },
            { icon: Mail, title: 'Inquiry Protocol', desc: "Send us a specific request and we'll respond within 4 hours." },
          ].map((cat, i) => (
            <div key={i} className="card-luxe p-10 space-y-6 group cursor-pointer hover:border-secondary-luxe/50 transition-all">
              <div className="p-4 bg-bg-luxe w-fit rounded-2xl text-secondary-luxe"><cat.icon size={24} /></div>
              <h3 className="text-xl font-display">{cat.title}</h3>
              <p className="text-sm text-text-luxe/60 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-12">
          <h2 className="text-3xl font-display text-center">Frequently Asked <span className="italic">Questions</span></h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border-luxe/20">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-8 flex justify-between items-center text-left group"
                >
                  <span className="text-lg font-medium text-text-luxe group-hover:text-primary-luxe transition-colors">{faq.q}</span>
                  <ChevronDown size={20} className={`transition-transform duration-500 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-text-luxe/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-luxe rounded-[3rem] p-16 text-center text-white space-y-8">
          <h2 className="text-4xl font-display">STILL REQUIRE <span className="italic text-highlight-luxe">CURATION?</span></h2>
          <p className="text-white/60 max-w-lg mx-auto">Our specialists are available 24/7 for premium assistance.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <button className="flex items-center space-x-3 px-8 py-5 border border-white/20 rounded-full hover:bg-white hover:text-primary-luxe transition-all uppercase tracking-widest text-xs font-bold">
              <Phone size={18} />
              <span>+1 (800) AURA-LUXE</span>
            </button>
            <button className="bg-highlight-luxe text-primary-luxe px-8 py-5 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-primary-luxe transition-all">
              Initiate Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
