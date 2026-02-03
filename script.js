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
        alert("タイトルを入力してください");
        return;
    }

    books.push({
        id: Date.now(),
        title: titleInput.value,
        author: authorInput.value || "Unknown",
        memo: memoInput.value || "",
        emotion: emoInput.value,
        emotionName: emoInput.getAttribute('data-name'),
        rating: parseInt(ratingInput ? ratingInput.value : 3),
        status: "unread",
        cover: selectedImageData
    });

    saveAndRender();
    titleInput.value = "";
    authorInput.value = "";
    memoInput.value = "";
    document.getElementById("star3").checked = true;
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
        card.className = "book-card";
        const coverContent = book.cover 
            ? `<img src="${book.cover}" class="book-cover-img">`
            : `<div class="no-cover" style="background:${book.emotion}">${book.title[0]}</div>`;
        const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);

        card.innerHTML = `
            <div class="cover-wrapper" onclick="toggleStatus(${index})">
                ${coverContent}
            </div>
            <div class="book-rating">${stars}</div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-meta">
                <span class="vibe-tag" style="background:${book.emotion}">${book.emotionName}</span>
            </div>
            <button class="del-btn" onclick="deleteBook(${index})">✕</button>
        `;
        shelf.appendChild(card);
    });
}

function saveAndRender() {
    localStorage.setItem("color-log-v4", JSON.stringify(books));
    render();
}

window.deleteBook = function(index) {
    if(confirm("削除しますか？")) {
        books.splice(index, 1);
        saveAndRender();
    }
}
