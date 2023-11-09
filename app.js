if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comment-list');

commentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const commentText = document.getElementById('comment').value;
    addCommentToIndexedDB(commentText);
});

function addCommentToIndexedDB(commentText) {
    const request = indexedDB.open('commentsDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('comment', 'comment', { unique: false });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('comments', 'readwrite');
        const objectStore = transaction.objectStore('comments');
        objectStore.add({ comment: commentText });
        transaction.oncomplete = function() {
            console.log('Komentar berhasil disimpan di IndexedDB.');
            displayCommentsFromIndexedDB();
        };
    };

    request.onerror = function(event) {
        console.error('Error adding comment to IndexedDB:', event.target.error);
    };
}

function displayCommentsFromIndexedDB() {
    const request = indexedDB.open('commentsDB', 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('comments', 'readonly');
        const objectStore = transaction.objectStore('comments');
        const comments = [];

        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                comments.push(cursor.value.comment);
                cursor.continue();
            } else {
                renderComments(comments);
            }
        };
    };
}

function renderComments(comments) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';

    comments.forEach(function(comment) {
        const li = document.createElement('li');
        li.textContent = comment;
        commentList.appendChild(li);
    });
}
