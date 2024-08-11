<script lang="ts" setup>
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/solid';
import { computed, reactive, ref } from 'vue';

const settings = reactive({
  studyDuration: 25,
  breakDuration: 5,
  longBreakDuration: 20,
});
const isOpen = ref(false);
const timer = reactive({
  left: 0,
  from: 0,
  timerId: 0,
  count: 0,
  title: 'Timer',
});
const timerPercentage = computed(() => {
  if (timer.left <= 0 || timer.from <= 0) {
    return '0%';
  }
  return 100 - (timer.left * 100) / timer.from + '%';
});

const startTimer = () => {
  if (timer.timerId !== 0) {
    // If timer is already running, pause it.
    stopTimer();
    return;
  }
  if (settings.studyDuration < 0.2 || settings.breakDuration < 0.2) {
    alert('Please provide durations that are at least 1 minute.');
  } else {
    if (timer.count === 0) {
      timer.title = 'Study';
      timer.count++;
    }
    if (timer.left <= 0) {
      if (timer.count % 2 === 0) {
        if (timer.count % 3 === 0) {
          timer.from = settings.longBreakDuration * 60;
        } else {
          timer.from = settings.breakDuration * 60;
        }
      } else {
        timer.from = settings.studyDuration * 60;
      }
      timer.left = timer.from;
    }
    timer.timerId = setInterval(() => {
      if (timer.left > 0) {
        timer.left--;
      } else {
        stopTimer();
        timer.count++;
        if (timer.count % 2 === 0) {
          if (timer.count % 3 === 0) {
            startTimer();
            timer.title = 'Long Break';
            alert('Study time is up! Take a long break.');
          } else {
            startTimer();
            timer.title = 'Break';
            alert('Study time is up! Take a break.');
          }
        } else {
          startTimer();
          timer.title = 'Study';
          alert('Break time is up! Get back to study.');
        }
      }
    }, 1000);
  }
};

const stopTimer = () => {
  clearInterval(timer.timerId);
  timer.timerId = 0;
};

const resetTimer = () => {
  if (confirm('Do you want to reset the timer?')) {
    stopTimer();
    timer.left = 0;
    timer.count = 0;
    timer.title = 'Timer';
  }
};

const forwardTimer = () => {
  if (timer.left > 5 && confirm('Do you want to skip this session?')) {
    timer.left = 5;
    timer.from = 6;
  }
};

const formatTime = (time: number) => {
  const displayTime = new Date(0, 0);
  displayTime.setSeconds(+time);
  return displayTime.toTimeString().slice(0, 8);
};

const enforceNumberOnly = (event: KeyboardEvent) => {
  if (!((event.key >= '0' && event.key <= '9') || event.key === '.')) {
    event.preventDefault();
  }
};
</script>

<template>
  <button
    :class="{
      'text-gray-600 dark:text-gray-300': isOpen || timer.left > 0,
      'text-gray-400 dark:text-gray-500': !isOpen && timer.left <= 0,
    }"
    class="relative block cursor-pointer text-sm"
    @click="isOpen = !isOpen"
  >
    <template v-if="isOpen || timer.left <= 0">
      Pomodoro Timer
      <ChevronDownIcon v-if="isOpen" class="inline-block h-5" />
    </template>
    <template v-else>
      {{ timer.title }}:
      <span class="font-bold">{{ formatTime(timer.left) }}</span>
    </template>
  </button>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="isOpen"
      class="mt-2 box-border block rounded-lg bg-gray-200/50 p-4 text-sm text-gray-700 backdrop-blur transition duration-1000 dark:bg-gray-700/50 dark:text-gray-500"
    >
      <div class="text-center">
        <h2 class="text-lg font-bold dark:text-gray-400">
          {{ timer.title }}
          <a
            v-if="timer.left === 0"
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            target="_blank"
          >
            <QuestionMarkCircleIcon
              class="inline-block h-5 cursor-pointer text-slate-400 hover:text-gray-500 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            />
          </a>
        </h2>
        <div class="text-xl dark:text-gray-400">
          {{ formatTime(timer.left) }}
        </div>
        <div class="buttons">
          <a
            class="mx-1 cursor-pointer text-slate-400 hover:text-gray-500 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            @click="startTimer"
          >
            <PlayIcon v-if="timer.timerId === 0" class="inline-block h-7" />
            <PauseIcon v-else class="inline-block h-7" />
          </a>
          <ForwardIcon
            v-if="timer.left > 8"
            class="mx-1 inline-block h-6 cursor-pointer text-slate-400 hover:text-gray-500 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            @click="forwardTimer"
          />
          <ArrowPathIcon
            v-if="timer.left > 0 || timer.count > 0"
            class="mx-1 inline-block h-6 cursor-pointer text-slate-400 hover:text-gray-500 hover:underline dark:text-slate-500 dark:hover:text-gray-300"
            @click="resetTimer"
          />
        </div>
      </div>
      <div class="mt-2 space-y-1 sm:space-y-2">
        <div>
          <label for="input-study">Study Duration</label>
          <div class="flex items-center gap-2">
            <input
              id="input-study"
              v-model.number="settings.studyDuration"
              class="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              max="360"
              min="1"
              placeholder="25"
              type="number"
              v-on:keypress="enforceNumberOnly"
            />
            <p>min</p>
          </div>
        </div>
        <div>
          <label for="input-break">Break Duration</label>
          <div class="flex items-center gap-2">
            <input
              id="input-break"
              v-model.number="settings.breakDuration"
              class="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              max="360"
              min="1"
              placeholder="5"
              type="number"
              v-on:keypress="enforceNumberOnly"
            />
            <p>min</p>
          </div>
        </div>
        <div>
          <label for="input-long-break">Long Break Duration</label>
          <div class="flex items-center gap-2">
            <input
              id="input-long-break"
              v-model.number="settings.longBreakDuration"
              class="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              max="360"
              min="1"
              placeholder="15"
              type="number"
              v-on:keypress="enforceNumberOnly"
            />
            <p>min</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div class="absolute left-0 top-0 h-1.5 w-screen">
    <div
      :class="{
        'bg-green-400 dark:bg-green-700': timer.title === 'Study',
        'bg-gray-400 dark:bg-gray-700': timer.title === 'Break',
        'bg-pink-400 dark:bg-pink-700': timer.title === 'Long Break',
      }"
      :style="{ width: timerPercentage }"
      class="h-full"
    ></div>
  </div>
</template>
