
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Silent error logging in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 text-center font-sans">
          <h1 className="mb-4 text-primary text-2xl md:text-3xl font-bold">
            Oups! Une erreur s'est produite
          </h1>
          <p className="mb-8 text-slate-400 text-base">
            {this.state.error?.message || 'Une erreur inattendue s\'est produite'}
          </p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="bg-primary hover:bg-primary-dark text-black font-semibold px-6 py-3 rounded-lg cursor-pointer transition-colors duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

