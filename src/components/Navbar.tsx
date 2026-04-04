import { Link, useLocation } from "react-router-dom";
import { Menu, X, Palette } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className="glass rounded-[32px] px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-zinc-200">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter">
            VIJITHA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold tracking-tight transition-all relative group ${
                location.pathname === link.path
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900"
              }`}
            >
              {link.name}
              <motion.div
                initial={false}
                animate={{
                  width: location.pathname === link.path ? "100%" : "0%",
                  opacity: location.pathname === link.path ? 1 : 0,
                }}
                className="absolute -bottom-1 left-0 h-0.5 bg-zinc-900 rounded-full"
              />
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
          <Link
            to="/login"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="md:hidden mt-4 glass rounded-[32px] overflow-hidden p-4"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-4 text-lg font-bold rounded-2xl transition-all ${
                    location.pathname === link.path
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
