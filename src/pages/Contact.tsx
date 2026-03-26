import { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, MapPin, Phone, Linkedin } from "lucide-react";
import { Section, Button, Card } from "../components/UI";
import { api } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendMessage(formData);
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24">
      <Section
        title="Get in Touch"
        subtitle="Have a project in mind or just want to say hi? Feel free to reach out."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <p className="text-zinc-500 leading-relaxed">
                Open to opportunities where thoughtful design and impactful
                products come together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-50 rounded-[20px] flex items-center justify-center border border-zinc-100 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Email
                  </div>
                  <div className="font-bold"> vijithaseven@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-50 rounded-[20px] flex items-center justify-center border border-zinc-100 shadow-sm">
                  <Linkedin className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    LinkedIn
                  </div>
                  <a
                    href="https://www.linkedin.com/in/vijitha-p-52350320b/"
                    className="font-bold hover:underline hover:text-blue-500"
                  >
                    vijitha-p
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-50 rounded-[20px] flex items-center justify-center border border-zinc-100 shadow-sm">
                  <MapPin className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Location
                  </div>
                  <div className="font-bold">Kerala, India</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold">Message Sent!</h3>
                <p className="text-zinc-500">
                  Thank you for reaching out. I'll get back to you as soon as
                  possible.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    placeholder="How can I help you?"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={loading}
                >
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Section>
    </div>
  );
}
