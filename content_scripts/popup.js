// switches
const checkOffSwitch = document.getElementById('checkOffSwitch');
// const shortcutSwitch = document.getElementById('shortcutSwitch');
const customConfettiSwitch = document.getElementById('customConfettiSwitch');

// buttons
const applyButton = document.getElementById('applyButton');
const testButton = document.getElementById('testButton');
const resetButton = document.getElementById('resetButton');

// Listen for switch toggle
// checkOffSwitch.addEventListener('change', (event) => {
//     // Save the state of the switch in storage
//     chrome.storage.sync.set({checkOffEnabled: event.target.checked}, function() {
//         console.log('Value is set to ' + event.target.checked);
//     });
// });


window.onload = function() {
    // real time range sliders
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        var label = document.getElementById(slider.id + 'Value');
        slider.oninput = function() {
            label.textContent = this.value;
        }
        slider.dispatchEvent(new Event('input'));
    });
    
    // show switch states
    var switches = document.querySelectorAll('[role="switch"]');
    switches.forEach(function(mySwitch) {
        chrome.storage.sync.get(mySwitch.id).then(result => {
            mySwitch.checked = result[mySwitch.id] || false; // Set default to false if not found
        });
    });
    
    // show slider states
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        chrome.storage.sync.get(slider.id).then(result => {
            slider.value = result[slider.id] || 0; // Set default to false if not found
            slider.dispatchEvent(new Event('input')); // Trigger the input event to update the label
        });
    });
}

// Save the state of all of the switches and sliders in storage
applyButton.addEventListener('click', (event) => {
    // switches
    var switches = document.querySelectorAll('[role="switch"]');
    switches.forEach(function(mySwitch) {
        chrome.storage.sync.set({[mySwitch.id]: mySwitch.checked}, function() {
            console.log(mySwitch.id + ' value is set to ' + mySwitch.checked);
        });
    });
    // sliders
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        var sliderValue = document.getElementById(slider.id + 'Value').textContent;
        chrome.storage.sync.set({[slider.id]: sliderValue}, function() {
            console.log(slider.id + ' value is set to ' + sliderValue);
        });
    });
});


// function enableSliders(isChecked) {
//     var sliders = document.getElementsByClassName('form-range');
//     for (var i = 0; i < sliders.length; i++) {
//         sliders[i].disabled = !isChecked;
//     }
// }