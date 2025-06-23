"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useAnimation } from "framer-motion";
import {
  Calendar,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  Moon,
  Sun,
  X,
  Menu,
  Check,
  ArrowUp,
  ChevronRight,
  ChevronLeft,
  Clock,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Filter,
} from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
});

interface Appointment {
  date: string;
  time: string;
  client: string;
  type: string;
  status: "pending" | "completed" | "cancelled";
  description: string;
}

interface Case {
  title: string;
  client: string;
  court: string;
  caseNumber: string;
  outcome: string;
  date: string;
  description: string;
  verdict?: string;
  judge?: string;
  counsel?: string[];
  category?: string;
}

interface Expertise {
  domain: string;
  description: string;
  casesHandled: number;
  successRate: string;
  icon: string;
}

interface Experience {
  position: string;
  firm: string;
  location: string;
  duration: string;
  description: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
  description: string;
}

interface Query {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  type: string;
  message: string;
}

interface NavButtonProps {
  label: string;
  onClick: () => void;
  active: boolean;
  icon?: React.ReactNode;
  darkMode: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  label,
  onClick,
  active,
  icon,
  darkMode,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        active
          ? "bg-blue-600 text-white"
          : darkMode
          ? "text-white hover:bg-gray-700"
          : "text-gray-600 hover:bg-blue-100"
      }`}
    >
      {icon}
      <span className={active ? "font-medium" : ""}>{label}</span>
    </button>
  );
};

const CustomArrow = ({ direction, onClick }: { direction: "next" | "prev", onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
        direction === "next" ? "right-2" : "left-2"
      } bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300`}
      aria-label={direction === "next" ? "Next slide" : "Previous slide"}
    >
      {direction === "next" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  );
};

