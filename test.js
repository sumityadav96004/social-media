const axios = require('axios');

async function testAPI() {
  try {
    // First, register a test user
    console.log('Registering test user...');
    const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('User registered:', registerResponse.data);

    // Test user login
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', loginResponse.data);

    const token = loginResponse.data.token;

    // Test creating a post
    console.log('Creating a post...');
    const postResponse = await axios.post('http://localhost:3000/api/posts', {
      content: 'This is a test post!'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Post created:', postResponse.data);

    const postId = postResponse.data._id;

    // Test getting posts
    console.log('Retrieving posts...');
    const getPostsResponse = await axios.get('http://localhost:3000/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Posts retrieved:', getPostsResponse.data);

    // Test adding a comment
    console.log('Adding a comment...');
    const commentResponse = await axios.post(`http://localhost:3000/api/comments`, {
      content: 'This is a test comment!',
      postId: postId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Comment added:', commentResponse.data);

    // Test liking a post
    console.log('Liking a post...');
    const likeResponse = await axios.post(`http://localhost:3000/api/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Post liked:', likeResponse.data);

    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testAPI();
