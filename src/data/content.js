export const identity = {
  name: 'Rao Rizwan',
  role: 'Backend Engineer',
  pitch: 'I build APIs, data pipelines, and the systems behind them.',
};

export const nav = [
  ['work', 'Work'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

export const links = {
  email: 'dev.raorizwan@gmail.com',
  github: 'https://github.com/devRaoRizwan',
  linkedin: 'https://linkedin.com/in/raorixwan',
  resume: 'https://rao-rizwan-resume.vercel.app/',
  leetcode: 'https://leetcode.com/u/devraorizwan/',
  gfg: 'https://www.geeksforgeeks.org/profile/devraorizwan?tab=activity',
};

export const bio = [
  'I build backend systems — mostly REST APIs, data pipelines, and the scraping jobs that feed them. I started out writing Android apps in Java and Kotlin, and moved into backend work once I got more interested in how data moves between systems than in how a screen looks.',
  'Right now I build and maintain production APIs that handle 100K+ requests a day, mostly in Django REST Framework and FastAPI, backed by PostgreSQL and MongoDB. I have a BE in Computer Software Engineering from Lahore Garrison University, and in 2023 I was one of the Fellows selected for the Aspire Institute program in Cambridge, MA.',
  'I’m based in Pakistan and open to remote or on-site backend roles.',
];

export const skillLines = [
  ['Backend', 'Python, Django, Django REST Framework, FastAPI, Flask'],
  ['Data', 'PostgreSQL, MySQL, SQLite, MongoDB, Redis'],
  ['Async & queues', 'Celery, RabbitMQ'],
  ['Scraping', 'Scrapy, BeautifulSoup, Selenium'],
  ['Infra', 'Docker, Nginx, Linux, Git'],
  ['Hosting', 'Render, Railway, Vercel, Supabase, DigitalOcean'],
];

export const projects = [
  {
    name: 'JobHarvester',
    description: 'A job aggregation platform that crawls listings from local tech companies into one searchable, filterable place. Built the crawlers and the API serving the results.',
    stack: 'Python, Django REST Framework, PostgreSQL, Scrapy',
    note: 'repo coming soon',
    demo: 'https://job-harvester-demo.vercel.app/',
  },
  {
    name: 'Jobbr',
    description: 'A job board API with JWT auth and role-based access for employers and job seekers — resume uploads, filtering, full Swagger docs.',
    stack: 'Django REST Framework, JWT, Swagger',
    note: 'repo coming soon',
  },
];

export const history = 'Android development (Java, Kotlin) → Python → scraping and automation → backend APIs → the systems work I do now (queues, caching, deployment). Still mostly interested in event-driven architecture and observability next.';
