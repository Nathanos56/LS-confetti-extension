// switches
const checkOffSwitch = document.getElementById('checkOffSwitch');
// const shortcutSwitch = document.getElementById('shortcutSwitch');
const customConfettiSwitch = document.getElementById('customConfettiSwitch');

// buttons
const applyButton = document.getElementById('applyButton');
const testButton = document.getElementById('testButton');
const resetButton = document.getElementById('resetButton');

// Listen for switch toggle
checkOffSwitch.addEventListener('change', (event) => {
    // Save the state of the switch in storage
    chrome.storage.sync.set({checkOffEnabled: event.target.checked}, function() {
        console.log('Value is set to ' + event.target.checked);
    });
});

// real time range sliders
window.onload = function() {
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
        chrome.storage.sync.get(mySwitch.id, function(result) {
            mySwitch.checked = result[mySwitch.id] ? true : false;
        });
    });
}

// Save the state of all of the switches and sliders in storage
applyButton.addEventListener('click', (event) => {
    // switches
    var switches = document.querySelectorAll('[role="switch"]');
    switches.forEach(function(mySwitch) {
        chrome.storage.sync.set(mySwitch.id, mySwitch.checked);
    });
    // sliders
    var sliders = document.querySelectorAll('.form-range');
    sliders.forEach(function(slider) {
        chrome.storage.sync.set(slider.id, document.getElementById(slider.id + 'Value').textContent);
    });
});


// apply button
// chrome.storage.sync.set({label: this.value}, function() {
//     console.log('Value is set to ' + this.value);
// });