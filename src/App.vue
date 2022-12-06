<script setup lang="ts">
import Home from './components/Home.vue';
import Player from './components/Player.vue';
import {onMounted, ref} from 'vue';
import {SunIcon} from '@heroicons/vue/20/solid';

const url = ref<string | null>(null);
const processUrl = (rawInput: string) => {
  let input = null;
  if (rawInput && isValidHttpUrl(rawInput)) {
    // Transform URL input
    if (rawInput.includes('.mp4')) {
      input = rawInput;
    } else {
      const urlInput = new URL(rawInput);
      if (rawInput.includes('aculearn-idm/')) {
        input = 'http://cdn.md.chula.ac.th/content/' + urlInput.searchParams.get('author') + '/' + urlInput.searchParams.get('modulename') + '/media/' + (rawInput.includes('/v7/') ? '2' : '1') + '.mp4';
      } else if (rawInput.includes('aculearn-me/')) {
        input = 'http://cdn1.md.chula.ac.th/content/' + urlInput.searchParams.get('author') + '/' + urlInput.searchParams.get('modulename') + '/media/' + (rawInput.includes('/v7/') ? '2' : '1') + '.mp4';
      } else {
        alert('Error: Cannot extract video address!');
      }
    }
  }

  url.value = input;
  if (url.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    if (rawInput) {
      alert('Invalid URL');
    }
  }
};
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
const isValidHttpUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
onMounted(() => {
  if (window.location.href.includes('aculearn-')) {
    processUrl(window.location.href);
  }
});
</script>

<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-50 dark:bg-transparent sm:items-center sm:pt-0">
    <div class="fixed top-0 right-0 px-6 py-4 block font-thin">
      <a href="http://e-learning.md.chula.ac.th" target="_blank" class="text-sm text-gray-500 dark:text-gray-400 underline">MDCU E-Learning</a>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-0">
      <div class="flex justify-center pt-8 sm:justify-start sm:pt-0">
        <h1 class="text-6xl font-extrabold">
          <span class="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 dark:from-emerald-200 to-green-700 dark:to-green-600">Docchula</span>
          <span class="text-4xl">&ensp;</span>
          <span class="text-gray-700 dark:text-gray-200">Video Player</span>
        </h1>
      </div>

      <div class="mt-8">
        <Player v-if="url" :src="url" @back="processUrl(null)"/>
        <Home v-else :url="url" @submit="processUrl"/>
      </div>

      <div class="mt-20 mb-4 text-xs text-extralight text-gray-400 text-center">
        Created with ❤ by Keen | <a href="https://github.com/docchula/el-player" target="_blank"
                                    class="text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300">Source Code</a> |
        <SunIcon @click="toggleDarkMode" title="Toggle dark theme"
                 class="inline-block h-5 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"/>
      </div>
    </div>
  </div>
</template>
