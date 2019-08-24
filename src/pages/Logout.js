import React from 'react';

function Logout({language}) {
  return (
    <div className="text-center">
      <h2>{(language === 'FR') ? 'Déconnexion' : 'Logout'}</h2>
      {(language === 'FR') ? 'Vous avez été déconnecté' : 'You\'ve been disconnected'}
    </div>
  );
}

export default Logout;
