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
    "skewSlider": 1,
    "tickSlider": 200,
    "particleSlider": 150,
    "colorSelector1": '#ffffff'
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
const defaultWool = { }

const applyButton = document.getElementById('applyButton');
const resetButton = document.getElementById('resetButton');
// const testButton = document.getElementById('testButton'); // can't use a test button without giving the extension access to every webpage

let selectedProfile = null;
let profiles = {};

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
        chrome.storage.sync.get('profiles', function(data) { 
            profiles = data.profiles || { };
        
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

            // Save the profile to the profiles object
            profiles[selectedProfile] = profile;

            // Save the profiles object to chrome storage
            chrome.storage.sync.set({profiles: profiles}, function() {
                console.log('Profiles saved');
            });

            // tell confetti.js which profile to use
            chrome.storage.sync.set({selectedProfile: selectedProfile}, function() {
                console.log('Selected profile is set to ' + selectedProfile);
            });
        });
    }); 

    resetButton.addEventListener('click', (event) => {
        console.log("reset button pressed");
        const switches = document.querySelectorAll('[role="switch"]:not(#checkOffSwitch)');
        switches.forEach(function(mySwitch) {
            if (mySwitch.checked) {
                console.log("the switch being reset: ", mySwitch.id);
                switch(mySwitch.id) {
                    case "confettiSwitch":
                        updateInputs(defaultVals, "confettiSwitch", "checkOffSwitch");
                        break;
                    case "woolSwitch":
                        // updateInputs(defaultVals, "woolSwitch", "checkOffSwitch");
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
    // Get the profiles object
    chrome.storage.sync.get('profiles', function(data) {
        profiles = data.profiles;
        if (profiles) {
            console.log('profiles:', profiles);
            callback(profiles[profileName]);
        } else {
            callback(null);
        }
    }); 
}


// this also resets the other switches
function updateInputs(settings, targetSwitch, checkOffSwitch) {
    // show switch states
    const switches = document.querySelectorAll(`[role="switch"]:not(#${checkOffSwitch}):not(#${targetSwitch})`);
    switches.forEach(function(mySwitch) {
        console.log("switch.id:", mySwitch.id);
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
        console.log('%csettings[colorInput.id]' + settings[colorInput.id], 'color: green; font-weight: bold;');
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
    if (colorSelectorIds.length > 1) {
        colorContainer.className = "d-flex justify-content-between ms-4 me-4";
    } else {
        colorContainer.className = "d-flex justify-content-center";
    }
    

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



function addSwitchEventListeners() {
    const snowSwitch = document.getElementById('snowSwitch');
    const fireworkSwitch = document.getElementById('fireworkSwitch');
    const woolSwitch = document.getElementById('woolSwitch');
    const confettiSwitch = document.getElementById('confettiSwitch');
    const colorSelectorIds = ["colorSelector1", "colorSelector2", "colorSelector3"];

    snowSwitch.addEventListener('change', (event) => {
        const parentId = "snowOptions";
        if(event.target.checked) {
            // createSliders(parentId, "Ticks", "tickSlider", 0, 500, 10);
            createSliders(parentId, "Duration", "timeSlider", 1, 30, 1);
            
            createColorInputs(parentId, "Snow Colors", ["colorSelector1"]);
            selectedProfile = "snow";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultSnow, "snowSwitch", "checkOffSwitch");
            });
            // updateInputs(defaultSnow, "snowSwitch", "checkOffSwitch");
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
            // updateInputs(defaultFireworks, "fireworkSwitch", "checkOffSwitch");
        } else { deleteSwitchSettings(parentId) };
    });

    woolSwitch.addEventListener('change', (event) => {
        const parentId = "woolOptions";
        if(event.target.checked) {
            // createSliders(parentId, "Particle Count", "particleSlider", 10, 500, 10);
            // createSliders(parentId, "Angle", "angleSlider", 0, 180, 5);
            // createSliders(parentId, "Spread", "spreadSlider", 10, 360, 10);
            // createSliders(parentId, "Initial Velocity", "velocitySlider", 10, 100, 5);
            // createSliders(parentId, "Decay", "decaySlider", .2, 2, .1);
            // createSliders(parentId, "Gravity", "gravitySlider", .1, 3, .1);
            // createSliders(parentId, "Wind", "driftSlider", 0, 20, 1);
            // createSliders(parentId, "Ticks", "tickSlider", 0, 500, 10);
            // createSliders(parentId, "Particle Size", "particleSizeSlider", .2, 5, .1);
            // createSliders(parentId, "Random Bursts", "burstSlider", 0, 20, 1);
            // createSliders(parentId, "Duration", "timeSlider", 1, 30, 1);

            // createColorInputs(parentId, "Spark Colors", colorSelectorIds);
            selectedProfile = "steelWool";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultWool, "woolSwitch", "checkOffSwitch");
            });
            // updateInputs(defaultWool, "woolSwitch", "checkOffSwitch");
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
            createSliders(parentId, "Gravity", "gravitySlider", .1, 3, .1);
            createSliders(parentId, "Wind", "driftSlider", 0, 20, 1);
            // createSliders(parentId, "Ticks", "tickSlider", 0, 500, 10);
            createSliders(parentId, "Particle Size", "particleSizeSlider", .2, 5, .1);
            createSliders(parentId, "Random Bursts", "burstSlider", 0, 20, 1);

            // createColorInputs(parentId, labelText, colorSelectorIds)
            createColorInputs(parentId, "Confetti Colors", colorSelectorIds);
            selectedProfile = "confetti";
            getSavedSettings(selectedProfile, function(profileSettings) {
                updateInputs(profileSettings || defaultVals, "confettiSwitch", "checkOffSwitch");
            });
            // updateInputs(defaultVals, "confettiSwitch", "checkOffSwitch");
        } else { deleteSwitchSettings(parentId) };
    });
}



// show when sliders are disabled

// function enableSliders(isChecked) {
//     var sliders = document.getElementsByClassName('form-range');
//     for (var i = 0; i < sliders.length; i++) {
//         sliders[i].disabled = !isChecked;
//     }
// }