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
  if (langFa) farsiVersion(text);
  else englishVersion(text);
});

recognition.addEventListener('end', () => {
  if (speakeControl) recognition.start();
});

btnStart.addEventListener('click', () => {
  btnStart.style.opacity = 0;
  speaking = true;
  reset();
  recognition.start();
});

function farsiVersion(text) {
  // Convert Numbers To EnglishNumber
  let e = '۰'.charCodeAt(0);
  text = text.replace(/[۰-۹]/g, function (t) {
    return t.charCodeAt(0) - e;
  });

  let tArray = text.split(' ');

  faMonth.forEach((e) => {
    tArray.forEach((t) => {
      if (e == t) {
        resultArray['month'] = e;
      }
    });
  });

  tArray.forEach((e) => {
    e = parseInt(e);
    if (typeof e == 'number') {
      let t = String(e).padStart(4, '*');
      console.log(t);
      if (e)
        if (t.includes('*')) resultArray['day'] = e;
        else resultArray['year'] = e;
    }
  });

  if (!resultArray['day']) {
    helpText.textContent = 'تکمیل نشده : روز';
    if (!resultArray['month']) helpText.textContent += ' ماه';
    if (!resultArray['year']) helpText.textContent += ' سال';
  } else {
    helpText.textContent = 'تکمیل نشده : ';
    if (!resultArray['month']) helpText.textContent += ' ماه';
    if (!resultArray['year']) helpText.textContent += ' سال';
  }

  if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
    pTitle.textContent = "اگه این اطلاعات درسته بگو 'اوکی' در غیر اینصورت دوباره بگو";
    helpText.style.color = 'var(--secondary-color)';
    helpText.textContent = `${resultArray['day']}/${resultArray['month']}/${resultArray['year']}`;
  }

  if (text.includes('ok') || text.includes('okay') || text.includes('اوکی')) {
    // End Speak
    console.log(resultArray['year'], resultArray['month'], resultArray['day']);
    if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
      speaking = false;
      recognition.stop();
      speakeControl = false;
      calculateAge(resultArray['year'], resultArray['month'], resultArray['day']);
      helpText.style.opacity = 0;
      pTitle.textContent = 'سن شما';
      calculateRemain(resultArray['month'], resultArray['day']);
      btnStart.style.opacity = 1;
    } else pTitle.textContent = 'لطفا همه اطلاعات را بگو...';
  }
}

function englishVersion(text) {
  if (text.includes('year')) resultArray['year'] = text.split(' ')[0];
  if (text.includes('month')) resultArray['month'] = text.split(' ')[0];
  if (text.includes('day')) resultArray['day'] = text.split(' ')[0];

  if (!resultArray['day']) {
    helpText.textContent = 'Missing : Day';
    if (!resultArray['month']) helpText.textContent += ' Month';
    if (!resultArray['year']) helpText.textContent += ' Year';
  } else {
    helpText.textContent = 'Missing : ';
    if (!resultArray['month']) helpText.textContent += ' Month';
    if (!resultArray['year']) helpText.textContent += ' Year';
  }

  if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
    pTitle.textContent = "If this information is right say 'OK' otherwise say it again";
    helpText.style.color = '#676767';
    helpText.textContent = `${resultArray['year']}/${resultArray['month']}/${resultArray['day']}`;
  }

  if (text.includes('ok') || text.includes('okay') || text.includes('yes')) {
    // End Speak
    if (resultArray['year'] && resultArray['month'] && resultArray['day']) {
      speaking = false;
      recognition.stop();
      speakeControl = false;
      calculateAge(resultArray['year'], resultArray['month'], resultArray['day']);
      helpText.style.opacity = 0;
      pTitle.textContent = 'Your Age';
      calculateRemain(resultArray['month'], resultArray['day']);
      btnStart.style.opacity = 1;
    } else pTitle.textContent = 'Please Say Full Information';
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
    pTitle.innerHTML = `تاریخ تولدت رو به صورت <span style='color:var(--danger-color)'>روز/ماه/سال</span> بگو`;
  else
    pTitle.innerHTML = `After the birthday, say : <span style='color:var(--danger-color)'>Day</span> </br>
    After the month of birth, say : <span style='color:var(--danger-color)'>Month</span> </br>
    After the year of birth, say : <span style='color:var(--danger-color)'>Year</span>
  `;
  pTitle.style.textAlign = 'left';

  speakeControl = true;
  pYear.textContent = '00';
  pMonth.textContent = '00';
  pDay.textContent = '00';
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
