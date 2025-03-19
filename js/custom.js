// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 3.1;

// additional varibles for slides
const totalSlideAmount = 14;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

function controlFifthSlide() {
  $('.slide--5__block').on('click', function() {
    $(this).addClass('active');
    gsap.to($(this).find('p.title'), { opacity: 1, duration: 0.75, delay: 1, y: '0' });
    gsap.to($(this).find('p.text'), { opacity: 1, duration: 0.75, delay: 1.3, y: '0' });

    if ($('.slide--5__block.active').length > 2) {
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 2.5 * 1000);
    }
  });
}

function controlSixthSlide() {
  $('.slide--6__block .circle').on('click', function() {
    $(this).closest('.slide--6__block').addClass('animate');
    
    if ($('.slide--6__block.animate').length > 3) {
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 1.1 * 1000);
    }
  });
}

function customRangeController(selector) {
  let isDragging = false;
  let isShouldBeDragging = true;
  let rangeInput = $(`${selector} input`);
  let customThumb = $(`${selector} .custom-thumb`);
  let rangeMin = Number(rangeInput.attr("min"));
  let rangeMax = Number(rangeInput.attr("max"));

  function updateSlider(clientX) {
    let trackOffset = rangeInput.offset().left;
    let trackWidth = rangeInput.outerWidth();
    let newPosition = Math.min(Math.max(clientX - trackOffset, 0), trackWidth);
    let progress = (newPosition / trackWidth) * 100;
    let progressSpan = progress * 0.925;

    if (progressSpan >= 77.2486) {
      isShouldBeDragging = false;

      return;
    } else {
      isShouldBeDragging = true;
    }

    let value = Math.round((progress / 100) * (rangeMax - rangeMin) + rangeMin);

    rangeInput.val(value);
    customThumb.css("left", `${progressSpan}%`);
    rangeInput.css(
      "background",
      `linear-gradient(to right, #002222 ${progress}%, transparent ${progress}%)`
    );
  }

  function startDragging(event) {
    if (!isShouldBeDragging) {
      return;
    }

    isDragging = true;

    $(document).on("mousemove touchmove", function (event) {
      if (isDragging) {
        let clientX = event.clientX || event.touches?.[0]?.clientX;
        updateSlider(clientX);
      }
    })

    $(document).on("mouseup touchend", function () {
      isDragging = false;

      if (!isShouldBeDragging) {
        $('.slide--8').addClass('active');

        if ($('.slide--8')) {
          nextButtonTimeout = setTimeout(() => {
            $(nextSlideButton).removeClass(hiddenArrowClass);
            $(prevSlideButton).removeClass(hiddenArrowClass);
          }, 1.1 * 1000);
        }

        return
      }

      $(document).off("mousemove touchmove mouseup touchend");
    })
  }

  customThumb.on("mousedown touchstart", startDragging);
}

function offCustomRangeController() {
  $(document).off("mousemove touchmove mouseup touchend");
}

