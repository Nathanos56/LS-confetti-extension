
// toDo:
// add css animations in the popup
// make steel wool follow the mouse


import confetti from 'canvas-confetti';

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function initialConfetti(profileSettings) {   
    const color1 = profileSettings['colorSelector1'] || '#f00';
    const color2 = profileSettings['colorSelector2'] || '#00f';
    const color3 = profileSettings['colorSelector3'] || '#0f0';
    // Default values are commented
    const settings = {
        particleCount: profileSettings['particleSlider'] || 150,  // 50
        angle: profileSettings['angleSlider'] || 90,              // 90
        spread: profileSettings['spreadSlider'] || 270,           // 45
        startVelocity: profileSettings['velocitySlider'] || 45,   // 45
        decay: profileSettings['decaySlider'] || 0.9,             // .9
        gravity: profileSettings['gravitySlider'] || 1,           // 1
        drift: profileSettings['driftSlider'] || 0,               // 0
        flat: false,                                              // false
        ticks: profileSettings['tickSlider'] || 200,              // 200   how many times the confetti will move
        //origin: object,
        scalar: profileSettings['particleSizeSlider'] || 1,       // 1      size of particles
        colors: [ color1, color2, color3 ], // Adjust the confetti colors
    };
    confetti(settings);

    randomConfetti(profileSettings['burstSlider'] || 5, color1, color2, color3);
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

async function steelWool(profileSettings) {
    const degreeToRadian = Math.PI / 180;
    const twoPI = Math.PI * 2;
    const radianToDegree = 1 / degreeToRadian;
    const originalStep = 10; //100
    const myDecay = .97;

    const revolutions = profileSettings['revolutionsSlider'] || 15;
    const r = profileSettings['radiusSlider'] || 100; // px
    const accuracy = profileSettings['accuracySlider'] || 360;
    const size = profileSettings['particleSizeSlider'] || .75
    const wind = profileSettings['driftSlider'] || 0;
    const gravity = profileSettings['gravitySlider'] || 1;
    const velocity = profileSettings['velocitySlider'] || 75
    const color1 = profileSettings['colorSelector1'] || '#ffff00';
    const color2 = profileSettings['colorSelector2'] || '#ffff00';
    const color3 = profileSettings['colorSelector3'] || '#ffff00';
    
    const dTheta = ( 360 / accuracy ) * degreeToRadian;
    const duration = revolutions * accuracy;

    let settings = { 
        velocity: velocity,
        gravity: gravity,
        decay: .97,
        scalar: size,
        spread:  profileSettings['spreadSlider'] || 10,
        angle: 0,
        ticks:  profileSettings['tickSlider'] || 90,
        zIndex: 100,
        drift: wind,
        colors: [ color1, color2, color3 ],
        particleCount: profileSettings['particleSlider'] || 1, 
        origin: { x: 0, y: 0 }
    };

    function easeInQuad(t) { return t * t };
    function easeInCube(t) { return t * t * t };

    // do all the calculations before the animation starts
    let angleValues = new Array(duration);
    let originXValues = new Array(duration);
    let originYValues = new Array(duration);
    let stepValues = new Array(duration);
    let decayValues = new Array(duration);
    let zIndexValues = new Array(duration);
    let scalarValues = new Array(duration);
    let driftValues = new Array(duration);
    let gravityValues = new Array(duration);
    let velocityValues = new Array(duration);
    for ( let i = 0; i < duration; i++ ) {
        const theta = ( i * dTheta ) % twoPI;
        angleValues[i] = ( -theta * radianToDegree ) - 90;
        // polar to cartesian: x = r * cos(theta) , y = r * sin(theta) | a circle in polar coordinates can be drawn by changing theta
        // divide by width and height to turn it into a percent between 0 and 1 then add .5 to center on screen
        originXValues[i] = ( ( r * Math.cos(theta) ) / window.innerWidth ) + .5;
        originYValues[i] = ( ( r * Math.sin(theta) ) / window.innerHeight) + .5;
        const fadeOut = ( ( duration - i ) / duration );
        zIndexValues[i] = randomInRange(80, 150);
        scalarValues[i] = randomInRange(size * .7, size * 1.3);
        driftValues[i] = randomInRange(wind -1, wind + 1);
        gravityValues[i] = randomInRange(gravity * .9, gravity * 1.4);
        velocityValues[i] = randomInRange(velocity * .75, velocity * 1.5);
        // these accelerate the animation speed
        stepValues[i] = Math.min( originalStep *  easeInCube(1 / fadeOut), 1000 );
        const decayTemp = Math.min( myDecay * easeInQuad(1 / fadeOut) / 1.2, myDecay);
        decayValues[i] = randomInRange( decayTemp * .95, decayTemp * 1.15);
        
    }

    let count = 0;

    function frame() {
        for(let i = 0; i < stepValues[count]; ++i) {
            if (count >= duration) { return; }
            settings.angle = angleValues[count];
            settings.origin.x = originXValues[count];
            settings.origin.y = originYValues[count];
            settings.decay = decayValues[count];
            settings.colors.push(settings.colors.shift());
            settings.zIndex = zIndexValues[count];
            settings.scalar = scalarValues[count];
            settings.drift = driftValues[count];
            settings.gravity = gravityValues[count];
            settings.velocity = velocityValues[count];
            confetti(settings);
            ++count;
        }
        requestAnimationFrame(frame);
    }

    frame();
}


function fireworks(profileSettings) {
    const inputTime = profileSettings['timeSlider'] || 5;
    const MyparticleCount = profileSettings['particleSlider'] || 150;

    var duration = inputTime * 1000;
    var animationEnd = Date.now() + duration;

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        var settings = { velocity: profileSettings['velocitySlider'] || 30,
            spread: profileSettings['spreadSlider'] || 360,
            ticks: profileSettings['tickSlider'] || 60,
            zIndex: 0,
            colors: [profileSettings['colorSelector1'] || '#f00', profileSettings['colorSelector2'] || '#00f', profileSettings['colorSelector3'] || '#0f0'],
            particleCount: MyparticleCount * (timeLeft / duration) //this fades out the fireworks
        };

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
    let duration = inputTime * 1000;
    let animationEnd = Date.now() + duration;
    let skew = 1;

    let settings = {
        particleCount: profileSettings['particleSlider'] || 1,
        startVelocity: profileSettings['velocitySlider'] || 0,
        ticks: 200,
        colors: [profileSettings['colorSelector1'] || '#ffffff', profileSettings['colorSelector2'] ||  '#ffffff', profileSettings['colorSelector3'] ||  '#ffffff'],
        shapes: ['circle'],
    }

    function frame() {
        const timeLeft = animationEnd - Date.now();
        skew = Math.max(0.8, skew - 0.001);

        settings.ticks = Math.max( 200, 500 * (timeLeft / duration) );
        settings.colors.push(settings.colors.shift());
        settings.gravity = randomInRange(0.4, 0.6);
        settings.scalar = randomInRange(0.4, 1);
        settings.drift = randomInRange(-0.4, 0.4);
        settings.origin = {
            x: Math.random(),
            y: (Math.random() * skew) - 0.2 // since particles fall down, skew start toward the top
        };

        confetti(settings);

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    };
    frame();
}






// splitting this into its own function lets the user test settings without refreshing the page
function getSelectedProfile() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('selectedProfile', function(data) {
            resolve(data.selectedProfile || 'confetti');
        });
    });
}
function getSettings(selectedProfile) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(selectedProfile, function(data) {
            resolve(data[selectedProfile] || {}); //returns profileSettings
        });
    });
}

