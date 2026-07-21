const PILLARS = [
  {
    title: "Se reconnecter",
    description:
      "Un annuaire vivant pour retrouver qui est passé par le Maroc et savoir qui est aujourd'hui à Abidjan, dans quel secteur.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Se voir régulièrement",
    description:
      "Afterworks, matchs, déjeuners : des rendez-vous simples et réguliers pour que la communauté reste réelle, pas virtuelle.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19V9M12 19V5M20 19v-7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Créer des ponts",
    description:
      "Mettre en relation les bonnes personnes pour faire émerger des opportunités professionnelles et des partenariats concrets.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 12h10M7 12l4-4M7 12l4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="20" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export default function Mission() {
  return (
    <section className="mission" id="mission">
      <div className="mission__head">
        <h2>Ce qu&apos;on construit ensemble</h2>
        <p>Trois piliers, un seul objectif : ne jamais rester isolé.</p>
      </div>
      <div className="mission__grid">
        {PILLARS.map((pillar) => (
          <article className="mission__card" key={pillar.title}>
            <div className="mission__icon" aria-hidden="true">
              {pillar.icon}
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
