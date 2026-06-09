import { useState } from "react";
import { createInvite } from "../../services/authService";

const InviteForm = ({ onClose, onCreated }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [skillsInput, setSkillsInput] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const payload = { email, role, skills, expiresInDays };
      const res = await createInvite(payload);
      setResult(res);
      if (onCreated) onCreated(res);
    } catch (err) {
      setError(err || "Failed to create invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Invite</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800" placeholder="invitee@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800">
              <option>Employee</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma separated)</label>
            <input value={skillsInput} onChange={e => setSkillsInput(e.target.value)} className="w-full mt-1 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800" placeholder="React,Node,SQL" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expires (days)</label>
            <input type="number" min={1} value={expiresInDays} onChange={e => setExpiresInDays(Number(e.target.value))} className="w-full mt-1 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800" />
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-pink-500 text-white">
              {loading ? 'Creating...' : 'Create Invite'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium">Invite Created</div>
            <div className="text-sm">Token: <span className="font-mono break-all">{result.token}</span></div>
            <div className="text-sm">Expires: {new Date(result.expiresAt).toLocaleString()}</div>
            <div className="text-sm">Link: <a className="text-pink-600" href={`/register?inviteToken=${result.token}`}>Prefill register</a></div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{String(error)}</div>
        )}

      </div>
    </div>
  );
};

export default InviteForm;
