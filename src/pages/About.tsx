import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <article className="feed-column">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          About
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Latin Swing
        </h1>
        <p className="mt-6 text-base leading-relaxed text-foreground/90 md:text-[17px]">
          Latin Swing is a high-energy live band based in the Dallas–Fort Worth
          metroplex specializing in Merengue, Salsa, Bachata, and Latin classics. Built
          for celebrations of every size — from intimate weddings to corporate galas
          and main-stage festivals — we bring polished musicianship and genuine
          dance-floor energy to every performance.
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-[17px]">
          Our lineup blends seasoned vocalists, a tight horn section, and a percussion
          team that knows how to read a room. We tailor every set to the moment:
          smooth bolero for cocktail hour, rich Salsa romántica through dinner, and
          relentless Merengue when it's time to fill the floor.
        </p>
        <h2 className="mt-10 font-display text-2xl font-bold">What we do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/90">
          <li>Weddings, quinceañeras, and private celebrations</li>
          <li>Corporate events, conferences, and brand activations</li>
          <li>Festivals, club residencies, and concert dates</li>
          <li>Custom song requests and bilingual MC services</li>
        </ul>

        <div className="mt-10 rounded-2xl bg-muted/60 p-6 ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Booking inquiries</p>
          <p className="mt-1 font-display text-lg font-bold">
            Head over to{" "}
            <a className="text-secondary underline-offset-4 hover:underline" href="/contact">
              Contact
            </a>{" "}
            and tell us about your event.
          </p>
        </div>
      </article>
    </Layout>
  );
};

export default About;
