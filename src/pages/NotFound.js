import React from 'react';

function NotFound({language}) {
  return (
    <div className="text-center">
      <h2>404</h2>
      {(language === 'FR') ? 'Cette page n\'existe pas' : 'Page not found'}
    </div>
  );
}

export default NotFound;
