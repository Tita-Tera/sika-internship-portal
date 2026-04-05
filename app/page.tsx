'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, ExternalLink, ChevronRight,
  Users, Briefcase, Star, Award, Building2,
  ArrowRight, Globe, Quote,
} from 'lucide-react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

const NAV_LINKS = [
  { label: 'Home',    href: '#home'    },
  { label: 'About',   href: '#about'   },
  { label: 'Alumni',  href: '#alumni'  },
  { label: 'Contact', href: '#contact' },
];

const STATS = [
  { value: '120+', label: 'Interns Placed',    icon: <Users className="w-5 h-5" />    },
  { value: '40+',  label: 'Partner Companies', icon: <Building2 className="w-5 h-5" /> },
  { value: '95%',  label: 'Hire Rate',         icon: <Award className="w-5 h-5" />    },
  { value: '8',    label: 'Specialties',        icon: <Briefcase className="w-5 h-5" /> },
];

const SPECIALTIES = [
  { title: 'Frontend Development',  desc: 'React, Next.js, UI engineering',       color: 'bg-blue-50 border-blue-100 text-blue-700'   },
  { title: 'Backend Engineering',   desc: 'Node.js, PHP, APIs & databases',        color: 'bg-violet-50 border-violet-100 text-violet-700' },
  { title: 'UI/UX Design',          desc: 'Figma, user research, prototyping',     color: 'bg-pink-50 border-pink-100 text-pink-700'   },
  { title: 'Mobile Development',    desc: 'React Native, Flutter, iOS & Android',  color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
  { title: 'Data Science',          desc: 'Python, ML, analytics & visualization', color: 'bg-amber-50 border-amber-100 text-amber-700' },
  { title: 'Digital Marketing',     desc: 'SEO, social media, growth strategy',    color: 'bg-cyan-50 border-cyan-100 text-cyan-700'   },
  { title: 'DevOps & Cloud',        desc: 'CI/CD, Docker, AWS & GCP',              color: 'bg-orange-50 border-orange-100 text-orange-700' },
  { title: 'Cybersecurity',         desc: 'Pen testing, security audits, SIEM',    color: 'bg-red-50 border-red-100 text-red-700'      },
];

const ALUMNI = [
  {
    name: 'Élisabeth Ngum',
    role: 'Frontend Intern → Junior Dev @ TechCorp',
    avatar: 'EN',
    color: 'bg-blue-100 text-blue-700',
    review: 'Tera-Tech gave me real production experience from week one. I shipped features used by thousands of users — nothing beats that.',
    project: 'E-commerce dashboard rebuild',
    stars: 5,
  },
  {
    name: 'Jean-Paul Mbarga',
    role: 'UI/UX Intern → Product Designer @ Fintech Ltd',
    avatar: 'JM',
    color: 'bg-violet-100 text-violet-700',
    review: 'The mentorship here is exceptional. My supervisor pushed me to think beyond aesthetics — to design for real user problems.',
    project: 'Mobile banking app redesign',
    stars: 5,
  },
  {
    name: 'Amina Fouda',
    role: 'Data Intern → Analyst @ Analytics Co.',
    avatar: 'AF',
    color: 'bg-emerald-100 text-emerald-700',
    review: 'I worked on a live ML pipeline that our clients used daily. That kind of exposure is rare at the internship level.',
    project: 'Customer churn prediction model',
    stars: 5,
  },
  {
    name: 'Boris Tchamba',
    role: 'Backend Intern → Engineer @ CloudSystems',
    avatar: 'BT',
    color: 'bg-amber-100 text-amber-700',
    review: 'Code reviews, standups, sprint planning — full Agile experience. I walked out job-ready.',
    project: 'REST API for logistics platform',
    stars: 5,
  },
];

const GALLERY = [
  { label: 'Team Hackathon 2024',  bg: 'from-blue-400 to-indigo-500'     },
  { label: 'Demo Day Pitches',     bg: 'from-violet-400 to-purple-500'   },
  { label: 'Mentorship Sessions',  bg: 'from-emerald-400 to-teal-500'    },
  { label: 'Project Showcases',    bg: 'from-amber-400 to-orange-500'    },
  { label: 'Intern Graduation',    bg: 'from-pink-400 to-rose-500'       },
  { label: 'Tech Talks',           bg: 'from-cyan-400 to-sky-500'        },
];

const TIMELINE = [
  { step: '01', title: 'Apply Online',         desc: 'Fill out our 5-step application form. Takes about 15 minutes.'   },
  { step: '02', title: 'Initial Screening',    desc: 'Our team reviews your application within 5 business days.'        },
  { step: '03', title: 'Technical Interview',  desc: 'A 30-minute conversation with a mentor in your specialty.'        },
  { step: '04', title: 'Offer & Onboarding',   desc: 'Receive your offer, sign docs, and get your equipment & access.'  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
      {children}
    </span>
  );
}


// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800">
      <SiteHeader transparent={true} />

      {/* ══════════════════════════════════════════════════════ HERO */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div>
            <SectionLabel>🇨🇲 Bamenda, Cameroon · Est. 2018</SectionLabel>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] text-zinc-900 mb-6" style={{ fontFamily: 'Syne' }}>
              Launch Your<br />
              <span className="text-blue-600 font-syne">Tech Career</span><br />
              From Day One.
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-md">
              Tera-Tech Ltd brings you meaningful internships that build real skills and impact. Learn, grow, contribute to projects that matter from day one and kickstart your tech career with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                Start Application <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-medium px-7 py-3.5 rounded-xl transition-all text-sm hover:bg-zinc-50"
              >
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {['EN','JM','AF','BT','CM'].map((initials, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                    ['bg-blue-400','bg-violet-400','bg-emerald-400','bg-amber-400','bg-pink-400'][i]
                  } text-white`}>
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-zinc-500"><strong className="text-zinc-700">120+ interns</strong> placed since 2019</p>
              </div>
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="relative hidden md:block h-[480px]">
            {/* Main card */}
            <div className="absolute top-8 right-0 w-72 bg-white rounded-3xl shadow-xl border border-zinc-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">2025 Cohort Open</p>
                  <p className="text-xs text-zinc-400">Applications close June 30</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Frontend Dev', 'UI/UX Design', 'Data Science', 'DevOps'].map((s) => (
                  <div key={s} className="flex items-center justify-between bg-zinc-50 rounded-xl px-3 py-2">
                    <span className="text-xs font-medium text-zinc-700">{s}</span>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Open</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review card */}
            <div className="absolute bottom-16 left-0 w-60 bg-white rounded-2xl shadow-lg border border-zinc-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">AF</div>
                <div>
                  <p className="text-xs font-semibold text-zinc-800">Amina Fouda</p>
                  <StarRating count={5} />
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">&quot;Shipped a production ML model in my first month. Life-changing.&quot;</p>
            </div>

            {/* Stat badge */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-blue-600 text-white rounded-2xl p-4 shadow-lg">
              <p className="text-3xl font-extrabold" style={{ fontFamily: 'Syne' }}>95%</p>
              <p className="text-[11px] text-blue-200 font-medium">hire rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ STATS */}
      <section className="border-y border-zinc-100 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                {s.icon}
              </div>
              <p className="text-3xl font-extrabold text-zinc-900 mb-1" style={{ fontFamily: 'Syne' }}>{s.value}</p>
              <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ ABOUT */}
      <section id="about" className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <SectionLabel>About the Programme</SectionLabel>
            <h2 className="text-4xl font-extrabold text-zinc-900 mb-5 leading-tight" style={{ fontFamily: 'Syne' }}>
              Built for students<br />who want to build.
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-5">
              This internship program is designed to bridge the gap between academic learning and real-world tech experience. We offer structured, project-based internships where participants work on actual products, systems and research initiatives - not simulations. interns gain hands-on experience, mentorship from industry professionals, and exposure to modern tools and workflows used in today&apos;s technology ecosystem.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-8">
              The program focuses on developing practical skills, critical thinking, and professional readiness. Whether you are a student, recent graduate, or self-taught learner, Tera-Tech Ltd provides an environment to grow, contribute, and build a strong portfolio.
            </p>

            {/* Timeline */}
            <div className="space-y-4">
              {TIMELINE.map((t) => (
                <div key={t.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {t.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">{t.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — specialties */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Open Specialties</p>
            <div className="grid grid-cols-2 gap-3">
              {SPECIALTIES.map((s) => (
                <div key={s.title} className={`border rounded-2xl p-4 ${s.color}`}>
                  <p className="text-sm font-bold mb-1">{s.title}</p>
                  <p className="text-xs opacity-70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company section */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-200 mb-3">About Tera-Tech Ltd</p>
              <h3 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Syne' }}>
                We specializes in<br />System Innovation.
              </h3>
              <p className="text-blue-100 leading-relaxed text-sm mb-3">
                Tera-Tech Ltd is a forward-thinking technology company focused on building digital solutions that drive education, innovation and data-driven development.
              </p>
              <p className="text-blue-100 leading-relaxed text-sm mb-3">
                We specialize in developing intelligent systems, educational platforms, and scalable digital infrastructure tailored to emerging markets. Our mission is to empower individuals and organizations through technology by creating tools that are practical, accessible, and impactful.
              </p>
              <p className="text-blue-100 leading-relaxed text-sm mb-6">
                Through initiatives like internships, Tera-Tech Ltd is committed to nurturing the next generation of talent by providing opportunities for hands-on learning, innovation, and real-world problem solving.
              </p>
              <a
                href="https://www.teratechcompany.tech"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition"
              >
                <Globe className="w-4 h-4" />
                Visit Tera-Tech Ltd
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Founded',     value: '2018'         },
                { label: 'HQ',          value: 'Bamenda, Cameroon' },
                { label: 'Employees',   value: '10+'      },
                { label: 'Countries',   value: '3'         },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-2xl p-4">
                  <p className="text-[11px] text-blue-200 uppercase tracking-wide font-medium mb-1">{item.label}</p>
                  <p className="text-lg font-bold" style={{ fontFamily: 'Syne' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ ALUMNI */}
      <section id="alumni" className="py-24 bg-zinc-50/50 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Alumni</SectionLabel>
            <h2 className="text-4xl font-extrabold text-zinc-900" style={{ fontFamily: 'Syne' }}>
              What our interns say
            </h2>
            <p className="text-zinc-500 mt-3 max-w-md mx-auto text-sm">
              Real stories from real people who turned an internship into a career.
            </p>
          </div>

          {/* Reviews grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {ALUMNI.map((a) => (
              <div key={a.name} className="bg-white rounded-3xl border border-zinc-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${a.color}`}>
                      {a.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{a.name}</p>
                      <p className="text-xs text-zinc-400">{a.role}</p>
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-zinc-200 shrink-0" />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-4 italic">&quot;{a.review}&quot;</p>
                <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-medium">Project</p>
                    <p className="text-xs font-semibold text-zinc-700">{a.project}</p>
                  </div>
                  <StarRating count={a.stars} />
                </div>
              </div>
            ))}
          </div>

          {/* Gallery */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-5">Photo Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GALLERY.map((g) => (
                <div
                  key={g.label}
                  className={`relative rounded-2xl bg-gradient-to-br ${g.bg} h-36 flex items-end p-4 overflow-hidden group cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="relative z-10 text-white text-xs font-semibold">{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ CTA */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <SectionLabel>Apply Today</SectionLabel>
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-5 leading-tight" style={{ fontFamily: 'Syne' }}>
          Ready to start<br />building your future?
        </h2>
        <p className="text-zinc-500 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
          Applications for our 2025 cohort are open. The process takes 15 minutes. Your next chapter starts here.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl"
        >
          Start Your Application <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ══════════════════════════════════════════════════════ CONTACT */}
      <section id="contact" className="py-24 bg-zinc-50/50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="text-4xl font-extrabold text-zinc-900" style={{ fontFamily: 'Syne' }}>
              Get in touch
            </h2>
            <p className="text-zinc-500 mt-3 max-w-md mx-auto text-sm">
              Questions about the programme? Reach out — we reply within one business day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact details */}
            <div className="space-y-4">
              {[
                { icon: <MapPin className="w-4 h-4" />,  label: 'Address',  value: 'Sonac Street, Bamenda, Cameroon',      color: 'bg-blue-100 text-blue-600'    },
                { icon: <Phone className="w-4 h-4" />,   label: 'Phone',    value: '+237 678 937 645',                               color: 'bg-emerald-100 text-emerald-600' },
                { icon: <Mail className="w-4 h-4" />,    label: 'Email',    value: 'internships@teratechcompany.tech',                        color: 'bg-violet-100 text-violet-600' },
                { icon: <Globe className="w-4 h-4" />,   label: 'Website',  value: 'www.teratechcompany.tech',                                   color: 'bg-amber-100 text-amber-600'  },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4 bg-white border border-zinc-100 rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">{c.label}</p>
                    <p className="text-sm font-medium text-zinc-700">{c.value}</p>
                  </div>
                </div>
              ))}

              {/* Office hours */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Office Hours</p>
                <div className="space-y-2">
                  {[
                    { day: 'Tuesday – Friday', hours: '8:00 AM – 5:00 PM' },
                    { day: 'Saturday',        hours: '9:00 AM – 1:00 PM' },
                    { day: 'Sunday',          hours: 'Closed'             },
                  ].map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-zinc-600">{h.day}</span>
                      <span className={`font-medium ${h.hours === 'Closed' ? 'text-zinc-400' : 'text-zinc-800'}`}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-3xl overflow-hidden border border-zinc-100 shadow-sm h-full min-h-[420px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15916.07607069494!2d9.696887!3d4.050994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610d06e5e3c17b%3A0x1c25d28eb2fa0aa3!2sAkwa%2C%20Douala!5e0!3m2!1sen!2scm!4v1700000000000!5m2!1sen!2scm"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tera-Tech Ltd Office Location — Sonac Street, Bamenda, Cameroon"
              />
              {/* Directions button overlay */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Sonac%20Street,%20Bamenda,%20Cameroon"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white shadow-lg border border-zinc-100 text-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Get Directions
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}