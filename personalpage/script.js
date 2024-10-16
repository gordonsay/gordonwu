document.addEventListener('DOMContentLoaded', function() {
    loadFloatingTexts(); // 頁面加載時從本地儲存加載文字
});

document.getElementById('addButton').addEventListener('click', function() {
    const textInput = document.getElementById('textInput');
    const textValue = textInput.value.trim();
    
    if (textValue !== "") {
        addFloatingText(textValue);
        saveTextToLocalStorage(textValue);
        textInput.value = ""; // 清空輸入欄
    }
});

function addFloatingText(text) {
    const fishTank = document.querySelector('.fish-tank');
    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    
    // 設定初始隨機位置
    let topPosition = Math.random() * (fishTank.clientHeight - 30); // 隨機高度
    let leftPosition = Math.random() * (fishTank.clientWidth - 100); // 隨機寬度

    floatText.style.top = `${topPosition}px`;
    floatText.style.left = `${leftPosition}px`;
    
    const textNode = document.createTextNode(text);
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'x';
    
    removeBtn.addEventListener('click', function() {
        fishTank.removeChild(floatText);
        removeTextFromLocalStorage(text); // 移除本地儲存中的文字
    });
    
    floatText.appendChild(textNode);
    floatText.appendChild(removeBtn);
    fishTank.appendChild(floatText);
    
    // 隨機漂浮動畫，加入反彈效果
    moveFloatingText(floatText, topPosition, leftPosition);
}

function saveTextToLocalStorage(text) {
    let texts = JSON.parse(localStorage.getItem('floatingTexts')) || [];
    texts.push(text);
    localStorage.setItem('floatingTexts', JSON.stringify(texts)); // store to LocalStorage
}

function removeTextFromLocalStorage(text) {
    let texts = JSON.parse(localStorage.getItem('floatingTexts')) || [];
    texts = texts.filter(t => t !== text); // remove specified text in pool
    localStorage.setItem('floatingTexts', JSON.stringify(texts));
}

function loadFloatingTexts() {
    let texts = JSON.parse(localStorage.getItem('floatingTexts')) || [];
    texts.forEach(text => addFloatingText(text)); // load text from storage
}

function moveFloatingText(element, top, left) {
    const fishTank = document.querySelector('.fish-tank');
    
    // modify velocity
    let deltaX = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1); // X方向速度 (範圍：0.2~0.7)
    let deltaY = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1); // Y方向速度 (範圍：0.2~0.7)

    function updatePosition() {
        top += deltaY;
        left += deltaX;

        // check boundary
        if (top <= 0 || top >= fishTank.clientHeight - element.offsetHeight) {
            deltaY = -deltaY; // reverse y direction
        }
        if (left <= 0 || left >= fishTank.clientWidth - element.offsetWidth) {
            deltaX = -deltaX; // reverse x direction
        }

        element.style.top = `${top}px`;
        element.style.left = `${left}px`;

        requestAnimationFrame(updatePosition); // move countinue
    }

    requestAnimationFrame(updatePosition); // activate 
}

