function saveOptions() {
    let weekendArr = Array.from(document.getElementsByName('weekend'));
    let weekendDays = weekendArr.filter(cb => cb.checked).map(cb => parseInt(cb.value));
    console.log(weekendDays);

    let holidayToAdd = document.getElementById('addHoliday');
    if (holidayToAdd.value) {
        console.log(new Date(holidayToAdd.value));
    }
    else {
        console.log('Nothing');
    }


    // chrome.storage.sync.set({
    //     favoriteColor: color,
    //     likesColor: likesColor
    // }, function () {
    //     // Update status to let user know options were saved.
    //     var status = document.getElementById('status');
    //     status.textContent = 'Options saved.';
    //     setTimeout(function () {
    //         status.textContent = '';
    //     }, 750);
    // });
}

document.getElementById('save').addEventListener('click', saveOptions);