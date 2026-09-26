// Long-form write-ups, one per project that has earned more than a card.
// Each entry is prerendered to its own page at `path`.

export const bomwatcher = {
  path: '/projects/bomwatcher',
  project: 'BOMWatcher',
  logo: '/logos/projects/bomwatcher.svg',
  cover: '/images/covers/bomwatcher.webp',
  meta: {
    title: 'BOMWatcher case study | Rao Rizwan',
    description:
      'How BOMWatcher generates a CycloneDX AI bill of materials on the repo’s own GitHub Actions: a GitHub App, a consent pull request, a signed webhook and a validated ingest.',
  },

  lead: `An AI bill of materials for any GitHub repo, generated on that repo's own
    Actions runners, so the source code never leaves GitHub. This is how it
    works, and the trade-offs behind it.`,

  facts: [
    { label: 'Role', value: 'Built solo: API, scanner, dashboard' },
    { label: 'Status', value: 'Live, free trial for 3 repos' },
    { label: 'Output', value: 'CycloneDX 1.6 JSON' },
  ],
  stack: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'GitHub Apps', 'GitHub Actions', 'Syft', 'React 19', 'Docker'],
  links: {
    live: 'https://bomwatcher.vercel.app',
    code: 'https://github.com/devRaoRizwan/bomwatcher',
  },

  problem: [
    `AI features are landing in codebases faster than anyone is tracking them.
      Most teams cannot quickly answer simple questions: which models do we call,
      from which providers, in which repos, and under what licenses?`,
    `At Broadstone I built scanning and inventory as stages every build had to
      pass, so problems showed up before release instead of after it. BOMWatcher
      takes the same idea, a scan as a pipeline stage rather than an
      afterthought, and turns it into something anyone can connect a GitHub
      account to.`,
  ],

  guarantees: [
    { title: 'Code never leaves GitHub', body: 'BOMWatcher never clones a repo. It only ever receives the finished report.' },
    { title: 'Nothing runs without consent', body: 'The scan is added through a pull request the owner reviews. Nothing happens until it is merged.' },
    { title: 'Read-only in the repo', body: 'The workflow runs with contents: read and does not keep checkout credentials.' },
    { title: 'An open format', body: 'Results are CycloneDX 1.6, so any tool that reads it can use them.' },
  ],

  diagram: {
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
          { icon: 'ui:lock', label: 'Webhook', sub: 'HMAC-signed workflow_run' },
          { icon: 'ui:bolt', label: '202 Accepted', sub: 'Verify, then reply' },
          { icon: 'tech:fastapi', label: 'Ingest', sub: 'Download, validate' },
          { icon: 'tech:postgresql', label: 'Store', sub: 'Keyed by run ID' },
        ],
      },
    ],
    note: 'The only thing that crosses from the customer’s repo to BOMWatcher is the report itself.',
  },

  steps: [
    {
      title: 'Connect and pick repos',
      body: `The user installs the BOMWatcher GitHub App and chooses which repos
        it can see. The API authenticates as the app with a short-lived JWT,
        exchanges it for an installation token, and caches that token per
        installation so a busy dashboard does not mint a new one on every call.`,
    },
    {
      title: 'Open a pull request, not a commit',
      body: `For each repo the API creates a branch, writes a roughly twenty-line
        workflow file to it, and opens a PR that explains what the workflow does.
        If the workflow already exists it skips the PR, and if a previous branch
        is left over it resets it rather than failing.`,
    },
    {
      title: 'Scan on the repo’s own runner',
      body: `Once merged, every push to the default branch runs a composite
        Action. Syft inventories dependencies into CycloneDX, then a Python
        script walks the source for AI model names, provider SDK imports and
        Hugging Face loaders, merges both into one BOM and uploads it as a
        build artifact.`,
    },
    {
      title: 'Hear about it through a signed webhook',
      body: `When the run finishes, GitHub sends a workflow_run event. The API
        checks the HMAC-SHA256 signature in constant time, caps the body at
        5 MB, records the scan and replies 202 immediately.`,
    },
    {
      title: 'Ingest after replying',
      body: `A background task downloads the artifact with a fresh installation
        token, enforces a 20 MB limit on the listed size, the zip and the file
        inside it, checks that the document really is CycloneDX, and stores it
        against the scan. Failures are recorded on the scan, not swallowed.`,
    },
  ],

  decisions: [
    {
      title: 'Scan on the customer’s runners, not mine',
      why: `It is the only way to promise the code never leaves GitHub: nothing
        is cloned or stored on my side. It also means scanning capacity grows
        with the number of users at no cost to me.`,
      cost: `Scans spend the customer’s Actions minutes, take as long as a CI job,
        and I cannot see anything beyond the artifact the run produces.`,
    },
    {
      title: 'Add the workflow through a pull request',
      why: `The owner reads exactly what will run before anything runs, and
        stopping is as simple as deleting one file. That consent step is what
        makes a stranger comfortable installing the app.`,
      cost: `There is an extra step before the first result, and some people
        never merge. The API has to track PR state and handle repos where the
        workflow already exists.`,
    },
    {
      title: 'Pull the report instead of letting the Action push it',
      why: `If the Action posted results to my API, every repo would need a
        BOMWatcher secret to authenticate with. Instead the Action only uploads
        an artifact, GitHub tells me the run finished, and I fetch the artifact
        with a token GitHub issues to the app. No secret lives in user repos.`,
      cost: `It adds a round trip, depends on webhook delivery, and relies on the
        artifact still existing. Artifacts are kept for 30 days.`,
    },
    {
      title: 'Reply first, ingest second',
      why: `GitHub expects a webhook response within a few seconds. Verifying the
        signature and answering 202 before downloading anything means a slow
        artifact never makes GitHub mark the delivery as failed.`,
      cost: `The ingest runs as a FastAPI background task in the same process. If
        the process restarts mid-ingest, that scan is left marked as running.`,
    },
    {
      title: 'Use the workflow run ID as the scan ID',
      why: `GitHub sends several workflow_run events per run and can redeliver
        them. With the run ID as the primary key, every event for a run lands on
        the same row, so handling them is idempotent.`,
      cost: `Re-running a workflow keeps the same run ID, so the newest attempt
        overwrites the previous one rather than adding a second scan.`,
    },
    {
      title: 'Detect AI models with patterns, not a model',
      why: `Regular expressions for model names, SDK imports and Hugging Face
        loaders run anywhere Python 3 does, need no dependencies, and catch the
        common case: a model name written in the code.`,
      cost: `Names built at runtime or read from environment variables are
        missed, and each new model family needs a pattern.`,
    },
  ],

  hardening: [
    'Every webhook is checked with HMAC-SHA256 using a constant-time compare, and rejected outright if no secret is configured.',
    'Artifacts are size-checked three times: the listed size, the downloaded zip, and the uncompressed file, so a zip bomb cannot slip through.',
    'The generated workflow only has contents: read, and checkout runs with persist-credentials: false.',
    'Passwords are hashed with Argon2, JWTs carry an issuer and audience, and auth endpoints are rate limited per IP.',
    'The app refuses to start in production with wildcard CORS, SQLite, or a JWT secret shorter than 32 characters.',
    'Uninstalling the GitHub App deletes that installation’s data, and removing a repo from the app drops it from BOMWatcher.',
  ],

  testing: `A pytest suite drives the whole lifecycle against a fake GitHub client:
    connect, enable a repo, merge the PR, receive workflow_run, ingest the BOM.
    Around it are tests for the trial limit, repos that already have the
    workflow, a PR that fails to open, an invalid BOM, one user trying to read
    another user’s repos, unsigned webhooks, and uninstall cleanup.`,

  next: [
    {
      title: 'Move ingest onto a real queue',
      body: 'Celery with RabbitMQ or Redis would survive restarts and retry failed downloads, instead of relying on in-process background tasks.',
    },
    {
      title: 'Share state across instances',
      body: 'The rate limiter and token cache live in process memory. That is fine on one instance, but a second one needs them in Redis.',
    },
    {
      title: 'Validate the full schema',
      body: 'Ingest checks the CycloneDX envelope. Validating against the full 1.6 schema would catch malformed components earlier.',
    },
  ],
}

