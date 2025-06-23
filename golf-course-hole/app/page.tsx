"use client";

import { JSX, useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Flag, Trophy, ShoppingBag, Phone, Mail, Sun, Moon, Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useAnimation, color } from 'framer-motion';
import { useRef } from 'react';
import { Mona_Sans } from "next/font/google";
import type { PropsWithChildren } from "react";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mona-sans"
});

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  level: string;
}

interface NavigationItem {
  name: string;
  href: string;
}

interface MembershipPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface FacilityItem {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface ShopItem {
  id: number;
  name: string;
  category: string;
  price: number;
  discount?: number;
  image: string;
}

interface TeamMember {
  name: string;
  position: string;
  image: string;
}

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: PropsWithChildren<{ delay?: number; className?: string }>) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", delay }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerChildren = ({ children, staggerDelay = 0.1, className = "" }: PropsWithChildren<{ staggerDelay?: number; className?: string }>) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: { 
            staggerChildren: staggerDelay 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FadeInStaggerItem = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ScaleInHover = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ParallaxSection = ({ children, intensity = 0.2, className = "" }: PropsWithChildren<{ intensity?: number; className?: string }>) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [intensity * 100, -intensity * 100]);
  
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

export default function HoleGolfCourse() {
  const [activeTab, setActiveTab] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "Membership Inquiry",
    message: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "Membership Inquiry",
          message: ""
        });
      }, 3000);
    }, 1500);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);
  
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const navigation: NavigationItem[] = [
    { name: 'Club', href: '#club' },
    { name: 'Membership', href: '#membership' },
    { name: 'Shop', href: '#shop' },
    { name: 'About us', href: '#about' },
  ];
  
  const timeSlots: TimeSlot[] = [
    {
      day: 'Saturday',
      startTime: '08.00 AM',
      endTime: '12.00 AM',
      duration: 4,
      level: 'Beginers'
    },
    {
      day: 'Sunday',
      startTime: '08.00 AM',
      endTime: '15.00 AM',
      duration: 7,
      level: 'Advanced'
    }
  ];

  const facilities: FacilityItem[] = [
    {
      icon: <Flag className="w-8 h-8 text-lime-500" />,
      title: "Championship Course",
      description: "18-hole championship course designed by renowned architect Tom Peterson"
    },
    {
      icon: <Trophy className="w-8 h-8 text-lime-500" />,
      title: "Pro Academy",
      description: "Training facilities with professional coaches for all skill levels"
    },
    {
      icon: <Flag className="w-8 h-8 text-lime-500" />,
      title: "Practice Areas",
      description: "Dedicated driving range, putting greens, and short game area"
    },
    {
      icon: <Sun className="w-8 h-8 text-lime-500" />,
      title: "Clubhouse",
      description: "Luxury clubhouse with dining, locker rooms, and lounge areas"
    }
  ];

  const membershipPlans: MembershipPlan[] = [
    {
      title: "Standard",
      price: "$199",
      period: "monthly",
      features: [
        "Weekday green fees included",
        "10% off pro shop purchases",
        "Access to practice facilities",
        "Member events access"
      ],
      popular: false
    },
    {
      title: "Premium",
      price: "$349",
      period: "monthly",
      features: [
        "Unlimited green fees",
        "20% off pro shop purchases",
        "Unlimited access to practice facilities",
        "Complimentary guest passes (2/month)",
        "Priority tee time booking",
        "Locker room access"
      ],
      popular: true
    },
    {
      title: "Family",
      price: "$599",
      period: "monthly",
      features: [
        "Covers family of 4",
        "Unlimited green fees",
        "25% off pro shop purchases",
        "Unlimited access to all facilities",
        "Junior golf program included",
        "Private events access"
      ],
      popular: false
    }
  ];

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Pro Driver X7",
      category: "Clubs",
      price: 499,
      discount: 15,
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Performance Polo",
      category: "Apparel",
      price: 89,
      image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Tour Golf Balls (12pk)",
      category: "Accessories",
      price: 49,
      image: "https://images.unsplash.com/photo-1562204320-31975a5e09ce?q=80&w=2047&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 4,
      name: "Premium Putter",
      category: "Clubs",
      price: 299,
      image: "https://plus.unsplash.com/premium_photo-1679758306824-ed864d718f87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      position: "Head Golf Professional",
      image: "https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Mark Williams",
      position: "Course Director",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "David Chen",
      position: "Golf Instructor",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
    }
  ];
  
  return (
    <div className={
      `${monaSans.variable} min-h-screen font-sans transition-colors duration-300`
    } style={{
      backgroundColor: 'var(--color-bg-body)',
      color: 'var(--color-text-body)'
    }}>
      <style jsx global>{`
        /* Theme transition styles */
        html {
          transition: color 0.3s ease, background-color 0.3s ease;
        }
        
        button, a, div, section, nav, header, footer, main, aside, span {
          transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        :root {
          /* Font variables */
          --font-heading: 'Mona Sans', system-ui, sans-serif;
          --font-body: 'Mona Sans', system-ui, sans-serif;
          
          /* Light theme colors */
          --color-primary: #2563eb;
          --color-primary-hover: #1d4ed8;
          --color-secondary: #0ea5e9;
          --color-accent: #06b6d4;
          --color-highlight: #38bdf8;
          
          /* Light theme background colors */
          --color-bg-body: #ffffff;
          --color-bg-card: #ffffff;
          --color-bg-card-hover: #f9fafb;
          --color-bg-section: #ffffff;
          --color-bg-muted: #f1f5f9;
          --color-bg-hover: #dbeafe;
          
          /* Light theme text colors */
          --color-text-heading: #0f172a;
          --color-text-body: #334155;
          --color-text-muted: #64748b;
          --color-text-inverted: #f8fafc;
          
          /* Light theme border colors */
          --color-border: rgba(226, 232, 240, 0.8);
          --color-border-hover: rgba(203, 213, 225, 1);
          
          /* Light theme utility colors */
          --color-glass-bg: rgba(255, 255, 255, 0.85);
          --color-glass-border: rgba(255, 255, 255, 0.18);
          --color-glass-shadow: rgba(0, 0, 0, 0.04);
          --color-shadow: rgba(0, 0, 0, 0.1);
          --color-shadow-highlight: rgba(59, 130, 246, 0.25);
        }
        
        /* Dark theme color assignments */
        .dark {
          /* Dark theme colors */
          --color-primary: #38bdf8;
          --color-primary-hover: #0ea5e9;
          --color-secondary: #1d4ed8;
          --color-accent: #0284c7;
          --color-highlight: #60a5fa;
          
          /* Dark theme background colors */
          --color-bg-body: #0f172a;
          --color-bg-card: #1e293b;
          --color-bg-card-hover: #334155;
          --color-bg-section: #0f172a;
          --color-bg-muted: #1e293b;
          --color-bg-hover: #1e3a8a;
          
          /* Dark theme text colors */
          --color-text-heading: #f1f5f9;
          --color-text-body: #e2e8f0;
          --color-text-muted: #94a3b8;
          --color-text-inverted: #0f172a;
          
          /* Dark theme border colors */
          --color-border: rgba(51, 65, 85, 0.8);
          --color-border-hover: rgba(71, 85, 105, 1);
          
          /* Dark theme utility colors */
          --color-glass-bg: rgba(15, 23, 42, 0.85);
          --color-glass-border: rgba(30, 41, 59, 0.3);
          --color-glass-shadow: rgba(0, 0, 0, 0.2);
          --color-shadow: rgba(0, 0, 0, 0.2);
          --color-shadow-highlight: rgba(59, 130, 246, 0.15);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading);
          letter-spacing: -0.015em;
          color: var(--color-text-heading);
          font-weight: 600;
        }
        
        body, p, a, button, input, select, textarea {
          font-family: var(--font-body);
          color: var(--color-text-body);
          font-weight: 400;
        }
        
        .text-muted {
          color: var(--color-text-muted);
        }
        
        .glass {
          background: var(--color-glass-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--color-glass-border);
          box-shadow: 0 8px 32px var(--color-glass-shadow);
        }
        
        .bg-primary {
          background-color: var(--color-primary);
          color: white;
        }
        
        .bg-secondary {
          background-color: var(--color-secondary);
          color: white;
        }
        
        .text-primary {
          color: var(--color-primary);
        }
        
        .card {
          background-color: var(--color-bg-card);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px var(--color-shadow), 0 2px 4px -2px var(--color-shadow);
        }
      `}</style>
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ 
          scaleX: scrollYProgress,
          background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-highlight))'
        }}
      />
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 py-4 sm:py-4 px-4 sm:px-6 xl:px-8 mx-auto mt-4 glass
          ${scrolled ? 'border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl' : 'shadow-md rounded-full'}
          transition-all duration-300 ease-in-out max-w-7xl
        `}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          duration: 0.8 
        }}
      >
        <div className="flex items-center justify-between px-2">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center">
              <motion.div 
                className="grid grid-cols-2 gap-0.5"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "mirror",
                  duration: 4, 
                  ease: "easeInOut" 
                }}
              >
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
              </motion.div>
              <span style={{ color: 'var(--color-text-heading)' }} className="ml-2 font-bold text-xl tracking-tight">Hole</span>
            </div>
          </motion.div>
          
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-6 lg:space-x-10">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium tracking-wide"
                  style={{ 
                    color: activeTab === item.name.toLowerCase() 
                      ? 'var(--color-primary)' 
                      : 'var(--color-text-muted)',
                    transition: 'color 0.2s ease'
                  }}
                  whileHover={{
                    color: activeTab === item.name.toLowerCase() 
                      ? 'var(--color-primary-hover)' 
                      : 'var(--color-text-heading)'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.name.toLowerCase());
                    document.querySelector(item.href)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-3">              <motion.button 
              style={{
                backgroundColor: 'var(--color-bg-muted)',
              }}
              className="p-2 cursor-pointer rounded-md transition-colors relative overflow-hidden"
              whileHover={{
                scale: 1.1,
                backgroundColor: 'var(--color-bg-hover)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
              }}
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                initial={{ y: theme === 'dark' ? -30 : 0, opacity: theme === 'dark' ? 0 : 1 }}
                animate={{ y: theme === 'dark' ? -30 : 0, opacity: theme === 'dark' ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              </motion.div>
              
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: theme === 'dark' ? 0 : 30, opacity: theme === 'dark' ? 1 : 0 }}
                animate={{ y: theme === 'dark' ? 0 : 30, opacity: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              className="flex cursor-pointer items-center px-3 sm:px-4 py-2 text-white rounded-full transition-colors"
              style={{ 
                color: 'var(--color-text-inverted)',
                backgroundColor: 'var(--color-primary)', 
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' } 
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("contact us");
                document.querySelector("#contact")?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Contact Us</span>
              <motion.div
                className="ml-1 sm:ml-2"
                animate={{
                  x: [0, 5, 0],
                  transition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1
                  }
                }}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        <div className="md:hidden mt-4 border-t border-slate-200 dark:border-slate-700 pt-3 pb-1">
          <div className="flex justify-around px-2">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-xs font-medium"
                style={{
                  color: activeTab === item.name.toLowerCase()
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.name.toLowerCase());
                  document.querySelector(item.href)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-white dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#1e293b] rounded-2xl -z-10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 opacity-20 dark:opacity-10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/6256043/pexels-photo-6256043.jpeg?cs=srgb&dl=pexels-cottonbro-6256043.jpg')` }} />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-0">
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span 
                  className="inline-block text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider"
                  style={{ 
                    background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' 
                  }}
                >
                  WELCOME TO HOLE
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#0f172a] dark:text-white tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Golf Game to <br />
                <motion.span
                  className="inline-block relative"
                >
                  <span 
                    className="inline-block text-transparent bg-clip-text"
                    style={{
                      backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))'
                    }}
                  >the Next Level.</span>
                  <motion.span 
                    className="absolute -right-1 top-0 bottom-0 w-[3px] h-full rounded-full"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))'
                    }}
                    animate={{ 
                      opacity: [1, 0],
                      transition: {
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }}
                  />
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-black dark:text-[#cbd5e1] mb-10 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the ultimate golfing journey with expert tips,
                <br className="hidden sm:block" />premium gear, and professional insights.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                
                <ScaleInHover>
                  <button 
                    className="flex cursor-pointer items-center px-6 py-3.5 rounded-full border transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("membership");
                      document.querySelector("#membership")?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                    style={{ 
                      color: 'var(--color-text)',
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'var(--color-border)',
                      '&:hover': { backgroundColor: 'var(--color-bg-card-hover)' }
                    }}>
                    <span className="font-medium">View Membership</span>
                    <svg 
                      className="ml-2 w-4 h-4 text-[#2563eb] dark:text-[#38bdf8]" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </ScaleInHover>
              </motion.div>
              
              <motion.div 
                  className="mt-12 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                >
                  <div className="flex -space-x-2">
                    <motion.div 
                      className="w-10 h-10 rounded-full border-2 overflow-hidden"
                      style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderColor: 'var(--color-bg-card)' 
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                    ></motion.div>
                    <motion.div 
                      className="w-10 h-10 rounded-full border-2 overflow-hidden"
                      style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderColor: 'var(--color-bg-card)' 
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    ></motion.div>
                    <motion.div 
                      className="w-10 h-10 rounded-full border-2 overflow-hidden"
                      style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderColor: 'var(--color-bg-card)' 
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.4 }}
                    ></motion.div>
                    <motion.div 
                      className="w-10 h-10 flex items-center justify-center rounded-full border-2"
                      style={{ 
                        backgroundColor: 'var(--color-bg-muted)',
                        color: 'var(--color-text-muted)',
                        borderColor: 'var(--color-bg-card)'
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.6 }}
                    >
                      +9k
                    </motion.div>
                  </div>
                  <motion.div 
                    className="ml-4"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                  >
                    <p className="text-sm font-bold" style={{ color: 'var(--color-text-heading)' }}>12k+ Members</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Join our community today</p>
                  </motion.div>
                </motion.div>
            </div>
            
            <div className="relative py-6 flex flex-col items-center lg:items-end">
              <motion.div 
                className="rounded-lg p-3.5 inline-flex items-center mb-6 shadow-md border"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)'
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-bg-hover)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#0f172a] dark:text-white">Jakarta, Green Valley, GC</p>
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">98765, Indonesia</p>
                </div>
              </motion.div>
              
              <div className="w-full max-w-sm space-y-4">
                {timeSlots.map((slot, index) => (
                  <motion.div 
                    key={index} 
                    className="rounded-xl p-4 shadow-md border hover:shadow-lg transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'var(--color-border)'
                    }}
                    initial={{ opacity: 0, y: 20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-medium" style={{ color: 'var(--color-text-heading)' }}>{slot.day}</p>
                      <div className="flex items-center text-xs px-2 py-1 rounded-full"
                           style={{ 
                             backgroundColor: 'var(--color-bg-muted)',
                             color: 'var(--color-text-muted)'
                           }}>
                        <User className="w-3 h-3 mr-1" />
                        <span>{slot.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Start</p>
                        <p className="font-medium" style={{ color: 'var(--color-text-heading)' }}>{slot.startTime}</p>
                      </div>
                      
                      <div className="flex-1 mx-3">
                        <div className="h-2 rounded-full w-full overflow-hidden"
                             style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                          <motion.div 
                            className="rounded-full h-full"
                            style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ 
                              duration: 1.2,
                              delay: 0.5 + (index * 0.3),
                              ease: "easeOut"
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>End</p>
                        <p className="font-medium" style={{ color: 'var(--color-text-heading)' }}>{slot.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <motion.div 
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ 
                          backgroundColor: 'var(--color-bg-hover)',
                          color: 'var(--color-primary)'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 1 + (index * 0.3)
                        }}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {slot.duration}h duration
                      </motion.div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-medium"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <section id="club" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 rounded-2xl shadow-lg mb-20 sm:mb-24"
               style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-xs font-bold tracking-wider uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            World-Class Facilities
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-muted))'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The Club Experience
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg"
            style={{ color: 'var(--color-text-body)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our premium facilities designed for golfers of all levels,
            from beginners to professionals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl border hover:shadow-lg transition-shadow"
              style={{ 
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-3 rounded-full inline-flex mb-4" 
                   style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>{facility.title}</h3>
              <p style={{ color: 'var(--color-text-body)' }}>{facility.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative rounded-2xl overflow-hidden h-96"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="absolute inset-0 mix-blend-multiply z-10"
                style={{ 
                  backgroundImage: 'linear-gradient(to bottom right, var(--color-primary)/40, var(--color-secondary)/40)'
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              />
              <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1670002537821-6a4fa25596f8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center" />
            </motion.div>
            
            <div>
              <motion.h3 
                className="text-2xl sm:text-3xl font-bold mb-6 text-[#0f172a] dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Award-Winning Course Design
              </motion.h3>
              
              <motion.p 
                className="text-[#475569] dark:text-[#cbd5e1] mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our championship course was designed by renowned architect Thomas Reid, featuring stunning landscapes 
                and challenging holes that test players of all skill levels.
              </motion.p>
              
              <StaggerChildren>
                <div className="space-y-4">
                  <FadeInStaggerItem>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                           style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-text-body)' }}>18-hole championship course</p>
                    </div>
                  </FadeInStaggerItem>
                  
                  <FadeInStaggerItem>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                           style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-text-body)' }}>Challenging water hazards</p>
                    </div>
                  </FadeInStaggerItem>
                  
                  <FadeInStaggerItem>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                           style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-text-body)' }}>Meticulously maintained fairways</p>
                    </div>
                  </FadeInStaggerItem>
                  
                  <FadeInStaggerItem>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                           style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-text-body)' }}>Scenic mountain views</p>
                    </div>
                  </FadeInStaggerItem>
                </div>
              </StaggerChildren>
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ScaleInHover>
                  <button 
                    className="flex cursor-pointer  items-center px-6 py-3 rounded-lg shadow-lg transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-inverted)',
                      '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                      boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("membership");
                      document.querySelector("#membership")?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <span>Explore the Course</span>
                    <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </ScaleInHover>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="membership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-xs font-bold tracking-wider uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Join Our Community
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-muted))'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Membership Plans
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg"
            style={{ color: 'var(--color-text-body)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose the perfect membership option that suits your golfing goals
            and lifestyle with our flexible plans.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {membershipPlans.map((plan, index) => (
            <motion.div
              key={index}
              className="rounded-2xl transition-all relative"
              style={plan.popular 
                ? {
                    backgroundImage: 'linear-gradient(to bottom right, var(--color-bg-hover), var(--color-bg-muted))',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)',
                    zIndex: 10,
                    transform: 'scale(1.05)',
                  }
                : {
                    backgroundColor: 'var(--color-bg-card)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    boxShadow: '0 4px 6px -1px var(--color-shadow), 0 2px 4px -2px var(--color-shadow)',
                  }
              }
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 } 
              }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <motion.span 
                    className="text-xs font-bold px-4 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--color-primary)', 
                      color: 'var(--color-text-inverted)'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Most Popular
                  </motion.span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-heading)' }}>{plan.title}</h3>
                <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>Perfect for {plan.title === 'Standard' ? 'casual golfers' : plan.title === 'Premium' ? 'serious players' : 'the whole family'}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-text-heading)' }}>{plan.price}</span>
                  <span className="ml-2" style={{ color: 'var(--color-text-muted)' }}>/{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (featureIndex * 0.1) }}
                    >
                      <div 
                        className="mt-1.5 w-4 h-4 rounded-full flex items-center justify-center mr-3"
                        style={{ 
                          backgroundColor: plan.popular ? 'var(--color-primary)' : 'var(--color-bg-hover)'
                        }}>
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span style={{ color: 'var(--color-text-body)' }}>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <ScaleInHover className="w-full">
                  <button 
                    className="w-full cursor-pointer py-3 rounded-lg font-medium"
                    style={plan.popular 
                      ? { 
                          backgroundColor: 'var(--color-primary)', 
                          color: 'var(--color-text-inverted)',
                          boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)',
                          '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
                        }
                      : { 
                          backgroundColor: 'var(--color-bg-card)', 
                          color: 'var(--color-text-heading)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: 'var(--color-border)',
                          '&:hover': { backgroundColor: 'var(--color-bg-muted)' }
                        }
                    }
                  >
                    Get Started
                  </button>
                </ScaleInHover>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p style={{ color: 'var(--color-text-body)' }} className="mb-6">
            All memberships include access to member events and tournaments.
            <br />Corporate packages are also available.
          </p>
          <ScaleInHover className="inline-block">
            <button 
              className="flex cursor-pointer items-center px-6 py-3 bg-transparent border rounded-lg transition-colors"
              style={{ 
                borderColor: 'var(--color-primary)', 
                color: 'var(--color-primary)',
                '&:hover': { 
                  backgroundColor: 'var(--color-bg-hover)',
                }
              }}
              onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("membership");
                      document.querySelector("#membership")?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
            >
              <span>View All Membership Details</span>
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </ScaleInHover>
        </motion.div>
      </section>
      
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 rounded-2xl relative overflow-hidden shadow-lg mb-20 sm:mb-24"
               style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#2563eb]/10 to-[#38bdf8]/20 dark:from-[#2563eb]/20 dark:to-[#38bdf8]/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
            style={{ top: '-20%', right: '-5%' }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-gradient-to-bl from-[#2563eb]/10 to-[#38bdf8]/20 dark:from-[#2563eb]/20 dark:to-[#38bdf8]/10 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
            style={{ bottom: '-10%', left: '-5%' }}
          />
        </div>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block text-xs font-bold tracking-wider text-[#2563eb] dark:text-[#38bdf8] uppercase mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Golf Essentials
            </motion.span>
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text"
              style={{ 
                backgroundImage: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-muted))'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Pro Shop Collection
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg text-[#475569] dark:text-[#cbd5e1]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Browse our premium selection of golf equipment, apparel and accessories
              from top brands in the industry.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shopItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-lg border"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 } 
                }}
              >
                <div className="relative h-48 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                  {item.discount && (
                    <div 
                      className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-inverted)' }}
                    >
                      -{item.discount}% OFF
                    </div>
                  )}
                  
                  <motion.div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.button
                    className="absolute bottom-3 right-3 p-2 rounded-full shadow-md"
                    style={{ backgroundColor: 'var(--color-bg-card)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShoppingBag className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </motion.button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold truncate" style={{ color: 'var(--color-text-heading)' }}>{item.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-bg-muted)',
                            color: 'var(--color-text-muted)'
                          }}>
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-3">
                    {item.discount ? (
                      <>
                        <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>${(item.price * (1 - item.discount / 100)).toFixed(2)}</span>
                        <span className="ml-2 text-sm line-through" style={{ color: 'var(--color-text-muted)' }}>${item.price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>${item.price}</span>
                    )}
                    
                    <div className="ml-auto">
                      <div className="flex items-center" style={{ color: 'var(--color-highlight)' }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="none" />
                          <path d="M12 2v15.27" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ScaleInHover className="inline-block">
              <button 
                className="flex cursor-pointer items-center px-6 py-3 text-white rounded-lg shadow-lg transition-all"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverted)',
                  '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                  boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)'
                }}
                onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("shop");
                      document.querySelector("#shop")?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
              >
                <span>Visit Full Online Shop</span>
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </ScaleInHover>
          </motion.div>
        </div>
      </section>
      
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-xs font-bold tracking-wider text-[#2563eb] dark:text-[#38bdf8] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Story
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-muted))'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Meet Our Team
          </motion.h2>              <motion.p 
            className="max-w-2xl mx-auto text-lg"
            style={{ color: 'var(--color-text-body)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our team of golf professionals is dedicated to helping you improve your game
            and enhance your experience on the course.
          </motion.p>
        </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  {teamMembers.map((member, index) => (
    <motion.div
      key={index}
      className="relative group overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      style={{ boxShadow: '0 10px 25px -5px var(--color-shadow), 0 8px 10px -6px var(--color-shadow-highlight)' }}
    >
      <motion.div 
        className="aspect-[3/4] overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full h-full bg-cover bg-center transition-transform duration-500"
          style={{ backgroundImage: `url(${member.image})` }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300"
        style={{ 
          background: 'linear-gradient(to top, var(--color-primary)/90, transparent 80%)',
          clipPath: 'polygon(0 60%, 100% 50%, 100% 100%, 0% 100%)'
        }}
        whileHover={{ 
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          transition: { duration: 0.4 }
        }}
      >
        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <h3 style={{color:"white"}} className="text-xl font-bold text-white mb-1">{member.name}</h3>
          <p style={{color:"white"}} className="text-sm text-white/80 mb-4">{member.position}</p>
          
          <p className="text-sm text-white/90 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3" style={{color:"white"}}>
            Professional golfer with over 10 years of experience teaching and competing worldwide.
          </p>
          
          <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-primary)' }}
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-bg-card)', color: 'var(--color-primary)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
            <motion.a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-primary)' }}
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-bg-card)', color: 'var(--color-primary)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="w-4 h-4" />
            </motion.a>
            <motion.a 
              href="#" 
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-primary)' }}
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-bg-card)', color: 'var(--color-primary)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  ))}
</div>
        
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.h3 
              className="text-2xl sm:text-3xl font-bold mb-6 text-[#0f172a] dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Legacy of Excellence
            </motion.h3>              <motion.p 
              className="mb-6"
              style={{ color: 'var(--color-text-body)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Founded in 1995, Hole Golf Club has been a premier destination for golf enthusiasts 
              seeking both challenge and beauty in their game. We believe that golf is more than 
              just a sport—it's a tradition, a community, and a lifelong pursuit of excellence.
            </motion.p>              <motion.p
              className="mb-8"
              style={{ color: 'var(--color-text-body)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our club has hosted numerous professional tournaments, and our course has been recognized 
              for its outstanding design, immaculate maintenance, and breathtaking views. We're committed 
              to preserving the traditions of the game while embracing modern techniques and technologies.
            </motion.p>
            
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                <h4 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>25+</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>Years Experience</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                <h4 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>12K+</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>Members</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                <h4 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>150+</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>Tournaments</p>
              </div>
            </motion.div>
          </div>
          
          <div className="order-1 lg:order-2">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1538648759472-7251f7cb2c2f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }} />
              </div>
              <div 
                className="absolute -bottom-6 -left-6 w-28 h-28 rounded-lg flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)'
                }}
              >
                <div className="text-center" style={{ color: 'var(--color-text-inverted)' }}>
                  <h4 className="text-3xl font-bold" style={{ color: 'var(--color-text-inverted)' }}>25</h4>
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-inverted)' }}>Years of Excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 mb-20 sm:mb-24 rounded-2xl shadow-lg"
               style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-xs font-bold tracking-wider text-[#2563eb] dark:text-[#38bdf8] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-text-heading), var(--color-text-muted))'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Our Members Say
          </motion.h2>            <motion.p 
              className="max-w-2xl mx-auto text-lg"
              style={{ color: 'var(--color-text-body)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hear from our members about their experiences at our golf club and the
              services we provide.
            </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote: "The course at Hole Golf Club is simply breathtaking. The staff is incredibly friendly and the facilities are top-notch. It's my favorite place to play.",
              name: "Michael Johnson",
              title: "Member since 2015",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
            },
            {
              quote: "I've played at golf courses around the world, and Hole Golf Club offers some of the most challenging and well-maintained fairways I've ever experienced.",
              name: "Sarah Williams",
              title: "Professional Golfer",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
            },
            {
              quote: "Joining Hole Golf Club was the best decision I made to improve my game. The coaching staff and practice facilities are exceptional.",
              name: "David Chen",
              title: "Member since 2018",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="rounded-xl p-6 shadow-md border relative"
              style={{ 
                backgroundColor: 'var(--color-bg-card)', 
                borderColor: 'var(--color-border)' 
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="absolute -top-4 -left-4 text-4xl"
                style={{ color: 'var(--color-primary)' }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                "
              </motion.div>
              <p className="mb-6 italic" style={{ color: 'var(--color-text-body)' }}>
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${testimonial.image})` }} 
                  />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text-heading)' }}>{testimonial.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 rounded-2xl mb-20 sm:mb-24 shadow-lg" 
               style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.span 
              className="inline-block text-xs font-bold tracking-wider text-[#2563eb] dark:text-[#38bdf8] uppercase mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Get In Touch
            </motion.span>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6 text-[#0f172a] dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contact Us
            </motion.h2>
            <motion.p 
              className="text-lg text-[#475569] dark:text-[#cbd5e1] mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions about membership, events, or facilities? 
              Get in touch with our friendly team for assistance.
            </motion.p>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                  <MapPin className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-heading)' }}>Address</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  123 Golf Course Road, Green Valley<br />
                  Jakarta, Indonesia 98765
                </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                  <Phone className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-heading)' }}>Phone</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  +62 123 456 7890<br />
                  +62 987 654 3210
                </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                  <Mail className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-heading)' }}>Email</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  info@holegolfclub.com<br />
                  membership@holegolfclub.com
                </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-10 flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Instagram className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
          
          <motion.div
  className="rounded-xl p-8 shadow-lg"
  style={{ backgroundColor: 'var(--color-bg-muted)' }}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text-heading)' }}>Send us a message</h3>
  
  {isSubmitted ? (
    <motion.div 
      className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.2 }}
      >
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-heading)' }}>Message Sent!</h4>
      <p style={{ color: 'var(--color-text-body)' }}>Thank you for contacting us. We'll get back to you shortly.</p>
    </motion.div>
  ) : (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-body)' }}>
            First Name
          </label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-body)',
              '--tw-ring-color': 'var(--color-primary)'
            }}
            placeholder="John"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-body)' }}>
            Last Name
          </label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-body)',
              '--tw-ring-color': 'var(--color-primary)'
            }}
            placeholder="Doe"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-body)' }}>
          Email Address
        </label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{ 
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-body)',
            '--tw-ring-color': 'var(--color-primary)'
          }}
          placeholder="john@example.com"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-body)' }}>
          Subject
        </label>
        <select 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{ 
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-body)',
            '--tw-ring-color': 'var(--color-primary)'
          }}
          disabled={isSubmitting}
        >
          <option>Membership Inquiry</option>
          <option>Event Booking</option>
          <option>Course Information</option>
          <option>Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-body)' }}>
          Message
        </label>
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
          style={{ 
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-body)',
            '--tw-ring-color': 'var(--color-primary)'
          }}
          placeholder="How can we help you?"
          rows={4}
          required
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <ScaleInHover className={`inline-block ${isSubmitting ? 'cursor-not-allowed' : ''}`}>
  <button 
    type="submit"
    className={`px-6 cursor-pointer py-3 rounded-lg shadow-lg transition-all flex items-center justify-center min-w-[160px]`}
    style={{ 
      backgroundColor: isSubmitting ? 'var(--color-primary-hover)' : 'var(--color-primary)',
      color: 'var(--color-text-inverted)',
      '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
      boxShadow: '0 10px 15px -3px var(--color-shadow-highlight)'
    }}
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <div className="flex items-center justify-center whitespace-nowrap">
        <motion.div 
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3 flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span>Sending...</span>
      </div>
    ) : 'Send Message'}
  </button>
</ScaleInHover>
    </form>
  )}
</motion.div>
        </div>
      </section>
      
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="grid grid-cols-2 gap-0.5 mr-2">
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
                <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-2 h-2 rounded-sm"></div>
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-text-heading)' }}>Hole Golf Club</span>
            </div>
            <p className="mb-6" style={{ color: 'var(--color-text-body)' }}>
              Experience the ultimate golfing destination with world-class facilities,
              professional instruction, and a welcoming community of golf enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  '&:hover': { 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-text-inverted)'
                  }
                }}
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--color-text-heading)' }}>Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="transition-colors" style={{ color: 'var(--color-text-body)', '&:hover': { color: 'var(--color-primary)' } }}>Course Information</a></li>
              <li><a href="#" className="transition-colors" style={{ color: 'var(--color-text-body)', '&:hover': { color: 'var(--color-primary)' } }}>Membership Options</a></li>
              <li><a href="#" className="transition-colors" style={{ color: 'var(--color-text-body)', '&:hover': { color: 'var(--color-primary)' } }}>Book a Tee Time</a></li>
              <li><a href="#" className="transition-colors" style={{ color: 'var(--color-text-body)', '&:hover': { color: 'var(--color-primary)' } }}>Golf Academy</a></li>
              <li><a href="#" className="transition-colors" style={{ color: 'var(--color-text-body)', '&:hover': { color: 'var(--color-primary)' } }}>Pro Shop</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--color-text-heading)' }}>Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Monday-Friday</span>
                <span className="font-medium" style={{ color: 'var(--color-text-heading)' }}>7:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Saturday</span>
                <span className="font-medium" style={{ color: 'var(--color-text-heading)' }}>6:30 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Sunday</span>
                <span className="font-medium" style={{ color: 'var(--color-text-heading)' }}>6:30 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} Hole Golf Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}