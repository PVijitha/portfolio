import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Layout,
  Smartphone,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Section } from "../components/UI";
import ProjectCard from "../components/ProjectCard";
import { api } from "../services/api";
import { Project } from "../types";
import vijithaImg from "../assets/images/vijitha.jpg";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then((data) => {
      setProjects(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <div className="pt-16 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] w-64 h-64 bg-zinc-100 rounded-full blur-3xl opacity-50"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-zinc-50 rounded-full blur-3xl opacity-60"
        />
      </div>

      {/* Hero Section */}
      <Section className="min-h-[90vh] flex flex-col justify-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8"
            >
              <Sparkles className="w-3 h-3 text-zinc-900" />I am Vijitha
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-[100px] font-extrabold tracking-tighter leading-[0.9] mb-10 gradient-text"
            >
              Designing digital <br />
              experiences that <br />
              <span className="text-zinc-300 font-medium">people love.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-red-700 max-w-2xl mb-12 leading-relaxed font-medium"
            >
              A Front-End Developer with 3 years of experience, specializing in
              UI/UX development and creating responsive, visually engaging user
              interfaces.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6"
            >
              <Link to="/projects">
                <Button
                  size="lg"
                  className="rounded-full px-10 py-5 text-base shadow-xl shadow-zinc-200 hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  Explore Work <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 py-5 text-base border-zinc-200 hover:bg-zinc-50"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="lg:col-span-4 relative hidden lg:block"
          >
            <div className="aspect-4/5 rounded-[48px] overflow-hidden bg-zinc-100 border-8 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src={vijithaImg}
                alt="Vijitha"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -inset-4 bg-zinc-900 -z-10 rounded-[52px] rotate-1 opacity-5" />
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-zinc-200 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            />
          </div>
        </motion.div>
      </Section>

      {/* Skills Highlight */}
      <div className="bg-white">
        <Section className="py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Layout,
                title: "UI Design",
                desc: "Design thinking, Wireframing, High-fidelity UI screens",
              },
              {
                icon: Smartphone,
                title: "Front-End",
                desc: "React, Tailwind CSS, Zustand, React Query",
              },
              {
                icon: Monitor,
                title: "Tools",
                iconColor: "text-zinc-900",
                desc: "Figma, Adobe XD, Whimsical, Git, Jira",
              },
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group space-y-6"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:rotate-6 transition-all duration-500">
                  <skill.icon className="w-8 h-8 text-zinc-900 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {skill.title}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed">
                  {skill.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>

      {/* Featured Projects */}
      <Section
        title="Selected Works"
        subtitle="A selection of my recent work across web and mobile platforms."
        className="pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-4/3 bg-zinc-50 rounded-3xl animate-pulse"
                />
              ))
          ) : projects.length > 0 ? (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-[40px]">
              No projects found. Add some in the admin panel!
            </div>
          )}
        </div>
        <div className="mt-24 text-center">
          <Link to="/projects">
            <Button
              variant="outline"
              className="rounded-full px-12 py-6 text-base border-zinc-200 hover:bg-zinc-50 hover:scale-105 transition-all"
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
