const Footer = () => (
  <footer className="mt-16 border-t border-white/5 bg-secondary/60 py-10 text-sm text-white/60">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
      <p>© {new Date().getFullYear()} AniStream. Built with ❤️ for anime fans.</p>
      <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-wide">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </div>
  </footer>
);

export default Footer;

