import { useState } from 'react';

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setToast] = useState(false);

  const showToastFunction = (message) => {
    setToastMessage(message);
    setToast(true);
  };

  const hideToast = () => setToast(false);

  return {
    toastMessage,
    showToast,
    hideToast,
    showToastFunction
  };
};
