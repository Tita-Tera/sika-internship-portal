import Link from 'next/link';
import { Briefcase, Globe } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function SiteFooter() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-zinc-800">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/teratechcompany.jpg"
                alt="Tera-Tech Ltd Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span
                className="font-extrabold text-white text-lg"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Tera-Tech Internship<span className="text-blue-400">.</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mb-5">
              Cameroon&apos;s leading tech internship programme, placing students in real companies with real mentors since 2019.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaLinkedin className="w-4 h-4" />, href: '#'                    },
                { icon: <FaGithub className="w-4 h-4" />,   href: '#'                    },
                { icon: <Globe className="w-4 h-4" />,    href: 'https://teratechcompany.tech' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Programme links */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Programme</p>
            <ul className="space-y-2.5">
              {['How it works', 'Specialties', 'Apply now', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-zinc-400 hover:text-white text-sm transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Company</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Tera-Tech Ltd', href: 'https://teratechcompany.tech' },
                { label: 'About us',    href: '/#about'              },
                { label: 'Alumni',      href: '/#alumni'             },
                { label: 'Contact',     href: '/#contact'            },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Tera-Tech Internship Portal · Bamenda, Cameroon
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((t) => (
              <a key={t} href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}