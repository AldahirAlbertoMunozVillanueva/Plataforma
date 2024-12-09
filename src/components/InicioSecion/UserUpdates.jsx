import React, { useEffect, useState } from 'react';
import supabase from '../client';

function UserUpdates() {
  const [updates, setUpdates] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener usuario autenticado
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error('Error al obtener usuario:', error.message);
    setUser(data.user);
  };

  // Obtener actualizaciones
  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUpdates(data);
    } catch (error) {
      console.error('Error al obtener actualizaciones:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dar like a una actualización
  const handleLike = async (id, currentLikes) => {
    try {
      const { error } = await supabase
        .from('updates')
        .update({ likes: currentLikes + 1 })
        .eq('id', id);

      if (error) throw error;

      fetchUpdates(); // Refresca las actualizaciones
    } catch (error) {
      console.error('Error al dar like:', error.message);
    }
  };

  // Obtener comentarios de una actualización
  const fetchComments = async (updateId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('update_id', updateId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments((prev) => ({ ...prev, [updateId]: data }));
    } catch (error) {
      console.error('Error al obtener comentarios:', error.message);
    }
  };

  // Enviar un nuevo comentario
  const handleCommentSubmit = async (updateId) => {
    const commentContent = newComments[updateId]?.trim();
    if (!commentContent) {
      alert('El comentario no puede estar vacío.');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ update_id: updateId, user_id: user.id, content: commentContent }]);

      if (error) throw error;

      setNewComments((prev) => ({ ...prev, [updateId]: '' }));
      fetchComments(updateId); // Refresca los comentarios
    } catch (error) {
      console.error('Error al agregar comentario:', error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUpdates();
  }, []);

  if (loading) {
    return <p>Cargando actualizaciones...</p>;
  }

  return (
    <div className="user-updates">
      <h1 className="text-2xl font-bold mb-4">Actualizaciones Recientes</h1>
      {user && <p>Bienvenido, {user.email}</p>}
      {!user && <p>Inicia sesión para interactuar con las actualizaciones.</p>}
      <ul className="space-y-4">
        {updates.map((update) => (
          <li key={update.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{update.title}</h2>
            <p className="text-gray-700">{update.description}</p>
            <small className="text-gray-500">
              {new Date(update.created_at).toLocaleDateString()}
            </small>
            <div className="mt-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => handleLike(update.id, update.likes)}
              >
                👍 {update.likes} Likes
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Comentarios:</h3>
              <ul className="space-y-2">
                {(comments[update.id] || []).map((comment) => (
                  <li key={comment.id} className="border p-2 rounded">
                    <p>{comment.content}</p>
                    <small className="text-gray-500">
                      {new Date(comment.created_at).toLocaleTimeString()}
                    </small>
                  </li>
                ))}
              </ul>
              {user && (
                <>
                  <textarea
                    className="border mt-2 p-2 w-full"
                    value={newComments[update.id] || ''}
                    onChange={(e) =>
                      setNewComments((prev) => ({ ...prev, [update.id]: e.target.value }))
                    }
                    placeholder="Escribe un comentario..."
                  />
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                    onClick={() => handleCommentSubmit(update.id)}
                  >
                    Enviar
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserUpdates;
