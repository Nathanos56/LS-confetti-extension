const checkOffSwitch = document.getElementById('checkOffSwitch');
const shortcutSwitch = document.getElementById('shortcutSwitch');
const customConfettiSwitch = document.getElementById('customConfettiSwitch');

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
}