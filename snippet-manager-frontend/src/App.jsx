import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast, { Toaster } from 'react-hot-toast';
import Auth from './components/Auth'
import SnippetForm from './components/SnippetForm.jsx'
const API_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [session, setSession] = useState(null)
  const [snippets, setSnippets] = useState([])
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  
useEffect(() => {
    if (session) {
      
      fetch(`${API_URL}/snippets?user_id=${session.user.id}`)
        .then(res => res.json())
        .then(data => setSnippets(data))
        .catch(err => {
    
        })
    }
}, [session])

  const handleNewSnippet = (newSnippet) => {
    setSnippets([newSnippet, ...snippets]);
    toast.success('Snippet saved successfully!');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/snippets/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSnippets(snippets.filter(s => s.id !== id));
        toast.success('Snippet deleted!');
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) { 
        toast.error('Error connecting to server');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-8">
      <Toaster position="bottom-right" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Snippets</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{session.user.email}</span>
            <button onClick={handleLogout} className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition">
              Logout
            </button>
          </div>
        </div>
        
        <SnippetForm onSnippetAdded={handleNewSnippet} userId={session.user.id} />
        
        <div className="grid gap-6">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 hover:border-blue-500 transition duration-300 group">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{snippet.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-900/50 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-800">
                      {snippet.language}
                    </span>
                    {snippet.tags && snippet.tags.map(tag => (
                       <span key={tag} className="text-xs text-slate-400">#{tag}</span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(snippet.id)}
                  className="text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-2"
                  title="Delete Snippet"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="rounded-md overflow-hidden my-4 border border-slate-700 shadow-inner">
                <SyntaxHighlighter 
                    language={snippet.language} 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.9rem', padding: '1.5rem' }}
                    showLineNumbers={true}
                >
                    {snippet.code_content || ''}
                </SyntaxHighlighter>
              </div>
              
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">{snippet.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App