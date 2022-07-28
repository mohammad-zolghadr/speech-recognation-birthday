const btnStart = document.querySelector('.btnConfirm');
const pTitle = document.querySelector('.title');
const helpText = document.querySelector('.helpText');
const pYear = document.querySelector('.year');
const pMonth = document.querySelector('.month');
const pDay = document.querySelector('.day');
const pRemain = document.querySelector('.remainToBirthday');
const btnDarkMode = document.querySelector('.darkMode');
const btnLangChange = document.querySelector('.langChange');
const dmyTexts = document.querySelectorAll('.desc');
const popUpFull = document.querySelector('.popUp');
const puMessage = document.querySelector('.pu-message');
const btnClosePu = document.querySelector('.closePu');

let speakeControl = true,
  langFa = true,
  speaking = false;
const resultArray = [];

const enMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const faMonth = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

btnDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme-variables');

  if (btnDarkMode.classList.contains('fa-sun')) btnDarkMode.classList.remove('fa-sun');
  else btnDarkMode.classList.add('fa-sun');
});

btnLangChange.addEventListener('click', () => {
  if (!speaking)
    if (langFa) {
      langFa = false;
      recognition.lang = 'en-US';
      btnLangChange.textContent = 'Fa';
      btnStart.textContent = 'Start';
      pTitle.innerHTML = `Click on Start`;
      dmyTexts[0].textContent = 'Day';
      dmyTexts[1].textContent = 'Month';
      dmyTexts[2].textContent = 'Year';
    } else {
      langFa = true;
      recognition.lang = 'fa-IR';
      btnLangChange.textContent = 'En';
      btnStart.textContent = 'شروع';
      pTitle.textContent = 'روی دکمه شروع کلیک کن';
      dmyTexts[0].textContent = 'روز';
      dmyTexts[1].textContent = 'ماه';
      dmyTexts[2].textContent = 'سال';
    }
  else {
    if (langFa) popUp('عملیاتِ فارسی که تموم شد زبان رو عوض کن');
    else popUp('When the English operation is finished, change the language');
  }
  pRemain.style.opacity = 0;
});

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fa-IR';
recognition.interimResults = true;

recognition.addEventListener('result', (e) => {
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join(' ');
  startDetection(text);
});

recognition.addEventListener('end', () => {
  if (speakeControl) recognition.start();
});

btnStart.addEventListener('click', () => {
  btnStart.style.display = 'none';
  speaking = true;
  reset();
  recognition.start();
});

function startDetection(text) {
  let tArray;
  if (langFa) {
    // Convert Numbers To EnglishNumber
    let e = '۰'.charCodeAt(0);
    text = text.replace(/[۰-۹]/g, function (t) {
      return t.charCodeAt(0) - e;
    });
    tArray = text.split(' ');

    faMonth.forEach((e) => {
      tArray.forEach((t) => {
        if (e == t) {
          resultArray['month'] = e;
          pMonth.textContent = e;
        }
      });
    });
  } else {
    tArray = text.split(' ');

    enMonth.forEach((e) => {
      tArray.forEach((t) => {
        if (e == t) {
          resultArray['month'] = e;
          pMonth.textContent = e;
        }
      });
    });
  }

  tArray.forEach((e) => {
    e = parseInt(e);
    if (typeof e == 'number') {
      let t = String(e).padStart(4, '*');
      console.log(t);
      if (e)
        if (t.includes('*')) {
          resultArray['day'] = e;
          pYear.textContent = e;
        } else {
          resultArray['year'] = e;
          pDay.textContent = e;
        }
    }
  });

  if (!resultArray['day']) {
    langFa
      ? (helpText.textContent = 'تکمیل نشده : روز')
      : (helpText.textContent = 'Missing : Day');
    if (!resultArray['month'])
      langFa ? (helpText.textContent += ' ماه') : (helpText.textContent += ' Month');
    if (!resultArray['year'])
      langFa ? (helpText.textContent += ' سال') : (helpText.textContent += ' Year');
  } else {
    langFa
      ? (helpText.textContent = 'تکمیل نشده : ')
      : (helpText.textContent = 'Missing : ');
    if (!resultArray['month'])
      langFa ? (helpText.textContent += ' ماه') : (helpText.textContent += ' Month');
    if (!resultArray['year'])
      langFa ? (helpText.textContent += ' سال') : (helpText.textContent += ' Year');
  }

  if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
    langFa
      ? (pTitle.textContent = "اگه این اطلاعات درسته بگو 'اوکی' \n وگرنه دوباره بگو")
      : (pTitle.textContent =
          "If this information is correct say 'OK' \n otherwise say it again");
    helpText.style.color = 'var(--secondary-color)';
    helpText.textContent = `${resultArray['day']}/${resultArray['month']}/${resultArray['year']}`;
  }

  if (
    text.includes('ok') ||
    text.includes('okay') ||
    text.includes('اوکی') ||
    text.includes('yes')
  ) {
    if (resultArray['day'] > 31) {
      langFa
        ? popUp('روز تولد اشتباهه، یه بار دیگه روز رو بگو')
        : popUp('Day of birthday is invalid \n say it again');
    } else {
      // End Speak
      if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
        console.log(resultArray['year'], resultArray['month'], resultArray['day']);
        speaking = false;
        recognition.stop();
        speakeControl = false;
        calculateAge(resultArray['year'], resultArray['month'], resultArray['day']);
        helpText.style.opacity = 0;
        langFa ? (pTitle.textContent = 'سن شما') : (pTitle.textContent = 'Your Age');
        calculateRemain(resultArray['month'], resultArray['day']);
        btnStart.style.display = 'block';
      } else
        langFa
          ? (pTitle.textContent = 'لطفا همه اطلاعات را بگو...')
          : (pTitle.textContent = 'Please Say Full Information');
    }
  }
}

