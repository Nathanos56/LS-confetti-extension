import 'bootstrap/dist/css/bootstrap.min.css';
import './popup.css';
import 'bootstrap';

const defaultVals = {
    "confettiSwitch": true,
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
const defaultSnow = {
    "timeSlider": 5,
    "velocitySlider": 0,
    "particleSlider": 1,
    "colorSelector1": '#ffffff',
    "colorSelector2": '#ffffff',
    "colorSelector3": '#ffffff'
}
const defaultFireworks = {
    "timeSlider": 5,
    "particleSlider": 150,
    "velocitySlider": 30,
    "spreadSlider": 360,
    "tickSlider": 60,
    "colorSelector1": '#ff0000',
    "colorSelector2": '#0000ff',
    "colorSelector3": '#00ff00'
}
const defaultWool = {
    'revolutionsSlider': 15,
    'radiusSlider': 100,
    'accuracySlider': 360,
    'velocitySlider': 75,
    'gravitySlider': 1,
    'particleSizeSlider': .75,
    'particleSlider': 1,
    'spreadSlider': 10,
    'tickSlider': 90,
    'driftSlider': 0,
    'colorSelector1': '#ffff00',
    'colorSelector2': '#ffff00',
    'colorSelector3': '#ffff00'
}

const applyButton = document.getElementById('applyButton');
const resetButton = document.getElementById('resetButton');
// const testButton = document.getElementById('testButton'); // can't use a test button without giving the extension access to every webpage

let selectedProfile = null;

window.onload = function() {
    // Get the selected profile name
    chrome.storage.sync.get('selectedProfile', function(data) {
        selectedProfile = data.selectedProfile;
        if (selectedProfile) {
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings);
            });
        } else {
            selectedProfile = "confetti";
            updateInputs(defaultVals);
        }
    });

    addSwitchEventListeners();

    // profiles are so poeple can adjust the defaults and save their work
    applyButton.addEventListener('click', (event) => {
            let profile = {}; // current profile settings

            // switches
            const switches = document.querySelectorAll('[role="switch"]');
            switches.forEach(function(mySwitch) {
                profile[mySwitch.id] = mySwitch.checked;
            });

            // sliders
            const sliders = document.querySelectorAll('.form-range');
            sliders.forEach(function(slider) {
                var sliderValue = document.getElementById(slider.id + 'Value').textContent;
                profile[slider.id] = sliderValue;
            });

            // color inputs
            const colorInputs = document.querySelectorAll('.form-control-color');
            colorInputs.forEach(function(colorInput) {
                profile[colorInput.id] = colorInput.value;
            });

            // Save the profile object to chrome storage
            chrome.storage.sync.set({[selectedProfile]: profile}, function() {
                console.log('Profile saved');
            });

            // tell confetti.js which profile to use
            chrome.storage.sync.set({selectedProfile: selectedProfile}, function() {
                console.log('Selected profile is set to ' + selectedProfile);
            });
    }); 

    resetButton.addEventListener('click', (event) => {
        const switches = document.querySelectorAll('[role="switch"]:not(#checkOffSwitch)');
        switches.forEach(function(mySwitch) {
            if (mySwitch.checked) {
                switch(mySwitch.id) {
                    case "confettiSwitch":
                        updateInputs(defaultVals, "confettiSwitch", "checkOffSwitch");
                        break;
                    case "woolSwitch":
                        updateInputs(defaultWool, "woolSwitch", "checkOffSwitch");
                        break;
                    case "fireworkSwitch":
                        updateInputs(defaultFireworks, "fireworkSwitch", "checkOffSwitch");
                        break;
                    case "snowSwitch":
                        updateInputs(defaultSnow, "snowSwitch", "checkOffSwitch");
                        break;
                }
            }
        });
    });
}

function getSavedSettings(profileName, callback) {
    // Get the profile directly
    chrome.storage.sync.get(profileName, function(data) {
        let profile = data[profileName];
        if (profile) {
            callback(profile);
        } else {
            callback(null);
        }
    }); 
}

// this also resets the other switches
function updateInputs(settings, ignoreSwitch, checkOffSwitch) {
    // show switch states
    const switches = document.querySelectorAll(`[role="switch"]:not(#${checkOffSwitch}):not(#${ignoreSwitch})`);
    switches.forEach(function(mySwitch) {
        mySwitch.checked = settings[mySwitch.id] || false;
        mySwitch.dispatchEvent(new Event('change'));
    });

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

    // show color input states
    var colorInputs = document.querySelectorAll('.form-control-color');
    colorInputs.forEach(function(colorInput) {
        colorInput.value = (settings && settings[colorInput.id]) || defaultVals[colorInput.id] || '#808080';
    });
};




