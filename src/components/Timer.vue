<script lang="ts" setup>
import {
  ArrowPathIcon,
  ChevronDownIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  StopIcon,
} from '@heroicons/vue/24/solid';
import { reactive, ref } from 'vue';

const settings = reactive({
  studyDuration: 25,
  breakDuration: 5,
  longBreakDuration: 20,
  isTimerRunning: false,
  timerId: 0,
  count: 0,
  title: 'Timer',
});
const isOpen = ref(false);
const timeLeft = ref<number>(0);

const startTimer = () => {
  if (settings.isTimerRunning) {
    return;
  }
  if (settings.studyDuration >= 1 && settings.breakDuration >= 1) {
    if (settings.count === 0) {
      settings.title = 'Study';
      settings.count++;
    }
    settings.isTimerRunning = true;
    timeLeft.value =
      settings.count % 2 === 0
        ? settings.count % 3 === 0
          ? settings.longBreakDuration * 60
          : settings.breakDuration * 60
        : settings.studyDuration * 60;
    settings.timerId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer();
        settings.count++;
        if (settings.count % 2 === 0) {
          if (settings.count % 3 === 0) {
            startTimer();
            settings.title = 'Long Break';
            alert('Study time is up! Take a long break.');
          } else {
            startTimer();
            settings.title = 'Break';
            alert('Study time is up! Take a break.');
          }
        } else {
          startTimer();
          settings.title = 'Study';
          alert('Break time is up! Get back to study.');
        }
      }
    }, 1000);
  } else {
    alert('Please provide durations that are at least 1 minute.');
  }
};

const stopTimer = () => {
  settings.isTimerRunning = false;
  clearInterval(settings.timerId);
};

const resetTimer = () => {
  stopTimer();
  timeLeft.value = 0;
};

const formatTime = (time: number) => {
  const displayTime = new Date(0, 0);
  displayTime.setSeconds(+time);
  return displayTime.toTimeString().slice(0, 8);
};
</script>

<template>
  <button
    :class="{
      'text-gray-600 dark:text-gray-300': isOpen || timeLeft > 0,
      'text-gray-400 dark:text-gray-500': !isOpen && timeLeft <= 0,
    }"
    class="cursor-pointer relative text-sm block"
    @click="isOpen = !isOpen"
  >
    <template v-if="isOpen || timeLeft <= 0">
      Pomodoro Timer
      <ChevronDownIcon v-if="isOpen" class="inline-block h-5" />
    </template>
    <template v-else>
      {{ settings.title }}: {{ formatTime(timeLeft) }}
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
      class="box-border p-4 mt-2 rounded-lg bg-gray-200/50 backdrop-blur transition duration-1000 dark:bg-gray-700/50 block text-sm text-gray-700 dark:text-gray-500"
    >
      <div class="text-center">
        <h2 class="text-lg font-bold dark:text-gray-400">
          {{ settings.title }}
          <a
            v-if="timeLeft === 0"
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            target="_blank"
          >
            <QuestionMarkCircleIcon
              class="inline-block h-5 cursor-pointer text-slate-400 dark:text-slate-500 hover:underline hover:text-gray-500 dark:hover:text-gray-300"
            />
          </a>
        </h2>
        <div class="text-xl dark:text-gray-400">
          {{ formatTime(timeLeft) }}
        </div>
        <div class="buttons">
          <PlayIcon
            class="inline-block h-7 cursor-pointer text-slate-400 dark:text-slate-500 hover:underline hover:text-gray-500 dark:hover:text-gray-300"
            @click="startTimer"
          />
          <StopIcon
            class="inline-block h-7 cursor-pointer text-slate-400 dark:text-slate-500 hover:underline hover:text-gray-500 dark:hover:text-gray-300"
            @click="stopTimer"
          />
          <ArrowPathIcon
            class="inline-block h-6 cursor-pointer text-slate-400 dark:text-slate-500 hover:underline hover:text-gray-500 dark:hover:text-gray-300"
            @click="resetTimer"
          />
        </div>
      </div>
      <div class="space-y-1 sm:space-y-2 mt-2">
        <div>
          <label for="input-study">Study Duration</label>
          <div class="flex items-center gap-2">
            <input
              id="input-study"
              v-model.number="settings.studyDuration"
              class="block w-28 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              max="360"
              min="1"
              onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
              placeholder="25"
              type="number"
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
              onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
              placeholder="5"
              type="number"
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
              onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
              placeholder="15"
              type="number"
            />
            <p>min</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
