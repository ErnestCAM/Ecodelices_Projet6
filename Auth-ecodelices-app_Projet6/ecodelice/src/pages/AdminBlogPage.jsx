import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function AdminBlogPage() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/blog/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Erreur posts:", error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/blog/posts", newPost, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      alert("Erreur création");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (confirm("Supprimer ce post ?")) {
      try {
        await axios.delete(`/api/blog/posts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchPosts();
      } catch (error) {
        alert("Erreur suppression");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Admin Blog</h1>
        
        {/* Créer nouveau post */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Nouveau post</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-2xl text-xl"
              required
            />
            <textarea
              placeholder="Contenu"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows="5"
              className="w-full p-4 border border-gray-200 rounded-2xl"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700"
            >
              {loading ? "Création..." : "Créer post"}
            </button>
          </form>
        </div>

        {/* Liste posts */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
                <small className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('fr-FR')}</small>
              </div>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
