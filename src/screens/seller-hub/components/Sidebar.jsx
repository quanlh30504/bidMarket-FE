import React from 'react';

export const Sidebar = ({ menuItems, activeMenuItem, setActiveMenuItem }) => {

  return (
    <div className="w-1/6 p-4 border-r">
      <ul>
        {menuItems.map((filter) => (
          <li key={filter}>
            <button
              className={`block w-full text-left p-2 mb-2 rounded ${
                activeMenuItem === filter ? 'bg-green_100 text-green' : ''
              }`}
              onClick={() => setActiveMenuItem(filter)}
            >
              {filter}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
