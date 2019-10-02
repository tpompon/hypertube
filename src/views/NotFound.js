import React from 'react';
import translations from 'translations'

const NotFound = ({language}) => (
  <div className="text-center">
      <h2>404</h2>
      {translations[language].notfound.title}
    </div>
)

export default NotFound;
