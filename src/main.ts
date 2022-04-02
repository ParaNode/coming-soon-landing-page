import './style.css';


interface Step {
  timeStart: number;
  timeLimit: number;
  display: 'write' | 'blink' | 'delete',
  text: string;
}


const outlet = document.getElementById('outlet');


function init() {
  let prevTimeStamp = 0;
  
  function step(timestamp: number) {
    const delta = timestamp - prevTimeStamp;
    // hold for at least 50ms for each frame
    if (delta >= 50) {
      prevTimeStamp = timestamp
      // correct timestamp format to 1s instead of 1ms
      draw(timestamp / 1000);
    }
    window.requestAnimationFrame(step);
  }
  
  window.requestAnimationFrame(step);
}



const preArray = ['Web Development', 'tutorials', 'nodejs', 'and beyond'];
const paranode = 'ParaNode';
const soon = 'Coming Soon';
const cursorCharacters = [' ', '█'];
const normalPause = 2; // in seconds
const finalPause = 5; // in seconds
const writingSpeed = 10; // characters per second
const deletingSpeed = 15; // characters per second
const cursorSpeed = 4; // half-cycle per second
const startAt = 1; // in seconds


function setOutletText(newText: string) {
  if (outlet) {
    if(outlet.innerText != newText) {
      outlet.innerText = `${newText}`;

      if (newText.endsWith(cursorCharacters[1])) {
        outlet.classList.add('blinking');
      } else {
        outlet.classList.remove('blinking');
      }
    }
  }
}

function generateSteps() {
  let timeStart = 0;
  const stepsIn: Array<Step> = [{
    timeStart,
    timeLimit: timeStart += startAt,
    display: 'blink',
    text: ''
  }];

  for(const item of preArray) {
    stepsIn.push({
      timeStart,
      timeLimit: timeStart += (item.length / writingSpeed),
      display: 'write',
      text: item
    }, {
      timeStart,
      timeLimit: timeStart += normalPause,
      display: 'blink',
      text: item
    }, {
      timeStart,
      timeLimit: timeStart += (item.length / deletingSpeed),
      display: 'delete',
      text: item
    });
  }

  stepsIn.push({
    timeStart,
    timeLimit: timeStart += normalPause,
    display: 'blink',
    text: ''
  }, {
    timeStart,
    timeLimit: timeStart += (paranode.length / writingSpeed),
    display: 'write',
    text: paranode
  }, {
    timeStart,
    timeLimit: timeStart += finalPause,
    display: 'blink',
    text: paranode
  }, {
    timeStart,
    timeLimit: timeStart += (paranode.length / deletingSpeed),
    display: 'delete',
    text: paranode
  }, {
    timeStart,
    timeLimit: timeStart += (soon.length / writingSpeed),
    display: 'write',
    text: soon
  })

  return stepsIn;
}

const steps = generateSteps();

function getText(timestamp: number) {
  for(const step of steps) {
    if (step.timeStart <= timestamp && step.timeLimit >= timestamp) {
      const stepTotalTime = step.timeLimit - step.timeStart;
      const currentStepDelta = timestamp - step.timeStart;

      const mod = ((currentStepDelta / stepTotalTime) * step.text.length) % step.text.length

      switch(step.display) {
        case 'blink':
          return step.text + cursorCharacters[Math.round(cursorSpeed * timestamp) % 2];
        case 'write':
          const writePartial = step.text.slice(0, mod);
          return writePartial + cursorCharacters[1];
        case 'delete':
          const deletePartial = step.text.slice(0, step.text.length - mod);
          return deletePartial + cursorCharacters[1];
      }
    }
  }

  return soon + cursorCharacters[Math.round(cursorSpeed * timestamp) % 2];
}


function draw(timestamp: number) {
  const text = getText(timestamp)  
  
  setOutletText(text);
}



init();