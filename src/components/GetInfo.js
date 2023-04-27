import React, { useState, useEffect } from 'react';

function GetInfo() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(" ");
  const [delay, setDelay] = useState(1);
  const [lastLoadTime, setLastLoadTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await Promise.race([
          fetch(`https://reqres.in/api/users?delay=${delay}`),
          new Promise((resolve,reject) => setTimeout(() => reject(new Error('Timeout')),3000))
      ]);
        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
          setError('Timeout Error: Loading more than 3s');
        }
        finally {
        setIsLoading(false);
        setLastLoadTime(new Date().toLocaleTimeString());
      }
    };
    fetchData();
  }, [delay]);

  const filteredUsers = users.filter((user) =>
    (user.first_name + ' ' + user.last_name + ' ' + user.email)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>User List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Filter by name or email"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <button onClick={() => setDelay(5)}>Simulate 5-second delay</button>
          <p>Last data load time: {lastLoadTime}</p>
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                <p>
                  {user.first_name} {user.last_name}
                </p>
                <p>{user.email}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default GetInfo;
