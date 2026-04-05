import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Figma,
  Layout,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Section, Card } from "../components/UI";
import { api } from "../services/api";
import { Experience } from "../types";
import vijithaImg from "../assets/images/last.jpg";

export default function About() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperience().then((data) => {
      setExperience(data);
      setLoading(false);
    });
  }, []);

  const skills = [
    {
      name: "UI Design",
      icon: Layout,
      desc: "Design thinking, Wireframing, High-fidelity UI screens",
    },
    {
      name: "Front-End",
      icon: Smartphone,
      desc: "React, Tailwind CSS, Zustand, React Query",
    },
    {
      name: "Tools",
      icon: Monitor,
      desc: "Figma, Adobe XD, Whimsical, Git, Jira",
    },
  ];

  const tools = [
    "React",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Zustand",
    "React Query",
    "Figma",
    "Adobe XD",
    "Whimsical",
    "Git",
    "Jira",
    "DevExtreme UI",
  ];

  return (
    <div className="pt-32 pb-24">
      <Section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
            I'm Vijitha P, <br />
            <span className="text-zinc-300">Front-End Developer.</span>
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed font-medium">
            A Front-End Developer with 3 years of experience, specializing in
            UI/UX development and creating responsive, visually engaging user
            interfaces. I focus on translating design concepts into intuitive,
            user-friendly web experiences.
          </p>
          <div className="flex gap-12">
            <div>
              <div className="text-5xl font-extrabold mb-1">3</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Years Exp
              </div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-1">15+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Projects
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative aspect-square rounded-[40px] overflow-hidden bg-zinc-50 border border-zinc-100 shadow-2xl">
          <img
            src={vijithaImg}
            alt="Vijitha"
            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </Section>

      {/* Skills */}
      <div className="bg-zinc-50/50 border-y border-zinc-100">
        <Section
          title="Expertise"
          subtitle="Core competencies I've developed over the years."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {skills.map((skill, i) => (
              <Card
                key={i}
                className="space-y-6 p-8 rounded-[32px] hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <skill.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {skill.name}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed font-medium">
                  {skill.desc}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      {/* Experience Timeline */}
      <Section
        title="Experience"
        subtitle="My professional journey at Experion Technologies."
      >
        <div className="max-w-4xl space-y-16">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-zinc-50 rounded-[32px] animate-pulse"
                />
              ))
          ) : experience.length > 0 ? (
            experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-12 border-l-2 border-zinc-100"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-zinc-900 rounded-full ring-4 ring-white shadow-sm" />
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight">
                        {exp.role}
                      </h3>
                      <div className="text-lg font-bold text-zinc-400 mt-1">
                        {exp.company}
                      </div>
                    </div>
                    <span className="px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 inline-block">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-lg leading-relaxed font-medium max-w-3xl">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-zinc-400 italic">
              Experience details coming soon...
            </p>
          )}
        </div>
      </Section>

      {/* Education */}
      <div className="bg-zinc-900 text-white py-32">
        <Section title="Education" className="text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 p-8 border border-white/10 rounded-[32px]">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                2024 - Present
              </div>
              <h3 className="text-2xl font-bold">
                Bachelor of Computer Applications
              </h3>
              <p className="text-zinc-400 font-medium">
                Indira Gandhi National Open University
              </p>
            </div>
            <div className="space-y-4 p-8 border border-white/10 rounded-[32px]">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                2019 - 2022
              </div>
              <h3 className="text-2xl font-bold">
                Diploma in Computer Engineering
              </h3>
              <p className="text-zinc-400 font-medium">
                Government Polytechnic College, Nedumangad
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Tools */}
      <Section title="Tools & Technologies">
        <div className="flex flex-wrap gap-4">
          {tools.map((tool) => (
            <span
              key={tool}
              className="px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-[20px] text-sm font-bold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 cursor-default shadow-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}
