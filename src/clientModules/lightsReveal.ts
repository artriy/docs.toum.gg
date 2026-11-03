import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const TOGGLE = '[class*="colorModeToggle"] button';
const THEME_SETTLE_MS = 300;

if (ExecutionEnvironment.canUseDOM && 'startViewTransition' in document) {
  let replaying = false;

  window.addEventListener(
    'click',
    (event) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>(TOGGLE);
      if (replaying || !button) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();

      const root = document.documentElement;
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      root.style.setProperty('--lights-x', `${x}px`);
      root.style.setProperty('--lights-y', `${y}px`);
      root.style.setProperty(
        '--lights-r',
        `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`,
      );

      const previousTheme = root.dataset.theme;
      document.startViewTransition(() => {
        const {promise, resolve} = Promise.withResolvers<void>();
        const observer = new MutationObserver(() => {
          if (root.dataset.theme !== previousTheme) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(root, {attributes: true, attributeFilter: ['data-theme']});
        window.setTimeout(() => {
          observer.disconnect();
          resolve();
        }, THEME_SETTLE_MS);
        replaying = true;
        button.click();
        replaying = false;
        return promise;
      });
    },
    true,
  );
}
