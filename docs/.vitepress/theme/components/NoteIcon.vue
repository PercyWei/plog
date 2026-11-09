<script setup lang="ts">
defineProps<{ name: string }>()
const paths: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9',
  notes: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  rl: 'M6 7a3 3 0 1 0 0 .1M18 17a3 3 0 1 0 0 .1M9 7h6a3 3 0 0 1 3 3v4M15 17H9a3 3 0 0 1-3-3v-4',
  infra: 'M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01M11 7h6M11 17h6',
  papers: 'M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1V5Z',
  write: 'm15 4 5 5M4 20l4-1L21 6a2.8 2.8 0 0 0-4-4L4 15z',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z',
  sun: 'M12 3V1m0 22v-2M3 12H1m22 0h-2M4.2 4.2 2.8 2.8m18.4 18.4-1.4-1.4M4.2 19.8l-1.4 1.4M21.2 2.8l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  menu: 'M4 6h16M4 12h16M4 18h16',
  tag: 'M3 3h8l10 10-8 8L3 11zM7 7h.01',
  book: 'M4 3h13a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V3Zm0 14h16M8 3v10',
}
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name]" /></svg>
</template>
