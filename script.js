let books = JSON.parse(localStorage.getItem("color-log-v4")) || [];
let selectedImageData = null;

render();

function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      selectedImageData = e.target.result;
      document.getElementById("preview-display").innerHTML = `<img src="${selectedImageData}" class="preview-image">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const memo = document.getElementById("memo").value;
  const emoInput = document.querySelector('input[name="emo"]:checked');
  
  if (!title) return;

  books.push({
    id: Date.now(),
    title: title,
    author: author || "Unknown",
    memo: memo || "No memo recorded.",
    emotion: emoInput.value,
    emotionName: emoInput.getAttribute('data-name'),
    status: "unread",
    cover: selectedImageData
  });

  saveAndRender();

  // Reset
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("memo").value = "";
  selectedImageData = null;
  document.getElementById("preview-display").innerHTML = `<span class="icon">📸</span><p>Cover Image</p>`;
}

function render() {
  const shelf = document.getElementById("bookshelf");
  shelf.innerHTML = "";
  document.getElementById("book-count").innerText = `${books.length} items`;

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

function toggleStatus(index) {
  const states = ["unread", "reading", "done"];
  books[index].status = states[(states.indexOf(books[index].status) + 1) % states.length];
  saveAndRender();
}

function deleteBook(index) {
  if(confirm("このデータを削除しますか？")) {
    books.splice(index, 1);
    saveAndRender();
  }
}

function updateHeatmap() {
  const heatmap = document.getElementById("heatmap");
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
