function saveOptions() {
    let cibusBudget = document.getElementById('cibusBudget').value;
    let actualBudget = document.getElementById('actualBudget').value;
    let weekendArr = Array.from(document.getElementsByName('weekend'));
    let weekendDays = weekendArr.filter(cb => cb.checked).map(cb => parseInt(cb.value));

    let optionsObj = {
        cibusBudget: cibusBudget,
        actualBudget: actualBudget,
        weekend: weekendDays,
        holidays: holidays
    };

    console.log(optionsObj);

    chrome.storage.sync.set(optionsObj, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

function restoreOptions() {
    chrome.storage.sync.get(["cibusBudget", "actualBudget", "weekend", "holidays"], function (items) {
        console.log(items);
        document.getElementById('cibusBudget').value = items.cibusBudget;
        document.getElementById('actualBudget').value = items.actualBudget;
        
        let holidaysUl = document.getElementById('holidays');
        for (h of items.holidays) {
            let holidayDate = new Date(h);

            let now = new Date();
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (holidayDate < today) {
                continue;
            }

            let holiday = createHolidayElement(holidayDate);
            holidaysUl.appendChild(holiday);
            holidays.push(h);
        }
    
        let weekendArr = Array.from(document.getElementsByName('weekend'));
        for (day of weekendArr) {
            day.checked = items.weekend.includes(parseInt(day.value));
        }
    });
}

function addHoliday() {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let holidayToAdd = document.getElementById('addHolidayDate');
    let holidayDate = new Date(holidayToAdd.value);

    if (holidayDate < today) {
        return;
    }

    let holiday = createHolidayElement(holidayDate);
    let holidaysUl = document.getElementById('holidays');
    holidaysUl.appendChild(holiday);
    holidays.push(holidayDate.getTime());
    console.log(holidays);
}

function createHolidayElement(date) {
    var li = document.createElement("li");
    var xBtn = document.createElement("button");
    xBtn.value = date.getTime();
    xBtn.innerHTML = "X";
    xBtn.addEventListener('click', removeHoliday);
    li.appendChild(document.createTextNode(date.toDateString()));
    li.appendChild(xBtn);
    li.id = "holiday-" + date.getTime();
    return li;
}

function removeHoliday() {
    console.log(this);
    let holidayToRemove = this.value;
    let index = holidays.indexOf(holidayToRemove);
    holidays.splice(index, 1);
    document.getElementById('holiday-' + holidayToRemove).remove();
}

const holidays = [];
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('addHolidayBtn').addEventListener('click', addHoliday);