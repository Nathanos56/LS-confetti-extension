import confetti from 'canvas-confetti';

function initialConfetti(MyparticleCount, angle, spread, velocity, decay, gravity, drift, ticks, size, color1, color2, color3) {
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
        colors: [color1, color2, color3], // Adjust the confetti colors
    };
    confetti(testConfettiSettings);
}

function randomConfetti(burstNum, color1, color2, color3) {
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
            colors: [color1, color2, color3],
        });
        ++count;

        if (count >= numExplosions) {
            clearInterval(intervalId);
            resolve();
        }
        }, interval);
    });
}


window.onload = function() {
    // console.log('%cinside dom event listener', 'color: green; font-weight: bold;');
    const LSSubmit = '[data-v-625658].text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    const LSCheckOff = '[data-v--363100].float-right.ml-2.w-28.text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    
    let profileSettings = {};
    chrome.storage.sync.get('selectedProfile', function(data) {
        let selectedProfile = data.selectedProfile;

        // Get the profiles object
        chrome.storage.sync.get('profiles', function(data) {
            let profiles = data.profiles || {};
            profileSettings = profiles[selectedProfile] || {};
        });
    });
    let checkOffEnabled = profileSettings["checkOffSwitch"] || false; // Set default to false if not found
    console.log('Check Off Enabled: ', checkOffEnabled);
    attachClickListener(); //initial attach
    
  
    const handleClick = async (event) => {
        // console.log('%cbutton pressed', 'color: green; font-weight: bold;');
        const particleCount = profileSettings['particleSlider'] || 150;
        const angle = profileSettings['angleSlider'] || 90;
        const spread = profileSettings['spreadSlider'] || 270;
        const velocity = profileSettings['velocitySlider'] || 45;
        const decay = profileSettings['decaySlider'] || 0.9;
        const gravity = profileSettings['gravitySlider'] || 1;
        const drift = profileSettings['driftSlider'] || 0;
        const ticks = profileSettings['tickSlider'] || 200;
        const size = profileSettings['particleSizeSlider'] || 1;
        const burstNum = profileSettings['burstSlider'] || 5;
        const color1 = profileSettings['colorSelector1'] || '#f00';
        const color2 = profileSettings['colorSelector2'] || '#00f';
        const color3 = profileSettings['colorSelector3'] || '#0f0';

        initialConfetti(particleCount, angle, spread, velocity, decay, gravity, drift, ticks, size, color1, color2, color3);
        randomConfetti(burstNum, color1, color2, color3);
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