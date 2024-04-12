const checkOffSwitch = document.getElementById('checkOffSwitch');
const shortcutSwitch = document.getElementById('shortcutSwitch');
const customConfettiSwitch = document.getElementById('customConfettiSwitch');

// Listen for switch toggle
checkOffSwitch.querySelector('.switch input[type="checkbox"]').addEventListener('change', (event) => {
    // Save the state of the switch in storage
    chrome.storage.sync.set({secondButtonTypeEnabled: event.target.checked}, function() {
        console.log('Value is set to ' + event.target.checked);
    });
});