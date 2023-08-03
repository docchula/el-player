<script lang="ts" setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import 'videojs-youtube';
import Checkbox from './Checkbox.vue';
import { ProgressItem } from '../types';

defineEmits(['back']);
const props = defineProps<{
  source: Partial<ProgressItem> & {
    src: string;
    type?: string;
  };
}>();
const playerEl = ref<Element | null>(null);
let player: any;
let startTime: number | null;
let ticker: number | undefined;
const startClock = ref<String | null>(null);
onMounted(() => {
  const source = {
    src: props.source.src,
    type: props.source.type ?? null,
  };
  player = videojs(
    playerEl.value!,
    {
      aspectRatio: '1280:640',
      controlBar: {
        skipButtons: {
          forward: 10,
          backward: 10,
        },
      },
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5],
      sources: [source],
    },
    () => {
      player.src(source);
      player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        enableVolumeScroll: false,
      });
      player.on('play', () => {
        if (!startTime) {
          startTime = new Date().getTime();
          ticker = setInterval(() => {
            const currentTime = new Date().getTime();
            const diff = currentTime - startTime!;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            startClock.value = `${h}:${m.toString().padStart(2, '0')}`;
          }, 10000);
        }
      });
      player.on('pause', () => {
        if (isProgressSaveEnabled) {
          let progressList = [];
          const progressString = localStorage.getItem('ProgressSave-v1');
          if (progressString && localStorage.getItem('isProgressSaveEnabled')) {
            progressList = JSON.parse(progressString);
            if (!Array.isArray(progressList)) {
              progressList = [];
            }
          }
          const expireLimit = new Date();
          expireLimit.setMonth(expireLimit.getMonth() - 1);
          // Remove progress of this video & expired progress
          progressList = progressList.filter(
            p =>
              p.src.toLowerCase().split('?').shift() !==
                props.source.src.toLowerCase().split('?').shift() &&
              p.updated_at &&
              new Date(p.updated_at) > expireLimit
          );
          if (progressList.length >= 3) {
            // Save only 3 latest progress
            progressList = progressList
              .sort((a, b) => -a.updated_at.localeCompare(b.updated_at))
              .slice(0, 2);
          }
          progressList.push({
            currentTime: player.currentTime(),
            duration: player.duration(),
            playbackRate: player.playbackRate(),
            src: props.source.src,
            type: props.source.type ?? null,
            updated_at: new Date().toISOString(),
            thumbnail: props.source.src.startsWith(
              'http://cdn.md.chula.ac.th/content/'
            )
              ? props.source.src.replace('/media/1.mp4', '/index/0.jpg')
              : null,
          });

          localStorage.setItem('ProgressSave-v1', JSON.stringify(progressList));
        }
      });
      if (props.source.currentTime) {
        player.currentTime(props.source.currentTime);
      }
      if (props.source.playbackRate) {
        player.playbackRate(props.source.playbackRate);
      }
    }
  );
});
onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
  if (ticker) {
    clearInterval(ticker);
  }
});
const promptPlaybackSpeed = () => {
  const speed = prompt(
    'Specify playback speed (between 0.2-5.0)',
    player.playbackRate().toString()
  );
  if (speed) {
    const speedNum = parseFloat(speed);
    if (speedNum > 5 || speedNum < 0.2) {
      alert('Invalid speed!');
    } else {
      player.playbackRate(speedNum);
    }
  }
};

const isProgressSaveEnabledLocal = ref<boolean | null>(null);
const isProgressSaveEnabled = computed<boolean>({
  get() {
    // The keys and the values are always strings.
    return isProgressSaveEnabledLocal.value === null
      ? localStorage.getItem('isProgressSaveEnabled') === 'true'
      : isProgressSaveEnabledLocal.value;
  },
  set(newValue) {
    isProgressSaveEnabledLocal.value = newValue;
    localStorage.setItem('isProgressSaveEnabled', newValue.toString());
  },
});
</script>

<template>
  <video
    ref="playerEl"
    class="video-js vjs-default-skin vjs-big-play-centered w-max"
    controls
    preload="metadata"
  >
    Your browser does not support the video tag.
  </video>
  <div class="my-4 text-gray-500 dark:text-gray-200">
    <p class="my-2 hidden md:block text-gray-400 dark:text-gray-300">
      <b>Hotkeys</b>&emsp; Space: Pause, ▲/▼: Volume, ◄/►: Seek, F: Fullscreen
    
    <span v-if="startClock">Time spent on this page: {{ startClock }} | </span
    ><button
      class="cursor-pointer text-gray-400 dark:text-gray-300 py-1 px-4 bg-transparent font-semibold border border-green-600 rounded hover:bg-green-600 hover:border-transparent transition ease-in duration-200"
      @click="promptPlaybackSpeed"
      >Set playback speed</button
    >
  </p>
    <label
      class="block my-1 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
    >
      <div class="flex items-center">
        <Checkbox v-model:checked="isProgressSaveEnabled" />
        <div class="ml-2">
          Save video progress in this device
          <p
            v-if="isProgressSaveEnabled"
            class="text-xs text-gray-500 dark:text-gray-500"
          >
            After you close this tab, just visit <i>player.docchula.com</i> to
            resume watching.
          </p>
        </div>
      </div>
    </label>
  </div>
  <div class="tracking-wide text-center text-green-600 dark:text-red-500 mt-6">
    <a class="cursor-pointer" @click="$emit('back')">
      <ChevronLeftIcon class="inline-block h-5" />
      Back</a
    >
  </div>
</template>
