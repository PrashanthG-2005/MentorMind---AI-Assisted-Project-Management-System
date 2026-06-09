import { useEffect, useState } from "react";
import { getInvites, revokeInvite } from "../../services/authService";

const InviteList = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvites();
      setInvites(data);
    } catch (err) {
      setError(err || 'Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRevoke = async (id) => {
    if (!confirm('Revoke this invite?')) return;
    try {
      await revokeInvite(id);
      setInvites(invites.filter(i => i._id !== id));
    } catch (err) {
      alert(err || 'Failed to revoke');
    }
  };

  if (loading) return <div className="p-4">Loading invites...</div>;
  if (error) return <div className="p-4 text-red-600">{String(error)}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h4 className="font-semibold mb-2">Active Invites</h4>
      {invites.length === 0 && <div className="text-sm text-gray-500">No invites found</div>}
      <ul className="space-y-2">
        {invites.map(inv => (
          <li key={inv._id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{inv.email || <span className="text-gray-400">(any email)</span>}</div>
              <div className="text-sm text-gray-500">Role: {inv.role} • Token: <span className="font-mono">{inv.token}</span></div>
              <div className="text-xs text-gray-400">Created: {new Date(inv.createdAt).toLocaleString()} • Expires: {inv.expiresAt ? new Date(inv.expiresAt).toLocaleString() : 'never'}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => navigator.clipboard?.writeText(inv.token)} className="px-2 py-1 text-sm border rounded">Copy</button>
              <button onClick={() => handleRevoke(inv._id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded">Revoke</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InviteList;
