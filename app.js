import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, Phone, Download, ChevronDown } from 'lucide-react';

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Détection de la section active
      const sections = ['accueil', 'apropos', 'parcours', 'projets', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'apropos', label: 'À propos' },
    { id: 'parcours', label: 'Parcours' },
    { id: 'projets', label: 'Projets' },
    { id: 'contact', label: 'Contact' }
  ];

  const skills = [
    'Python', 'R', 'SQL', 'Power BI', 'Excel & VBA',
    'JavaScript', 'React', 'Data Analysis', 'Machine Learning'
  ];

  const projects = [
    {
      title: "NoteIt",
      year: "2025",
      description: "Application innovante de collecte d'avis clients via technologie NFC.",
      tags: ["Entrepreneuriat", "NFC", "Web"]
    },
    {
      title: "Analyse ADRD",
      year: "2024-2025",
      description: "Projet avec le laboratoire MAVIE pour Calixys. Pipeline complet de données et tableau de bord Power BI.",
      tags: ["Data Viz", "Python", "Power BI"]
    },
    {
      title: "Concours DataViz",
      year: "2024",
      description: "Visualisation de données sur la scolarisation des 15-29 ans en région PACA.",
      tags: ["Data Viz", "Concours", "Équipe"]
    },
    {
      title: "Robot Tout-Terrain",
      year: "2023-2024",
      description: "Robot pilotable à distance avec caméra temps réel et Raspberry Pi.",
      tags: ["Python", "IoT", "Raspberry Pi"]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={() => scrollToSection('accueil')}
            className="text-xl font-bold tracking-tight hover:text-blue-600 transition-colors"
          >
            TP
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm uppercase tracking-wider transition-all hover:text-blue-600 ${
                  activeSection === item.id 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t mt-4 py-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <div className="overflow-hidden">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
              Théo PETIT
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-delay">
            Data Analyst • Étudiant en Science des Données
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-fade-in-delay-2">
            Alternant chez IMA, passionné par l'analyse de données et l'innovation technologique.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-delay-3">
            <button 
              onClick={() => scrollToSection('projets')}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:scale-105"
            >
              Voir mes projets
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all"
            >
              Me contacter
            </button>
          </div>
          <button 
            onClick={() => scrollToSection('apropos')}
            className="mt-16 animate-bounce"
          >
            <ChevronDown size={32} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="min-h-screen py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">À propos</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Profil</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Étudiant en BUT Science des Données (promotion 2027), je suis actuellement en alternance chez <strong>Inter Mutuelle Assistance</strong> en tant que Data Analyst.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Titulaire d'un BAC STI2D avec spécialités Mathématiques et Informatique, je développe mes compétences en analyse de données, visualisation et programmation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Parallèlement, je suis entrepreneur et fondateur de <strong>NoteIt.fr</strong>, une solution innovante de collecte d'avis clients via NFC.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Valeurs</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="font-semibold">Rigueur & Discipline</p>
                  <p className="text-sm text-gray-600">2 ans aux Halles de Niort</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="font-semibold">Esprit d'équipe</p>
                  <p className="text-sm text-gray-600">Football depuis 13 ans</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="font-semibold">Innovation</p>
                  <p className="text-sm text-gray-600">Entrepreneuriat & projets tech</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Compétences</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <span 
                  key={skill}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-blue-600 hover:text-white transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section id="parcours" className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Parcours</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Data Analyst</h3>
                  <p className="text-blue-600">Inter Mutuelle Assistance (IMA)</p>
                </div>
                <span className="text-gray-500">2024-2027</span>
              </div>
              <p className="text-gray-600">Alternance - Analyse de données, reporting et datavisualisation</p>
            </div>

            <div className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">BUT Science des Données</h3>
                  <p className="text-blue-600">IUT de Niort</p>
                </div>
                <span className="text-gray-500">2024-2027</span>
              </div>
              <p className="text-gray-600">Formation en 3 ans - Data Analysis, Machine Learning, Statistiques</p>
            </div>

            <div className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Fondateur</h3>
                  <p className="text-blue-600">NoteIt.fr</p>
                </div>
                <span className="text-gray-500">2025</span>
              </div>
              <p className="text-gray-600">Solution de collecte d'avis clients via technologie NFC</p>
            </div>

            <div className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Vendeur</h3>
                  <p className="text-blue-600">P'tites Pêcheries Trembladaises</p>
                </div>
                <span className="text-gray-500">2022-2024</span>
              </div>
              <p className="text-gray-600">Halles de Niort - Service client et rigueur professionnelle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projets */}
      <section id="projets" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Projets sélectionnés</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="border border-gray-200 p-8 rounded-lg hover:border-blue-600 hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-500">{project.year}</span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Découvrez tous mes projets académiques et personnels
            </p>
            <a 
              href="http://but-sd-niort.fr/2027/theopetit/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all"
            >
              Portfolio complet
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact</h2>
          <p className="text-xl text-gray-400 mb-12">
            Intéressé par mon profil ? N'hésitez pas à me contacter.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
            <a 
              href="mailto:pro.theopetit@gmail.com"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
            >
              <Mail size={20} />
              pro.theopetit@gmail.com
            </a>
            <a 
              href="tel:0781088125"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-all"
            >
              <Phone size={20} />
              07 81 08 81 25
            </a>
          </div>

          <div className="flex gap-6 justify-center">
            <a 
              href="https://www.linkedin.com/in/théo-petit-b06857260"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://github.com/theopetit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              <Github size={24} />
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2025 Théo PETIT • Portfolio minimaliste
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}