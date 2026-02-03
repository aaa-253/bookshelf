let books = JSON.parse(localStorage.getItem("color-log-v4")) || [];
let selectedImageData = null;

document.addEventListener('DOMContentLoaded', () => {
    render();
});

window.previewImage = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            selectedImageData = e.target.result;
            document.getElementById("preview-display").innerHTML = `<img src="${selectedImageData}" class="preview-image">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

window.addBook = function() {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const memoInput = document.getElementById("memo");
    const emoInput = document.querySelector('input[name="emo"]:checked');
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    if (!titleInput || !titleInput.value) {
        alert("本のタイトルを入力してください");
        return;
    }

    const newBook = {
        id: Date.now(),
        title: titleInput.value,
        author: authorInput.value || "Unknown Author",
        memo: memoInput.value || "No thoughts recorded.",
        emotion: emoInput.value,
        emotionName: emoInput.getAttribute('data-name'),
        rating: parseInt(ratingInput ? ratingInput.value : 3),
        status: "unread",
        cover: selectedImageData
    };

    books.push(newBook);
    saveAndRender();

    // 入力フォームをクリア
    titleInput.value = "";
    authorInput.value = "";
    memoInput.value = "";
    document.getElementById("star3").checked = true; // デフォルトを星3に
    selectedImageData = null;
    document.getElementById("preview-display").innerHTML = `<span class="icon">📸</span><p>Cover Image</p>`;
}

function render() {
    const shelf = document.getElementById("bookshelf");
    if (!shelf) return;
    shelf.innerHTML = "";
    document.getElementById("book-count").innerText = `${books.length} items`;

    books.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = `book-card ${book.status}`;
        
        const coverContent = book.cover 
            ? `<img src="${book.cover}" class="book-cover-img" alt="${book.title}">`
            : `<div class="no-cover" style="background:${book.emotion}">${book.title[0]}</div>`;

        // 星評価の生成（満点5）
        const starHTML = `<div class="book-rating">${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</div>`;

        card.innerHTML = `
            <div class="cover-wrapper" onclick="toggleStatus(${index})" title="Click to change status">
                ${coverContent}
                <div class="memo-overlay">${book.memo}</div>
            </div>
            ${starHTML}
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-meta">
                <span class="status-tag">${getStatusText(book.status)}</span>
                <span class="vibe-tag" style="background:${book.emotion}">${book.emotionName}</span>
            </div>
            <button class="del-btn" onclick="deleteBook(${index})" title="Delete">✕</button>
        `;
        shelf.appendChild(card);
    });
    updateHeatmap();
}

window.toggleStatus = function(index) {
    const states = ["unread", "reading", "done"];
    let currentPos = states.indexOf(books[index].status);
    books[index].status = states[(currentPos + 1) % states.length];
    saveAndRender();
}

window.deleteBook = function(index) {
    if(confirm("この読書記録を削除してもよろしいですか？")) {
        books.splice(index, 1);
        saveAndRender();
    }
}

function updateHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;
    heatmap.innerHTML = "";
    if (books.length === 0) return;

    const counts = books.reduce((acc, b) => { 
        acc[b.emotion] = (acc[b.emotion] || 0) + 1; 
        return acc; 
    }, {});

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
    return map[s] || "TBR";
}

function saveAndRender() {
    localStorage.setItem("color-log-v4", JSON.stringify(books));
    render();
}
