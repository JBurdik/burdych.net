import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit3,
  Github,
  Linkedin,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { about, type Social } from "../../data/portfolio";
import { Modal, ConfirmModal } from "../../components/admin/Modal";
import { AboutForm } from "../../components/admin/forms/AboutForm";
import type { AboutFormData } from "../../data/schemas";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const socialIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

function SettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [deletingSocial, setDeletingSocial] = useState<Social | null>(null);

  // Local state for about data (will be replaced with API calls)
  const [aboutData, setAboutData] = useState(about);

  // New social form state
  const [newSocial, setNewSocial] = useState({ name: "", url: "", icon: "" });

  const handleSaveProfile = async (data: AboutFormData) => {
    // In real app, this would be an API call
    setAboutData((prev) => ({
      ...prev,
      ...data,
    }));
    setIsEditingProfile(false);
  };

  const handleAddSocial = () => {
    if (newSocial.name && newSocial.url && newSocial.icon) {
      setAboutData((prev) => ({
        ...prev,
        socials: [...prev.socials, newSocial],
      }));
      setNewSocial({ name: "", url: "", icon: "" });
      setIsAddingSocial(false);
    }
  };

  const handleDeleteSocial = () => {
    if (deletingSocial) {
      setAboutData((prev) => ({
        ...prev,
        socials: prev.socials.filter((s) => s.url !== deletingSocial.url),
      }));
      setDeletingSocial(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Nastavení
            </h1>
            <p className="text-gray-400 mt-1">
              Správa profilu a kontaktních údajů
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden"
          >
            {/* Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30" />
            </div>

            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <motion.div
                  className="w-32 h-32 rounded-2xl border-4 border-[#12121a] overflow-hidden bg-[#0a0a0f]"
                  whileHover={{ scale: 1.02 }}
                >
                  {aboutData.avatar ? (
                    <img
                      src={aboutData.avatar}
                      alt={aboutData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </motion.div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute top-2 right-0 p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {aboutData.name}
                  </h2>
                  <p className="text-cyan-400">{aboutData.title}</p>
                </div>

                <p className="text-gray-400 leading-relaxed line-clamp-4">
                  {aboutData.bio}
                </p>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 rounded-lg bg-white/5">
                      <Mail className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm truncate">{aboutData.email}</span>
                  </div>

                  {aboutData.phone && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 rounded-lg bg-white/5">
                        <Phone className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="text-sm">{aboutData.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 rounded-lg bg-white/5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm">{aboutData.location}</span>
                  </div>

                  {aboutData.cvUrl && (
                    <a
                      href={aboutData.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                        <FileText className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <span className="text-sm">Stáhnout CV</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Sociální sítě
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingSocial(true)}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {aboutData.socials.map((social, index) => {
                  const Icon = socialIcons[social.icon] || ExternalLink;
                  return (
                    <motion.div
                      key={social.url}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 flex-1"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {social.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {social.url}
                          </p>
                        </div>
                      </a>

                      <motion.button
                        initial={{ opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => setDeletingSocial(social)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {aboutData.socials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Zatím žádné sociální sítě</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bio Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Kompletní Bio
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {aboutData.bio}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title="Upravit profil"
        size="lg"
      >
        <AboutForm
          defaultValues={aboutData}
          onSubmit={handleSaveProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      </Modal>

      {/* Add Social Modal */}
      <Modal
        isOpen={isAddingSocial}
        onClose={() => {
          setIsAddingSocial(false);
          setNewSocial({ name: "", url: "", icon: "" });
        }}
        title="Přidat sociální síť"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Název
            </label>
            <input
              type="text"
              value={newSocial.name}
              onChange={(e) =>
                setNewSocial((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="GitHub, LinkedIn, Twitter..."
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              URL
            </label>
            <input
              type="url"
              value={newSocial.url}
              onChange={(e) =>
                setNewSocial((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Ikona
            </label>
            <select
              value={newSocial.icon}
              onChange={(e) =>
                setNewSocial((prev) => ({ ...prev, icon: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
            >
              <option value="">Vyberte ikonu</option>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="mail">Email</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsAddingSocial(false);
                setNewSocial({ name: "", url: "", icon: "" });
              }}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Zrušit
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSocial}
              disabled={!newSocial.name || !newSocial.url || !newSocial.icon}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Přidat
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Social Confirmation */}
      <ConfirmModal
        isOpen={!!deletingSocial}
        onClose={() => setDeletingSocial(null)}
        onConfirm={handleDeleteSocial}
        title="Smazat sociální síť"
        message={`Opravdu chcete smazat "${deletingSocial?.name}"?`}
        confirmText="Smazat"
        variant="danger"
      />
    </AdminLayout>
  );
}
