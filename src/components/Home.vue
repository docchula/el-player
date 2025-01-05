<script lang="ts" setup>
import { PlayCircleIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';

const props = defineProps<{ url?: string | null }>();
defineEmits(['submit']);
const url = ref(props?.url);
</script>

<template>
  <form @submit.prevent="$emit('submit', url)">
    <div class="mb-4">
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-500"
        for="url"
        >Video URL</label
      >
      <div class="relative mt-1 rounded-md shadow-sm">
        <input
          id="url"
          v-model.trim="url"
          class="block w-full rounded-md border-gray-300 transition duration-1000 focus:border-primary-400 focus:ring-primary-400 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-primary-800 dark:focus:ring-primary-800 sm:text-sm"
          placeholder="https://cdn.md.chula.ac.th/aculearn-idm/..."
          type="text"
        />
      </div>
      <p
        class="py-1 text-xs text-gray-400 transition duration-1000 dark:text-gray-700"
      >
        Supports MDCU E-Learning, Google Drive (public file), and YouTube
      </p>
    </div>
    <button
      :class="{
        'border-primary-500 text-primary-500 dark:border-primary-600 dark:text-primary-600':
          url,
        'border-gray-500 dark:border-gray-600 dark:text-gray-600': !url,
      }"
      :disabled="!url"
      class="group relative flex w-full justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      type="submit"
    >
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <PlayCircleIcon aria-hidden="true" class="h-5 w-5" />
      </span>
      Play
    </button>
  </form>
</template>
