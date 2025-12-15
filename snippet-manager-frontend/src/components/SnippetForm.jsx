import { useState } from 'react';
import toast from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API_BASE_URL;

function SnippetForm({ onSnippetAdded, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    language: 'javascript',
    description: '',
    code_content: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const payload = {
      user_id: userId,
      title: formData.title,
      language: formData.language,
      description: formData.description,
      code_content: formData.code_content,
      tags: formattedTags
    };

    try {
      const response = await fetch(`${API_URL}/snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newSnippet = await response.json();
        onSnippetAdded(newSnippet);
        setFormData({ title: '', language: 'javascript', description: '', code_content: '', tags: '' });
      } else {
        toast.error("Failed to save snippet");
      }
    } catch (error) {
      console.error("Failed to add snippet", error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8 border border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-white">Add New Snippet</h2>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Title</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full rounded border border-slate-600 bg-slate-900 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Language</label>
            <select 
              className="mt-1 block w-full rounded border border-slate-600 bg-slate-900 p-2 text-white"
              value={formData.language}
              onChange={e => setFormData({...formData, language: e.target.value})}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="css">CSS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="react, hooks, basics"
              className="mt-1 block w-full rounded border border-slate-600 bg-slate-900 p-2 text-white"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Code</label>
          <textarea 
            required
            rows={4}
            className="mt-1 block w-full rounded border border-slate-600 bg-slate-900 p-2 text-white font-mono text-sm"
            value={formData.code_content}
            onChange={e => setFormData({...formData, code_content: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Description</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded border border-slate-600 bg-slate-900 p-2 text-white"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-semibold"
        >
          Save Snippet
        </button>
      </div>
    </form>
  );
}

export default SnippetForm;