import { useState } from 'react';


function SnippetForm({ onSnippetAdded,userId }) {
  const [formData, setFormData] = useState({
    title: '',
    language: 'javascript',
    description: '',
    code_content: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated tags into an array (e.g. "react, ui" -> ["react", "ui"])
    const formattedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const payload = {
      user_id : userId,
      title: formData.title,
      language: formData.language,
      description: formData.description,
      code_content: formData.code_content,
      tags: formattedTags
    };

    try {
      const response = await fetch('http://localhost:5000/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newSnippet = await response.json();
        onSnippetAdded(newSnippet); // Tell parent component to update list
        // Reset form
        setFormData({ title: '', language: 'javascript', description: '', code_content: '', tags: '' });
      }
    } catch (error) {
      console.error("Failed to add snippet", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Snippet</h2>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select 
              className="mt-1 block w-full rounded border border-gray-300 p-2 text-gray-900"
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
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="react, hooks, basics"
              className="mt-1 block w-full rounded border border-gray-300 p-2 text-gray-900"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <textarea 
            required
            rows={4}
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-gray-900 font-mono text-sm bg-gray-50"
            value={formData.code_content}
            onChange={e => setFormData({...formData, code_content: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-gray-900"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save Snippet
        </button>
      </div>
    </form>
  );
}

export default SnippetForm;