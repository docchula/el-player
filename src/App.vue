<script lang="ts" setup>
import Home from './components/Home.vue';
import Player from './components/Player.vue';
import Timer from './components/Timer.vue';
import { onMounted, ref } from 'vue';
import { LockClosedIcon, LockOpenIcon, SunIcon } from '@heroicons/vue/20/solid';
import BookmarkModal from './components/BookmarkModal.vue';

const source = ref<{
  src: string;
  type?: string;
} | null>(null);
const processUrl = (rawInput: string | null) => {
  let input: {
    src: string;
    type?: string;
  } | null = null;
  if (rawInput && isValidHttpUrl(rawInput)) {
    // Transform URL input
    const urlInput = new URL(rawInput);
    if (rawInput.includes('.mp4')) {
      input = { src: rawInput, type: 'video/mp4' };
    } else {
      if (rawInput.includes('aculearn-idm/')) {
        input = {
          src:
            'http://cdn.md.chula.ac.th/content/' +
            urlInput.searchParams.get('author') +
            '/' +
            urlInput.searchParams.get('modulename') +
            '/media/' +
            (rawInput.includes('/v7/') ? '2' : '1') +
            '.mp4',
          type: 'video/mp4',
        };
      } else if (rawInput.includes('aculearn-me/')) {
        input = {
          src:
            'http://cdn1.md.chula.ac.th/content/' +
            urlInput.searchParams.get('author') +
            '/' +
            urlInput.searchParams.get('modulename') +
            '/media/' +
            (rawInput.includes('/v7/') ? '2' : '1') +
            '.mp4',
          type: 'video/mp4',
        };
      } else if (
        rawInput.startsWith('https://drive.google.com/open?') ||
        rawInput.startsWith('https://drive.google.com/file/')
      ) {
        const fileIds = rawInput.match(/\/[-\w]{25,}\//);
        if (fileIds) {
          input = {
            src:
              'https://drive.google.com/uc?export=download&id=' +
              fileIds[0].replace(/\//g, ''),
            type: 'video/mp4',
          };
        }
      } else if (
        rawInput?.match(
          /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i
        )
      ) {
        // YouTube URL
        input = { src: rawInput, type: 'video/youtube' };
      }
    }

    if (
      input &&
      input.src.startsWith('http:') &&
      window.location.protocol === 'https:' &&
      !window.location.search.includes('downgraded')
    ) {
      // Automatically downgrade to HTTP if the page is HTTPS
      window.location.replace(
        'http://' +
          window.location.host +
          '/?downgraded=true&url=' +
          encodeURIComponent(input.src)
      );
    }
  }

  source.value = input;
  if (!(lockTheme.value === 'true-dark' || lockTheme.value === 'true-light')) {
    if (source.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (rawInput) {
        alert('Invalid URL');
      }
    }
  } else {
    if (!source.value) {
      if (rawInput) {
        alert('Invalid URL');
      }
    }
  }
};
const lockTheme = ref(localStorage.getItem('lockTheme') ?? 'false');
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
  if (lockTheme.value === 'true-dark' || lockTheme.value === 'true-light') {
    lockTheme.value = document.documentElement.classList.contains('dark')
      ? 'true-dark'
      : 'true-light';
    localStorage.setItem('lockTheme', lockTheme.value);
  }
};
const toggleLockTheme = () => {
  if (lockTheme.value === 'true-dark' || lockTheme.value === 'true-light') {
    lockTheme.value = 'false';
  } else {
    if (document.documentElement.classList.contains('dark')) {
      lockTheme.value = 'true-dark';
    } else {
      lockTheme.value = 'true-light';
    }
  }
  localStorage.setItem('lockTheme', lockTheme.value);
};
const showBookmarkModal = ref(false);
const isValidHttpUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};
onMounted(() => {
  if (window.location.search.includes('url=')) {
    const urlInput = new URL(window.location.href);
    processUrl(urlInput.searchParams.get('url'));
  } else if (window.location.href.includes('aculearn-')) {
    processUrl(window.location.href);
  }
  if (lockTheme.value === 'true-dark') {
    document.documentElement.classList.add('dark');
  } else if (lockTheme.value === 'true-light') {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div
    class="relative flex items-top justify-center min-h-screen bg-gray-50 transition duration-1000 dark:bg-gray-900 sm:items-center sm:pt-0"
  >
    <div class="absolute top-0 right-0 px-6 py-4 block font-light">
      <a
        class="text-sm text-gray-500 dark:text-gray-400 underline"
        href="http://e-learning.md.chula.ac.th"
        target="_blank"
        >MDCU E-Learning</a
      >
    </div>
    <div class="absolute top-0 left-0 px-6 py-4 block z-40">
      <Timer />
    </div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 md:mt-12">
      <div class="flex justify-center pt-8 sm:justify-start sm:pt-0">
        <h1 class="text-6xl font-extrabold md:px-4 lg:px-12">
          <span
            class="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 dark:from-emerald-200 to-green-700 dark:to-green-600"
            >Docchula</span
          >
          <span class="text-4xl">&ensp;</span>
          <span
            class="text-gray-700 transition duration-1000 dark:text-gray-200"
            >Video Player</span
          >
        </h1>
      </div>

      <div class="mt-8">
        <Player v-if="source" :source="source" @back="processUrl(null)" />
        <Home v-else @submit="processUrl" />
      </div>

      <div
        class="mt-20 mb-4 text-xs font-light text-gray-400 transition duration-1000 dark:text-gray-300 text-center"
      >
        Created with ❤ by Keen&nbsp;|&nbsp;
        <a
          class="text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          href="https://github.com/docchula/el-player"
          target="_blank"
          >Source Code</a
        >&nbsp;|&nbsp;
        <span class="hidden md:inline">
          <a
            class="cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
            @click="showBookmarkModal = true"
            >Add to Bookmark</a
          >&nbsp;|&nbsp;
        </span>
        <SunIcon
          class="inline-block h-5 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          title="Toggle dark theme"
          @click="toggleDarkMode"
        />&nbsp;
        <LockOpenIcon
          v-if="lockTheme === 'false'"
          class="inline-block h-4 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          title="Enable theme lock"
          @click="toggleLockTheme"
        />
        <LockClosedIcon
          v-else
          class="inline-block h-4 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          title="Disable dark theme"
          @click="toggleLockTheme"
        />
      </div>
    </div>
  </div>
  <BookmarkModal :show="showBookmarkModal" @close="showBookmarkModal = false" />
</template>
