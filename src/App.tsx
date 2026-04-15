import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Mail, Code2, Send, Instagram, Linkedin, ChevronRight, GraduationCap } from 'lucide-react';
import { db, auth } from './lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from './lib/utils';

// --- Yazı Efekti Fonksiyonu (Siyah Ekranı Çözen Kısım) ---
const useTypingEffect = (phrases: string[]) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setText(current.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex(index + 1);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, phrases]);
  return text;
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const phrases = useMemo(() => ["11. Sınıf Öğrencisi", "Geleceğin Yazılım Profesörü", "React & C# Geliştirici"], []);
  const typedText = useTypingEffect(phrases);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="font-black text-xl tracking-tighter">ZEE<span className="text-cyan-400">.DEV</span></div>
          <button onClick={handleLogin} className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-full font-bold text-sm">
            {user ? user.displayName?.split(' ')[0] : 'Giriş Yap'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-8xl font-black mb-6">Zeynel Eren <span className="text-cyan-400">Erbaş</span></h1>
          <div className="h-10 mb-8">
            <p className="text-xl md:text-3xl text-cyan-400 font-mono">{typedText}<span className="animate-pulse">|</span></p>
          </div>
          <p className="text-gray-500 tracking-[0.3em] uppercase text-xs mb-12">Nureddin Erk Perihan Erk MTAL</p>
          <div className="flex justify-center gap-8 mb-12">
            <a href="https://github.com/Zeynel-Eren-Erbas" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-all"><Github className="w-8 h-8" /></a>
            <a href="https://www.instagram.com/erenamaks/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-cyan-400 transition-all"><Instagram className="w-8 h-8" /></a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all"><Linkedin className="w-8 h-8" /></a>
          </div>
        </motion.div>
      </section>

      {/* Hakkımda */}
      <section id="hakkimda" className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 border-l-4 border-cyan-400 pl-4">Hakkımda</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Merhaba! Ben Zeynel Eren Erbaş. 11. sınıf öğrencisiyim ve hedefim gelecekte bir yazılım profesörü olmak. 
          Şu an React ve C# üzerine yoğunlaşıyorum. Boş zamanlarımda CS ve Valorant oynamayı seviyorum.
        </p>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-20 bg-white/5 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Bana Ulaşın</h2>
        <form className="max-w-xl mx-auto space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Mesajınız başarıyla gönderildi!'); }}>
          <input className="w-full bg-[#0f0f1a] border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-400" placeholder="Adınız" required />
          <input className="w-full bg-[#0f0f1a] border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-400" placeholder="E-Posta" type="email" required />
          <textarea className="w-full bg-[#0f0f1a] border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-400 h-32" placeholder="Mesajınız..." required />
          <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all">GÖNDER</button>
        </form>
      </section>

      <footer className="py-10 text-center text-gray-500 text-sm">
        © 2026 Zeynel Eren Erbaş. Geleceğin Yazılım Profesörü.
      </footer>
    </div>
  );
}
