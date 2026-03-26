import { Link } from 'react-router-dom';
import { Palette, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">VIJITHA.</span>
            </Link>
            <p className="text-zinc-500 max-w-sm text-sm leading-relaxed font-medium">
              Front-End Developer specializing in UI/UX development. 
              Translating complex workflows into intuitive digital experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-black/5 hover:bg-zinc-100 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-black/5 hover:bg-zinc-100 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-black/5 hover:bg-zinc-100 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-black/5 hover:bg-zinc-100 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Projects', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-sm text-zinc-600 hover:text-black transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-zinc-600 hover:text-black transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} UX/UI Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Built with React, Express & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