function controlThirteenthSlide() {
  $('.slide--13__left-block').on('click', function () {
    $(this).addClass('active');

    if ($('.slide--13__left-block.active').length === 3) {
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 1100);
    }
  });
}
// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--1__left-content', { opacity: 0, duration: 0.75, delay: 1, y: '-35%', x: '-35%' });
    gsap.from('.slide--1__right ul li.first', { opacity: 0, duration: 0.75, delay: 1.5, y: '35%', x: '35%' });
    gsap.from('.slide--1__right ul li.second', { opacity: 0, duration: 0.75, delay: 1.7, y: '35%', x: '35%' });
    gsap.from('.slide--1__right ul li.third', { opacity: 0, duration: 0.75, delay: 1.9, y: '35%', x: '35%' });
    gsap.from('.slide--1__right ul li.fourth', { opacity: 0, duration: 0.75, delay: 2.1, y: '35%', x: '35%' });
    nextArrowDelay = 3.1;
  },
  2: () => {
    animateNumber(1, '.slide--2__block.first .percent p span');
    gsap.from('.slide--2__block.first .description p', { opacity: 0, duration: 0.75, delay: 2.5, x: '35%' });
    animateNumber(3.15, '.slide--2__block.second .percent p span');
    gsap.from('.slide--2__block.second .description p', { opacity: 0, duration: 0.75, delay: 4.65, x: '35%' });
    gsap.from('.slide--2__block.third', { opacity: 0, duration: 0.75, delay: 5.55, x: '35%' });
    nextArrowDelay = 6.55;
  },
  3: () => {
    typewriterEffect('.sl3__right p.text', 6.5, 1);
    gsap.from('.sl3__right p.author', { opacity: 0, duration: 0.75, delay: 8.3, y: '50%' });
    nextArrowDelay = 9.3;
  },
  4: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--4__right-content', { opacity: 0, duration: 0.75, delay: 1, x: '35%' });
    nextArrowDelay = 2;
  },
  5: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    controlFifthSlide();
  },
  6: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    controlSixthSlide();
  },
  7: () => {
    $('.arrows').removeClass('to-top');
    $('.arrow--next').removeClass('arrow--white');
    offCustomRangeController();
    gsap.from('.slide--7__right-top', { opacity: 0, duration: 0.75, delay: 1, x: '35%' });
    gsap.from('.slide--7__right-bottom', { opacity: 0, duration: 0.75, delay: 1, x: '-35%' });
    nextArrowDelay = 2;
  },
  8: () => {
    $('.arrows').addClass('to-top');
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    customRangeController('.slide--8__input');
  },
  9: () => {
    $('.arrows').removeClass('to-top');
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    offCustomRangeController();
    gsap.from('.slide--9__right-content ul li.first', { opacity: 0, duration: 0.75, delay: 1, y: '45%', x: '20%' });
    gsap.from('.slide--9__right-content ul li.second', { opacity: 0, duration: 0.75, delay: 1.3, y: '45%', x: '20%' });
    gsap.from('.slide--9__right-content ul li.third', { opacity: 0, duration: 0.75, delay: 1.6, y: '45%', x: '20%' });
    nextArrowDelay = 2.6;
  },
  10: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    animateNumber(1, '.slide--10__block p.number span');
    nextArrowDelay = 4.2;
  },
  11: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--11__block.first', { opacity: 0, duration: 0.75, delay: 1, y: '-45%', x: '35%' });
    gsap.from('.slide--11__block.second', { opacity: 0, duration: 0.75, delay: 1.3, y: '-45%', x: '35%' });
    gsap.from('.slide--11__block.third', { opacity: 0, duration: 0.75, delay: 1.6, y: '-45%', x: '35%' });
    gsap.from('.slide--11__block.fourth', { opacity: 0, duration: 0.75, delay: 1.9, y: '-45%', x: '35%' });
    nextArrowDelay = 2.9;
  },
  12: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--12__block.first', { opacity: 0, duration: 0.75, delay: 1 });
    gsap.from('.slide--12__bottle.first', { opacity: 0, duration: 0.75, delay: 1.5, y: '-45%' });
    gsap.from('.slide--12__bottle.second', { opacity: 0, duration: 0.75, delay: 1.8, y: '-45%' });
    gsap.from('.slide--12__bottle.third', { opacity: 0, duration: 0.75, delay: 2.1, y: '-45%' });
    gsap.from('.slide--12__block.second', { opacity: 0, duration: 0.75, delay: 2.7 });
    gsap.from('.slide--12__bottle.fourth', { opacity: 0, duration: 0.75, delay: 3.2, y: '-45%' });
    gsap.from('.slide--12__bottle.fifth', { opacity: 0, duration: 0.75, delay: 3.5, y: '-45%' });
    gsap.from('.slide--12__bottle.sixth', { opacity: 0, duration: 0.75, delay: 3.8, y: '-45%' });
    nextArrowDelay = 4.8;
  },
  13: () => {
    clearTimeout(lastSlideActionTimeout);
    controlThirteenthSlide();
  },
  14: () => {
    gsap.from('.slide--14__right h2', { opacity: 0, duration: 0.75, delay: 1, y: '35%' });
    gsap.from('.slide--14__right h3', { opacity: 0, duration: 0.75, delay: 1.3, y: '35%' });
    nextArrowDelay = 3.9;
    lastSlideActionTimeout = setTimeout(() => {
      lastSlideAction();
    }, 7.5 * 1000);
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 5:
      break;
    case 6:
      break;
    case 8:
      break;
    case 13:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
