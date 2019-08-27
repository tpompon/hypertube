import React from 'react';
import translations from '../translations'

function NotFound({language}) {
  return (
    <div className="text-center">
      <h2>404</h2>
      {translations[language].notfound.title}
    </div>
  );
}

export default NotFound;