const AdvocatePortfolio = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<Expertise | null>(
    null
  );
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );
  const [query, setQuery] = useState<Query>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("appointments");
  const [darkMode, setDarkMode] = useState(false);
  
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error" | "info">("info");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const controls = useAnimation();
  const { scrollY } = useScroll();

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDarkMode);

    document.body.classList.toggle("dark", prefersDarkMode);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const unsubscribe = scrollY.on("change", handleScroll);
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    });
  }, [controls]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const appointments: Appointment[] = [
    {
      date: "2024-09-20",
      time: "10:00 AM",
      client: "John Doe",
      type: "Consultation",
      status: "pending",
      description: "Initial consultation for divorce proceedings",
    },
    {
      date: "2024-09-21",
      time: "02:00 PM",
      client: "Jane Smith",
      type: "Court Hearing",
      status: "completed",
      description: "Property dispute case hearing",
    },
    {
      date: "2024-09-22",
      time: "11:00 AM",
      client: "Mike Johnson",
      type: "Mediation",
      status: "pending",
      description: "Mediation for employment dispute",
    },
    {
      date: "2024-09-23",
      time: "03:00 PM",
      client: "Sarah Williams",
      type: "Consultation",
      status: "cancelled",
      description: "Cancelled - Client rescheduled",
    },
    {
      date: "2024-09-24",
      time: "09:00 AM",
      client: "Robert Brown",
      type: "Court Hearing",
      status: "pending",
      description: "Criminal defense case hearing",
    },
  ];

  const cases: Case[] = [
    {
      title: "Smith vs. Johnson - Property Dispute",
      client: "Jane Smith",
      court: "Supreme Court of India",
      caseNumber: "WP(C) 1234/2023",
      outcome: "Won",
      date: "2024-08-15",
      description:
        "Property dispute case where the client was being sued for ownership. Successfully defended and won the case.",
      verdict:
        "In favor of the client. The court ruled that the property rightfully belonged to our client.",
      judge: "Hon'ble Justice S. Kumar",
      counsel: ["Senior Advocate R. Sharma", "Junior Advocate A. Verma"],
      category: "Property Law",
    },
    {
      title: "State vs. Kumar - Criminal Defense",
      client: "Rahul Kumar",
      court: "Sessions Court, Delhi",
      caseNumber: "CRL.A. 5678/2022",
      outcome: "Acquitted",
      date: "2024-07-10",
      description:
        "Criminal defense case where the client was accused of theft. Successfully argued for acquittal.",
      verdict:
        "Client was acquitted of all charges. The court found the evidence insufficient to convict.",
      judge: "Hon'ble Justice A. Sinha",
      counsel: ["Senior Advocate P. Chawla"],
      category: "Criminal Law",
    },
    {
      title: "Johnson vs. Smith - Employment Dispute",
      client: "Mike Johnson",
      court: "Labor Court, Mumbai",
      caseNumber: "L.A. 9101/2023",
      outcome: "Settled",
      date: "2024-06-20",
      description:
        "Employment dispute case where the client was terminated unfairly. Successfully mediated a settlement.",
      verdict:
        "Case was settled out of court with a favorable compensation package for the client.",
      counsel: ["Senior Advocate S. Mehta"],
      category: "Employment Law",
    },
    {
      title: "Williams vs. Brown - Family Law",
      client: "Sarah Williams",
      court: "Family Court, Bangalore",
      caseNumber: "FC 1122/2023",
      outcome: "Won",
      date: "2024-05-25",
      description:
        "Family law case involving divorce and custody. Successfully represented the client in court.",
      verdict:
        "The court granted our client a favorable divorce settlement and custody arrangement.",
      judge: "Hon'ble Justice R. Rao",
      counsel: ["Senior Advocate K. Reddy", "Junior Advocate L. Fernandes"],
      category: "Family Law",
    },
    {
      title: "Brown vs. Green - Civil Suit",
      client: "Robert Brown",
      court: "High Court of Karnataka",
      caseNumber: "RSA 3344/2022",
      outcome: "Pending",
      date: "2024-04-30",
      description:
        "Civil suit for recovery of damages. Case is currently ongoing.",
      counsel: ["Senior Advocate V. Iyer"],
      category: "Corporate Law",
    },
  ];

  const expertiseList: Expertise[] = [
    {
      domain: "Criminal Law",
      description:
        "Expertise in handling criminal cases, from petty offenses to serious felonies. Proven track record of securing favorable outcomes for clients through meticulous case preparation and aggressive defense strategies.",
      casesHandled: 150,
      successRate: "85%",
      icon: "⚖️",
    },
    {
      domain: "Family Law",
      description:
        "Specialized in family law matters including divorce, child custody, alimony, and property disputes. Focus on achieving amicable settlements while fiercely protecting client interests when necessary.",
      casesHandled: 200,
      successRate: "90%",
      icon: "👪",
    },
    {
      domain: "Property Law",
      description:
        "Extensive experience in property-related disputes, including ownership conflicts, landlord-tenant issues, and real estate transactions. Skilled in navigating complex property laws to secure client rights.",
      casesHandled: 180,
      successRate: "80%",
      icon: "🏠",
    },
    {
      domain: "Employment Law",
      description:
        "Proficient in handling employment-related disputes such as wrongful termination, workplace discrimination, and contract negotiations. Works closely with employees and employers to resolve disputes efficiently.",
      casesHandled: 120,
      successRate: "75%",
      icon: "💼",
    },
    {
      domain: "Corporate Law",
      description:
        "Provides comprehensive legal services to businesses, including contract drafting, compliance issues, mergers and acquisitions, and corporate governance. Helps companies navigate legal complexities to focus on growth.",
      casesHandled: 90,
      successRate: "95%",
      icon: "🏢",
    },
  ];

  const experiences: Experience[] = [
    {
      position: "Senior Advocate",
      firm: "Sharma & Associates",
      location: "New Delhi, India",
      duration: "2020 - Present",
      description:
        "Handling high-profile cases in various legal domains with a focus on criminal and property law. Mentoring junior lawyers and contributing to the firm's growth.",
      responsibilities: [
        "Represent clients in high courts and supreme court",
        "Develop and implement effective legal strategies",
        "Conduct legal research and draft complex legal documents",
        "Provide mentorship to junior lawyers",
      ],
    },
    {
      position: "Associate Lawyer",
      firm: "Jain & Co.",
      location: "Mumbai, India",
      duration: "2017 - 2020",
      description:
        "Worked on a wide range of cases including family law, employment disputes, and property matters. Gained extensive courtroom experience and built a strong client base.",
      responsibilities: [
        "Handled client consultations and case intake",
        "Prepared legal documents and court filings",
        "Assisted senior lawyers in court proceedings",
        "Conducted legal research for case preparation",
      ],
    },
    {
      position: "Legal Intern",
      firm: "Kumar & Associates",
      location: "Bangalore, India",
      duration: "Summer 2016",
      description:
        "Assisted lawyers with case preparation, legal research, and client communication. Gained valuable insights into the legal profession and developed foundational skills.",
      responsibilities: [
        "Conducted legal research for ongoing cases",
        "Prepared case summaries and client reports",
        "Assisted in drafting legal documents",
        "Observed court proceedings and client meetings",
      ],
    },
  ];

  const education: Education[] = [
    {
      degree: "Bachelor of Laws (LL.B.)",
      institution: "National Law School of India University",
      location: "Bangalore, India",
      year: "2017",
      description:
        "Completed a five-year integrated law program with a focus on corporate law and litigation. Graduated with honors and participated in several moot court competitions.",
    },
    {
      degree: "Master of Laws (LL.M.)",
      institution: "Harvard Law School",
      location: "Cambridge, MA, USA",
      year: "2020",
      description:
        "Pursued a master's degree with a specialization in international law and human rights. Conducted extensive research and authored a thesis on cross-border legal issues.",
    },
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySubmitted(true);
    setTimeout(() => {
      setQuery({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setQuerySubmitted(false);
    }, 3000);
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const inputClass = `w-full p-3 border-0 rounded-lg focus:ring-2 transition-all duration-300 ${
    darkMode
      ? "bg-gray-800 text-white focus:ring-blue-500"
      : "bg-gray-50 text-gray-800 focus:ring-blue-500"
  }`;

  const statusColors = {
    pending: {
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-800 text-yellow-200",
    },
    completed: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-800 text-green-200",
    },
    cancelled: {
      light: "bg-red-100 text-red-800",
      dark: "bg-red-800 text-red-200",
    },
    Won: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-800 text-green-200",
    },
    Pending: {
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-800 text-yellow-200",
    },
    Acquitted: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-800 text-green-200",
    },
    Settled: {
      light: "bg-blue-100 text-blue-800",
      dark: "bg-blue-800 text-blue-200",
    },
  };

  const getGradientAndColors = () => {
    return darkMode
      ? {
          bg: "bg-gray-900",
          card: "bg-gray-800 border-gray-700",
          text: "text-white",
          header: "from-blue-900 to-indigo-900",
          section: "from-gray-800 to-gray-900 border-gray-700",
          highlight: "text-blue-400",
          button: "bg-blue-600 hover:bg-blue-700",
          itemBg: "bg-gray-800",
          itemBorder: "border-gray-700 hover:border-blue-500",
          modalBg: "bg-gray-800 border-gray-700",
        }
      : {
          bg: "bg-blue-50",
          card: "bg-white border-blue-100",
          text: "text-gray-800",
          header: "from-blue-600 to-blue-500",
          section: "from-blue-50 to-blue-100 border-blue-100",
          highlight: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          itemBg: "bg-white",
          itemBorder: "border-blue-100 hover:border-blue-200",
          modalBg: "bg-white border-blue-100",
        };
  };

  const filteredCases = caseFilter === "all" 
    ? cases 
    : cases.filter(c => c.category === caseFilter);
  


  const colors = getGradientAndColors();

  return (
    <div
      className={`min-h-screen ${colors.bg} ${colors.text} p-4 md:p-8 transition-colors duration-300 ${inter.className} relative`}
    >
      <button
        onClick={toggleDarkMode}
        className="fixed cursor-pointer top-4 right-4 z-50 p-2 rounded-full bg-opacity-80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun size={20} className="text-yellow-300" />
        ) : (
          <Moon size={20} className="text-blue-800" />
        )}
      </button>
      
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg md:hidden transition-all duration-300 hover:bg-blue-700"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed cursor-pointer bottom-20 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notificationType === "success"
                ? "bg-green-600"
                : notificationType === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            } text-white font-medium flex items-center gap-2 min-w-[300px]`}
          >
            {notificationType === "success" ? (
              <Check size={20} />
            ) : notificationType === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <Mail size={20} />
            )}
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 z-50 p-4 rounded-lg shadow-xl md:hidden"
            style={{
              backgroundColor: darkMode
                ? "rgba(30, 41, 59, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex flex-col space-y-2">
              <NavButton
                label="Appointments"
                onClick={() => scrollToSection("appointments")}
                active={activeSection === "appointments"}
                icon={<Calendar size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Cases"
                onClick={() => scrollToSection("cases")}
                active={activeSection === "cases"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Expertise"
                onClick={() => scrollToSection("expertise")}
                active={activeSection === "expertise"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Experience"
                onClick={() => scrollToSection("experience")}
                active={activeSection === "experience"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Education"
                onClick={() => scrollToSection("education")}
                active={activeSection === "education"}
                icon={<GraduationCap size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Contact"
                onClick={() => scrollToSection("contact")}
                active={activeSection === "contact"}
                icon={<Mail size={16} />}
                darkMode={darkMode}
              />
              
              <div className="border-t border-gray-300 dark:border-gray-700 mt-3 pt-3">
                <div className="flex justify-between">
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-full ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-100'}`} 
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-full ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-100'}`} 
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-full ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-100'}`} 
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-full ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-100'}`} 
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block sticky top-0 z-40 mb-4">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-blue-100"
          } border rounded-full shadow-md mx-auto max-w-4xl py-2 px-4 backdrop-blur-sm bg-opacity-90`}
        >
          <div className="flex justify-between items-center overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">
              <NavButton
                label="Appointments"
                onClick={() => scrollToSection("appointments")}
                active={activeSection === "appointments"}
                icon={<Calendar size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Cases"
                onClick={() => scrollToSection("cases")}
                active={activeSection === "cases"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Expertise"
                onClick={() => scrollToSection("expertise")}
                active={activeSection === "expertise"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Experience"
                onClick={() => scrollToSection("experience")}
                active={activeSection === "experience"}
                icon={<Briefcase size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Education"
                onClick={() => scrollToSection("education")}
                active={activeSection === "education"}
                icon={<GraduationCap size={16} />}
                darkMode={darkMode}
              />
              <NavButton
                label="Contact"
                onClick={() => scrollToSection("contact")}
                active={activeSection === "contact"}
                icon={<Mail size={16} />}
                darkMode={darkMode}
              />
            </div>
          </div>
        </motion.nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-7xl mx-auto ${colors.card} rounded-2xl shadow-xl overflow-hidden`}
      >
        <div
          className={`bg-gradient-to-r ${colors.header} p-8 text-white relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-2"
          >
            Advocate Rohan Sharma
          </motion.h1>
          <p className="text-xl md:text-2xl font-light italic tracking-wide">
            Legal Advocate & Counselor at Law
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm"
            >
              <MapPin size={14} /> New Delhi, India
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm"
            >
              <Phone size={14} /> +91 98765 43210
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm"
            >
              <Mail size={14} /> rohan@advocate.com
            </motion.span>
          </div>
        </div>

        <div className="p-4 md:p-10">
          <div
            id="appointments"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
            >
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Calendar size={20} /> Available Appointments
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg shadow-md ${
                      colors.itemBg
                    } cursor-pointer ${
                      selectedAppointment?.date === appointment.date
                        ? "border-l-4 border-blue-500"
                        : `border ${colors.itemBorder}`
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg ${colors.highlight}`}>
                        {appointment.type}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          darkMode
                            ? statusColors[appointment.status].dark
                            : statusColors[appointment.status].light
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      <span className="font-medium">Client:</span>{" "}
                      {appointment.client}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      <span className="font-medium">Date:</span>{" "}
                      {appointment.date} |{" "}
                      <span className="font-medium">Time:</span>{" "}
                      {appointment.time}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-1`}
                    >
                      {appointment.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              id="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
            >
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Briefcase size={20} /> Case History
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
                {filteredCases.map((caseItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg shadow-md ${
                      colors.itemBg
                    } cursor-pointer ${
                      selectedCase?.caseNumber === caseItem.caseNumber
                        ? "border-l-4 border-blue-500"
                        : `border ${colors.itemBorder}`
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg ${colors.highlight}`}>
                        {caseItem.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          darkMode
                            ? statusColors[
                                caseItem.outcome as keyof typeof statusColors
                              ]?.dark || "bg-gray-600 text-gray-200"
                            : statusColors[
                                caseItem.outcome as keyof typeof statusColors
                              ]?.light || "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {caseItem.outcome}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      <span className="font-medium">Client:</span>{" "}
                      {caseItem.client}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      <span className="font-medium">Court:</span>{" "}
                      {caseItem.court}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-1`}
                    >
                      {caseItem.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            id="expertise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`mt-8 bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
          >
            <h2
              className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
            >
              <Briefcase size={20} /> Areas of Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expertiseList.map((expertise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.03 }}
                  className={`p-5 rounded-lg shadow-md ${
                    colors.itemBg
                  } cursor-pointer ${
                    selectedExpertise?.domain === expertise.domain
                      ? "border-l-4 border-blue-500"
                      : `border ${colors.itemBorder}`
                  }`}
                  onClick={() => setSelectedExpertise(expertise)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-bold text-lg ${colors.highlight}`}>
                      {expertise.domain}
                    </h3>
                    <span className="text-2xl">{expertise.icon}</span>
                  </div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } line-clamp-2`}
                  >
                    {expertise.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: expertise.successRate }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className={`text-xs font-medium ${colors.highlight}`}>
                      Success Rate: {expertise.successRate}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Cases: {expertise.casesHandled}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div
            id="experience"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={`bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
            >
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <GraduationCap size={20} /> Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg shadow-md ${
                      colors.itemBg
                    } cursor-pointer ${
                      selectedEducation?.degree === edu.degree
                        ? "border-l-4 border-blue-500"
                        : `border ${colors.itemBorder}`
                    }`}
                    onClick={() => setSelectedEducation(edu)}
                  >
                    <h3 className={`font-bold text-lg ${colors.highlight}`}>
                      {edu.degree}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      {edu.institution}, {edu.location} | {edu.year}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-2`}
                    >
                      {edu.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className={`bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
            >
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Briefcase size={20} /> Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg shadow-md ${
                      colors.itemBg
                    } cursor-pointer ${
                      selectedExperience?.firm === exp.firm
                        ? "border-l-4 border-blue-500"
                        : `border ${colors.itemBorder}`
                    }`}
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <h3 className={`font-bold text-lg ${colors.highlight}`}>
                      {exp.position}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } mb-2`}
                    >
                      {exp.firm}, {exp.location} | {exp.duration}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-2`}
                    >
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className={`mt-8 bg-gradient-to-br ${colors.section} p-6 rounded-xl shadow-sm border`}
          >
            <h2
              className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
            >
              <Mail size={20} /> Send a Query
            </h2>
            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${colors.highlight} mb-1`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={query.name}
                    onChange={(e) =>
                      setQuery({ ...query, name: e.target.value })
                    }
                    className={inputClass}
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${colors.highlight} mb-1`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={query.email}
                    onChange={(e) =>
                      setQuery({ ...query, email: e.target.value })
                    }
                    className={inputClass}
                    required
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className={`block text-sm font-medium ${colors.highlight} mb-1`}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={query.phone}
                    onChange={(e) =>
                      setQuery({ ...query, phone: e.target.value })
                    }
                    className={inputClass}
                    required
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className={`block text-sm font-medium ${colors.highlight} mb-1`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={query.subject}
                    onChange={(e) =>
                      setQuery({ ...query, subject: e.target.value })
                    }
                    className={inputClass}
                    required
                    placeholder="Query Subject"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${colors.highlight} mb-1`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={query.message}
                  onChange={(e) =>
                    setQuery({ ...query, message: e.target.value })
                  }
                  className={`${inputClass} h-32`}
                  required
                  placeholder="Your Message"
                />
              </div>
              <motion.button
                type="submit"
                disabled={querySubmitted}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full ${colors.button} cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2`}
              >
                {querySubmitted ? "Message Sent" : "Send Message"}
                <Send size={18} />
              </motion.button>
              {querySubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-center text-green-500 dark:text-green-400"
                >
                  Your message has been sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mt-8 text-center"
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {new Date().getFullYear()} Advocate Rohan Sharma. All rights
              reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedAppointment(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${colors.modalBg} rounded-xl shadow-xl max-w-md w-full p-6 relative border`}
            >
              <button
                onClick={() => setSelectedAppointment(null)}
                className={`absolute top-4 right-4 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Calendar size={20} /> Appointment Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Client
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedAppointment.client}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date & Time
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedAppointment.date} | {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Type
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedAppointment.type}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </label>
                  <span
                    className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-semibold ${
                      darkMode
                        ? statusColors[selectedAppointment.status].dark
                        : statusColors[selectedAppointment.status].light
                    }`}
                  >
                    {selectedAppointment.status.charAt(0).toUpperCase() +
                      selectedAppointment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedAppointment.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedCase(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${colors.modalBg} rounded-xl shadow-xl max-w-md w-full p-6 relative border max-h-[90vh] overflow-y-auto`}
            >
              <button
                onClick={() => setSelectedCase(null)}
                className={`absolute top-4 right-4 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Briefcase size={20} /> Case Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Case Title
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.title}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Client
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.client}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Court
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.court}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Case Number
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.caseNumber}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Outcome
                  </label>
                  <span
                    className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-semibold ${
                      darkMode
                        ? statusColors[
                            selectedCase.outcome as keyof typeof statusColors
                          ]?.dark || "bg-gray-600 text-gray-200"
                        : statusColors[
                            selectedCase.outcome as keyof typeof statusColors
                          ]?.light || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedCase.outcome}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.date}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCase.description}
                  </p>
                </div>
                {selectedCase.verdict && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Verdict
                    </label>
                    <p
                      className={`mt-1 text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedCase.verdict}
                    </p>
                  </div>
                )}
                {selectedCase.judge && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Judge
                    </label>
                    <p
                      className={`mt-1 text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedCase.judge}
                    </p>
                  </div>
                )}
                {selectedCase.counsel && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Counsel
                    </label>
                    <ul
                      className={`mt-1 text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      } list-disc list-inside`}
                    >
                      {selectedCase.counsel.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedExpertise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedExpertise(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${colors.modalBg} rounded-xl shadow-xl max-w-md w-full p-6 relative border`}
            >
              <button
                onClick={() => setSelectedExpertise(null)}
                className={`absolute top-4 right-4 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <span className="text-2xl mr-2">{selectedExpertise.icon}</span>
                {selectedExpertise.domain}
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <p
                    className={`mt-1 text-lg ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExpertise.description}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Success Rate
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${colors.highlight}`}
                      >
                        {selectedExpertise.successRate}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: selectedExpertise.successRate }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Cases Handled
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExpertise.casesHandled}
                  </p>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <h3
                    className={`text-md font-semibold ${colors.highlight} mb-2`}
                  >
                    Why Choose Our Expertise
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Specialized knowledge and experience
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Strategic approach to every case
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Proven track record of success
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Personalized attention to client needs
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedExperience(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${colors.modalBg} rounded-xl shadow-xl max-w-md w-full p-6 relative border`}
            >
              <button
                onClick={() => setSelectedExperience(null)}
                className={`absolute top-4 right-4 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <Briefcase size={20} /> Experience Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Position
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExperience.position}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Firm
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExperience.firm}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Location
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExperience.location}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Duration
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExperience.duration}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <p
                    className={`mt-1 text-lg ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedExperience.description}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Responsibilities
                  </label>
                  <ul
                    className={`mt-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    } list-disc list-inside space-y-1`}
                  >
                    {selectedExperience.responsibilities.map((resp, i) => (
                      <li key={i} className="text-base">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEducation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedEducation(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${colors.modalBg} rounded-xl shadow-xl max-w-md w-full p-6 relative border`}
            >
              <button
                onClick={() => setSelectedEducation(null)}
                className={`absolute top-4 right-4 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold ${colors.highlight} mb-4 flex items-center gap-2`}
              >
                <GraduationCap size={20} /> Education Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Degree
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEducation.degree}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Institution
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEducation.institution}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Location
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEducation.location}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Year
                  </label>
                  <p
                    className={`mt-1 text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEducation.year}
                  </p>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <p
                    className={`mt-1 text-lg ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedEducation.description}
                  </p>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <h3
                    className={`text-md font-semibold ${colors.highlight} mb-2`}
                  >
                    Academic Achievements
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Graduated with honors (top 5% of class)
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Winner of National Moot Court Competition
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Published research paper in Law Review Journal
                    </li>
                    <li
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Awarded scholarship for academic excellence
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvocatePortfolio;
