export function Footer() {
return (
  <footer className="w-full py-6 text-center text-sm text-text-light/70 dark:text-text-dark/70 bg-bg-light dark:bg-bg-dark border-t mt-8 md:mt-0 pb-20 md:pb-6">
    <p>&copy; {new Date().getFullYear()} Mindful Journal. All rights reserved.</p>
  </footer>
);
}
