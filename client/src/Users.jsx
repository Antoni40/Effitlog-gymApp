import {useEffect, useState} from "react"

function Users(){
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers(){
      const res = await fetch('http://localhost:8080/api/getusers');
      const data =  await res.json();
      setUsers(data);
    }

    loadUsers();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name} {user.surname}</li>
      ))}
    </ul>
  )
}

export default Users;