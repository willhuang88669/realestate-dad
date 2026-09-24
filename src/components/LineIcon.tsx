export default function LineIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 5.58 2 10c0 3.94 3.53 7.23 8.3 7.87.32.07.76.21.87.49.1.26.06.66.03.92l-.14.85c-.04.26-.2 1 .88.55 1.07-.46 5.78-3.41 7.89-5.84C21.14 13.06 22 11.62 22 10c0-4.42-4.48-8-10-8zm-3.6 9.9H6.9V8.3h.9v3.6h.6zm2.2 0h-.9V8.3h.9v3.6zm4-3.6v.7h-1.6v.7h1.4v.7h-1.4v.75h1.6v.75h-2.5V8.3h2.5zm3.5 3.6h-.85l-1.45-2v2h-.9V8.3h.9l1.4 1.95V8.3h.9v3.6z" />
    </svg>
  );
}
