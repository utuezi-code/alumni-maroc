export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#" className="brand">
          <span className="brand__mark">AM</span>
          <span className="brand__name">
            Alumni Maroc <span className="accent">CI</span>
          </span>
        </a>
        <a href="#inscription" className="btn btn--accent btn--sm">
          Rejoindre
        </a>
      </div>
    </header>
  );
}
