import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-96 border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            className="border border-slate-600 bg-slate-900 p-2 rounded text-white"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-slate-600 bg-slate-900 p-2 rounded text-white"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button 
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {message && <p className="mt-4 text-red-400 text-sm text-center">{message}</p>}

        <p className="mt-4 text-center text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} 
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 font-bold ml-1 hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}