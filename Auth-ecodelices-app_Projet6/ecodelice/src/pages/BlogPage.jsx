import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(UserContext);

  const loadPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/blog/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur /api/blog/posts:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAdminUpload = async (e) => {
    e.preventDefault();
    if (!file || !newPost.title || !newPost.content) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    formData.append("image", file);

    try {
      await axios.post("http://localhost:4000/api/blog/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewPost({ title: "", content: "" });
      setFile(null);
      await loadPosts();
    } catch (err) {
      console.error("Erreur upload blog:", err.response?.data || err);
      alert("Erreur lors du téléversement");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/blog/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err.response?.data || err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = async (post) => {
    const newTitle = window.prompt("Nouveau titre :", post.title);
    if (!newTitle) return;
    const newContent = window.prompt("Nouveau contenu :", post.content);
    if (!newContent) return;
    try {
      await axios.put(
        `http://localhost:4000/api/blog/posts/${post.id}`,
        { title: newTitle, content: newContent },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, title: newTitle, content: newContent } : p
        )
      );
    } catch (err) {
      console.error("Erreur édition:", err.response?.data || err);
      alert("Erreur lors de la modification");
    }
  };

  const noPosts = posts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-green-600 text-center mb-4">
          Actualités
        </h1>

        {user?.role === "admin" && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              🛠️ Zone admin – Ajouter un article
            </h2>
            <form
              onSubmit={handleAdminUpload}
              className="grid md:grid-cols-2 gap-6"
            >
              <input
                type="text"
                placeholder="Titre"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full p-4 border border-gray-200 rounded-2xl"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-4 border border-gray-200 rounded-2xl"
                required
              />
              <div className="md:col-span-2">
                <textarea
                  placeholder="Contenu"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows="3"
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="md:col-span-2 bg-blue-600 text-white py-3 px-8 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Téléversement..." : "Publier l’article"}
              </button>
            </form>
          </div>
        )}

        {noPosts && !user?.role === "admin" && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Aucune nouvelle actualité
            </h2>
            <p className="text-gray-600">
              Revenez bientôt pour de nouvelles publications.
            </p>
          </div>
        )}

        {!noPosts && (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {post.image && (
                  <img
                    src={`http://localhost:4000${post.image}`}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#7CB342]">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{post.content}</p>
                  <small className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </small>

                  {user?.role === "admin" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 text-xs rounded-full border border-red-500 text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
