setTimeout(() => {
    const discountMultiplier = getDiscount();
    if (!discountMultiplier) {
        return;
    }
    const priceElements = document.getElementsByClassName('card-footer');
    for (let e of priceElements) {
        addDiscountToElement(e, discountMultiplier);
    }
}, 5000);


function getDiscount() {
    const discountElement = document.getElementsByClassName('mat-tooltip-trigger size-16 white-pink')[0];
    console.log('discountElement', discountElement);
    if (!discountElement) {
        return false;
    }
    const innerText = discountElement.innerText;
    console.log('mat-tooltip-trigger size-16 white-pink.innerText', innerText);
    const discountNumberString = innerText.split(' ')[0].replaceAll(/%/g, '');
    const discountValue = parseFloat(discountNumberString);
    const discountMultiplier = (100 - discountValue) / 100;
    console.log('discountMultiplier', discountMultiplier);
    return discountMultiplier;
}

function addDiscountToElement(e, discountMultiplier) {
    let priceText = e.children[0].innerHTML;
    let priceNumberString = priceText.replaceAll(/\u20AA/g, "");
    let priceValue = parseFloat(priceNumberString);
    let discountPrice = priceValue * discountMultiplier;
    e.children[0].innerHTML = `<s>${priceText}</s> \u20AA${discountPrice.toFixed(2)}`;
}