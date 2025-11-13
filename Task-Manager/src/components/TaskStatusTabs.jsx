// import React from 'react';

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  if (!tabs || tabs.length === 0) {
    return <p>No tabs available</p>;
  }

  return (
    <div className='my-2'>
      <div className='flex flex-wrap gap-2'>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;

          return (
            <button
              key={tab.label}
              className={`relative px-3 md:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-red-600 bg-red-50 shadow-sm'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-100'
              }`}
              onClick={() => {
                console.log("Tab clicked:", tab.label);
                if (typeof setActiveTab === 'function') {
                  setActiveTab(tab.label);
                } else {
                  console.warn('setActiveTab is not a function!');
                }
              }}
            >
              <div className='flex items-center space-x-2'>
                <span className='text-xs'>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 group-hover:bg-red-200 group-hover:text-red-700'
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              {isActive && (
                <div className='h-1 bg-red-600 mt-1 rounded-full w-full transition-all duration-200'></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
