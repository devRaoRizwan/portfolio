export const profile = {
  name: 'Rao Rizwan',
  role: 'Backend Engineer',
  coreStack: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Celery', 'AWS'],

  bio: `Two years on the half of a product nobody sees. Django REST APIs at a
    hundred thousand requests a day, Celery and RabbitMQ keeping slow work off
    the request path, and CI/CD that stops a release when a scan finds
    something.`,

  email: 'dev.raorizwan@gmail.com',
  phone: '+92 323 454 4880',
  resume: '/documents/RaoRizwan_Resume.pdf',

  github: 'https://github.com/devRaoRizwan',
  linkedin: 'https://linkedin.com/in/raorixwan',

  photo: '/images/rao.webp',
  photoFallback: '/images/rao.png',
  photoAlt: 'Rao Rizwan',
}

export const work = [
  {
    company: 'Broadstone Technologies',
    logo: '/logos/broadstone.webp',
    role: 'Software Engineer',
    period: 'Apr 2026 to Sep 2026',
    story: `I worked on the pipeline more than the product. Scanning and inventory
      became stages every build had to pass, so problems surfaced before release
      rather than after it. Around that: Flask APIs, AWS under least privilege IAM,
      and OAuth 2.0 service to service auth across four clouds.`,
    diagram: {
      caption: 'The pipeline I built',
      kind: 'flow',
      lanes: [
        {
          label: 'Every build',
          nodes: [
            { icon: 'ui:commit', label: 'Commit', sub: 'CodeCommit, GitHub' },
            { icon: 'ui:build', label: 'Build', sub: 'CodePipeline' },
            { icon: 'ui:shield', label: 'Scan', sub: 'Vulnerabilities' },
            { icon: 'ui:inventory', label: 'AIBOM', sub: 'Dependency inventory' },
            { icon: 'ui:release', label: 'Release', sub: 'EC2, S3' },
          ],
        },
      ],
      note: 'Findings stop the release instead of landing in production and being found later.',
    },
    stack: ['Flask', 'GitHub Actions', 'AWS', 'OAuth 2.0', 'AIBOM', 'Azure DevOps'],
  },
  {
    company: 'Programmers Force',
    logo: '/logos/programmersforce.webp',
    role: 'Backend Engineer',
    period: 'Jun 2024 to Apr 2026',
    story: `Django REST Framework APIs serving over 100,000 requests a day. The
      work that mattered was getting the slow things out of the way: scraping and
      report generation used to run inside the request, so a user waited on them.
      I moved both onto workers, then reshaped the schemas underneath.`,
    diagram: {
      caption: 'Getting slow work off the request path',
      kind: 'flow',
      lanes: [
        {
          label: 'Request path, answers immediately',
          nodes: [
            { icon: 'ui:user', label: 'Client', sub: '100k+ per day' },
            { icon: 'ui:server', label: 'DRF API', sub: 'Validate, enqueue' },
            { icon: 'ui:bolt', label: 'Response', sub: 'Returns at once' },
          ],
        },
        {
          label: 'Background, takes as long as it takes',
          nodes: [
            { icon: 'ui:queue', label: 'Queue', sub: 'RabbitMQ' },
            { icon: 'ui:cog', label: 'Workers', sub: 'Celery' },
            { icon: 'ui:globe', label: 'Scrape and report', sub: 'BeautifulSoup4, Selenium' },
            { icon: 'ui:database', label: 'Data layer', sub: 'PostgreSQL, MongoDB' },
          ],
        },
      ],
      note: 'The API hands slow jobs to the queue and replies straight away. Nothing waits on a scrape.',
    },
    stack: ['Django REST Framework', 'Celery', 'RabbitMQ', 'PostgreSQL', 'MongoDB', 'Docker'],
  },
]

