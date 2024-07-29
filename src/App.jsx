import React, { useState, useEffect } from 'react';

const API_URL =
  'https://46695d2b-6a0a-45b5-ae21-dd2969b4140a-00-32gkc9ywx0qhf.janeway.replit.dev/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [editPostId, setEditPostId] = useState(null); // State to hold the ID of the post being edited

  const fetchPosts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post
  const createPost = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    })
      .then((res) => res.json())
      .then(fetchPosts) // Fetch all posts again after creating a post
      .catch((err) => console.error(err));

    setTitle('');
    setContent('');
    setAuthor('');
  };

  // Update a post
  const updatePost = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/${editPostId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    })
      .then((res) => res.json())
      .then(fetchPosts) // Fetch all posts again after updating a post
      .catch((err) => console.error(err));

    setTitle('');
    setContent('');
    setAuthor('');
    setEditPostId(null); //Reset the edit post ID
  };

  // Start editing a post
  const startEditing = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setEditPostId(post.id);
  };

  // Delete a post
  const deletePost = (postId) => {
    fetch(`${API_URL}/${postId}`, {
      method: 'DELETE',
    })
      .then(() => fetchPosts()) // Fetch all posts again after deleting a post
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <form onSubmit={editPostId ? updatePost : createPost}>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">
          {editPostId ? 'Update Post' : 'Create Post'}
        </button>
      </form>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <pre>{post.content}</pre>
            <p>Author: {post.author}</p>
            <button onClick={() => startEditing(post)}>Edit</button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
