import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";
import { Section, Button } from "../components/UI";
import { api } from "../services/api";
import { Project } from "../types";
import healthcareImg from "../assets/images/healthcare.png";
import forumImg from "../assets/images/forum.png";
import todoImg from "../assets/images/todo.png";
import scoringImg from "../assets/images/scoring.png";
import movieImg from "../assets/images/movie.png";
import quizImg from "../assets/images/quiz.png";
import restaurantImg from "../assets/images/restaurant.png";
import petsImg from "../assets/images/pets.png";
import healthhomeImg from "../assets/images/healthhome.png";
import forumhomeImg from "../assets/images/forumhome.png";

const imageMap: Record<string, string> = {
  "1": healthcareImg,
  "2": forumImg,
  "3": todoImg,
  "4": scoringImg,
  "5": movieImg,
  "6": quizImg,
  "7": restaurantImg,
  "8": petsImg,
};

const gallaryMap: Record<string, string> = {
  "1": healthhomeImg,
  "2": forumhomeImg,
};

export default function CaseStudy() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then((data) => {
      const found = data.find((p) => p.id === id);
      setProject(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <div className="pt-32 text-center">Loading case study...</div>;
  if (!project)
    return <div className="pt-32 text-center">Project not found.</div>;

  return (
    <div className="pt-24 pb-24">
      <Section>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-12 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-zinc-100 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                {project.title}
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-4 py-2 bg-zinc-50 border border-black/5 rounded-xl text-xs font-medium text-zinc-600"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-black/5">
            <img
              src={imageMap[project.id]}
              alt={project.title}
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </Section>

      {/* Case Study Content */}
      <div className="bg-zinc-50 border-y border-black/5 mt-12">
        <Section className="py-24">
          <div className="max-w-3xl mx-auto space-y-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">The Problem</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {project.caseStudy.problem}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Research & Discovery</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {project.caseStudy.research}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Wireframes & Ideation</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {project.caseStudy.wireframes}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Final UI Design</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {project.caseStudy.finalUI}
              </p>
              {project.caseStudy.gallery &&
                project.caseStudy.gallery.length > 0 && (
                  <div className="grid grid-cols-1 gap-8 mt-12">
                    {project.caseStudy.gallery.map((img, i) => (
                      <img
                        key={i}
                        src={gallaryMap[project.id]}
                        className="rounded-2xl shadow-lg border border-black/5"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Outcome & Impact</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {project.caseStudy.outcome}
              </p>
            </div>
          </div>
        </Section>
      </div>

      <Section className="text-center py-32">
        <h3 className="text-2xl font-bold mb-8">Want to see more?</h3>
        <Link to="/projects">
          <Button size="lg">Browse All Projects</Button>
        </Link>
      </Section>
    </div>
  );
}
