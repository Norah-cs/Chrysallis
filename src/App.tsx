import React, { useState } from 'react';
import { HomePage } from './components/pages/HomePage';
import { RegistrationPage } from './components/pages/RegistrationPage';

type CurrentPage = 'home' | 'registration';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');

  const handleGetStarted = () => {
    setCurrentPage('registration');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onGetStarted={handleGetStarted} />
      )}
      {currentPage === 'registration' && (
        <RegistrationPage onBack={handleBackToHome} />
      )}
    </>
  );
}

export default App;