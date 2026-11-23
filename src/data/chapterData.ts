export type WorkCategory = 'All' | 'Python' | 'Vision & AI' | 'Systems' | 'Events';

import archiveImg1 from '../assets/images/archive/archive_1.jpg';
import archiveImg2 from '../assets/images/archive/archive_2.jpg';
import archiveImg3 from '../assets/images/archive/archive_3.jpg';
import archiveImg4 from '../assets/images/archive/archive_4.jpg';
import archiveImg5 from '../assets/images/archive/archive_5.jpg';
import archiveImg6 from '../assets/images/archive/archive_6.jpg';

export interface LeaderProfile {
  id: string;
  role: string;
  name: string;
  initials: string;
  discipline: string;
  tenure: string;
  bio: string;
  highlights: string[];
  featuredProject: string;
  image?: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: Exclude<WorkCategory, 'All'>;
  year: string;
  stack: string;
  lead: string;
  summary: string;
  architecture: string;
  impactMetric: string;
  image: string;
  fallbackTone: string;
  span: 'wide' | 'standard';
  codeExcerpt: string;
}

export const CHAPTER_LEADERS: LeaderProfile[] = [
  {
    id: 'srishti-trivedi',
    role: 'President',
    name: 'Srishti Trivedi',
    initials: 'ST',
    discipline: 'Computer Vision & Systems Design',
    tenure: '2025 – 2026',
    bio: 'Leads the CSI student chapter with a focus on pairing algorithmic rigor with expressive editorial interfaces. Spearheaded the annual Python Open Source Summit and mentored 140+ student builders.',
    highlights: [
      'Directed 12 campus engineering sprints',
      'Architected the PyMosaic generative portrait engine',
      'Co-founded WeGrow Student Craft Collective',
    ],
    featuredProject: 'PyMosaic Chiaroscuro Engine',
    image: './assets/leaders/leader_1.jpg',
  },
  {
    id: 'aditya-kushwaha',
    role: 'Vice President',
    name: 'Aditya Kushwaha',
    initials: 'AK',
    discipline: 'Distributed Python & Developer Tooling',
    tenure: '2025 – 2026',
    bio: 'Oversees technical curriculum, Python infrastructure workshops, and inter-collegiate hackathons. Focused on high-throughput async backends and clean terminal tooling.',
    highlights: [
      'Led 8 hands-on Python & FastAPI bootcamps',
      'Built automated judging pipelines for HackNight',
      'Maintains 4 open-source campus CLI packages',
    ],
    featuredProject: 'CSI Terminal & CLI Kit',
    image: './assets/leaders/leader_2.jpg',
  },
  {
    id: 'aman-raj',
    role: 'General Secretary',
    name: 'Aman Raj',
    initials: 'AR',
    discipline: 'Applied ML & Chapter Operations',
    tenure: '2025 – 2026',
    bio: 'Coordinates chapter operations, industry research talks, and cross-department engineering cohorts. Champions accessible Python literacy for first-year contributors.',
    highlights: [
      'Scaled chapter membership to 420+ active fellows',
      'Published the CSI Hello Python Field Guide',
      'Organized 24-hour HackNight Auditorium Series',
    ],
    featuredProject: 'HackNight Auditorium Series',
    image: './assets/leaders/leader_3.jpg',
  },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'pymosaic-engine',
    title: 'PyMosaic Chiaroscuro Engine',
    category: 'Vision & AI',
    year: '2026',
    stack: 'Python 3.12 · NumPy · WebGL Canvas',
    lead: 'Srishti Trivedi',
    summary:
      'Procedural depth-map quantization system that transforms studio rim-lit portraits into interactive iridescent pixel-tile silhouettes at 60 frames per second.',
    architecture:
      'Computes directional surface normals against a high-contrast chiaroscuro light vector, mapping luminance buckets to a curated jewel-tone mosaic palette with spatial dithering.',
    impactMetric: '18,400 live tiles rendered per frame',
    image: archiveImg1,
    fallbackTone: 'from-emerald-950 via-slate-950 to-indigo-950',
    span: 'wide',
    codeExcerpt: `def shade_tile(nx: float, ny: float, nz: float) -> float:
    lx, ly, lz = 0.74, -0.18, 0.65
    dot = max(0.0, nx * lx + ny * ly + nz * lz)
    return pow(dot, 1.45)`,
  },
  {
    id: 'csi-cli-kit',
    title: 'CSI Terminal & CLI Kit',
    category: 'Python',
    year: '2026',
    stack: 'Python · Typer · Rich TUI',
    lead: 'Aditya Kushwaha',
    summary:
      'Zero-dependency developer command suite used by chapter fellows to scaffold Python workspaces, run automated test harnesses, and submit hackathon artifacts.',
    architecture:
      'Built around typed command registries, structured TOML manifests, and deterministic virtual-environment bootstrapping with sub-120ms cold startup.',
    impactMetric: '420+ student repos bootstrapped',
    image: archiveImg2,
    fallbackTone: 'from-zinc-900 via-neutral-950 to-black',
    span: 'standard',
    codeExcerpt: `@app.command()
def init(project: str, template: str = "fastapi"):
    scaffold_workspace(project, template)
    console.print(f"Ready: {project}")`,
  },
  {
    id: 'topomesh-vision',
    title: 'TopoMesh Point-Cloud Studio',
    category: 'Vision & AI',
    year: '2025',
    stack: 'Python · PyTorch · Open3D',
    lead: 'Srishti Trivedi',
    summary:
      'Real-time topological wireframe reconstructor that extracts smooth spatial manifolds from sparse monocular depth frames for campus robotics.',
    architecture:
      'Streams quantized point tensors over WebSockets into a lightweight Delaunay triangulation worker with adaptive edge decimation.',
    impactMetric: '4.2ms average mesh pass',
    image: archiveImg3,
    fallbackTone: 'from-cyan-950 via-zinc-950 to-violet-950',
    span: 'standard',
    codeExcerpt: `mesh = reconstruct_manifold(
    points=depth_cloud.downsample(0.02),
    rim_weight=0.85,
    ) `,
  },
  {
    id: 'hacknight-series',
    title: 'HackNight Auditorium Series',
    category: 'Events',
    year: '2026',
    stack: 'Chapter Flagship · 36-Hour Build',
    lead: 'Aman Raj',
    summary:
      'Annual overnight engineering residency bringing together designers, Python systems programmers, and first-time builders to ship open-source tools.',
    architecture:
      'Structured around 4-person cross-disciplinary pods, live architecture critiques at midnight, and public demo monographs archived by CSI.',
    impactMetric: '64 shipped open-source builds',
    image: archiveImg4,
    fallbackTone: 'from-neutral-900 via-zinc-950 to-black',
    span: 'wide',
    codeExcerpt: `cohort = ChapterCohort(
    builders=256,
    tracks=["Python Core", "Vision", "Civic Tech"],
)`,
  },
  {
    id: 'wegrow-studio',
    title: 'WeGrow Design & Code System',
    category: 'Systems',
    year: '2025',
    stack: 'Python · FastAPI · React',
    lead: 'Srishti Trivedi',
    summary:
      'Editorial portfolio and mentorship portal connecting early-stage student founders with design engineers and technical reviewers across the chapter.',
    architecture:
      'Combines an async FastAPI review queue with automated Lighthouse typography audits and structured project case-study templates.',
    impactMetric: '38 student ventures launched',
    image: archiveImg5,
    fallbackTone: 'from-stone-900 via-zinc-950 to-black',
    span: 'standard',
    codeExcerpt: `async def publish_showcase(entry: Monograph):
    validated = await audit_contrast(entry)
    return await archive.commit(validated)`,
  },
  {
    id: 'asyncio-campus-grid',
    title: 'AsyncIO Telemetry Grid',
    category: 'Systems',
    year: '2025',
    stack: 'Python · asyncio · Redis Streams',
    lead: 'Aditya Kushwaha',
    summary:
      'Lightweight event bus powering live workshop attendance, leaderboard scoring, and real-time code execution sandboxes during CSI seminars.',
    architecture:
      'Fan-out consumer groups built strictly on standard-library asyncio primitives and bounded ring buffers for resilient burst handling.',
    impactMetric: '99.94% uptime across 18 events',
    image: archiveImg6,
    fallbackTone: 'from-slate-900 via-zinc-950 to-black',
    span: 'standard',
    codeExcerpt: `async with TaskGroup() as tg:
    for node in cluster_nodes:
        tg.create_task(stream_events(node))`,
  },
];
