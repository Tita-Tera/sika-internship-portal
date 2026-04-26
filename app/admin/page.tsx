'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Clock, Download, User, GraduationCap, Briefcase, Paperclip, ArrowLeft } from 'lucide-react';

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

  const correctPassword = "sika2025"; // Change this to a secure password in production

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
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-800">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Login</h1>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-600 mb-6 text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition text-lg"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-1">Manage Internship Applications</p>
          </div>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center gap-2 text-sm md:text-base"
          >
            Refresh List
          </button>
        </div>

        {/* Applications List */}
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Applicant</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400 hidden md:table-cell">Email</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Applied</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Status</th>
                  <th className="text-left p-4 md:p-6 font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                    <td className="p-4 md:p-6 font-medium text-white">{app.full_name}</td>
                    <td className="p-4 md:p-6 text-zinc-400 hidden md:table-cell">{app.email}</td>
                    <td className="p-4 md:p-6 text-sm text-zinc-500">
                      {new Date(app.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4 md:p-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
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
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Readable Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl border border-zinc-700 max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl">
                    👤
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedApp.full_name}</h2>
                    <p className="text-zinc-400 text-sm md:text-base">{selectedApp.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-3xl text-zinc-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6 md:p-8 space-y-12">
                {/* Personal Information */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 md:p-8 rounded-2xl">
                    {Object.entries(selectedApp.about || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-zinc-100 font-medium text-base md:text-lg break-words">
                          {String(value || '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <GraduationCap className="w-6 h-6 text-violet-400" />
                    <h3 className="text-xl font-semibold">Education Background</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 md:p-8 rounded-2xl space-y-6">
                    {Object.entries(selectedApp.education || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col md:flex-row md:justify-between gap-2 border-b border-zinc-800 pb-5 last:border-0 last:pb-0">
                        <span className="text-zinc-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-zinc-100 font-medium text-right">
                          {String(value || '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Internship */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-semibold">Internship Preferences</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 md:p-8 rounded-2xl space-y-6">
                    {Object.entries(selectedApp.internship || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col md:flex-row md:justify-between gap-2 border-b border-zinc-800 pb-5 last:border-0 last:pb-0">
                        <span className="text-zinc-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-zinc-100 font-medium text-right">
                          {String(value || '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Documents & Links */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Paperclip className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-semibold">Documents & Links</h3>
                  </div>
                  <div className="bg-zinc-950 p-6 md:p-8 rounded-2xl">
                    {selectedApp.uploads ? (
                      <div className="space-y-8">
                        {/* Uploaded Files */}
                        <div>
                          <p className="text-sm text-zinc-400 mb-4">Uploaded Documents</p>
                          <div className="grid grid-cols-1 gap-4">
                            {Object.entries(selectedApp.uploads).map(([key, value]) => {
                              if (key === 'socialLinks') return null;
                              return (
                                <div key={key} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900 p-5 rounded-2xl gap-3">
                                  <span className="capitalize text-zinc-300">
                                    {key.replace('Url', '').replace(/([A-Z])/g, ' $1')}
                                  </span>
                                  {value ? (
                                    <a 
                                      href={String(value)} 
                                      target="_blank" 
                                      className="text-blue-400 hover:underline text-sm flex items-center gap-2"
                                    >
                                      View File <span className="text-xs">↗</span>
                                    </a>
                                  ) : (
                                    <span className="text-zinc-500 text-sm">Not uploaded</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Social Links */}
                        {selectedApp.uploads.socialLinks && Object.values(selectedApp.uploads.socialLinks).some(Boolean) && (
                          <div>
                            <p className="text-sm text-zinc-400 mb-4">Social Links</p>
                            <div className="space-y-3">
                              {Object.entries(selectedApp.uploads.socialLinks).map(([key, value]) => 
                                value && (
                                  <a
                                    key={key}
                                    href={String(value)}
                                    target="_blank"
                                    className="block text-blue-400 hover:underline text-sm"
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1)} → {value}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No documents or links provided.</p>
                    )}

                    {selectedApp.pdf_url && (
                      <a
                        href={selectedApp.pdf_url}
                        target="_blank"
                        className="mt-10 inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-medium transition w-full md:w-auto justify-center"
                      >
                        <Download className="w-5 h-5" />
                        Download Full Application PDF
                      </a>
                    )}
                  </div>
                </section>
              </div>

              {/* Status Controls */}
              <div className="border-t border-zinc-800 p-6 md:p-8 flex flex-wrap gap-3">
                {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedApp.id, status)}
                    className={`flex-1 md:flex-none py-4 px-6 rounded-2xl font-medium transition min-w-[140px] ${
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