window.onload = async function() {
    // console.log('%cinside dom event listener', 'color: green; font-weight: bold;');
    const LSSubmit = '[data-v-625658].text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    const LSCheckOff = '[data-v--363100].float-right.ml-2.w-28.text-white.bg-primary-dark.hover\\:bg-primary-alt.p-px.font-metro.focus\\:outline-none.transition-colors.duration-150';
    
    let profileSettings;
    let selectedProfile;
    try {
        selectedProfile = await getSelectedProfile();
        profileSettings = await getSettings(selectedProfile);
    } catch (error) {
        console.error('An error occurred with getSettings:', error);
    }

    const checkOffEnabled = profileSettings["checkOffSwitch"] || false;

    const handleClick = async (event) => {
        switch(selectedProfile) { // no need for default
            case "confetti":
                initialConfetti(profileSettings);
                break;
            case "steelWool":
                steelWool(profileSettings);
                break;
            case "fireworks":
                fireworks(profileSettings);
                break;
            case "snow":
                snow(profileSettings);
                break;
        }
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

    attachClickListener(); //initial attach

    // when the dom changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes' || mutation.type === 'characterData') {
                attachClickListener();
            }
        }
    });
  
    observer.observe(document.body, { childList: true, attributes: true, characterData: true, subtree: true });
};