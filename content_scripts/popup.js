const defaultVals = {
    "particleSlider": 150,
    "angleSlider": 90,
    "spreadSlider": 270,
    "velocitySlider": 45,
    "decaySlider": 0.9,
    "gravitySlider": 1,
    "driftSlider": 0,
    "tickSlider": 200,
    "particleSizeSlider": 1,
    "burstSlider": 5,
    "colorSelector1": "#ff0000",
    "colorSelector2": "#0000ff",
    "colorSelector3": "#00ff00"
}

// switches
// const checkOffSwitch = document.getElementById('checkOffSwitch');
// const shortcutSwitch = document.getElementById('shortcutSwitch');
// const customConfettiSwitch = document.getElementById('customConfettiSwitch');

// buttons
const applyButton = document.getElementById('applyButton');
const resetButton = document.getElementById('resetButton');
// const testButton = document.getElementById('testButton'); 
// can't use a test button without giving the extension access to every webpage

window.onload = function() {
    // Get the selected profile name
    chrome.storage.sync.get('selectedProfile', function(data) {
        let selectedProfile = data.selectedProfile;

        // If selectedProfile doesn't exist, use defaultVals
        if (!selectedProfile) {
            getSavedSettings(defaultVals);
        } else {
            // Get the profiles object
            chrome.storage.sync.get('profiles', function(data) {
                let profiles = data.profiles;
                let profileSettings = profiles[selectedProfile];
                getSavedSettings(profileSettings);
            });
        }
    });
}

function getSavedSettings(settings) {
    // real time range sliders
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        var label = document.getElementById(slider.id + 'Value');
        slider.oninput = function() {
            label.textContent = this.value;
        }
        slider.dispatchEvent(new Event('input'));
        slider.value = settings[slider.id] || defaultVals[slider.id] || 0;
    });

    // show switch states
    var switches = document.querySelectorAll('[role="switch"]');
    switches.forEach(function(mySwitch) {
        mySwitch.checked = settings[mySwitch.id] || false;
    });

    // show color input states
    var colorInputs = document.querySelectorAll('.form-control-color');
    colorInputs.forEach(function(colorInput) {
        colorInput.value = settings[colorInput.id] || defaultVals[colorInput.id] || '#808080';
    });
};


// profiles are so poeple can adjust the defaults and save their work
var profiles = {}; // all profiles

applyButton.addEventListener('click', (event) => {
    var profile = {}; // current profile settings

    // switches
    var switches = document.querySelectorAll('[role="switch"]');
    switches.forEach(function(mySwitch) {
        profile[mySwitch.id] = mySwitch.checked;
    });

    // sliders
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        var sliderValue = document.getElementById(slider.id + 'Value').textContent;
        profile[slider.id] = sliderValue;
    });

    // color inputs
    var colorInputs = document.querySelectorAll('.form-control-color');
    colorInputs.forEach(function(colorInput) {
        profile[colorInput.id] = colorInput.value;
    });

    // Save the profile to the profiles object
    var profileName = "confetti"; // Replace with dynamic profile name
    profiles[profileName] = profile;

    // Save the profiles object to chrome storage
    chrome.storage.sync.set({profiles: profiles}, function() {
        console.log('Profiles saved');
    });

    // tell confetti.js which profile to use
    chrome.storage.sync.set({selectedProfile: profileName}, function() {
        console.log('Selected profile is set to ' + profileName);
    });
});



// profiles:
// snow
// fireworks
// wool
// confetti





// show when sliders are disabled

// function enableSliders(isChecked) {
//     var sliders = document.getElementsByClassName('form-range');
//     for (var i = 0; i < sliders.length; i++) {
//         sliders[i].disabled = !isChecked;
//     }
// }