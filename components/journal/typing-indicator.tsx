export function TypingIndicator() {
return (
  <div className="flex items-center space-x-1">
    <span className="w-2 h-2 bg-primary-light dark:bg-primary-dark rounded-full animate-blink" style={{ animationDelay: '0s' }}></span>
    <span className="w-2 h-2 bg-primary-light dark:bg-primary-dark rounded-full animate-blink" style={{ animationDelay: '0.2s' }}></span>
    <span className="w-2 h-2 bg-primary-light dark:bg-primary-dark rounded-full animate-blink" style={{ animationDelay: '0.4s' }}></span>
  </div>
);
}
