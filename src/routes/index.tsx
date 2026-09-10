import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Peak Academia — The mind is made by what it feeds upon" },
      {
        name: "description",
        content:
          "Peak Academia builds the architecture that keeps your mind clear and your output deliberate.",
      },
      {
        property: "og:title",
        content: "Peak Academia — The mind is made by what it feeds upon",
      },
      {
        property: "og:description",
        content:
          "Peak Academia builds the architecture that keeps your mind clear and your output deliberate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="relative flex flex-col bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-8 py-6">
        <div
          className="text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Peak Academia<sup className="text-xs">®</sup>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#"
            className="text-sm text-foreground transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Studio
          </a>
          <a
            href="#about"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Journal
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Reach Us
          </a>
        </div>

        <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]">
          Begin Journey
        </button>
      </nav>

      <section className="relative z-10 flex min-h-screen flex-1 flex-col items-center justify-center px-6 pb-40 pt-32 text-center">
        <h1
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          THE MIND IS MADE BY WHAT IT FEEDS UPON.
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          "Ideas require solitude before they demand action. We build the
          architecture that keeps your mind clear and your output deliberate."
        </p>

        <button className="animate-fade-rise-delay-2 liquid-glass mt-12 cursor-pointer rounded-full px-14 py-5 text-base text-foreground transition-transform hover:scale-[1.03]">
          Begin Journey
        </button>
      </section>

      <section
        id="about"
        className="relative z-10 bg-background px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-4xl font-normal leading-[1.1] tracking-[-1.5px] text-foreground sm:text-5xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            About Peak Academia
          </h2>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Peak Academia started with a simple observation: too many Matric and
            O Level students lose momentum before the year even begins. The
            syllabus feels endless, pressure builds early, and by the time exams
            are close, half the year already feels lost. What we noticed wasn't a
            lack of talent — it was a lack of consistency, structure, and someone
            in their corner from day one.
          </p>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We're a group of teens who've stood exactly where our students stand
            now. Not long ago, we were the ones staring at the same syllabus,
            feeling the same pressure, trying to figure out how to stay on track
            without burning out. That's the gap Peak Academia was built to close —
            not from the outside looking in, but from students who've actually
            lived through it.
          </p>

          <h3
            className="mt-16 text-3xl font-normal leading-[1.1] tracking-[-1px] text-foreground sm:text-4xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Our Approach
          </h3>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We work with beginners tackling the Sindh Board and O Level
            syllabus, and our focus is on the start of the year, not just the end
            of it. Most places kick into gear right before exams. We do the
            opposite — we help students build momentum in the first months, when
            discipline is hardest to establish but matters most. Steady pacing,
            regular accountability, and a syllabus broken down into something
            that doesn't feel overwhelming.
          </p>

          <h3
            className="mt-16 text-3xl font-normal leading-[1.1] tracking-[-1px] text-foreground sm:text-4xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Our Promise
          </h3>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Because our age gap with our students is small, the relationship
            stays personal. We're not distant instructors — we're seniors who've
            walked the same path, cooperating to guide juniors through it. That
            closeness means we notice when someone's falling behind before it
            becomes a crisis, and we know how to talk them back into confidence
            rather than just handing over notes.
          </p>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Peak Academia exists so no student has to face their first year of
            Matric or O Levels alone — with someone who understands the syllabus,
            and someone who remembers exactly how it feels to be on the other
            side of it.
          </p>
        </div>
      </section>
    </div>
  );
}
