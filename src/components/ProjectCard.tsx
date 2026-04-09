import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Project } from "../types";
import { resolveProjectMedia } from "../lib/projectMedia";

export default function ProjectCard({ project }: { project: Project }) {
  const imageUrl = resolveProjectMedia(project.imageUrl, project.id);

  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
      className="group"
    >
      <Link to={`/projects/${project.id}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-zinc-50 mb-8 border border-zinc-100">
          <img
            src={imageUrl}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="px-4 py-2 glass text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-full">
              {project.category}
            </span>
          </div>

          {/* View Project Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <ArrowRight className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="space-y-3 px-2">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold tracking-tight group-hover:text-zinc-600 transition-colors">
              {project.title}
            </h3>
          </div>
          <p className="text-zinc-500 line-clamp-2 text-base leading-relaxed font-medium">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
