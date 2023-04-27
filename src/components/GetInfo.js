import React, { useState, useEffect } from 'react';

function GetInfo() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [delay, setDelay] = useState(3);
  const [lastLoadTime, setLastLoadTime] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // const startTime = Date.now();
      const response = await fetch(`https://reqres.in/api/users?delay=${delay}`);
      // const endTime = Date.now();
      // const delayedTime = endTime - startTime;
      
      setData(response.json());
      setLastLoadTime(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again later.');
      } else {
        setError('An error occurred while fetching data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(delay);
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
            onChange={(e) => setFilter(e.target.value)}
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
