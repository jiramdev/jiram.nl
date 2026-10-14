import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import VideoPlayer from "@/components/VideoPlayer";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProjectCard({
  project,
  preload,
}: {
  project: Project;
  preload: boolean;
}) {
  const { cover } = project;
  const soon = project.comingSoon === true;

  return (
    <article
      // No `group` on a coming soon card: without it nothing inside matches
      // group-hover, so the tile stays still and does not invite a click.
      className={`${soon ? "" : "group "}relative aspect-[5/4] w-full overflow-hidden rounded-[16px] bg-[var(--color-background)] shadow-[var(--shadow-card)] transition-shadow duration-[200ms] [transition-timing-function:var(--ease-out-expo)] ${
        soon ? "" : "hover:shadow-[var(--shadow-elevated)]"
      }`}
    >
      {cover.type === "video" ? (
        <VideoPlayer
          src={cover.url}
          poster={cover.poster}
          alt={cover.alt}
          preload="auto"
        />
      ) : (
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          preload={preload}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[800ms] [transition-timing-function:var(--ease-out-expo)] motion-reduce:transition-none group-hover:scale-[1.02]"
        />
      )}

      {/* Minimal gradient scrim for WCAG legibility (on-primary text) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 via-[var(--color-surface)]/15 to-transparent"
      />

      {/* No backdrop-blur on anything sitting over the cover media. WebKit has
          to snapshot whatever is behind a backdrop-filter every frame; with five
          of these stacked on playing video that is five backdrop snapshots a
          frame, which is how the content process runs out of memory on iOS. The
          tiles are more opaque instead, which reads the same over media. */}
      {soon && (
        <span className="pointer-events-none absolute right-[16px] top-[16px] z-[10] rounded-full bg-[var(--color-surface)]/75 px-[10px] py-[7px] text-[13px] font-[700] leading-none tracking-[-0.01em] text-[var(--color-on-primary)]">
          Coming soon
        </span>
      )}

      {/* Card Metadata Bar. items-end, not items-center: the year then shares the
          tagline's bottom edge and baseline. Centring it floated the year between
          the two lines of type. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] flex select-none items-end justify-between p-[16px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[var(--color-surface)]/70 text-[11px] font-[700] tracking-[-0.02em] text-[var(--color-on-primary)]">
            {project.logoUrl ? (
              <Image
                src={project.logoUrl}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              initials(project.name)
            )}
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[15px] font-[700] leading-[1.4] tracking-[-0.01em] text-[var(--color-on-primary)]">
              {project.name}
            </span>
            <span className="mt-[2px] text-[15px] font-[400] leading-[1.4] tracking-[-0.01em] text-[var(--color-on-primary)]/80">
              {project.tagline}
            </span>
          </div>
        </div>

        <span className="shrink-0 text-[15px] font-[400] leading-[1.4] tracking-[-0.01em] text-[var(--color-on-primary)]/80">
          {project.timeline}
        </span>
      </div>

      {/* The whole card is the link. Coming soon cards get no link at all. */}
      {!soon && (
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.name} — ${project.tagline}`}
          className="absolute inset-0 z-[10] rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
        />
      )}
    </article>
  );
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="w-full bg-[var(--color-background)]">
      <div className="mx-auto max-w-[1440px] px-[16px] pb-[110px] pt-[22px] md:px-[22px]">
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              preload={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}