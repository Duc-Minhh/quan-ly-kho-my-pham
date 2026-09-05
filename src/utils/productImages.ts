// Generates lightweight SVG placeholder image data URLs for cosmetic items
export const getCosmeticIconSvg = (brand: string, category: string, name: string): string => {
  const isMask = category.toLowerCase().includes('mặt nạ') || name.toLowerCase().includes('mask');
  const isMediheal = brand.toUpperCase() === 'MEDIHEAL';
  const isNumbuzin = brand.toUpperCase() === 'NUMBUZIN';

  const bgColor = isMediheal ? '#0284c7' : isNumbuzin ? '#0d9488' : '#6366f1';
  const subColor = isMediheal ? '#e0f2fe' : isNumbuzin ? '#ccfbf1' : '#e0e7ff';
  const label = brand.slice(0, 3).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="16" fill="${subColor}"/>
    ${
      isMask
        ? `<g transform="translate(20, 16)">
            <!-- Sheet mask pouch shape -->
            <rect x="5" y="5" width="50" height="60" rx="8" fill="${bgColor}" />
            <path d="M5 20 Q30 25 55 20" stroke="white" stroke-width="2" fill="none" opacity="0.4"/>
            <!-- Droplet / Cross icon -->
            <circle cx="30" cy="36" r="10" fill="white" opacity="0.9" />
            <path d="M30 30 L30 42 M24 36 L36 36" stroke="${bgColor}" stroke-width="2.5" stroke-linecap="round" />
            <rect x="18" y="52" width="24" height="4" rx="2" fill="white" opacity="0.6" />
          </g>`
        : `<g transform="translate(25, 15)">
            <!-- Bottle shape -->
            <rect x="10" y="22" width="30" height="45" rx="6" fill="${bgColor}" />
            <rect x="17" y="10" width="16" height="12" rx="3" fill="#64748b" />
            <circle cx="25" cy="40" r="7" fill="white" opacity="0.9" />
          </g>`
    }
    <text x="50" y="90" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="bold" fill="${bgColor}" text-anchor="middle" letter-spacing="1">
      ${label}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
