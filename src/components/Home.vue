<script setup lang="ts">
import {PlayCircleIcon} from '@heroicons/vue/20/solid';
import {ref} from 'vue';

const props = defineProps<{ url?: string | null }>();
defineEmits(['submit']);
const url = ref(props?.url);
</script>

<template>
  <form @submit.prevent="$emit('submit', url)">
    <div class="mb-4">
      <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-500">Video URL</label>
      <div class="relative mt-1 rounded-md shadow-sm">
        <input type="text" id="url"
               class="block w-full rounded-md border-gray-300 focus:border-green-400 dark:focus:border-green-800 focus:ring-green-400 dark:focus:ring-green-800 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
               placeholder="http://cdn.md.chula.ac.th/aculearn-idm/..." v-model.trim="url"/>
      </div>
      <p class="py-1 text-xs text-gray-400 dark:text-gray-700">Supports MDCU E-Learning, Google Drive (public file), and YouTube</p>
    </div>
    <button type="submit" :disabled="!url" :class="{ 'border-green-500 dark:border-green-600 text-green-500 dark:text-green-600': url, 'border-gray-500 dark:border-gray-600 dark:text-gray-600': !url }"
            class="group relative flex w-full justify-center rounded-md py-2 px-4 text-sm font-medium border-2 hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <PlayCircleIcon class="h-5 w-5" aria-hidden="true"/>
            </span>
      Play
    </button>
  </form>
</template>
