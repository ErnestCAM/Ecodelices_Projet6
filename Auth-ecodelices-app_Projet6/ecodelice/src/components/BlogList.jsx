import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/api/blog")
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="bg-white p-4 rounded shadow max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-500 mb-2">{post.date}</p>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
