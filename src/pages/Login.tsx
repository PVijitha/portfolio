import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Section, Button, Card } from "../components/UI";
import { api } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await api.login({ username, password });
      localStorage.setItem("admin_token", token);
      navigate("/admin");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Enter your credentials to manage your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Username
            </label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
