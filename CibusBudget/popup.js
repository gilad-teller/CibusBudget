var cibusBudget = 2000;
var actualBudget = 900;
const weekend = [];
const holidays = [];

chrome.storage.sync.get(["cibusBudget", "actualBudget", "weekend", "holidays"], function (items) {
    console.log('Storage Items', items);
    cibusBudget = items.cibusBudget;
    actualBudget = items.actualBudget;
    
    for (h of items.holidays) {
        holidays.push(h);
    }

    for (w of items.weekend) {
        weekend.push(w);
    }
});

let budget = document.getElementById('budget');
let remainingDays = document.getElementById('remainingDays');
let budgetPerDay = document.getElementById('budgetPerDay');
let hasOrder = document.getElementById('hasOrder');
let skipDay = document.getElementById('skipDay');
skipDay.addEventListener('click', toggleSkipDay);

let remainingWorkdays = 0;
let myRemainingBudget = 0;
let isDaySkipped = false;

chrome.cookies.getAll({ domain: 'mysodexo.co.il' }, handleCookies);

function handleCookies(cookies) {
    console.log('cookies', cookies);
    remainingWorkdays = countRemainingWorkdays();
    let budgetBeforePurchaseCookie = cookies.find(c => c.name == "budget");
    let budgetCookie = cookies.find(c => c.name == "bdgt");
    let hasOrderCookie = cookies.find(c => c.name == "user_hasorders");
    console.log('budgetBeforePurchaseCookie', budgetBeforePurchaseCookie);
    console.log('budgetCookie', budgetCookie);
    console.log('hasOrderCookie', hasOrderCookie);
    
    if (budgetCookie) {
        myRemainingBudget = remainingBudget(budgetCookie.value);

        if (hasOrderCookie && hasOrderCookie.value === "1") {
            skipDay.parentElement.style.display = "none";
            remainingWorkdays = remainingWorkdays - 1;
            hasOrder.innerHTML = "&#127828; Order found &#127828;";
            let budgetDiff = 0;
            if (budgetBeforePurchaseCookie) {
                budgetDiff = budgetBeforePurchaseCookie.value - budgetCookie.value;
                if (budgetDiff > 0) {
                    hasOrder.innerHTML = `&#127828; Order pending - ${formatCurrency(budgetDiff)}`;
                }
            }
        }
        
        remainingDays.innerHTML = remainingWorkdays + ' days';
        budget.innerHTML = formatCurrency(myRemainingBudget);

        let perDay = myRemainingBudget / remainingWorkdays;
        budgetPerDay.innerHTML = formatCurrency(perDay);
    }
    else {
        console.log('No Cookie');
        budget.innerHTML = 'No cookie';
    }
}

function toggleSkipDay() {
    if (isDaySkipped) {
        remainingWorkdays++;
    } else {
        remainingWorkdays--;
    }
    let perDay = myRemainingBudget / remainingWorkdays;
    budgetPerDay.innerHTML = formatCurrency(perDay);
    remainingDays.innerHTML = remainingWorkdays + ' days';
    isDaySkipped = !isDaySkipped;
}

function remainingBudget(currentCibusRemaining) {
    let expended = cibusBudget - currentCibusRemaining;
    let myRemaining = actualBudget - expended;
    return myRemaining;
}

function getEndOfMonth(date) {
    let month = date.getMonth();
    let year = date.getFullYear();
    if (month === 11) {
        console.log('move year');
        return new Date(year + 1, 0, 1);
    }
    return new Date(year, month + 1, 1);
}

function countRemainingWorkdays() {
    let now = new Date();
    let today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    let lastimeZoneOffset = today.getTimezoneOffset();
    let endOfMonth = getEndOfMonth(today);
    let count = 0;
    for (let d = today; d < endOfMonth; d.setDate(d.getDate() + 1)) {
        let newTimezoneOffset = d.getTimezoneOffset();
        if (lastimeZoneOffset !== newTimezoneOffset) {
            let timeZoneChange = newTimezoneOffset - lastimeZoneOffset;
            let timeZoneChangeHours = timeZoneChange / 60;
            console.log('timeZoneChangeHours', timeZoneChangeHours);
            d.setHours(d.getHours() - timeZoneChangeHours);
        }
        lastimeZoneOffset = newTimezoneOffset;
        if (!weekend.includes(d.getDay()) && !holidays.includes(d.getTime())) {
            count++;
        }
    }
    return count;
}

function formatCurrency(value) {
    return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
}