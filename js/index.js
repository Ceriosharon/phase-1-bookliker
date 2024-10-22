document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const userId = { id: 1, username: "pouros" }; // Example user

    // Fetch books and display them
    fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                const li = document.createElement("li");
                li.textContent = book.title;
                li.addEventListener("click", () => displayBookDetails(book));
                list.appendChild(li);
            });
        });

    // Display book details
    function displayBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.thumbnail}" alt="${book.title}">
            <p>${book.description}</p>
            <h3>Liked by:</h3>
            <ul id="user-list">${book.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
            <button id="like-button">${book.users.some(user => user.id === userId.id) ? "Un-Like" : "Like"}</button>
        `;

        const likeButton = document.getElementById("like-button");
        likeButton.addEventListener("click", () => toggleLike(book));
    }

    // Toggle like functionality
    function toggleLike(book) {
        const liked = book.users.some(user => user.id === userId.id);
        const newUsers = liked ? book.users.filter(user => user.id !== userId.id) : [...book.users, userId];

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ users: newUsers })
        })
        .then(response => response.json())
        .then(updatedBook => {
            displayBookDetails(updatedBook); // Refresh the details
        });
    }
});
