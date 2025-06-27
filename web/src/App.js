import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [keywords, setKeywords] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSinopse('');

    try {
      // Faz a chamada para o NOSSO backend, não para a API do Gemini diretamente
      const response = await axios.post('http://localhost:5000/api/gerar-sinopse', {
        keywords: keywords,
      });
      setSinopse(response.data.sinopse);
    } catch (err) {
      setError('Ocorreu um erro ao gerar a sinopse. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Luminária: Gerador de Sinopses com IA (Gemini)</h1>
        <p className="subtitle">
          Forneça algumas palavras-chave e veja a Inteligência Artificial transformá-las em uma história cativante.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ex: dragão, castelo, profecia"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Gerar Sinopse'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {sinopse && (
          <div className="sinopse-container">
            <h2>Sua Sinopse:</h2>
            <p>{sinopse}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;