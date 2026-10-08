export const profile = {
  name: 'Rao Rizwan',
  role: 'Backend Engineer',
  coreStack: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Celery', 'AWS'],

  // The hero shows both; phones show only the lead line.
  bioLead: 'I break code on purpose so prod never breaks by accident.',
  bio: `Two years of Python backend in production. Django REST APIs at 100,000+
    requests a day. Celery and RabbitMQ for the slow stuff. CI/CD pipelines with
    security scans that stop bad releases before they ship.`,

  email: 'dev.raorizwan@gmail.com',
  resume: '/documents/RaoRizwan_Resume.pdf',

  github: 'https://github.com/devRaoRizwan',
  linkedin: 'https://linkedin.com/in/raorixwan',
  leetcode: 'https://leetcode.com/u/devraorizwan/',

  openTo: 'Open to backend roles',
  location: 'Lahore, Pakistan',
  availability: 'Remote, or on site in Lahore',

  photo: '/images/rao-rizwan-320.webp',
  photoFallback: '/images/rao-rizwan-320.jpg',
  photoAlt: 'Rao Rizwan, Python backend engineer in Lahore, Pakistan',
}

export const work = [
  {
    company: 'Broadstone Technologies',
    logo: '/logos/broadstone.webp',
    role: 'Backend Developer (Python)',
    period: 'Jun 2026 to Aug 2026',
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
    logo: '/logos/programmersforce.svg',
    role: 'Associate Software Engineer',
    period: 'Jul 2024 to Apr 2026',
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
            { icon: 'ui:user', label: 'Client', sub: 'Sends a request' },
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
    name: 'BOMWatcher',
    slug: 'bomwatcher',
    logo: '/logos/projects/bomwatcher.svg',
    tagline: 'An AI bill of materials for your GitHub repos',
    cover: {
      image: '/images/covers/bomwatcher.webp',
      alt: 'BOMWatcher: know every dependency and AI model your code ships with',
    },
    // Screenshots shown after the cover in the project's slideshow.
    gallery: [
      { src: '/images/projects/bomwatcher-1.webp', alt: 'BOMWatcher landing page with a sample AI-BOM' },
      { src: '/images/projects/bomwatcher-2.webp', alt: 'Dashboard with tracked repositories and the AI models in use' },
      { src: '/images/projects/bomwatcher-3.webp', alt: 'A repository inventory: components, AI models and licenses' },
    ],
    description: `You connect GitHub, choose the repos to watch, and merge one
      small pull request. After that, every push runs a scan on your own GitHub
      Actions and reports back which libraries and AI models the code uses,
      with risky licenses flagged. Your code stays on GitHub the whole time.`,
    diagram: {
      caption: 'How a push becomes an AI-BOM',
      kind: 'flow',
      lanes: [
        {
          label: 'Every push to the default branch',
          nodes: [
            { icon: 'tech:github', label: 'Connect', sub: 'GitHub App, one PR' },
            { icon: 'tech:githubactions', label: 'Scan', sub: 'Syft, AI-model detector' },
            { icon: 'ui:lock', label: 'Webhook', sub: 'Signed workflow_run' },
            { icon: 'tech:fastapi', label: 'Ingest', sub: 'Pulls and validates the BOM' },
            { icon: 'tech:postgresql', label: 'AI-BOM', sub: 'CycloneDX 1.6, Postgres' },
          ],
        },
      ],
      note: 'The workflow runs with read-only access and uploads only the report. The code is never cloned.',
    },
    stack: [
      'React 19',
      'FastAPI',
      'SQLAlchemy',
      'PostgreSQL',
      'GitHub Apps',
      'GitHub Actions',
      'Syft',
      'CycloneDX',
    ],
    // The project page: problem, what I built, how it flows, and the tech by layer.
    details: {
      problem: `AI features are going into codebases faster than anyone tracks them.
        Most teams cannot quickly say which models they call, from which
        providers, in which repos, or under what licenses.`,
      solution: `BOMWatcher answers that per repo. You install a GitHub App and merge
        one pull request. After that, every push runs a scan on your own GitHub
        Actions and sends back a CycloneDX 1.6 bill of materials.`,
      points: [
        'The code is never cloned. The only thing that leaves GitHub is the finished report.',
        'The scan arrives as a pull request, so nothing runs until the owner reads it and merges.',
        'Webhooks are checked with an HMAC signature, and the API replies before it downloads anything.',
      ],
      flow: {
        caption: 'From install to a stored AI-BOM',
        kind: 'flow',
        lanes: [
          {
            label: 'Once per repo',
            nodes: [
              { icon: 'tech:github', label: 'Install', sub: 'GitHub App' },
              { icon: 'ui:search', label: 'Pick repos', sub: 'Up to 3 on trial' },
              { icon: 'ui:commit', label: 'Workflow PR', sub: 'Opened by the API' },
              { icon: 'ui:user', label: 'Merge', sub: 'Owner reviews' },
            ],
          },
          {
            label: 'Every push to the default branch, on GitHub',
            nodes: [
              { icon: 'tech:githubactions', label: 'Runner', sub: 'Checkout, read-only' },
              { icon: 'ui:inventory', label: 'Syft', sub: 'Dependencies' },
              { icon: 'tech:python', label: 'Detector', sub: 'AI models, SDKs' },
              { icon: 'ui:build', label: 'Artifact', sub: 'bom.cdx.json' },
            ],
          },
          {
            label: 'Back on BOMWatcher',
            nodes: [
              { icon: 'ui:lock', label: 'Webhook', sub: 'Signed workflow_run' },
              { icon: 'ui:bolt', label: '202 Accepted', sub: 'Verify, then reply' },
              { icon: 'tech:fastapi', label: 'Ingest', sub: 'Download, validate' },
              { icon: 'tech:postgresql', label: 'Store', sub: 'Keyed by run ID' },
            ],
          },
        ],
        note: 'The only thing that crosses from the repo to BOMWatcher is the report itself.',
      },
      tech: [
        { layer: 'Backend', items: ['FastAPI', 'SQLAlchemy', 'PostgreSQL'] },
        { layer: 'Scanning', items: ['GitHub Apps', 'GitHub Actions', 'Syft', 'CycloneDX 1.6'] },
        { layer: 'Auth', items: ['JWT', 'Argon2', 'HMAC webhooks'] },
        { layer: 'Frontend', items: ['React 19'] },
        { layer: 'Hosting', items: ['Vercel', 'Render'] },
      ],
    },
    links: {
      live: 'https://bomwatcher.vercel.app',
      overview: 'https://github.com/devRaoRizwan/bomwatcher',
      frontend: null,
      backend: null,
      crawlers: null,
    },
  },
  {
    name: 'SiteScopia',
    slug: 'sitescopia',
    logo: '/logos/projects/sitescopia.svg',
    tagline: 'Evidence-led website analysis',
    cover: {
      image: '/images/covers/sitescopia.webp',
      alt: 'SiteScopia: see what your page is really telling you',
    },
    gallery: [
      { src: '/images/projects/sitescopia-1.webp', alt: 'SiteScopia home page with the URL analyzer' },
      { src: '/images/projects/sitescopia-2.webp', alt: 'The 38 checks, grouped into seven categories' },
      { src: '/images/projects/sitescopia-3.webp', alt: 'A finished report for stripe.com with scores and findings' },
    ],
    description: `Analyze a public URL across SEO, accessibility, security,
      performance, and domain signals. Every finding includes evidence and a
      practical fix.`,
    diagram: {
      caption: 'How a page becomes an actionable report',
      kind: 'flow',
      lanes: [
        {
          label: 'One public URL, checked safely',
          nodes: [
            { icon: 'ui:globe', label: 'URL', sub: 'Validate and fetch' },
            { icon: 'tech:fastapi', label: 'API', sub: 'Analysis job' },
            { icon: 'ui:shield', label: 'Checks', sub: 'SEO, security, a11y' },
            { icon: 'tech:react', label: 'Report', sub: 'Evidence and fixes' },
          ],
        },
      ],
      note: 'Safe fetching, independent checks, and evidence-backed fixes in one report.',
    },
    stack: ['React', 'Vite', 'FastAPI', 'Python'],
    details: {
      problem: `Checking a page properly means opening several tools: one for meta
        tags, one for security headers, a WHOIS lookup, a link checker. Each one
        gives its own verdict, and most of them do not show what they actually saw.`,
      solution: `SiteScopia does it in one pass from a single URL. It fetches the page
        once, runs 38 checks over it, and every finding comes with the evidence it
        was based on and a suggested fix.`,
      points: [
        'A URL that resolves to a private or internal address is refused, and every redirect is checked again.',
        'Each check runs on its own, so one that breaks becomes a note in the report instead of an error.',
        'If a site answers with a bot challenge, the result says blocked rather than scoring the challenge page.',
      ],
      flow: {
        caption: 'From a URL to a scored report',
        kind: 'flow',
        lanes: [
          {
            label: 'In the request',
            nodes: [
              { icon: 'ui:globe', label: 'URL', sub: 'Public addresses only' },
              { icon: 'tech:fastapi', label: 'Job', sub: '202 and a token' },
              { icon: 'tech:react', label: 'Poll', sub: 'Until it is done' },
            ],
          },
          {
            label: 'In the background job',
            nodes: [
              { icon: 'ui:shield', label: 'Fetch', sub: 'Checked every hop' },
              { icon: 'ui:block', label: 'Challenge gate', sub: 'Blocked, not scored' },
              { icon: 'ui:search', label: 'Parse once', sub: 'BeautifulSoup' },
              { icon: 'ui:clock', label: 'Enrich', sub: 'RDAP, links in parallel' },
            ],
          },
          {
            label: 'Into the report',
            nodes: [
              { icon: 'ui:cog', label: '38 checks', sub: 'Each isolated' },
              { icon: 'ui:bolt', label: 'Score', sub: 'Weighted, 0 to 100' },
              { icon: 'ui:inventory', label: 'Report', sub: 'Evidence and fixes' },
            ],
          },
        ],
        note: 'The request only validates and queues. Everything slow happens in the job the browser polls.',
      },
      tech: [
        { layer: 'Backend', items: ['FastAPI', 'httpx', 'asyncio'] },
        { layer: 'Analysis', items: ['BeautifulSoup4', 'RDAP', 'curl_cffi'] },
        { layer: 'Frontend', items: ['React 18', 'TanStack Query', 'Vite'] },
        { layer: 'Hosting', items: ['Render', 'Vercel'] },
      ],
    },
    links: {
      live: 'https://sitescopia.online/',
      overview: 'https://github.com/devRaoRizwan/sitescopia',
      frontend: null,
      backend: null,
      crawlers: null,
    },
  },
  {
    name: 'JobHarvester',
    slug: 'jobharvester',
    logo: '/logos/projects/jobharvester.webp',
    tagline: 'Job aggregation for the Pakistani tech market',
    cover: {
      image: '/images/covers/jobharvester.webp',
      alt: 'JobHarvester: a smarter way to discover the right opportunities',
    },
    gallery: [
      { src: '/images/projects/jobharvester-1.webp', alt: 'A job page with the description and quick facts' },
      { src: '/images/projects/jobharvester-2.webp', alt: 'Browsing the companies JobHarvester tracks' },
      { src: '/images/projects/jobharvester-3.webp', alt: 'Home page with search and the latest listings' },
    ],
    description: `Crawlers pull postings from Lahore technology companies on a
      schedule, a Django REST API normalises them into Postgres, and a React
      frontend makes them searchable. Over {listings} listings collected so far.`,
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
    details: {
      problem: `Tech jobs in Lahore are spread across dozens of company career pages,
        each with its own layout, and many of them never reach the big job boards.
        Finding them means checking site after site by hand.`,
      solution: `JobHarvester checks those pages on a schedule and puts every listing
        in one feed. Crawlers send what they find to a Django REST API, which
        stores it in PostgreSQL, and a React app makes it searchable.`,
      points: [
        'Each company has its own crawler, so a site that changes its layout only breaks that one.',
        'Jobs are matched on their source URL, so running the crawl again updates listings instead of copying them.',
        'Crawlers never touch the database. They post through the API with a key, and the API does the checking.',
      ],
      flow: {
        caption: 'From a career page to the search box',
        kind: 'flow',
        lanes: [
          {
            label: 'On a schedule, on GitHub Actions',
            nodes: [
              { icon: 'tech:githubactions', label: 'Schedule', sub: 'Cron job' },
              { icon: 'ui:cog', label: 'Runner', sub: 'One crawler per company' },
              { icon: 'tech:selenium', label: 'Fetch', sub: 'requests, Selenium, JSON' },
              { icon: 'ui:search', label: 'Parse', sub: 'BeautifulSoup' },
            ],
          },
          {
            label: 'Into the API',
            nodes: [
              { icon: 'ui:key', label: 'Submit', sub: 'Ingest key header' },
              { icon: 'ui:shield', label: 'Validate', sub: 'Serializer, throttled' },
              { icon: 'tech:django', label: 'Upsert', sub: 'Matched on source URL' },
              { icon: 'tech:postgresql', label: 'PostgreSQL', sub: 'Supabase' },
            ],
          },
          {
            label: 'Out to people',
            nodes: [
              { icon: 'ui:server', label: 'REST API', sub: 'Paginated, searchable' },
              { icon: 'tech:react', label: 'Frontend', sub: 'Search, shareable links' },
            ],
          },
        ],
        note: 'Crawling runs on its own schedule, so an ingest that takes minutes never slows a page load.',
      },
      tech: [
        { layer: 'Crawling', items: ['Python', 'requests', 'BeautifulSoup4', 'Selenium'] },
        { layer: 'Backend', items: ['Django REST Framework', 'PostgreSQL'] },
        { layer: 'Frontend', items: ['React 18', 'Vite'] },
        { layer: 'Hosting', items: ['GitHub Actions', 'Render', 'Supabase', 'Vercel'] },
      ],
    },
    links: {
      live: 'https://job-harvester-demo.vercel.app',
      overview: 'https://github.com/devRaoRizwan/JobHarvesterDemo',
      frontend: null,
      backend: null,
      crawlers: null,
    },
  },
  {
    name: 'Jobbr',
    slug: 'jobbr',
    logo: '/logos/projects/jobbr.svg',
    tagline: 'A job board API with two very different users',
    cover: {
      image: '/images/covers/jobbr.webp',
      alt: 'Jobbr: one job board API for two very different users',
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
    details: {
      problem: `A job board has two kinds of users who want opposite things from the
        same data. Employers post jobs and read applications. Job seekers search,
        apply and save jobs. Neither side should be able to do the other's half.`,
      solution: `I built Jobbr as a learning project to get role-based permissions
        right in Django REST Framework. Every user has a role, every request
        carries a JWT, and each endpoint checks both who you are and whether the
        record is yours.`,
      points: [
        'Only employers can post jobs, and only the employer who posted a job can edit it, delete it or read its applications.',
        'Job seekers apply with a resume and a cover letter, and the database stops anyone applying to the same job twice.',
        'Open jobs can be searched and filtered by type, location and salary period, and Swagger documents every endpoint.',
      ],
      tech: [
        { layer: 'API', items: ['Django', 'Django REST Framework'] },
        { layer: 'Auth', items: ['SimpleJWT'] },
        { layer: 'Query and docs', items: ['django-filter', 'drf-spectacular'] },
        { layer: 'Database', items: ['SQLite (development)'] },
      ],
    },
    links: {
      live: null,
      overview: null,
      frontend: null,
      backend: 'https://github.com/devRaoRizwan/jobbr',
      crawlers: null,
    },
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
  { name: 'Selenium', icon: '/tech/selenium.svg' },
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
