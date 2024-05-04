import 'bootstrap/dist/css/bootstrap.min.css';
import './popup.css';
import 'bootstrap';

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

// buttons
const applyButton = document.getElementById('applyButton');
const resetButton = document.getElementById('resetButton');
// const testButton = document.getElementById('testButton'); // can't use a test button without giving the extension access to every webpage

// switches
const snowSwitch = document.getElementById('snowSwitch');
const fireworkSwitch = document.getElementById('fireworkSwitch');
const woolSwitch = document.getElementById('woolSwitch');
const confettiSwitch = document.getElementById('confettiSwitch');


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
        slider.value = settings[slider.id] || defaultVals[slider.id] || 0;
        slider.dispatchEvent(new Event('input'));
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


resetButton.addEventListener('click', (event) => {
    getSavedSettings(defaultVals)
});


// profiles:
// snow
// fireworks
// wool
// confetti


function createSliders(parentId, labelText, sliderId, min, max, step) {
    var parentElement = document.getElementById(parentId);

    var newDiv = document.createElement("div");
    newDiv.classname = "ms-5 me-5 mt-2";

    var labelContainer = document.createElement("div");

    var newLabel = document.createElement("label");
    newLabel.classname = "form-label";
    newLabel.htmlFor = sliderId;
    newLabel.textContent = labelText;

    var labelVal = document.createElement("label");
    labelVal.style.float = "right";
    labelVal.id = sliderId + "Value";

    labelContainer.appendChild(newLabel);
    labelContainer.appendChild(labelVal);

    var newInput = document.createElement("input");
    newInput.className = "form-range";
    newInput.type = "range";
    newInput.min = min;
    newInput.max = max;
    newInput.step = step;
    newInput.id = sliderId;

    newDiv.appendChild(labelContainer);
    newDiv.appendChild(newInput);

    parentElement.appendChild(newDiv);
};

function createColorInputs(parentId, labelText, colorSelectorIds) {
    var parentElement = document.getElementById(parentId);

    var newForm = document.createElement("form");
    var newLabel = document.createElement("label");
    newLabel.classname = "form-label";
    newLabel.htmlFor = colorSelectorIds[0];
    newLabel.textContent = labelText;

    newForm.appendChild(newLabel);

    var colorContainer = documetn.createElement("div");
    colorContainer.className = "d-flex justify-content-between ms-4 me-4";

    for (var i = 0; i < colorSelectorIds.length; ++i) {
        var newInput = document.createElement("input");
        newInput.className = "form-control form-control-color";
        newInput.type = "color";
        newInput.id = colorSelectorIds[i];
        colorContainer.appendChild(newInput);
    };

    newForm.appendChild(colorContainer);
    parentElement.appendChild(newForm);
};

// show when sliders are disabled

// function enableSliders(isChecked) {
//     var sliders = document.getElementsByClassName('form-range');
//     for (var i = 0; i < sliders.length; i++) {
//         sliders[i].disabled = !isChecked;
//     }
// }