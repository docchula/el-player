<script setup lang="ts">
import {ChevronLeftIcon} from '@heroicons/vue/24/solid';
import {onMounted, onBeforeUnmount, ref} from 'vue';
import videojs from 'video.js';
import "video.js/dist/video-js.css";
import 'videojs-hotkeys';
import 'videojs-seek-buttons';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';
import 'videojs-youtube';

defineEmits(['back']);
const props = defineProps<{
  source: {
    src: string;
    type?: string;
  };
}>();
const playerEl = ref<Element | null>(null);
let player: videojs.Player;
let startTime: number | null;
let ticker: number | undefined;
const startClock = ref<String | null>(null);
onMounted(() => {
  console.log(props.source);
  player = videojs(playerEl.value!, {
    aspectRatio: "1280:640",
    playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5],
    plugins: {
      seekButtons: {forward: 10, back: 10}
    },
    sources: [props.source],
  }, () => {
    player.src(props.source);
    player.hotkeys({
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false,
      enableVolumeScroll: false
    });
    player.on('play', () => {
      if (!startTime) {
        startTime = (new Date()).getTime();
        ticker = setInterval(() => {
          const currentTime = (new Date()).getTime();
          const diff = currentTime - startTime!;
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          startClock.value = `${h}:${m.toString().padStart(2, '0')}`;
        }, 10000);
      }
    });
  });
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
  const speed = prompt('Specify playback speed (between 0.2-5.0)', player.playbackRate().toString());
  if (speed) {
    const speedNum = parseFloat(speed);
    if (speedNum > 5 || speedNum < 0.2) {
      alert('Invalid speed!');
    } else {
      player.playbackRate(speedNum);
    }
  }
};
</script>

<template>
  <video ref="playerEl" class="video-js vjs-default-skin vjs-big-play-centered w-max" controls preload="metadata">
    Your browser does not support the video tag.
  </video>
  <div class="my-4 text-gray-500 dark:text-gray-200">
    <p class="my-2 hidden md:block text-gray-400 dark:text-gray-300"><b>Hotkeys</b>&emsp; Space: Pause, ▲/▼: Volume, ◄/►: Seek, F: Fullscreen</p>
    <span v-if="startClock">Time spent on this page: {{ startClock }} | </span><a class="cursor-pointer text-gray-400 dark:text-gray-300" @click="promptPlaybackSpeed">Set playback speed</a>
  </div>
  <div class="tracking-wide text-center text-green-600 dark:text-red-500 mt-6">
    <a class="cursor-pointer" @click="$emit('back')">
      <ChevronLeftIcon class="inline-block h-5"/>
      Back</a>
  </div>
</template>
