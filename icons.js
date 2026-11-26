const paths={
  sprout:'<path d="M12 20v-9M12 15C6 15 4 12 4 7c5 0 8 2 8 8Zm0-4c0-6 4-8 8-8 0 5-3 8-8 8Z"/>',
  book:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/>',
  pen:'<path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z"/>',
  shield:'<path d="m12 3 8 3v6c0 5-4.1 7.9-8 9-3.9-1.1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  tag:'<path d="M3 4h8l9 9-7 7-10-10Z"/><circle cx="7.7" cy="8" r="1"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5"/>',
  profile:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',
  notes:'<path d="M6 3h12v18H6zm3 5h6m-6 4h6m-6 4h4"/>',
  dialogue:'<path d="M21 11a8 8 0 0 1-8 8H8l-5 3 1.5-6A8 8 0 0 1 11 3h2a8 8 0 0 1 8 8Z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.3"/>',
  copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V4H4v12h4"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  arrow:'<path d="m9 5 7 7-7 7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v5m10-5v5M3 11h18"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5"/>',
  play:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  trash:'<path d="M3 6h18m-15 0 1 15h10l1-15M9 6V3h6v3m-5 4v7m4-7v7"/>',
  star:'<path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/>'
};
export function icon(name,size=18){return '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||'')+'</svg>';}
