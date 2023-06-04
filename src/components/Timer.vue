<script lang="ts">
import { ArrowPathIcon, PlayIcon, StopIcon } from '@heroicons/vue/24/solid';

export default {
  data() {
    return {
      studyDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      isTimerRunning: false,
      open: false,
      timeLeft: 0,
      timerId: 0,
      count: 0,
      title: 'Timer',
    };
  },
  methods: {
    startTimer() {
      if (this.studyDuration >= 1 && this.breakDuration >= 1) {
        if (this.count === 0) {
          this.title = 'Study';
          this.count++;
        }
        this.isTimerRunning = true;
        this.timeLeft =
          this.count % 2 === 0
            ? this.count % 3 === 0
              ? this.longBreakDuration * 60
              : this.breakDuration * 60
            : this.studyDuration * 60;
        this.timerId = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            this.stopTimer();
            this.count++;
            if (this.count % 2 === 0) {
              if (this.count % 3 === 0) {
                this.startTimer();
                this.title = 'Long Break';
                alert('Study time is up! Take a long break.');
              } else {
                this.startTimer();
                this.title = 'Break';
                alert('Study time is up! Take a break.');
              }
            } else {
              this.startTimer();
              this.title = 'Study';
              alert('Break time is up! Get back to study.');
            }
          }
        }, 1000);
      } else {
        alert('Please provide durations that are at least 1 minute.');
      }
    },
    stopTimer() {
      this.isTimerRunning = false;
      clearInterval(this.timerId);
    },
    resetTimer() {
      this.stopTimer();
      this.timeLeft = 0;
    },
    formatTime(time: number) {
      const displayTime = new Date(0, 0);
      displayTime.setSeconds(+time);
      return displayTime.toTimeString().slice(0, 8);
    },
  },
  components: { PlayIcon, StopIcon, ArrowPathIcon },
};
</script>

<template>
  <button
    class="cursor-pointer relative text-sm text-gray-500 dark:text-gray-400 block"
    @click="open = !open"
  >
    Pomodoro Timer
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
      v-if="open"
      class="box-border p-4 mt-2 rounded-lg bg-gray-200 transition duration-1000 dark:bg-gray-800 block text-sm text-gray-700 dark:text-gray-500"
    >
      <div class="text-center">
        <h2 class="text-lg font-bold">{{ title }}</h2>
        <div class="text-xl">
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
      <div class="space-y-1">
        <div>
          <label class="label">Study Duration (minutes)</label>
          <input
            class="block rounded-md border-gray-300 focus:border-green-400 transition duration-500 dark:focus:border-green-800 focus:ring-green-400 dark:focus:ring-green-800 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
            type="number"
            min="1"
            placeholder="25"
            onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
            v-model.number="studyDuration"
          />
        </div>
        <div>
          <label class="label">Break Duration (minutes)</label>
          <input
            class="block rounded-md border-gray-300 focus:border-green-400 transition duration-500 dark:focus:border-green-800 focus:ring-green-400 dark:focus:ring-green-800 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
            type="number"
            min="1"
            placeholder="5"
            onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
            v-model.number="breakDuration"
          />
        </div>
        <div>
          <label class="label">Long Break Duration (minutes)</label>
          <input
            class="block rounded-md border-gray-300 focus:border-green-400 transition duration-500 dark:focus:border-green-800 focus:ring-green-400 dark:focus:ring-green-800 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
            type="number"
            min="1"
            placeholder="15"
            onkeypress="return (event.key >= '0' && event.key <= '9') || event.key === '.'"
            v-model.number="longBreakDuration"
          />
        </div>
      </div>
    </div>
  </transition>
</template>
