import confetti from 'canvas-confetti';

function initialConfetti(profileSettings) {
    const MyparticleCount = profileSettings['particleSlider'] || 150;
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

    randomConfetti(burstNum, color1, color2, color3);
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

function steelWool(profileSettings) {

}

function fireworks(profileSettings) {
    const inputTime = profileSettings['timeSlider'] || 5;
    const MyparticleCount = profileSettings['particleSlider'] || 150;

    var duration = inputTime * 1000;
    var animationEnd = Date.now() + duration;
    var settings = { velocity: profileSettings['velocitySlider'] || 30,
        spread: profileSettings['spreadSlider'] || 360,
        ticks: profileSettings['tickSlider'] || 60,
        zIndex: 0,
        colors: [profileSettings['colorSelector1'] || '#f00', profileSettings['colorSelector2'] || '#00f', profileSettings['colorSelector3'] || '#0f0'],
        particleCount: MyparticleCount * (timeLeft / duration) //this fades out the fireworks
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        // since particles fall down, start a bit higher than random
        confetti({ ...settings, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...settings, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250); //250ms between launches
}

function snow(profileSettings) {
    const inputTime = profileSettings['timeSlider'] || 5;

    var duration = inputTime * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        var timeLeft = animationEnd - Date.now();
        var ticks = Math.max(profileSettings['tickSlider'] || 200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                y: (Math.random() * skew) - 0.2 // since particles fall down, skew start toward the top
            },
            colors: [profileSettings['colorSelector1'] || '#ffffff', profileSettings['colorSelector2'] ||  '#ffffff', profileSettings['colorSelector3'] ||  '#ffffff'],
            shapes: ['circle'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    }());
}



// future updates:
// add logic to pick which confetti function to call
// add css animations in the popup
// change default color of the color pickers in popup.js


window.onload = function() {
    // console.log('%cinside dom event listener', 'color: green; font-weight: bold;');
    const LSSubmit = '[data-v-625658].text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    const LSCheckOff = '[data-v--363100].float-right.ml-2.w-28.text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    
    let profileSettings = {};
    let checkOffEnabled = false;
    
  
    const handleClick = async (event) => {
        // console.log('%cbutton pressed', 'color: green; font-weight: bold;');
        chrome.storage.sync.get('selectedProfile', function(data) {
            let selectedProfile = data.selectedProfile;
    
            // Get the profiles object
            chrome.storage.sync.get('profiles', function(data) {
                let profiles = data.profiles || {};
                profileSettings = profiles[selectedProfile] || {};
    
                checkOffEnabled = profileSettings["checkOffSwitch"] || false; // Set default to false if not found
                console.log('Check Off Enabled: ', checkOffEnabled);
                attachClickListener(); //initial attach
            });
        });
        
        initialConfetti(profileSettings);
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