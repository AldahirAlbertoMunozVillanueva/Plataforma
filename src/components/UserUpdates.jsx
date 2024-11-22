import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

function UserUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from('updates') // Tabla donde guardas las actualizaciones
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching updates:', error);
        return;
      }
      setUpdates(data);
    };

    fetchUpdates();
  }, []);

  return (
    <div className="user-updates">
      <h1>Actualizaciones Recientes</h1>
      <ul>
        {updates.map((update) => (
          <li key={update.id}>
            <h2>{update.title}</h2>
            <p>{update.description}</p>
            <small>{new Date(update.created_at).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserUpdates;
