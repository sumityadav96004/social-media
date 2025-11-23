const API_BASE = 'http://localhost:3000/api';

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authContainer = document.getElementById('authContainer');
const feedContainer = document.getElementById('feedContainer');
const postsContainer = document.getElementById('posts');
const postContent = document.getElementById('postContent');
const postBtn = document.getElementById('postBtn');

// Event listeners
loginBtn.addEventListener('click', showLoginForm);
registerBtn.addEventListener('click', showRegisterForm);
logoutBtn.addEventListener('click', logout);
postBtn.addEventListener('click', createPost);

// Auth forms
document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
document.getElementById('registerFormElement').addEventListener('submit', handleRegister);

// Check if user is logged in
const token = localStorage.getItem('token');
if (token) {
  showFeed();
} else {
  showAuth();
}

function showAuth() {
  authContainer.style.display = 'block';
  feedContainer.style.display = 'none';
  loginBtn.style.display = 'inline-block';
  registerBtn.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
}

function showFeed() {
  authContainer.style.display = 'none';
  feedContainer.style.display = 'block';
  loginBtn.style.display = 'none';
  registerBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
  loadPosts();
}

function showLoginForm() {
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
}

function showRegisterForm() {
  registerForm.style.display = 'block';
  loginForm.style.display = 'none';
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      showFeed();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Login failed');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      showFeed();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Registration failed');
  }
}

function logout() {
  localStorage.removeItem('token');
  showAuth();
}

async function createPost() {
  const content = postContent.value.trim();
  if (!content) return;

  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      postContent.value = '';
      loadPosts();
    } else {
      alert('Failed to create post');
    }
  } catch (error) {
    alert('Failed to create post');
  }
}

async function loadPosts() {
  try {
    const response = await fetch(`${API_BASE}/posts`);
    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
}

function displayPosts(posts) {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
    <div class="post-header">
      <span class="post-author">${post.author.username}</span>
      <span>${new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
    <div class="post-content">${post.content}</div>
    <div class="post-actions">
      <button class="like-btn" onclick="likePost('${post._id}')">
        ❤️ ${post.likes.length}
      </button>
      <button class="comment-btn" onclick="toggleComments('${post._id}')">
        💬 ${post.comments.length}
      </button>
    </div>
    <div id="comments-${post._id}" class="comments" style="display: none;">
      <div id="comment-list-${post._id}"></div>
      <form id="comment-form-${post._id}" onsubmit="addComment(event, '${post._id}')">
        <textarea placeholder="Write a comment..." required></textarea>
        <button type="submit">Comment</button>
      </form>
    </div>
  `;
  return postDiv;
}

async function likePost(postId) {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      loadPosts();
    }
  } catch (error) {
    alert('Failed to like post');
  }
}

async function toggleComments(postId) {
  const commentsDiv = document.getElementById(`comments-${postId}`);
  if (commentsDiv.style.display === 'none') {
    await loadComments(postId);
    commentsDiv.style.display = 'block';
  } else {
    commentsDiv.style.display = 'none';
  }
}

async function loadComments(postId) {
  try {
    const response = await fetch(`${API_BASE}/comments/post/${postId}`);
    const comments = await response.json();
    displayComments(postId, comments);
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

function displayComments(postId, comments) {
  const commentList = document.getElementById(`comment-list-${postId}`);
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <div class="comment-author">${comment.author.username}</div>
      <div>${comment.content}</div>
      <div>
        <button onclick="likeComment('${comment._id}')">👍 ${comment.likes.length}</button>
      </div>
    `;
    commentList.appendChild(commentDiv);
  });
}

async function addComment(e, postId) {
  e.preventDefault();
  const form = e.target;
  const textarea = form.querySelector('textarea');
  const content = textarea.value.trim();
  if (!content) return;

  try {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content, postId }),
    });

    if (response.ok) {
      textarea.value = '';
      await loadComments(postId);
      loadPosts(); // Update comment count
    } else {
      alert('Failed to add comment');
    }
  } catch (error) {
    alert('Failed to add comment');
  }
}

async function likeComment(commentId) {
  try {
    const response = await fetch(`${API_BASE}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      // Reload comments for the post
      const postId = response.url.split('/').pop(); // This might not work, need to track postId
      loadPosts(); // Reload everything for simplicity
    }
  } catch (error) {
    alert('Failed to like comment');
  }
}
