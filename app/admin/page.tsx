'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Clock, Download, User, GraduationCap, Briefcase, Paperclip } from 'lucide-react';

interface Application {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  created_at: string;
  status: string;
  pdf_url?: string;
  about?: any;
  education?: any;
  internship?: any;
  uploads?: any;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = "sika2025"; // Change this in production

  const handleLogin = () => {
    if (adminPassword === correctPassword) {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setApplications(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 md:p-12 rounded-3xl w-full max-w-md border border-zinc-800">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Login</h1>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-600 mb-6"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-500">Manage Internship Applications</p>
          </div>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center gap-2 text-sm"
          >
            Refresh List
          </button>
        </div>

        {/* Applications Table */}
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-zinc-950">
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Applicant</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400 hidden md:table-cell">Email</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Date</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Status</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-zinc-800 hover:bg-zinc-800/60 transition-all">
                    <td className="p-4 md:p-6 font-medium text-white whitespace-nowrap">{app.full_name}</td>
                    <td className="p-4 md:p-6 text-zinc-400 hidden md:table-cell break-all">{app.email}</td>
                    <td className="p-4 md:p-6 text-sm text-zinc-500 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 md:p-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                        app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 md:p-6">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm whitespace-nowrap"
                      >
                        View Full Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed View Modal - Highly Responsive */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl border border-zinc-700 max-h-[95vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl">👤</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedApp.full_name}</h2>
                    <p className="text-zinc-400 text-sm">{selectedApp.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-4xl text-zinc-400 hover:text-white leading-none"
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-auto p-6 space-y-10">
                {/* Personal Info */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <User className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-zinc-950 p-6 rounded-2xl">
                    {Object.entries(selectedApp.about || {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-zinc-100 font-medium">{String(value || '—')}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <GraduationCap className="w-6 h-6 text-violet-400" />
                    <h3 className="text-xl font-semibold">Education Background</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl space-y-6">
                    {Object.entries(selectedApp.education || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-zinc-800 pb-4 last:border-0">
                        <span className="text-zinc-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-zinc-100 font-medium text-right">{String(value || '—')}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Internship */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-semibold">Internship Preferences</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl space-y-6">
                    {Object.entries(selectedApp.internship || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-zinc-800 pb-4 last:border-0">
                        <span className="text-zinc-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-zinc-100 font-medium text-right">{String(value || '—')}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Documents */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Paperclip className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-semibold">Documents & Links</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl">
                    {selectedApp.uploads ? (
                      <div className="space-y-6">
                        {Object.entries(selectedApp.uploads).map(([key, value]) => {
                          if (key === 'socialLinks') return null;
                          return (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                              <span className="capitalize text-zinc-300 mb-2 sm:mb-0">
                                {key.replace('Url', '').replace(/([A-Z])/g, ' $1')}
                              </span>
                              {value ? (
                                <a href={String(value)} target="_blank" className="text-blue-400 hover:underline text-sm">
                                  View File →
                                </a>
                              ) : (
                                <span className="text-zinc-500 text-sm">Not uploaded</span>
                              )}
                            </div>
                          );
                        })}

                        {selectedApp.uploads.socialLinks && (
                          <div className="pt-4 border-t border-zinc-800">
                            <p className="text-sm text-zinc-400 mb-3">Social Links</p>
                            {Object.entries(selectedApp.uploads.socialLinks).map(([key, value]) =>
                              value && (
                                <a
                                  key={key}
                                  href={String(value)}
                                  target="_blank"
                                  className="block text-blue-400 hover:underline py-1"
                                >
                                  {key} → {value}
                                </a>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No documents uploaded.</p>
                    )}

                    {selectedApp.pdf_url && (
                      <a
                        href={selectedApp.pdf_url}
                        target="_blank"
                        className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-medium transition"
                      >
                        <Download className="w-5 h-5" />
                        Download Full PDF Summary
                      </a>
                    )}
                  </div>
                </section>
              </div>

              {/* Status Actions */}
              <div className="border-t border-zinc-800 p-6 flex flex-wrap gap-3">
                {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedApp.id, status)}
                    className={`flex-1 sm:flex-none py-4 px-6 rounded-2xl font-medium transition ${
                      selectedApp.status === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}