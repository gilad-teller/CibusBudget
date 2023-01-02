const cibusBudget = 2000;
const myBudget = 900;
const weekend = [5, 6];
const ooo = [
    
];

let budget = document.getElementById('budget');
let remainingDays = document.getElementById('remainingDays');
let budgetPerDay = document.getElementById('budgetPerDay');

chrome.cookies.get({ url: 'https://www.mysodexo.co.il', name: 'budget' }, handleCookie);

function handleCookie(cookie) {
    let remainingWorkdays = countRemainingWorkdays();
    remainingDays.innerHTML = remainingWorkdays + ' days';
    
    if (cookie) {
        console.log(cookie);
        let myRemainingBudget = remainingBudget(cookie.value);
        budget.innerHTML = formatCurrency(myRemainingBudget);

        let perDay = myRemainingBudget / remainingWorkdays;
        budgetPerDay.innerHTML = formatCurrency(perDay);
    }
    else {
        console.log('No Cookie');
        budget.innerHTML = 'No cookie';
    }
}

function remainingBudget(currentCibusRemaining) {
    let expended = cibusBudget - currentCibusRemaining;
    let myRemaining = myBudget - expended;
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
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let endOfMonth = getEndOfMonth(today);
    let count = 0;
    for (let d = today; d < endOfMonth; d.setDate(d.getDate() + 1)) {
        if (!weekend.includes(d.getDay()) && !ooo.includes(d.getTime())) {
            count++;
        }
    }
    return count;
}

function formatCurrency(value) {
    return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
}