function calculateRemain(month, day) {
  pRemain.style.opacity = 1;
  let d,
    date = [];
  if (!langFa) {
    d = new Date();
    date['day'] = d.getDate();
    date['month'] = d.getMonth();
    date['year'] = d.getFullYear();
  } else {
    d = new Date().toLocaleDateString('fa-IR');
    let e = '۰'.charCodeAt(0);
    d = d.replace(/[۰-۹]/g, function (t) {
      return t.charCodeAt(0) - e;
    });
    date['day'] = parseInt(d.split('/')[2]);
    date['month'] = parseInt(d.split('/')[1]);
    date['year'] = parseInt(d.split('/')[0]);
  }

  let remainDay = 30 - date['day'] + parseInt(day);
  let rMonth = 0;

  if (langFa) {
    if (faMonth.indexOf(month) + 1 < date['month'])
      rMonth = (12 - date['month']) * 30 + faMonth.indexOf(month) * 30;
    else rMonth = (faMonth.indexOf(month) - date['month']) * 30;
  } else {
    if (enMonth.indexOf(month) + 1 < date['month'])
      rMonth = (11 - date['month']) * 30 + enMonth.indexOf(month) * 30;
    else rMonth = (enMonth.indexOf(month) - date['month'] - 1) * 30;
  }

  let temp = remainDay + rMonth;
  if (langFa)
    pRemain.innerHTML = `<span style='color:#f7941d'>${temp}</span> روز دیگه تولدته`;
  else
    pRemain.innerHTML = `Your birthday is in <span style='color:#f7941d'>${temp}</span> Days`;
}

function calculateAge(year, month, day) {
  let d,
    date = [];
  if (!langFa) {
    d = new Date();
    date['day'] = d.getDate();
    date['month'] = d.getMonth();
    date['year'] = d.getFullYear();
  } else {
    d = new Date().toLocaleDateString('fa-IR');
    let e = '۰'.charCodeAt(0);
    d = d.replace(/[۰-۹]/g, function (t) {
      return t.charCodeAt(0) - e;
    });
    date['day'] = parseInt(d.split('/')[2]);
    date['month'] = parseInt(d.split('/')[1]);
    date['year'] = parseInt(d.split('/')[0]);
  }

  let fDay,
    fMonth = 0,
    tMonth = 0,
    fYear = 0;
  if (langFa) tMonth = typeof month == 'string' ? faMonth.indexOf(month) + 2 : month;
  else tMonth = typeof month == 'string' ? enMonth.indexOf(month) + 1 : month;

  if (day >= date['day']) {
    fDay = 30 - day + date['day'];
    fMonth--;
  } else {
    fDay = date['day'] - day;
  }

  console.log(fMonth, tMonth, month);

  if (tMonth <= date['month']) {
    fMonth += date['month'] + 1 - tMonth;
  } else {
    fMonth += 12 - tMonth + date['month'] + 1;
    fYear--;
  }
  fYear += date['year'] - year;

  if (fDay == 30) {
    fMonth++;
    fDay = 0;
    console.log(fMonth, tMonth, month);
  }

  if (fMonth == 12) {
    fYear++;
    fMonth = 0;
  }

  pDay.textContent = String(fYear).padStart(2, '0');
  pMonth.textContent = String(fMonth).padStart(2, '0');
  pYear.textContent = String(fDay).padStart(2, '0');

  calculateRemain(resultArray['month'], resultArray['day']);
}

function reset() {
  resultArray['year'] = null;
  resultArray['month'] = null;
  resultArray['day'] = null;
  if (langFa)
    pTitle.innerHTML = `تاریخ تولدت رو به فرمت زیر بگو <br/> <span style='color:var(--danger-color)'>روز/ماه شمسی/سال</span>`;
  else
    pTitle.innerHTML = `Say your birthday with below format <br/> <span style='color:var(--danger-color)'>Year/Gregorian Month/Day</span>`;
  pTitle.style.textAlign = 'left';

  speakeControl = true;
  pYear.textContent = `  `;
  pMonth.textContent = `  `;
  pDay.textContent = `  `;
  pRemain.style.opacity = 0;

  helpText.style.color = 'var(--danger-color)';
  helpText.style.opacity = 1;
  helpText.textContent = '';
}

function popUp(message) {
  popUpFull.style.top = '0';
  puMessage.textContent = message;

  if (langFa) btnClosePu.textContent = 'باشه';
  else btnClosePu.textContent = 'Ok';

  btnClosePu.addEventListener('click', () => {
    popUpFull.style.top = '-150%';
  });
}
