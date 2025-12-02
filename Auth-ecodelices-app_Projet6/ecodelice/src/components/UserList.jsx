import { useState, useEffect } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="border-b py-2">
            {user.username} – {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
