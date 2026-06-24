import {
  Activity,
  Briefcase,
  Code2,
  FileText,
  Grid2X2,
  Link as LinkIcon,
  MessageSquare,
  Users
} from 'lucide-react';

export const jobBoards = [
  'LinkedIn',
  'Indeed',
  'Naukri',
  'Glassdoor',
  'Greenhouse',
  'Lever',
  'Workday',
  'Wellfound',
  'ZipRecruiter',
  'shine.com',
  'Instahyre',
  'Monster'
];

export const applications = [
  {
    company: 'Google',
    role: 'Software Engineer L4',
    details: ['Bangalore', 'Resume v4 - Big Tech', '2 days ago'],
    version: 'v4',
    badge: 'Offer',
    badgeClass: 'bg-[rgba(34,197,94,0.1)] text-[#16a34a]',
    highlight: true
  },
  {
    company: 'Razorpay',
    role: 'SDE-1 Backend',
    details: ['Mumbai', 'Resume v2 - Startup', '4 days ago'],
    version: 'v2',
    badge: 'Interview',
    badgeClass: 'bg-[rgba(249,115,22,0.1)] text-[#ea580c]'
  },
  {
    company: 'Swiggy',
    role: 'Platform Engineer',
    details: ['Remote', 'Resume v3 - Full-stack', '6 days ago'],
    version: 'v3',
    badge: 'Screening',
    badgeClass: 'bg-[rgba(59,130,246,0.1)] text-[#2563eb]'
  },
  {
    company: 'Zepto',
    role: 'Senior SWE',
    details: ['Bangalore', 'Resume v1 - General', '1 week ago'],
    version: 'v1',
    badge: 'Applied',
    badgeClass: 'bg-[#f5f5f5] text-[#9a9a9a]'
  }
];

export const features = [
  {
    title: 'Version control for resumes',
    body: "Name, tag, and retrieve any version in seconds. The system keeps track so you don't have to.",
    icon: FileText,
    iconClass: 'bg-[rgba(249,115,22,0.1)] text-[#f97316]'
  },
  {
    title: 'Unified application board',
    body: 'All your jobs in one view. Filter by status, company, or the resume version you used.',
    icon: Grid2X2,
    iconClass: 'bg-[rgba(99,102,241,0.1)] text-[#818cf8]'
  },
  {
    title: 'Side-by-side diff view',
    body: 'Instantly see what changed between any two resume versions with a clean, readable diff.',
    icon: Code2,
    iconClass: 'bg-[rgba(34,197,94,0.1)] text-[#4ade80]'
  },
  {
    title: 'One-click job import',
    body: 'Paste a URL from LinkedIn, Naukri, or Greenhouse. Landed fills in company, role, and description.',
    icon: LinkIcon,
    iconClass: 'bg-[rgba(251,146,60,0.1)] text-[#fb923c]'
  },
  {
    title: 'Stage-by-stage pipeline',
    body: 'Applied -> Screening -> Interview -> Offer. Track every transition with timestamps and notes.',
    icon: Activity,
    iconClass: 'bg-[rgba(244,63,94,0.1)] text-[#fb7185]'
  },
  {
    title: 'Interview notes & context',
    body: "Attach notes to each stage so you always know what was discussed and what's next.",
    icon: MessageSquare,
    iconClass: 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]'
  }
];

export const roles = [
  {
    title: 'Active Job Seekers',
    body: 'Live pipeline tracking and version signals to stay on top of every active application.',
    icon: Activity
  },
  {
    title: 'Career Switchers',
    body: 'Multiple resume variants per industry, with diff views to tailor each application precisely.',
    icon: Briefcase
  },
  {
    title: 'Placement Advisors',
    body: 'Client-ready application summaries and resume comparison tools for superior placement outcomes.',
    icon: Users
  }
];

export const insights = [
  {
    title: 'Video Tutorials',
    body: 'How-to videos on resume tools, features, and smarter job searching.',
    className: 'bg-[#f5b8d4] text-[#0a0a0a]',
    deco: 'line'
  },
  {
    title: 'Academy',
    body: 'Learning center with guides, glossary, help docs, and expert tips.',
    className: 'bg-[#7c6df0] text-white',
    deco: 'target'
  },
  {
    title: 'Job Market Lens',
    body: 'Actionable insights across tech, finance, startup, and remote roles.',
    className: 'bg-[#5dd6e4] text-[#0a0a0a]',
    deco: 'globe'
  },
  {
    title: 'Smart Signals',
    body: 'Explore AI-driven resume signals to apply more confidently.',
    className: 'bg-[#e2a84a] text-[#0a0a0a]',
    deco: 'peak'
  }
];