export const sitescopia = {
  path: '/projects/sitescopia',
  project: 'SiteScopia',
  logo: '/logos/projects/sitescopia.svg',
  cover: '/images/covers/sitescopia.webp',
  meta: {
    title: 'SiteScopia case study | Rao Rizwan',
    description:
      'How SiteScopia analyzes a public URL safely: SSRF checks on every hop, a background job the browser polls, one parse, 38 isolated checks and a weighted score.',
  },

  lead: `A website analyzer that takes one public URL and returns scores and
    findings across SEO, accessibility, security, performance, content, domain
    and contact signals. This is how it fetches pages safely, and the
    trade-offs behind it.`,

  facts: [
    { label: 'Role', value: 'Built solo: API, checks, frontend' },
    { label: 'Status', value: 'Live, free to use' },
    { label: 'Scope', value: '38 checks across 7 categories' },
  ],
  stack: ['FastAPI', 'httpx', 'asyncio', 'BeautifulSoup4', 'curl_cffi', 'React 18', 'TanStack Query', 'Vite'],
  links: {
    live: 'https://sitescopia.online/',
    code: 'https://github.com/devRaoRizwan/sitescopia',
  },

  problem: [
    `A first review of a web page usually means juggling several tools: one
      for SEO tags, another for security headers, a WHOIS lookup, a link
      checker. Each gives a verdict in its own format, often without showing
      what it actually saw.`,
    `SiteScopia does it in one pass from one URL. Findings carry the evidence
      they were based on and a suggested fix, so the report can be checked
      rather than taken on trust.`,
  ],

  guarantees: [
    { title: 'Only public addresses', body: 'A URL that resolves to a private, loopback or internal address is refused before any request is made.' },
    { title: 'Fetch once, parse once', body: 'The page is downloaded one time and parsed into a single structure every check reads from.' },
    { title: 'One broken check cannot sink the report', body: 'Each check runs in isolation, and a failure becomes a note in the report instead of an error.' },
    { title: 'Never score a bot wall', body: 'If the site answers with a challenge page, the result is marked blocked rather than graded.' },
  ],

  diagram: {
    caption: 'From a URL to a scored report',
    kind: 'flow',
    lanes: [
      {
        label: 'In the request',
        nodes: [
          { icon: 'ui:globe', label: 'URL', sub: 'Public IPs only' },
          { icon: 'tech:fastapi', label: 'Job', sub: '202 and a token' },
          { icon: 'tech:react', label: 'Poll', sub: 'Every 1.5 s' },
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

  steps: [
    {
      title: 'Submit, then poll',
      body: `The browser posts a URL and gets back 202 with a job ID and a random
        token. It polls every 1.5 seconds until the job is done, failed or
        blocked. Reading a job needs its token, compared in constant time, and
        there is no endpoint that lists other people's jobs.`,
    },
    {
      title: 'Check the address before every hop',
      body: `Only http and https are allowed, internal hostnames are refused, and
        the name is resolved so any non-public address is rejected. Redirects
        are followed by hand, up to five, and each new host is checked again.
        The body is streamed with a 5 MB cap and a 15 second timeout.`,
    },
    {
      title: 'Get past bot walls, or say so',
      body: `A detector recognises challenge pages from Cloudflare, DataDome,
        Akamai, Imperva and others. The fetcher retries once with a Chrome TLS
        fingerprint through a different proxy, and if the wall is still there
        the job is marked blocked with no score.`,
    },
    {
      title: 'Parse once, enrich in parallel',
      body: `The HTML is parsed a single time. Then the domain lookup over RDAP
        and a check of up to 25 links, eight at a time within a 12 second
        budget, run side by side with asyncio.`,
    },
    {
      title: 'Run the checks, then score',
      body: `Every check is a plain function registered in a list for its
        category. Each one runs inside its own try/except. A check scores on
        its worst finding, weighted 3 for critical, 1 for normal and 0.4 for
        minor, and categories roll up into a 0 to 100 score.`,
    },
  ],

  decisions: [
    {
      title: 'A background job the browser polls',
      why: `Some sites take seconds to answer, and link checks add more. Replying
        202 straight away means a slow target never holds the HTTP request
        open, and the UI can show progress.`,
      cost: `Jobs live in memory in one process, so a restart loses them and a
        second instance could not see them. Delivery is polling, not push.`,
    },
    {
      title: 'Checks as a registry of pure functions',
      why: `Adding a check is one function and one list entry. Checks do no
        network work, so they are fast and easy to reason about, and the public
        list of checks is generated from the same registry.`,
      cost: `Checks for different categories take different inputs, and the
        broken-links check runs outside the registry, so it is not in the
        published count.`,
    },
    {
      title: 'Isolate every check',
      why: `A bug in one check, or an odd page that trips it up, should cost one
        line of the report, not the whole analysis.`,
      cost: `The isolation covers the checks only. An error while parsing,
        extracting contacts or scoring still fails the job.`,
    },
    {
      title: 'Score each check on its worst finding',
      why: `It is simple to explain: a critical check counts seven and a half
        times as much as a minor one, and the category score is the share of
        credit earned.`,
      cost: `A check that finds nothing counts as a pass, and the overall score
        is a plain average, so a three-check category weighs as much as an
        eight-check one.`,
    },
    {
      title: 'Heuristics from the HTML, not a headless browser',
      why: `Response time, size, compression, caching headers and script counts
        come straight from the response. No browser is needed, so an analysis
        is fast and cheap, and every result traces back to what was received.`,
      cost: `Layout shift, rendered contrast and anything built by JavaScript are
        out of reach, and response time is measured from the server, so the
        network path is included.`,
    },
    {
      title: 'Proxies and TLS impersonation for hard sites',
      why: `Many real sites sit behind bot protection. Rotating proxies, burning a
        proxy for a host after a failure, and one retry with a browser TLS
        fingerprint let far more of them be analyzed.`,
      cost: `It adds real complexity and a paid proxy provider, and timings and
        headers can reflect the proxy path rather than a visitor's.`,
    },
  ],

  hardening: [
    'SSRF checks run before the first request and before every redirect hop: scheme allowlist, internal names refused, and only globally routable addresses accepted.',
    'Downloads are streamed and abort once they pass 5 MB, with a 15 second timeout and at most five redirects.',
    'Analyses are rate limited per client, the limiter caps how many clients it remembers, and forwarded-for headers are only trusted when configured.',
    'No more than four analyses run at once; beyond that the API answers 503 rather than slowing down.',
    'Job results need a random token checked in constant time, and a wrong token looks exactly like a missing job.',
    'Users see generic error messages while the details go to the logs, API docs are off by default, and CORS is an explicit allowlist.',
  ],

  next: [
    {
      title: 'Close the remaining SSRF gaps',
      body: 'Connect to the address that was checked instead of resolving again, and re-validate redirects in the link checker and the TLS fallback.',
    },
    {
      title: 'Move jobs out of memory',
      body: 'A store like Redis and a worker would let jobs survive restarts and let more than one instance serve results.',
    },
    {
      title: 'Add tests and CI',
      body: 'The checks are pure functions, which makes them easy to test. A suite in CI would guard the scoring as checks are added.',
    },
  ],
}

export const jobharvester = {
  path: '/projects/jobharvester',
  project: 'JobHarvester',
  logo: '/logos/projects/jobharvester.webp',
  cover: '/images/covers/jobharvester.webp',
  meta: {
    title: 'JobHarvester case study | Rao Rizwan',
    description:
      'How JobHarvester crawls 38 company career pages every six hours, pushes jobs through an authenticated Django REST API, dedupes them by source URL and serves them to a React app.',
  },

  lead: `A job board for Pakistan's tech market. Scheduled crawlers read 38
    company career pages, push what they find through an authenticated API,
    and a React app makes it searchable. This is how the pipeline works, and
    the trade-offs behind it.`,

  facts: [
    { label: 'Role', value: 'Built solo: crawlers, API, frontend' },
    { label: 'Schedule', value: 'Every six hours on GitHub Actions' },
    { label: 'Sources', value: '38 company career pages' },
  ],
  stack: ['Python', 'requests', 'BeautifulSoup4', 'Selenium', 'GitHub Actions', 'Django REST Framework', 'PostgreSQL', 'React 18'],
  links: {
    live: 'https://job-harvester-demo.vercel.app',
    code: 'https://github.com/devRaoRizwan/JobHarvester_Crawlers',
  },

  problem: [
    `Tech jobs in Lahore are spread across dozens of company career pages, each
      with its own layout, and many of them never reach the big job boards.
      Finding them means checking site after site by hand.`,
    `JobHarvester checks them on a schedule instead and puts every listing in
      one searchable feed, aimed at developers, interns and fresh graduates.`,
  ],

  guarantees: [
    { title: 'Crawlers never touch the database', body: 'They submit jobs through the API with a key, so validation and storage rules live in one place.' },
    { title: 'One broken site cannot stop the run', body: 'Each crawler runs on its own, and a crash is recorded while the others carry on.' },
    { title: 'Running twice is harmless', body: 'Jobs are matched on their source URL, so a repeat run updates listings instead of copying them.' },
    { title: 'No crawler server to keep alive', body: 'The crawl is a scheduled GitHub Actions job that starts, runs and exits.' },
  ],

  diagram: {
    caption: 'From a career page to the search box',
    kind: 'flow',
    lanes: [
      {
        label: 'Every six hours on GitHub Actions',
        nodes: [
          { icon: 'tech:githubactions', label: 'Schedule', sub: 'Cron, every 6 h' },
          { icon: 'ui:cog', label: 'Runner', sub: '38 crawlers in turn' },
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
          { icon: 'tech:postgresql', label: 'PostgreSQL', sub: 'SSL required' },
        ],
      },
      {
        label: 'Out to people',
        nodes: [
          { icon: 'ui:server', label: 'REST API', sub: 'Paginated, searchable' },
          { icon: 'tech:react', label: 'Frontend', sub: 'Debounced, shareable URLs' },
        ],
      },
    ],
    note: 'Crawling runs on its own schedule, so an ingest that takes minutes never slows a page load.',
  },

  steps: [
    {
      title: 'Run every crawler, one at a time',
      body: `A cron job starts every six hours. The runner imports each of the 38
        crawler modules, marks the company as seen, and calls its crawl
        function inside a try/except, so a crash is logged as one failed row
        and the loop moves on.`,
    },
    {
      title: 'Fetch each site the cheapest way that works',
      body: `Nine companies publish jobs through a hiring platform's JSON API,
        such as Greenhouse or Workable, so those are read directly. Five pages
        only render with JavaScript and need headless Chrome through Selenium.
        The rest are plain HTML fetched with requests, with a 30 second timeout
        and up to four retries.`,
    },
    {
      title: 'Submit through the API',
      body: `Each job is posted to an ingest endpoint with a secret key in a
        header. The API rejects a wrong key with 401, validates the payload
        with a serializer, and throttles ingest to 60 requests a minute.`,
    },
    {
      title: 'Upsert on the source URL',
      body: `The company and then the job are looked up by their source URL.
        A new URL is created; an existing one is compared field by field and
        either updated or counted as a duplicate. In the logged runs, about
        125,000 submissions were duplicates against roughly 1,760 creates and
        updates, which is exactly what repeated crawls should produce.`,
    },
    {
      title: 'Serve and search',
      body: `Django REST Framework serves paginated lists of jobs and companies
        with search. The React app debounces typing and keeps the view, search
        and page in the URL, so any result can be shared as a link.`,
    },
  ],

  decisions: [
    {
      title: 'Push through an API instead of writing to the database',
      why: `The API owns validation and the upsert rules, the crawlers never
        hold database credentials, and the ingest endpoint can be throttled
        like any other.`,
      cost: `It costs one HTTP request per job. When the API moved hosts, its
        address was hard-coded in the crawlers, and about 26,700 submissions
        failed until it was updated.`,
    },
    {
      title: 'One module per company',
      why: `Every career site is different. Keeping each in its own module means
        a site's quirks stay in one file, and a site that changes breaks only
        its own crawler.`,
      cost: `There is no shared base class, so headers and helpers are repeated
        across modules, and a change to what crawlers return needs 38 edits.`,
    },
    {
      title: 'A browser only where it is needed',
      why: `Headless Chrome is slow and heavy, so it is used for the five sites
        that need it. JSON APIs are used where companies have them, because
        they are far less brittle than scraped HTML.`,
      cost: `The Selenium crawlers start a fresh browser for every page, so they
        are the slowest part of each run.`,
    },
    {
      title: 'The source URL is the identity of a job',
      why: `It is stable, it comes with every listing, and it makes repeated
        runs idempotent without any extra bookkeeping.`,
      cost: `The job table has no unique index on that column yet, so two
        simultaneous submissions of the same job could both insert it.`,
    },
    {
      title: 'Freshness tracked per company',
      why: `Each run stamps when a company's page was last crawled, and the app
        shows it, so people can see how current a listing is.`,
      cost: `Individual jobs are never marked expired, so the total count grows
        over time. The site shows about 1,400 listings collected, while a
        recent run found 366 open ones.`,
    },
    {
      title: 'Split settings that fail fast',
      why: `Production turns on HTTPS redirects, HSTS, SSL to the database and a
        JSON-only API, and the app refuses to start without an ingest key.`,
      cost: `Throttle counters live in each process's memory, so they are not
        shared if the API ever runs on more than one instance.`,
    },
  ],

  hardening: [
    'Ingest needs a secret key in a header; a wrong key gets 401 and a missing server key stops the request.',
    'Public endpoints are throttled at 60 requests a minute per anonymous client, and ingest has its own limit.',
    'CORS is an allowlist, and production adds HTTPS redirects, a one-year HSTS policy and SSL-only database connections.',
    'Crawler requests retry with a pause between attempts, each job card is parsed in its own try/except, and headless Chrome is always shut down in a finally block.',
    'Every crawl writes structured JSON events and a CSV run log, so a quiet failure on one site shows up in the numbers.',
  ],

  next: [
    {
      title: 'Expire stale listings',
      body: 'Mark a job inactive when a run no longer sees it, and filter on that, so the listing count reflects what is actually open.',
    },
    {
      title: 'Batch ingest and a unique index',
      body: 'Send each crawler’s jobs in one request, read the API address from configuration, retry failures, and add a unique index on the source URL.',
    },
    {
      title: 'A shared crawler contract with tests',
      body: 'A small base class and tests for what every crawler returns would catch drift between the runner and the 38 modules.',
    },
  ],
}

export const caseStudies = [bomwatcher, sitescopia, jobharvester]
