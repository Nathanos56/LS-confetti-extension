import confetti from 'canvas-confetti';

function initialConfetti(MyparticleCount, angle, spread, velocity, decay, gravity, drift, ticks, size) {
    // Default values are commented
    const testConfettiSettings = {
        particleCount: MyparticleCount,  // 50
        angle: angle,              // 90
        spread: spread,            // 45
        startVelocity: velocity,   // 45
        decay: decay,              // .9
        gravity: gravity,          // 1
        drift: drift,              // 0
        flat: false,               // false
        ticks: ticks,              // 200   how many times the confetti will move
        //origin: object,
        scalar: size,              // 1      size of particles
        colors: ['#f00', '#00f', '#0f0'], // Adjust the confetti colors
    };
    confetti(testConfettiSettings);
}

function randomConfetti(burstNum) {
    return new Promise((resolve) => {
        const interval = 200;
        const numExplosions = burstNum;
        let count = 0;

        let intervalId = setInterval(() => {
        confetti({
            particleCount: 50,
            spread: 360,
            startVelocity: 30,
            origin: {
            x: Math.random(),
            y: Math.random() - 0.2
            },
            scalar: .8,
            colors: ['#f00', '#00f', '#0f0'],
        });
        ++count;

        if (count >= numExplosions) {
            clearInterval(intervalId);
            resolve();
        }
        }, interval);
    });
}

function getStoredValue(id, predefined) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(id, (result) => {
            resolve(result[id] || predefined); // Set to default if not found
        });
    });
}

window.onload = function() {
    // console.log('%cinside dom event listener', 'color: green; font-weight: bold;');
    const LSSubmit = '[data-v-625658].text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    const LSCheckOff = '[data-v--363100].float-right.ml-2.w-28.text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    let checkOffEnabled = false;
    chrome.storage.sync.get('checkOffSwitch').then(result => {
        checkOffEnabled = result["checkOffSwitch"] || false; // Set default to false if not found
        console.log('Check Off Enabled: ', checkOffEnabled);
        attachClickListener(); //initial attach
    });
    // let color1 = '#f00';
    // let color2 = '#00f';
    // let color3 = '#0f0';
    
  
    const handleClick = async (event) => {
        // console.log('%cbutton pressed', 'color: green; font-weight: bold;');
        const particleCount = await getStoredValue('particleSlider', 150);
        const angle = await getStoredValue('angleSlider', 90);
        const spread = await getStoredValue('spreadSlider', 270);
        const velocity = await getStoredValue('velocitySlider', 45);
        const decay = await getStoredValue('decaySlider', 0.9);
        const gravity = await getStoredValue('gravitySlider', 1);
        const drift = await getStoredValue('driftSlider', 0);
        const ticks = await getStoredValue('tickSlider', 200);
        const size = await getStoredValue('particleSizeSlider', 1);
        const burstNum = await getStoredValue('burstSlider', 5);
        initialConfetti(particleCount, angle, spread, velocity, decay, gravity, drift, ticks, size);
        await randomConfetti(burstNum);
    };
  
    const attachClickListener = function() {
        let submitButtons = Array.from(document.querySelectorAll(LSSubmit));
        if (checkOffEnabled) { 
            let buttons = document.querySelectorAll(LSCheckOff);
            let checkOffButtons = Array.from(buttons).filter(button => {
                let childDivs = button.querySelectorAll('div');
                return Array.from(childDivs).some(div => div.textContent.includes('Check Off'));
            });
            submitButtons = submitButtons.concat(checkOffButtons);
        }
        submitButtons.forEach(function (submitButton) {
            if (!submitButton.hasClickListener) {
                submitButton.addEventListener('click', handleClick);
                submitButton.hasClickListener = true;
            }
        });
    };
  
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes' || mutation.type === 'characterData') {
                attachClickListener();
            }
        }
    });
  
    observer.observe(document.body, { childList: true, attributes: true, characterData: true, subtree: true });
  
    // console.log('%cjs file loaded', 'color: green; font-weight: bold;');
};





// this was a test for submit buttons on all websites:
// const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"], button[data-v-625658]');
// event.preventDefault();
// event.removeEventListener('click', handleClick);
// event.target.click(); // perform default button action
// event.addEventListener('click', handleClick);