export const projects = [
  {
    name: 'JobHarvester',
    tagline: 'Job aggregation for the Pakistani tech market',
    cover: {
      image: '/images/jobharvester.webp',
      alt: 'The JobHarvester home page, showing job search and recent listings',
    },
    description: `Crawlers pull postings from Lahore technology companies on a
      schedule, a Django REST API normalises them into Postgres, and a React
      frontend makes them searchable. Over 1,300 live listings right now.`,
    diagram: {
      caption: 'How a posting reaches the page',
      kind: 'flow',
      lanes: [
        {
          label: 'Postings move left to right',
          nodes: [
            { icon: 'tech:githubactions', label: 'Schedule', sub: 'GitHub Actions cron' },
            { icon: 'tech:selenium', label: 'Crawlers', sub: 'BeautifulSoup4, Selenium' },
            { icon: 'tech:django', label: 'REST API', sub: 'Django REST Framework on Render' },
            { icon: 'tech:supabase', label: 'PostgreSQL', sub: 'Supabase' },
            { icon: 'tech:react', label: 'Frontend', sub: 'React 18, Vite, on Vercel' },
          ],
        },
      ],
      note: 'Crawling runs on its own schedule, so an ingest that takes minutes never slows a page load.',
    },
    stack: [
      'React 18',
      'Django REST Framework',
      'PostgreSQL',
      'Supabase',
      'BeautifulSoup4',
      'Selenium',
      'GitHub Actions',
    ],
    links: {
      live: 'https://job-harvester-demo.vercel.app',
      overview: 'https://github.com/devRaoRizwan/JobHarvesterDemo',
      frontend: null,
      backend: null,
      crawlers: null,
    },
    featured: true,
  },
  {
    name: 'Jobbr',
    tagline: 'A job board API with two very different users',
    cover: {
      image: '/images/jobbr.webp',
      alt: 'The Jobbr API surface: auth, jobs, applications and bookmark endpoints',
    },
    description: `Employers and job seekers want opposite things from the same
      data, so the API is built around keeping them apart.`,
    diagram: {
      caption: 'One API, two sets of permissions',
      kind: 'split',
      sourcesLabel: 'Who is asking',
      sources: [
        { icon: 'ui:briefcase', label: 'Employer', sub: 'Posts and manages roles' },
        { icon: 'ui:search', label: 'Job seeker', sub: 'Searches and applies' },
      ],
      gateLabel: 'Every request passes through',
      gate: [
        { icon: 'ui:key', label: 'JWT', sub: 'Who you are' },
        { icon: 'ui:lock', label: 'RBAC', sub: 'What you may touch' },
      ],
      outputsLabel: 'What each side reaches',
      outputs: [
        { icon: 'ui:server', label: 'Employer endpoints', sub: 'Listings, applicants' },
        { icon: 'ui:globe', label: 'Seeker endpoints', sub: 'Search, resume upload' },
      ],
      note: 'Same data underneath. The token decides which half of the API you can see.',
    },
    stack: ['Django REST Framework', 'JWT', 'PostgreSQL', 'drf-spectacular'],
    links: {
      live: null,
      overview: null,
      frontend: null,
      backend: 'https://github.com/devRaoRizwan/jobbr',
      crawlers: null,
    },
    featured: false,
  },
]

export const toolbelt = [
  { name: 'Python', icon: '/tech/python.svg' },
  { name: 'Django', icon: '/tech/django.svg' },
  { name: 'Flask', icon: '/tech/flask.svg' },
  { name: 'FastAPI', icon: '/tech/fastapi.svg' },
  { name: 'PostgreSQL', icon: '/tech/postgresql.svg' },
  { name: 'MongoDB', icon: '/tech/mongodb.svg' },
  { name: 'Supabase', icon: '/tech/supabase.svg' },
  { name: 'Celery', icon: '/tech/celery.svg' },
  { name: 'RabbitMQ', icon: '/tech/rabbitmq.svg' },
  { name: 'Docker', icon: '/tech/docker.svg' },
  { name: 'AWS', icon: '/tech/amazonwebservices.svg' },
  { name: 'Google Cloud', icon: '/tech/googlecloud.svg' },
  { name: 'GitHub Actions', icon: '/tech/githubactions.svg' },
  { name: 'Git', icon: '/tech/git.svg' },
  { name: 'Selenium', icon: '/tech/selenium.svg' },
  { name: 'Swagger', icon: '/tech/swagger.svg' },
  { name: 'Postman', icon: '/tech/postman.svg' },
  { name: 'Vercel', icon: '/tech/vercel.svg' },
]

export const aitools = [
  { name: 'Claude Code', icon: '/tech/claudecode.svg' },
  { name: 'Cursor', icon: '/tech/cursor.svg' },
  { name: 'ChatGPT', icon: '/tech/chatgpt.svg' },
  { name: 'Grok', icon: '/tech/grok.svg' },
  { name: 'DeepSeek', icon: '/tech/deepseek.svg' },
]

export const background = {
  education: {
    logo: '/logos/lgu.webp',
    institution: 'Lahore Garrison University',
    degree: 'BS Software Engineering',
    period: '2020 to 2024',
  },
  community: [
    {
      role: 'Campus Director',
      org: 'AI Community of Pakistan',
      logo: '/logos/aicp.webp',
      note: 'Ran AI awareness initiatives and student tech events on campus.',
    },
    {
      role: 'Participant',
      org: 'Aspire Leaders Program',
      logo: '/logos/aspire.webp',
      note: 'Selected for a globally competitive leadership program.',
    },
  ],
}
