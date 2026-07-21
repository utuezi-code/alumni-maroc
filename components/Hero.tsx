export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <p className="eyebrow">Abidjan · Côte d&apos;Ivoire</p>
        <h1 className="hero__title">
          Formés au Maroc.
          <br />
          Actifs à <span className="accent">Abidjan</span>.
        </h1>
        <p className="hero__subtitle">
          Une communauté d&apos;anciens étudiants du Maroc, de nationalités et
          de secteurs différents, qui se retrouve régulièrement et se soutient
          au quotidien.
        </p>
        <div className="hero__actions">
          <a href="#inscription" className="btn btn--accent btn--lg">
            Rejoindre la communauté
          </a>
          <a href="#communaute" className="btn btn--ghost btn--lg">
            Découvrir la communauté
          </a>
        </div>
      </div>
      <div className="hero__glow" aria-hidden="true" />
    </section>
  );
}