function createSliders(parentId, labelText, sliderId, min, max, step) {
    var parentElement = document.getElementById(parentId);

    var newDiv = document.createElement("div");
    newDiv.className = "ms-5 me-5 mt-2";

    var labelContainer = document.createElement("div");

    var newLabel = document.createElement("label");
    newLabel.className = "form-label";
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
    
    var newDiv = document.createElement('div');
    newDiv.className = "ms-5 me-5";
    newDiv.id = "colorOptions"

    var newForm = document.createElement("form");
    var newLabel = document.createElement("label");
    newLabel.className = "form-label";
    newLabel.htmlFor = colorSelectorIds[0];
    newLabel.textContent = labelText;

    newForm.appendChild(newLabel);

    var colorContainer = document.createElement("div");
    colorContainer.className = "d-flex justify-content-between ms-4 me-4";

    for (var i = 0; i < colorSelectorIds.length; ++i) {
        var newInput = document.createElement("input");
        newInput.className = "form-control form-control-color";
        newInput.type = "color";
        newInput.id = colorSelectorIds[i];
        colorContainer.appendChild(newInput);
    };

    newForm.appendChild(colorContainer);
    newDiv.appendChild(newForm);
    parentElement.appendChild(newDiv);
};

function deleteSwitchSettings(parentId) {
    const parent = document.getElementById(parentId);
    while (parent.firstChild) { parent.removeChild(parent.firstChild) }
}

// function addDisabledClass(ignoreId) {
//     const divs = document.querySelectorAll(`div[id$="options"]:not(#${ignoreId})`);
// }

function addSwitchEventListeners() {
    const snowSwitch = document.getElementById('snowSwitch');
    const fireworkSwitch = document.getElementById('fireworkSwitch');
    const woolSwitch = document.getElementById('woolSwitch');
    const confettiSwitch = document.getElementById('confettiSwitch');
    const colorSelectorIds = ["colorSelector1", "colorSelector2", "colorSelector3"];

    snowSwitch.addEventListener('change', (event) => {
        const parentId = "snowOptions";
        if(event.target.checked) {
            createSliders(parentId, "Particle Count", "particleSlider", 1, 10, 1);
            createSliders(parentId, "Initial Velocity", "velocitySlider", -10, 10, 1);
            createSliders(parentId, "Duration", "timeSlider", 1, 30, 1);
            
            createColorInputs(parentId, "Snow Colors", colorSelectorIds);
            selectedProfile = "snow";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultSnow, "snowSwitch", "checkOffSwitch");
            });
        } else { deleteSwitchSettings(parentId) };
    });

    fireworkSwitch.addEventListener('change', (event) => {
        const parentId = "fireworkOptions";
        if(event.target.checked) {
            createSliders(parentId, "Particle Count", "particleSlider", 10, 500, 10);
            createSliders(parentId, "Initial Velocity", "velocitySlider", 10, 100, 5);
            createSliders(parentId, "Spread", "spreadSlider", 10, 360, 10);
            // createSliders(parentId, "Ticks", "tickSlider", 0, 500, 10);
            createSliders(parentId, "Duration", "timeSlider", 1, 30, 1);

            createColorInputs(parentId, "Firework Colors", colorSelectorIds);
            selectedProfile = "fireworks";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultFireworks, "fireworkSwitch", "checkOffSwitch");
            });
        } else { deleteSwitchSettings(parentId) };
    });

    woolSwitch.addEventListener('change', (event) => {
        const parentId = "woolOptions";
        if(event.target.checked) {
            createSliders(parentId, "Particle Count", "particleSlider", 1, 10, 1);
            createSliders(parentId, "Spread", "spreadSlider", 0, 50, 5);
            createSliders(parentId, "Initial Velocity", "velocitySlider", 15, 150, 5);
            createSliders(parentId, "Gravity", "gravitySlider", -2, 2, .1);
            createSliders(parentId, "Wind", "driftSlider", -5, 5, .5);
            createSliders(parentId, "Ticks", "tickSlider", 20, 200, 10);
            createSliders(parentId, "Particle Size", "particleSizeSlider", .3, 2, .05);
            createSliders(parentId, "Revolutions", "revolutionsSlider", 4, 50, 1);
            createSliders(parentId, "Radius", "radiusSlider", 50, 500, 10);
            createSliders(parentId, "Accuracy", "accuracySlider", 50, 500, 10);

            createColorInputs(parentId, "Spark Colors", colorSelectorIds);
            selectedProfile = "steelWool";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultWool, "woolSwitch", "checkOffSwitch");
            });
        } else { deleteSwitchSettings(parentId) };
    });

    confettiSwitch.addEventListener('change', (event) => {
        const parentId = "confettiOptions";
        if(event.target.checked) {
            // createSliders(parentId, labelText, sliderId, min, max, step)
            createSliders(parentId, "Particle Count", "particleSlider", 10, 500, 10);
            createSliders(parentId, "Angle", "angleSlider", 0, 180, 5);
            createSliders(parentId, "Spread", "spreadSlider", 10, 360, 10);
            createSliders(parentId, "Initial Velocity", "velocitySlider", 10, 100, 5);
            createSliders(parentId, "Decay", "decaySlider", .2, 2, .1);
            createSliders(parentId, "Gravity", "gravitySlider", -2, 2, .1);
            createSliders(parentId, "Wind", "driftSlider", -5, 5, .5);
            // createSliders(parentId, "Ticks", "tickSlider", 0, 500, 10);
            createSliders(parentId, "Particle Size", "particleSizeSlider", .2, 5, .1);
            createSliders(parentId, "Random Bursts", "burstSlider", 0, 20, 1);

            createColorInputs(parentId, "Confetti Colors", colorSelectorIds);
            selectedProfile = "confetti";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultVals, "confettiSwitch", "checkOffSwitch");
            });
        } else { deleteSwitchSettings(parentId) };
    });
}



