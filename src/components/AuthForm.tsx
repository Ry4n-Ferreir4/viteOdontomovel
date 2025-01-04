import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  type: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Novo campo para o nome
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name }, // Armazenar o nome no campo display_name
          },
        });

        if (signUpError) throw signUpError;

        // Após o cadastro, podemos atualizar o display_name
        if (data?.user) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              display_name: name,
            },
          });

          if (updateError) throw updateError;
        }

        navigate("/login");

      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Email ou senha incorretos');
          }
          throw signInError;
        }

        navigate("/calendar");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === 'login' ? 'Login' : 'Cadastro'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded text-white transition-colors ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </span>
            ) : (
              type === 'login' ? 'Entrar' : 'Cadastrar'
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            {type === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <a href="/register" className="text-blue-500 hover:text-blue-600">
                  Cadastre-se
                </a>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <a href="/login" className="text-blue-500 hover:text-blue-600">
                  Faça login
                </a>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
