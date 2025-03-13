import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let countdownInterval = null;

const button = document.querySelector('button');
button.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < new Date()) {
      iziToast.show({
        message: '"Please choose a date in the future"',
        position: 'topCenter',
      });
      button.disabled = true;
      return;
    }

    button.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

button.addEventListener('click', startCountdown);

function startCountdown() {
  if (!userSelectedDate || userSelectedDate < new Date()) {
    alert('Please choose a date in the future');
    return;
  }

  button.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  countdownInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    updateTimer(convertMs(timeRemaining));
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = pad(days);
  document.querySelector('[data-hours]').textContent = pad(hours);
  document.querySelector('[data-minutes]').textContent = pad(minutes);
  document.querySelector('[data-seconds]').textContent = pad(seconds);
}
