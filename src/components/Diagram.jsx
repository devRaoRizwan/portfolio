const TECH = {
  python: '/tech/python.svg',
  django: '/tech/django.svg',
  flask: '/tech/flask.svg',
  fastapi: '/tech/fastapi.svg',
  postgresql: '/tech/postgresql.svg',
  mongodb: '/tech/mongodb.svg',
  celery: '/tech/celery.svg',
  rabbitmq: '/tech/rabbitmq.svg',
  docker: '/tech/docker.svg',
  aws: '/tech/amazonwebservices.svg',
  githubactions: '/tech/githubactions.svg',
  react: '/tech/react.svg',
  selenium: '/tech/selenium.svg',
  git: '/tech/git.svg',
  swagger: '/tech/swagger.svg',
  postman: '/tech/postman.svg',
  supabase: '/tech/supabase.svg',
  vercel: '/tech/vercel.svg',
}

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const UI = {
  commit: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="3.5" />
      <line x1="12" y1="2" x2="12" y2="8.5" />
      <line x1="12" y1="15.5" x2="12" y2="22" />
    </svg>
  ),
  build: (
    <svg {...stroke}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.3 7 12 12 20.7 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  ),
  shield: (
    <svg {...stroke}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  inventory: (
    <svg {...stroke}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  release: (
    <svg {...stroke}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    </svg>
  ),
  block: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
    </svg>
  ),
  user: (
    <svg {...stroke}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  bolt: (
    <svg {...stroke}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  server: (
    <svg {...stroke}>
      <rect x="2" y="3" width="20" height="8" rx="2" />
      <rect x="2" y="13" width="20" height="8" rx="2" />
      <line x1="6" y1="7" x2="6.01" y2="7" />
      <line x1="6" y1="17" x2="6.01" y2="17" />
    </svg>
  ),
  database: (
    <svg {...stroke}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  clock: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  ),
  key: (
    <svg {...stroke}>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m10.7 12.3 8.3-8.3" />
      <path d="m17 5 2.5 2.5" />
      <path d="m14.5 7.5 2.5 2.5" />
    </svg>
  ),
  lock: (
    <svg {...stroke}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  briefcase: (
    <svg {...stroke}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  search: (
    <svg {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  ),
  queue: (
    <svg {...stroke}>
      <rect x="3" y="4" width="18" height="4" rx="1.5" />
      <rect x="3" y="10" width="18" height="4" rx="1.5" />
      <rect x="3" y="16" width="18" height="4" rx="1.5" />
    </svg>
  ),
  cog: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  globe: (
    <svg {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </svg>
  ),
}

function NodeIcon({ icon, size = 22 }) {
  if (!icon) return null

  if (icon.startsWith('tech:')) {
    const src = TECH[icon.slice(5)]
    if (!src) return null
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{ width: size, height: size }}
      />
    )
  }

  const glyph = UI[icon.replace('ui:', '')]
  if (!glyph) return null
  return (
    <span className="block text-accent" style={{ width: size, height: size }}>
      {glyph}
    </span>
  )
}

function Node({ node }) {
  const muted = node.tone === 'muted'
  return (
    <div
      className={`glass-chip flex flex-1 flex-col items-center gap-2 rounded-xl px-3 py-3.5 text-center ${
        muted ? 'opacity-70' : ''
      }`}
    >
      <NodeIcon icon={node.icon} />
      <span className="text-[13px] font-medium leading-tight text-ink">{node.label}</span>
      {node.sub && (
        <span className="font-mono text-[10px] leading-tight text-muted">{node.sub}</span>
      )}
    </div>
  )
}

function Connector({ always = 'responsive' }) {
  const rotation =
    always === 'down' ? 'rotate-90' : always === 'right' ? '' : 'rotate-90 @2xl:rotate-0'
  return (
    <div aria-hidden className="flex shrink-0 items-center justify-center py-0.5 text-faint @2xl:px-0.5">
      <svg width="15" height="15" {...stroke} className={rotation}>
        <line x1="4" y1="12" x2="18" y2="12" />
        <polyline points="13 7 18 12 13 17" />
      </svg>
    </div>
  )
}

function LaneLabel({ children }) {
  return <p className="mb-2.5 text-[11px] leading-tight text-faint">{children}</p>
}

function Lane({ lane }) {
  return (
    <div>
      {lane.label && <LaneLabel>{lane.label}</LaneLabel>}
      <div className="flex flex-col items-stretch @2xl:flex-row @2xl:items-stretch">
        {lane.nodes.map((node, i) => (
          <div
            key={node.label}
            className="flex flex-col items-stretch @2xl:flex-1 @2xl:flex-row @2xl:items-stretch"
          >
            <Node node={node} />
            {i < lane.nodes.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    </div>
  )
}

function Split({ diagram }) {
  const column = (nodes, label) => (
    <div className="flex flex-1 flex-col">
      {label && <LaneLabel>{label}</LaneLabel>}
      <div className="flex flex-1 flex-col gap-2">
        {nodes.map((node) => (
          <Node key={node.label} node={node} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-stretch gap-2 @2xl:flex-row @2xl:items-stretch">
      {column(diagram.sources, diagram.sourcesLabel)}

      <div className="flex items-center justify-center @2xl:self-stretch">
        <Connector />
      </div>

      <div className="flex flex-1 flex-col">
        {diagram.gateLabel && <LaneLabel>{diagram.gateLabel}</LaneLabel>}
        <div className="flex flex-1 items-center">
          <div className="flex w-full flex-col items-stretch @2xl:flex-row">
            {diagram.gate.map((node, i) => (
              <div key={node.label} className="flex flex-col @2xl:flex-1 @2xl:flex-row">
                <Node node={node} />
                {i < diagram.gate.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center @2xl:self-stretch">
        <Connector />
      </div>

      {column(diagram.outputs, diagram.outputsLabel)}
    </div>
  )
}

export default function Diagram({ diagram }) {
  if (!diagram) return null

  return (
    <figure className="glass-inset mt-6 rounded-2xl p-4 sm:p-5">
      {diagram.caption && <figcaption className="eyebrow mb-4">{diagram.caption}</figcaption>}

      <div className="hidden sm:block">
        {diagram.kind === 'split' ? (
          <Split diagram={diagram} />
        ) : (
          <div className="space-y-5">
            {diagram.lanes.map((lane, i) => (
              <Lane key={lane.label || i} lane={lane} />
            ))}
          </div>
        )}
      </div>

      {diagram.note && (
        <p className="border-l-2 border-accent/40 pl-3 text-[13px] leading-relaxed text-muted sm:mt-4">
          {diagram.note}
        </p>
      )}
    </figure>
  )
}
