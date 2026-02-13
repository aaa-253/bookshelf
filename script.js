// GitHub環境でも動くように初期化を最適化
let books = JSON.parse(localStorage.getItem("color-log-v4")) || [];
let selectedImageData = null;

const SVG_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="camera-icon-svg">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
    <p class="upload-text">Cover Image</p>
`;

document.addEventListener('DOMContentLoaded', () => {
   render();
});

window.previewImage = function(input) {
   if (input.files && input.files[0]) {
       const reader = new FileReader();
       reader.onload = e => {
           selectedImageData = e.target.result;
           const display = document.getElementById("preview-display");
           if (display) {
               display.innerHTML = `<img src="${selectedImageData}" class="preview-image">`;
           }
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
    
   if (!titleInput || !titleInput.value.trim()) {
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
       cover: selectedImageData
   });

   saveAndRender();

   // リセット
   titleInput.value = "";
   authorInput.value = "";
   memoInput.value = "";
   selectedImageData = null;
   const display = document.getElementById("preview-display");
   if (display) display.innerHTML = SVG_ICON;
}

function render() {
   const shelf = document.getElementById("bookshelf");
   const countDisplay = document.getElementById("book-count");
   if (!shelf) return;
   
   shelf.innerHTML = "";
   if (countDisplay) countDisplay.innerText = `${books.length} items`;

   books.forEach((book, index) => {
       const card = document.createElement("div");
       card.className = "book-card";
       const coverContent = book.cover 
           ? `<img src="${book.cover}" class="book-cover-img">`
           : `<div class="no-cover" style="background:${book.emotion}; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-size:2rem; font-weight:bold;">${book.title[0]}</div>`;
       
       const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);

       card.innerHTML = `
           <div class="cover-wrapper">${coverContent}</div>
           <button class="del-btn" onclick="deleteBook(${index})">✕</button>
           <div style="color:var(--star-color); font-size:10px; margin-bottom:4px;">${stars}</div>
           <div class="book-title">${book.title}</div>
           <div class="book-author">${book.author}</div>
           <div style="margin-top:5px;">
                <span class="vibe-tag" style="background:${book.emotion}">${book.emotionName}</span>
           </div>
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
