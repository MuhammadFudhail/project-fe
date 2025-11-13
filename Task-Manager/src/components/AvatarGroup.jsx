import React from 'react';

const AvatarGroup = ({ avatars, maxVisible = 3}) => {
  return (
    <div className='flex items-center gap-1'>
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0'
        />
      ))}
      {avatars.length > maxVisible && (
        <div className='w-9 h-9 rounded-full bg-blue-50 text-sm flex items-center justify-center font-medium border-2 border-white -ml-3'>
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
