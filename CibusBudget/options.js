function saveOptions() {
    const cibusBudget = document.getElementById('cibusBudget').value;
    const actualBudget = document.getElementById('actualBudget').value;
    const discountTimeout = document.getElementById('discountTimeout').value;
    const weekendArr = Array.from(document.getElementsByName('weekend'));
    const weekendDays = weekendArr.filter(cb => cb.checked).map(cb => parseInt(cb.value));

    const optionsObj = {
        cibusBudget: cibusBudget,
        actualBudget: actualBudget,
        discountTimeout: discountTimeout,
        weekend: weekendDays,
        holidays: holidays.sort()
    };

    console.log(optionsObj);

    chrome.storage.sync.set(optionsObj, function () {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

function restoreOptions() {
    chrome.storage.sync.get(["cibusBudget", "actualBudget", "discountTimeout", "weekend", "holidays"], function (items) {
        console.log(items);
        document.getElementById('cibusBudget').value = items.cibusBudget;
        document.getElementById('actualBudget').value = items.actualBudget;
        document.getElementById('discountTimeout').value = items.discountTimeout;
        
        const holidaysUl = document.getElementById('holidays');
        for (h of items.holidays.sort()) {
            const holidayDate = new Date(h);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (holidayDate < today) {
                continue;
            }

            const holiday = createHolidayElement(holidayDate);
            holidaysUl.appendChild(holiday);
            holidays.push(h);
        }
    
        const weekendArr = Array.from(document.getElementsByName('weekend'));
        for (day of weekendArr) {
            day.checked = items.weekend.includes(parseInt(day.value));
        }
    });
}

function addHoliday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const addHolidayDateStart = document.getElementById('addHolidayDateStart');
    const holidayDateStart = new Date(addHolidayDateStart.value);

    const addHolidayDateEnd = document.getElementById('addHolidayDateEnd');
    let holidayDateEnd = holidayDateStart;
    if (addHolidayDateEnd.value) {
        holidayDateEnd = new Date(addHolidayDateEnd.value);
    }
    

    if (holidayDateStart < today || holidayDateStart > holidayDateEnd) {
        return;
    }

    for (let d = new Date(holidayDateStart); d <= holidayDateEnd; d.setDate(d.getDate() + 1)) {
        const holidayToAdd = new Date(d);
        console.log('Adding holiday', holidayToAdd);
        const holiday = createHolidayElement(holidayToAdd);
        const holidaysUl = document.getElementById('holidays');
        holidaysUl.appendChild(holiday);
        holidays.push(holidayToAdd.getTime());
    }

    console.log(holidays);
}

function createHolidayElement(date) {
    const li = document.createElement("li");
    const xBtn = document.createElement("button");
    xBtn.value = date.getTime();
    xBtn.innerHTML = "X";
    xBtn.addEventListener('click', removeHoliday);
    xBtn.style.margin = "0 5px 0 0"
    li.appendChild(xBtn);
    li.appendChild(document.createTextNode(date.toLocaleDateString('en-GB')));
    li.id = "holiday-" + date.getTime();
    return li;
}

function removeHoliday() {
    console.log(this);
    const holidayToRemove = parseInt(this.value);
    const index = holidays.indexOf(holidayToRemove);
    if (index < 0) {
        throw new Exception("Unable to remove holiday");
    }
    holidays.splice(index, 1);
    document.getElementById('holiday-' + holidayToRemove).remove();
}

function updateEndDate() {
    const addHolidayDateStart = document.getElementById('addHolidayDateStart');
    const addHolidayDateEnd = document.getElementById('addHolidayDateEnd');
    if (!addHolidayDateEnd.value || addHolidayDateEnd.value < addHolidayDateStart.value) {
        addHolidayDateEnd.value = addHolidayDateStart.value;
    }
}

const holidays = [];
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('addHolidayBtn').addEventListener('click', addHoliday);
document.getElementById('addHolidayDateStart').addEventListener('change', updateEndDate);