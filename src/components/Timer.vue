<script lang="ts">
import { ArrowPathIcon, PlayIcon, StopIcon } from '@heroicons/vue/24/solid';

export default {
  data() {
    return {
      studyDuration: 25,
      breakDuration: 5,
      isTimerRunning: false,
      isStudyPhase: false,
      open: false,
      timeLeft: 0,
      timerId: 0,
      count: 0,
    };
  },
  methods: {
    startTimer() {
      if (this.studyDuration >= 1 && this.breakDuration >= 1) {
        if (this.count === 0) {
          this.isStudyPhase = true;
          this.count++;
        }
        this.isTimerRunning = true;
        this.timeLeft = this.isStudyPhase
          ? this.studyDuration * 60
          : this.breakDuration * 60;
        this.timerId = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            // Will implement long break later
            // if (this.count % 4 === 0) {
            //   this.count++;
            //   this.startTimer();
            //   alert('Long break');
            //   console.log(this.count);
            // } else {
            this.stopTimer();
            this.count++;
            if (this.isStudyPhase) {
              this.isStudyPhase = false;
              this.startTimer();
              alert('Study time is up! Take a break.');
            } else {
              this.isStudyPhase = true;
              this.startTimer();
              alert('Break time is up! Get back to study.');
            }
            // }
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
    class="cursor-pointer relative text-sm text-gray-500 dark:text-gray-400 block underline"
    @click="open = !open"
  >
    Pomodoro Timer
  </button>

  <div
    v-if="open"
    class="box-border p-4 mt-2 rounded-lg bg-gray-200 transition duration-1000 dark:bg-gray-800 block text-sm text-gray-700 dark:text-gray-500"
  >
    <div class="text-center">
      <h2 class="text-lg font-bold">Timer</h2>
      <div class="text-xl">
        {{ formatTime(timeLeft) }}
      </div>
      <div class="buttons">
        <PlayIcon
          class="inline-block h-7 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          @click="startTimer"
        />
        <StopIcon
          class="inline-block h-7 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
          @click="stopTimer"
        />
        <ArrowPathIcon
          class="inline-block h-6 cursor-pointer text-slate-300 dark:text-slate-500 hover:underline hover:text-gray-400 dark:hover:text-gray-300"
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
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
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
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          v-model.number="breakDuration"
        />
      </div>
    </div>
  </div>
</template>
