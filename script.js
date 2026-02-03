// データの初期化
let books = JSON.parse(localStorage.getItem("color-log-v4")) || [];
let selectedImageData = null;

// HTMLの読み込みが完了してから実行
document.addEventListener('DOMContentLoaded', () => {
    render();
});

// 画像プレビュー（グローバルスコープに配置）
window.previewImage = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            selectedImageData = e.target.result;
            const previewDisplay = document.getElementById("preview-display");
            if (previewDisplay) {
                previewDisplay.innerHTML = `<img src="${selectedImageData}" class="preview-image">`;
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 本の追加
window.addBook = function() {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const memoInput = document.getElementById("memo");
    const emoInput = document.querySelector('input[name="emo"]:checked');
    
    if (!titleInput || !titleInput.value) {
        alert("タイトルを入力してください");
        return;
    }

    books.push({
        id: Date.now(),
        title: titleInput.value,
        author: authorInput.value || "Unknown",
        memo: memoInput.value || "No memo recorded.",
        emotion: emoInput.value,
        emotionName: emoInput.getAttribute('data-name'),
        status: "unread",
        cover: selectedImageData
    });

    saveAndRender();

    // 入力リセット
    titleInput.value = "";
    authorInput.value = "";
    memoInput.value = "";
    selectedImageData = null;
    document.getElementById("preview-display").innerHTML = `<span class="icon">📸</span><p>Cover Image</p>`;
}

function render() {
    const shelf = document.getElementById("bookshelf");
    const countDisplay = document.getElementById("book-count");
    if (!shelf) return;

    shelf.innerHTML = "";
    countDisplay.innerText = `${books.length} items`;

    books.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = `book-card ${book.status}`;
        
        const coverContent = book.cover 
            ? `<img src="${book.cover}" class="book-cover-img">`
            : `<div class="no-cover" style="background:${book.emotion}">${book.title[0]}</div>`;

        card.innerHTML = `
            <div class="cover-wrapper" onclick="toggleStatus(${index})">
                ${coverContent}
                <div class="memo-overlay">${book.memo}</div>
            </div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-meta">
                <span class="status-tag">${getStatusText(book.status)}</span>
                <span class="vibe-tag" style="background:${book.emotion}">${book.emotionName}</span>
            </div>
            <button class="del-btn" onclick="deleteBook(${index})">✕</button>
        `;
        shelf.appendChild(card);
    });

    updateHeatmap();
}

window.toggleStatus = function(index) {
    const states = ["unread", "reading", "done"];
    books[index].status = states[(states.indexOf(books[index].status) + 1) % states.length];
    saveAndRender();
}

window.deleteBook = function(index) {
    if(confirm("このデータを削除しますか？")) {
        books.splice(index, 1);
        saveAndRender();
    }
}

function updateHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;
    
    heatmap.innerHTML = "";
    if (books.length === 0) return;

    const counts = books.reduce((acc, b) => { acc[b.emotion] = (acc[b.emotion] || 0) + 1; return acc; }, {});
    Object.entries(counts).forEach(([color, count]) => {
        const bar = document.createElement("div");
        bar.className = "heatmap-bar";
        bar.style.width = `${(count / books.length) * 100}%`;
        bar.style.backgroundColor = color;
        heatmap.appendChild(bar);
    });
}

function getStatusText(s) {
    const map = { unread: "TBR", reading: "READING", done: "DONE" };
    return map[s];
}

function saveAndRender() {
    localStorage.setItem("color-log-v4", JSON.stringify(books));
    render();
}
