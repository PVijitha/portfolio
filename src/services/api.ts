import { Project, Experience, Message } from "../types";

const API_BASE = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  createProject: async (project: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    return res.json();
  },
  updateProject: async (
    id: string,
    project: Partial<Project>,
  ): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    return res.json();
  },
  deleteProject: async (id: string) => {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // Experience
  getExperience: async (): Promise<Experience[]> => {
    const res = await fetch(`${API_BASE}/experience`);
    return res.json();
  },
  createExperience: async (exp: Partial<Experience>): Promise<Experience> => {
    const res = await fetch(`${API_BASE}/experience`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(exp),
    });
    return res.json();
  },
  deleteExperience: async (id: string) => {
    await fetch(`${API_BASE}/experience/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // Messages
  sendMessage: async (message: Partial<Message>) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    return res.json();
  },
  getMessages: async (): Promise<Message[]> => {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Upload
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: formData,
    });
    return res.json();
  },
};
