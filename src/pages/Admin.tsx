import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  MessageSquare,
  Briefcase,
  LayoutGrid,
  Image as ImageIcon,
} from "lucide-react";
import { Section, Button, Card } from "../components/UI";
import { api } from "../services/api";
import { Project, Experience, Message } from "../types";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    "projects" | "experience" | "messages"
  >("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [p, e, m] = await Promise.all([
          api.getProjects(),
          api.getExperience(),
          api.getMessages(),
        ]);
        setProjects(p);
        setExperience(e);
        setMessages(m);
      } catch (err) {
        localStorage.removeItem("admin_token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const deleteExperience = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      await api.deleteExperience(id);
      setExperience(experience.filter((e) => e.id !== id));
    }
  };

  if (loading)
    return <div className="pt-32 text-center">Loading dashboard...</div>;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-zinc-50">
      <Section>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-500">
              Manage your portfolio content and messages.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {[
              { id: "projects", label: "Projects", icon: LayoutGrid },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "messages", label: "Messages", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow-md"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    Projects ({projects.length})
                  </h2>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => alert("Add project modal would open here")}
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((p) => (
                    <Card
                      key={p.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden border border-black/5">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold">{p.title}</div>
                          <div className="text-xs text-zinc-400 uppercase tracking-wider">
                            {p.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteProject(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-center py-12 text-zinc-400">
                      No projects yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    Experience ({experience.length})
                  </h2>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() =>
                      alert("Add experience modal would open here")
                    }
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {experience.map((e) => (
                    <Card
                      key={e.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <div className="font-bold">{e.role}</div>
                        <div className="text-xs text-zinc-400">
                          {e.company} • {e.period}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteExperience(e.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {experience.length === 0 && (
                    <p className="text-center py-12 text-zinc-400">
                      No experience items yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">
                  Messages ({messages.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((m) => (
                    <Card key={m.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold">{m.name}</div>
                          <div className="text-xs text-zinc-400">{m.email}</div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-black/5">
                        {m.message}
                      </p>
                    </Card>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-center py-12 text-zinc-400">
                      No messages yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
