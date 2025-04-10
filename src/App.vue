<script lang="ts" setup>
import Home from './components/Home.vue';
import Player from './components/Player.vue';
import Timer from './components/Timer.vue';
import { computed, onMounted, ref } from 'vue';
import {
  CheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
  PlayIcon,
  SunIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid';
import BookmarkModal from './components/BookmarkModal.vue';
import { ProgressItem } from './types';

const source = ref<{
  src: string;
  type?: string;
  currentTime?: number;
} | null>(null);
const processUrl = (rawInput: string | { src: string } | null) => {
  let input: {
    src: string;
    type?: string;
    currentTime?: number;
  } | null = null;
  if (rawInput && (typeof rawInput === 'object' || isValidHttpUrl(rawInput))) {
    if (typeof rawInput === 'object') {
      input = rawInput;
    } else {
      // Transform URL input
      const urlInput = new URL(rawInput);
      if (rawInput.includes('.mp4')) {
        input = { src: rawInput, type: 'video/mp4' };
      } else {
        if (rawInput.includes('aculearn-idm/')) {
          input = {
            src:
              'https://cdn.md.chula.ac.th/content/' +
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
              'https://cdn1.md.chula.ac.th/content/' +
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
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i,
          )
        ) {
          // YouTube URL
          input = { src: rawInput, type: 'video/youtube' };
        }
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
          encodeURIComponent(input.src),
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
const savedProgressLocal = ref<ProgressItem[] | null>(null);
const savedProgress = computed<ProgressItem[]>({
  get() {
    if (savedProgressLocal.value) {
      return savedProgressLocal.value;
    }
    const progressString = localStorage.getItem('ProgressSave-v1');
    if (progressString && localStorage.getItem('isProgressSaveEnabled')) {
      let progressList = JSON.parse(progressString);
      // ignore if the source is the same as the current source and no progress
      if (!Array.isArray(progressList)) {
        progressList = [progressList];
      }
      return progressList
        .filter((progress: ProgressItem) => {
          return (
            (progress.src?.toLowerCase().split('?').shift() !==
              source.value?.src?.toLowerCase().split('?').shift() ||
              !source.value?.currentTime) &&
            progress.currentTime > 1
          );
        })
        .map((progress: ProgressItem) => {
          if (!progress.name) {
            if (
              progress.src.includes('://cdn.md.chula.ac.th/content/') ||
              progress.src.includes('://cdn1.md.chula.ac.th/content/')
            ) {
              progress.name = 'MDCU E-Learning Video';
            } else if (progress.src.startsWith('https://drive.google.com/uc')) {
              progress.name = 'Google Drive Video';
            } else {
              progress.name = progress.src.split('?').shift()?.split('/').pop();
            }
          }
          return progress;
        });
    }
    return [];
  },
  set(newValue) {
    savedProgressLocal.value = newValue;
    localStorage.setItem('ProgressSave-v1', JSON.stringify(newValue));
  },
});
const progressDelete = (progress: ProgressItem) => {
  savedProgress.value = savedProgress.value.filter(p => p.src !== progress.src);
};
const hideProgress = ref<boolean>(false);
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

const renameState = ref<boolean>(false);
const toggleRename = () => {
  if (renameState.value) {
    localStorage.setItem(
      'ProgressSave-v1',
      JSON.stringify(savedProgress.value),
    );
  }
  renameState.value = !renameState.value;
};

const theme = import.meta.env.VITE_SPECIAL_DAY
</script>

<template>
  <div
    class="items-top bg-special-day-light dark:bg-special-day-dark relative flex min-h-screen justify-center bg-gray-50 transition duration-300 dark:bg-gray-900 sm:items-center sm:pt-0"
    :class="{
      'bg-cover': theme === 'christmas',
      'bg-[length:100%] bg-bottom bg-no-repeat': theme === 'songkran' || theme === 'valentine',
    }"
    >
    <div class="absolute right-0 top-0 block px-6 py-4 font-light">
      <a
        class="text-sm text-gray-500 underline dark:text-gray-400"
        href="http://e-learning.md.chula.ac.th"
        target="_blank"
        >MDCU E-Learning</a
      >
    </div>
    <div class="absolute left-0 top-0 z-40 block px-6 py-4">
      <Timer />
    </div>
    <div class="mx-auto mt-6 max-w-6xl px-4 sm:mt-10 sm:px-6 md:mt-12 lg:px-8">
      <div class="flex justify-center pt-8 sm:justify-start sm:pt-0">
        <h1 class="mx-auto text-6xl font-extrabold md:px-4 lg:px-12">
          <span
            class="bg-gradient-to-br from-secondary-300 to-primary-700 bg-clip-text text-transparent dark:from-secondary-200 dark:to-primary-600"
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
        <div
          v-if="savedProgress.length > 0 && !hideProgress"
          class="mb-4 max-h-72 items-center space-y-2 overflow-y-auto rounded bg-gray-200 p-3 pt-1 dark:bg-gray-700"
        >
          <div class="flex items-center text-gray-500 dark:text-gray-400">
            <p class="flex-auto items-center text-xs font-bold">
              SAVED PROGRESS
              <span v-if="renameState">
                <CheckIcon
                  class="inline-block h-4 w-4 cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
                  @click="toggleRename"
                />
              </span>
              <span v-else>
                <PencilSquareIcon
                  class="inline-block h-4 w-4 cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
                  @click="toggleRename"
                />
              </span>
            </p>
            <div class="text-right">
              <XMarkIcon
                class="inline-block h-4 w-4 cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
                @click="hideProgress = true"
              />
            </div>
          </div>
          <div v-for="(progress, index) in savedProgress" class="flex gap-4">
            <div v-if="progress.thumbnail" class="flex">
              <img
                :class="{
                  'max-w-[8rem]': savedProgress.length <= 1,
                  'max-w-[6rem]': savedProgress.length > 1,
                }"
                :src="progress.thumbnail"
                class="w-full"
              />
            </div>
            <div class="flex-auto dark:text-gray-200">
              <span v-if="renameState">
                <input
                  type="text"
                  v-model="savedProgress[index].name"
                  @keyup.enter="toggleRename"
                  class="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </span>
              <span v-else> {{ progress.name }} </span>&ensp;
              <span class="text-sm text-gray-600 dark:text-gray-300">
                ({{ Math.round(progress.currentTime / 60) }} min/{{
                  Math.round(progress.duration / 60)
                }}
                min)
              </span>
            </div>
            <div class="text-center text-gray-500 dark:text-gray-400">
              <PlayIcon
                class="inline-block h-6 w-6 cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
                @click="processUrl(progress)"
              />
              <!-- ArrowTopRightOnSquareIcon
              class="w-6 h-6 inline-block cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
            / -->
              <TrashIcon
                class="inline-block h-6 w-6 cursor-pointer hover:text-gray-600 hover:dark:text-gray-300"
                @click="progressDelete(progress)"
              />
            </div>
          </div>
        </div>
        <Player v-if="source" :source="source" @back="processUrl(null)" />
        <Home v-else @submit="processUrl" />
      </div>

      <div
        class="mb-4 mt-20 text-center text-xs font-light text-gray-400 transition duration-1000 dark:text-gray-400"
      >
        <p class="mb-2">
          <small
            class="mr-1 rounded-sm border border-gray-300 p-0.5 uppercase text-gray-300 dark:border-gray-500 dark:text-gray-500"
            >Beta</small
          >
          MDCU E-Learning is now accessible through
          <a
            class="text-gray-500 dark:text-gray-300"
            href="https://flick.docchula.com"
            target="_blank"
            >Docchula Flick</a
          >, with a progress saving feature so you can pick up right where you
          left off!
        </p>
        <p class="mb-2">
          <small
            class="mr-1 rounded-sm border border-gray-300 p-0.5 uppercase text-gray-300 dark:border-gray-500 dark:text-gray-500"
            >Beta</small
          >
          Introducing
          <a
            class="text-gray-500 dark:text-gray-300"
            href="https://random.docchula.com"
            target="_blank"
            >Dog Randomizer</a
          >, a randomizer for team that eliminates the need for a trusted party.
        </p>
        <p>
          Created with ❤ by Keen&nbsp;|&nbsp;
          <a
            class="text-slate-300 hover:text-gray-400 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            href="https://github.com/docchula/el-player"
            target="_blank"
            >Source Code</a
          >&nbsp;|&nbsp;
          <span class="hidden md:inline">
            <a
              class="cursor-pointer text-slate-300 hover:text-gray-400 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
              @click="showBookmarkModal = true"
              >Add to Bookmark</a
            >&nbsp;|&nbsp;
          </span>
          <SunIcon
            class="inline-block h-5 cursor-pointer text-slate-300 hover:text-gray-400 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            title="Toggle dark theme"
            @click="toggleDarkMode"
          />&nbsp;
          <LockOpenIcon
            v-if="lockTheme === 'false'"
            class="inline-block h-4 cursor-pointer text-slate-300 hover:text-gray-400 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            title="Enable theme lock"
            @click="toggleLockTheme"
          />
          <LockClosedIcon
            v-else
            class="inline-block h-4 cursor-pointer text-slate-300 hover:text-gray-400 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            title="Disable dark theme"
            @click="toggleLockTheme"
          />
        </p>
      </div>
    </div>
  </div>
  <BookmarkModal :show="showBookmarkModal" @close="showBookmarkModal = false" />
</template>
