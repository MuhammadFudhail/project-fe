import React from 'react';

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = () => {
    onClose(); // Tutup modal kalau klik di luar
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Biar klik dalam modal gak nutup
  };

  return (
    <div
      className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen  bg-gray-200/30 overflow-y-auto'
      onClick={handleBackgroundClick}
    >
      <div
        className='relative p-4 w-full max-w-2xl max-h-full'
        onClick={stopPropagation}
      >
        <div className='relative bg-white rounded-lg shadow-sm dark:bg-gray-700'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              {title}
            </h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={onClose}
            >
              <svg
                className='w-3 h-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 1l12 12M13 1L1 13'
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className='p-4 md:p-5 space-y-4'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
