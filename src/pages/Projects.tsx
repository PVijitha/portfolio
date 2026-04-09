import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Section } from "../components/UI";
import ProjectCard from "../components/ProjectCard";
import { api } from "../services/api";
import { Project } from "../types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Web" | "Mobile" | "Dashboard">(
    "All",
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getProjects().then((data: any) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "All" || p.category === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24">
      <Section
        title="Works"
        subtitle="Exploring the intersection of design and technology through various digital products."
      >
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-20">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all text-base font-medium"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {["All", "Web", "Mobile"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-8 py-5 rounded-3xl text-sm font-bold tracking-tight transition-all whitespace-nowrap ${
                  filter === cat
                    ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                    : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-4/3 bg-zinc-50 rounded-4xl animate-pulse"
                />
              ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
              <p className="text-zinc-400 text-lg font-medium">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
