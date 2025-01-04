<script lang="ts" setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import 'videojs-overlay';
import 'videojs-overlay/dist/videojs-overlay.css';
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
let playerOverlayInterface: any;
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
      playerOverlayInterface = player.overlay({
        showBackground: false,
        class: 'bg-black bg-opacity-25 text-white opacity-50 text-xl',
        overlays: [],
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
              new Date(p.updated_at) > expireLimit,
          );
          if (progressList.length >= 10) {
            // Save only 10 latest progress
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
            name: props.source.name ?? null,
            updated_at: new Date().toISOString(),
            thumbnail: props.source.src.includes(
              '//cdn.md.chula.ac.th/content/',
            )
              ? props.source.src.replace('/media/1.mp4', '/index/0.jpg')
              : props.source.src.includes('//drive.google.com/')
                ? props.source.src.replace('uc?export=download&', 'thumbnail?')
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
    },
  );

  // set hotkey "T" to toggle clock
  document
    .getElementsByTagName('body')[0]
    .addEventListener('keyup', keyToggleClock);
});
onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
  if (ticker) {
    clearInterval(ticker);
  }
  document
    .getElementsByTagName('body')[0]
    .removeEventListener('keyup', keyToggleClock);
});
const promptPlaybackSpeed = () => {
  const speed = prompt(
    'Specify playback speed (between 0.2-5.0)',
    player.playbackRate().toString(),
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

const toggleClock = (isEnabled: boolean) => {
  if (isEnabled !== isClockEnabledLocal.value) {
    isClockEnabledLocal.value = isEnabled;
    if (isEnabled) {
      if (playerOverlayInterface) {
        showClock();
      } else {
        setTimeout(showClock, 3000);
      }
    } else if (clockOverlay && playerOverlayInterface) {
      playerOverlayInterface.remove(playerOverlayInterface.get()[0]);
      clockOverlay = null;
      if (clockTicker) {
        clearInterval(clockTicker);
        clockTicker = null;
      }
    }
  }
  return isEnabled;
};
const showClock = () => {
  clockOverlay = playerOverlayInterface.add({
    content: 'Loading',
    start: 'playing',
    end: '',
  });
  if (!player.paused()) {
    player.pause();
    player.play();
  }
  if (!clockTicker) {
    // update the clock immediately, then update every 2 seconds
    if (clockOverlay[0].contentEl()) {
      clockOverlay[0].contentEl().innerHTML = getClockString();
    }
    clockTicker = setInterval(() => {
      if (clockOverlay) {
        if (clockOverlay[0].contentEl()) {
          clockOverlay[0].contentEl().innerHTML = getClockString();
        } else {
          clockOverlay = null;
          if (clockTicker) {
            clearInterval(clockTicker);
            clockTicker = null;
          }
        }
      }
    }, 2000);
  }
};
const getClockString = () => {
  const date = new Date();
  const timeString = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (date.getSeconds() % 4 >= 2) {
    // The colon sign blinks every four seconds
    return timeString.replace(':', '<span class="opacity-0">:</span>');
  }
  return timeString;
};
let clockOverlay: any = null;
let clockTicker: any = null;
const isClockEnabledLocal = ref<boolean | null>(null);
const isClockEnabled = computed<boolean>({
  get() {
    // The keys and the values are always strings.
    return isClockEnabledLocal.value === null
      ? toggleClock(localStorage.getItem('isClockEnabled') === 'true')
      : isClockEnabledLocal.value;
  },
  set(newValue) {
    toggleClock(newValue);
    localStorage.setItem('isClockEnabled', newValue.toString());
  },
});
const keyToggleClock = (event: KeyboardEvent) => {
  if (event.key === 't') {
    isClockEnabled.value = !isClockEnabled.value;
  }
};
const origin = window.location.origin;

let posterOrigin = '';
switch (import.meta.env.VITE_SPECIAL_DAY) {
  case 'valentine':
    posterOrigin = "/poster-valentine.webp";
    break;
  case 'halloween':
    posterOrigin = "/poster-halloween.webp";
    break;
  case 'christmas':
    posterOrigin = "/poster-christmas.webp";
    break;
  default:
    break;
}
</script>

<template>
  <video
    ref="playerEl"
    class="video-js vjs-default-skin vjs-big-play-centered w-max"
    controls
    preload="metadata"
    :poster="posterOrigin"
  >
    Your browser does not support the video tag.
  </video>
  <div class="my-4 text-gray-500 dark:text-gray-200">
    <div class="mb-2 gap-4 space-y-2 sm:flex">
      <div class="flex-auto">
        <p
          class="my-2 hidden text-sm text-gray-400 dark:text-gray-400 md:block"
        >
          <b>Hotkeys</b>&emsp; Space: Pause, ▲/▼: Volume, ◄/►: Seek, F:
          Fullscreen<span :class="{ 'opacity-0': !isClockEnabled }"
            >, T: Toggle clock</span
          >
        </p>
        <p v-if="startClock">Time spent on this page: {{ startClock }}</p>
      </div>
      <div>
        <button
          class="cursor-pointer rounded border border-primary-600 bg-transparent px-4 py-1 font-semibold text-primary-600 transition duration-200 ease-in hover:border-transparent hover:bg-primary-600 hover:text-white"
          @click="promptPlaybackSpeed"
        >
          Set playback speed
        </button>
      </div>
    </div>

    <label
      class="my-1 block cursor-pointer text-sm text-gray-600 dark:text-gray-400"
    >
      <div class="flex items-center">
        <Checkbox v-model:checked="isProgressSaveEnabled" />
        <div class="ml-2">
          Save video progress in this device
          <p
            v-if="isProgressSaveEnabled"
            class="text-xs text-gray-500 dark:text-gray-500"
          >
            After you close this tab, just visit <i>{{ origin }}</i> to resume
            watching.
          </p>
        </div>
      </div>
    </label>
    <label
      class="my-1 block cursor-pointer text-sm text-gray-600 dark:text-gray-400"
    >
      <div class="flex items-center">
        <Checkbox v-model:checked="isClockEnabled" />
        <div class="ml-2">
          Show clock in the player
          <p
            v-if="isClockEnabled"
            class="text-xs text-gray-500 dark:text-gray-500"
          >
            The clock is shown at the top-left corner of the player after the
            video starts playing.
          </p>
        </div>
      </div>
    </label>
  </div>
  <div class="mt-6 text-center tracking-wide text-primary-600 dark:text-red-500">
    <a class="cursor-pointer" @click="$emit('back')">
      <ChevronLeftIcon class="inline-block h-5" />
      Back</a
    >
  </div>
</template>
