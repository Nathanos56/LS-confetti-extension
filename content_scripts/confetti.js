import confetti from 'canvas-confetti';

function initialConfetti() {
    // Default values are commented
    const testConfettiSettings = {
        particleCount: 150,  // 50
        angle: 90,           // 90
        spread: 270,         // 45
        startVelocity: 45,   // 45
        decay: 0.9,          // .9
        gravity: 1,          // 1
        drift: 0,            // 0
        flat: false,         // false
        ticks: 200,          // 200   how many times the confetti will move
        //origin: object,
        scalar: 1,           // 1      size of particles
        colors: ['#f00', '#00f', '#0f0'], // Adjust the confetti colors
    };
    confetti(testConfettiSettings);
}

function randomConfetti() {
    return new Promise((resolve) => {
        const interval = 200;
        const numExplosions = 5;
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
        count++;

        if (count >= numExplosions) {
            clearInterval(intervalId);
            resolve();
        }
        }, interval);
    });
}

window.onload = function() {
    console.log('%cinside dom event listener', 'color: green; font-weight: bold;');
  
    const handleClick = async (event) => {
        console.log('%cbutton pressed', 'color: green; font-weight: bold;');
        // event.preventDefault();
        initialConfetti();
        await randomConfetti();
        // event.removeEventListener('click', handleClick);
        // event.target.click(); // perform default button action
        // event.addEventListener('click', handleClick);
    };
  
    const attachClickListener = function() {
        // const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"], button[data-v-625658]');
        const submitButtons = document.querySelectorAll('[data-v-625658].text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150');
        submitButtons.forEach(function (submitButton) {
            if (!submitButton.hasClickListener) {
                submitButton.addEventListener('click', handleClick);
                submitButton.hasClickListener = true;
            }
        });
    };
  
    attachClickListener(); // Initial attach
  
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                attachClickListener();
            }
        }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    console.log('%cjs file loaded', 'color: green; font-weight: bold;');
};





// Use chrome.storage API instead of localStorage
// chrome.storage.sync.set({ userName: nameField.value });

// data-v-625658
// data-v--363100