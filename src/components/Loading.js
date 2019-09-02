import React from 'react';

function Loading() {
  return (
    <div className="container">
      <div className="flex" style={{ marginTop: 300 }}>
        <div className="loader">
        </div>
      </div>
      <div className="load-text">Loading...</div>
    </div>
  );
}

export default Loading;
