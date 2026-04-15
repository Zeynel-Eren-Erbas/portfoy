import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Mail, 
  ExternalLink, 
  Code2, 
  Terminal,
  Cpu,
  Globe,
  Send,
  ChevronRight,
  Instagram,
  Linkedin,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { db, auth } from './lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from './lib/utils';

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  tags: string[];
  icon?: string;
}

// --- Typing Effect Hook ---
const useTypingEffect = (phrases: string[], typingSpeed = 100, eraseSpeed = 50, delay = 2000) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          setText(currentPhrase.substring(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (text.length > 0) {
          setText(currentPhrase.substring(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? eraseSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, eraseSpeed, delay]);

  return text;
};

// --- Components ---

const Navbar = ({ user, onLogin }: { user: FirebaseUser | null, onLogin: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="logo font-extrabold text-xl tracking-tighter">
              ZEE<span className="text-accent">.DEV</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#hakkimda" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">Hakkımda</a>
            <a href="#projeler" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">Projeler</a>
            <a href="#iletisim" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">İletişim</a>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border-2 border-accent" referrerPolicy="no-referrer" />
                <span className="text-sm font-medium hidden sm:block text-text-primary">{user.displayName}</span>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="text-sm font-semibold bg-gradient-to-r from-accent to-accent-end text-white px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all active:scale-95"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const phrases = useMemo(() => [
    "11. Sınıf Öğrencisi", 
    "Geleceğin Yazılım Profesörü", 
    "React & C# Geliştirici", 
    "Rekabetçi Oyuncu (CS & Valorant)"
  ], []);
  
  const typedText = useTypingEffect(phrases);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#16213e_0%,#0f0f1a_100%)] -z-10" />
      
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">
            Merhaba, Ben <span className="bg-gradient-to-r from-accent to-accent-end bg-clip-text text-transparent">Zeynel Eren Erbaş</span>
          </h1>
          
          <div className="h-8 mb-6">
            <p className="text-xl md:text-2xl font-medium text-accent min-h-[1.5em]">
              {typedText}<span className="animate-pulse">|</span>
            </p>
          </div>

          <p className="text-xs md:text-sm text-text-secondary tracking-[0.2em] uppercase mb-10">
            NUREDDİN ERK PERİHAN ERK MESLEKİ VE TEKNİK ANADOLU LİSESİ
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a href="https://github.com/Zeynel-Eren-Erbas" target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent hover:-translate-y-1 transition-all">
              <Github className="w-7 h-7" />
            </a>
            <a href="https://www.linkedin.com/in/zeynel-eren-erbas" target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent hover:-translate-y-1 transition-all">
              <Linkedin className="w-7 h-7" />
            </a>
            <a href="https://www.instagram.com/erenamaks/" target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent hover:-translate-y-1 transition-all">
              <Instagram className="w-7 h-7" />
            </a>
          </div>

          <a href="#projeler" className="inline-block px-10 py-4 bg-gradient-to-r from-accent to-accent-end text-white rounded-full font-bold hover:shadow-[0_5px_20px_rgba(0,210,255,0.4)] hover:scale-105 transition-all">
            Çalışmalarımı Gör
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-card rounded-3xl border border-border p-8 transition-all hover:border-accent group"
    >
      <div className="text-5xl mb-6">{project.icon || '🚀'}</div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
      <p className="text-text-secondary text-sm mb-6 leading-relaxed">{project.description}</p>
      <div className="flex items-center justify-between">
        <span className="px-4 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-xl text-xs font-bold">
          {project.tags[0]}
        </span>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent transition-colors">
            <Github className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <section id="iletisim" className="py-24 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Bana <span className="text-accent">Ulaşın</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:border-accent transition-all text-sm"
              placeholder="Adınız"
            />
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:border-accent transition-all text-sm"
              placeholder="E-Posta"
            />
          </div>
          <textarea 
            required
            rows={5}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full px-6 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:border-accent transition-all resize-none text-sm"
            placeholder="Mesajınız nedir?"
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-gradient-to-r from-accent to-accent-end text-white rounded-2xl font-bold hover:shadow-[0_5px_20px_rgba(0,210,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Gönderiliyor...' : status === 'success' ? 'Başarıyla Gönderildi!' : (
              <>Mesajı Gönder <Send className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(q, (snapshot) => {
      const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(pData);
    });

    return () => {
      unsubscribe();
      unsubProjects();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const displayProjects = projects.length > 0 ? projects : [
    {
      id: '1',
      title: 'React Ders Planı',
      description: 'Grid yapısı ve bileşen tabanlı modern bir ders planlama uygulaması.',
      tags: ['React'],
      icon: '🚀'
    },
    {
      id: '2',
      title: 'C# İndirim Otomasyonu',
      description: 'Mağazalar için geliştirilmiş, animasyonlu ve dinamik indirim hesaplama aracı.',
      tags: ['C# / .NET'],
      icon: '💻'
    },
    {
      id: '3',
      title: 'Okul Web Sitesi',
      description: 'Okul tanıtımı için tasarlanmış modern bir arayüz çalışması.',
      tags: ['HTML/CSS'],
      icon: '🌐'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-accent selection:text-background">
      <Navbar user={user} onLogin={handleLogin} />
      
      <main>
        <Hero />

        <section id="hakkimda" className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Hakkımda</h2>
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                Merhaba! Ben <strong className="text-text-primary">Zeynel Eren Erbaş</strong>. Nureddin Erk Perihan Erk Mesleki ve Teknik Anadolu Lisesi'nde 11. sınıf öğrencisiyim. 
                Yazılım dünyasına olan merakım sadece kod yazmakla sınırlı değil; akademik bir kariyer hedefleyerek gelecekte bir <strong className="text-text-primary">üniversite profesörü</strong> olmayı amaçlıyorum.
              </p>
              <p>
                Şu an React, C# ve modern web teknolojileri üzerinde kendimi geliştiriyorum. 
                Teknoloji dışında, boş zamanlarımda Counter-Strike ve Valorant gibi rekabetçi oyunları oynamaktan büyük keyif alıyorum.
              </p>
            </div>
            
            <div className="mt-16 grid sm:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-3xl">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-accent"><Code2 className="w-6 h-6" /> Uzmanlık Alanları</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• React & Modern Web</li>
                  <li>• C# & .NET Geliştirme</li>
                  <li>• UI/UX Tasarım İlkeleri</li>
                  <li>• Veri Tabanı Yönetimi</li>
                </ul>
              </div>
              <div className="p-8 bg-card border border-border rounded-3xl">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-accent"><GraduationCap className="w-6 h-6" /> Akademik Hedef</h3>
                <p className="text-text-secondary">
                  Yazılım mühendisliği alanında derinleşerek, gelecekte genç yazılımcılara rehberlik edecek bir akademisyen olmayı hedefliyorum.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="projeler" className="py-24 px-4 bg-[#16213e]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center">Öne Çıkan Projeler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map(project => (
                <div key={project.id}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 border-t border-border">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-3xl p-10">
              <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> 12. Sınıf Staj Yol Haritası
              </h3>
              <div className="space-y-8">
                {[
                  { step: 1, title: 'Portfolio UI Geliştirme', desc: 'Orijinal tasarımını React ve Tailwind ile modernize ettik.', active: true },
                  { step: 2, title: 'Database Entegrasyonu', desc: 'Firebase Firestore ile form verilerini canlıya bağladık.', active: true },
                  { step: 3, title: 'Deployment (Canlıya Alma)', desc: 'GitHub reposunu Cloud Run üzerinden dünyaya açtık.', active: true }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      item.active ? "bg-accent text-background" : "bg-border text-text-secondary"
                    )}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">{item.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-10">
              <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" /> CV Kabartacak Fikirler
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Ödev Takip Otomasyonu', desc: 'Sınıf arkadaşların için bir ödev yönetim sistemi.' },
                  { title: 'Teknik Terimler Sözlüğü', desc: 'Bilişim derslerinde gördüğün terimlerin yer aldığı bir mini-wiki.' },
                  { title: 'Staj Defteri Asistanı', desc: 'Günlük yapılan işleri not alan bir uygulama.' }
                ].map((idea, idx) => (
                  <div key={idx} className="pb-6 border-b border-border last:border-0 last:pb-0">
                    <h4 className="font-bold text-text-primary">{idea.title}</h4>
                    <p className="text-sm text-text-secondary mt-1">{idea.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>

      <footer className="py-16 px-4 border-t border-border text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-8 mb-8 text-text-secondary">
            <a href="https://github.com/Zeynel-Eren-Erbas" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/zeynel-eren-erbas" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="https://www.instagram.com/erenamaks/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
          </div>
          <p className="text-text-secondary text-sm">
            © 2026 Zeynel Eren Erbaş. Geleceğin Yazılım Profesörü.
          </p>
        </div>
      </footer>
    </div>
  );
}
