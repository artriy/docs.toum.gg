import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

const LOCAL_BANNERS = `${siteConfig.baseUrl}img/RoleBanners/`;

function rescueBanner(image: HTMLImageElement): void {
  const file = image.getAttribute('src')?.split('/').pop();
  if (file && !image.getAttribute('src')?.startsWith(LOCAL_BANNERS)) {
    image.src = LOCAL_BANNERS + file;
    return;
  }
  image.classList.add('role-banner--missing');
}

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener(
    'error',
    (event) => {
      if (event.target instanceof HTMLImageElement && event.target.classList.contains('role-banner')) {
        rescueBanner(event.target);
      }
    },
    true,
  );
}

export function onRouteDidUpdate(): void {
  for (const image of document.querySelectorAll<HTMLImageElement>('img.role-banner')) {
    if (image.complete && image.naturalWidth === 0) {
      rescueBanner(image);
    }
  }

  for (const table of document.querySelectorAll<HTMLTableElement>('.markdown table')) {
    const labels = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent?.trim() ?? '');
    for (const row of table.querySelectorAll('tbody tr')) {
      [...row.children].forEach((cell, index) => cell.setAttribute('data-label', labels[index] ?? ''));
    }
  }

  const active = document.querySelector<HTMLElement>('.theme-doc-sidebar-menu .menu__link--active');
  const scroller = active?.closest<HTMLElement>('.thin-scrollbar');
  if (active && scroller) {
    const offset = active.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    if (offset < 0 || offset > scroller.clientHeight - active.offsetHeight) {
      scroller.scrollTop += offset - scroller.clientHeight / 3;
    }
  }
}
