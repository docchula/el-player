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
          class="block w-full rounded-md border-gray-300 focus:border-orange-400 transition duration-1000 dark:focus:border-orange-800 focus:ring-orange-400 dark:focus:ring-orange-800 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
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
        'border-orange-500 dark:border-orange-600 text-orange-500 dark:text-orange-600':
          url,
        'border-gray-500 dark:border-gray-600 dark:text-gray-600': !url,
      }"
      :disabled="!url"
      class="group relative flex w-full justify-center rounded-md py-2 px-4 text-sm font-medium border-2 hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
      type="submit"
    >
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <PlayCircleIcon aria-hidden="true" class="h-5 w-5" />
      </span>
      Play
    </button>
  </form>
</template>
