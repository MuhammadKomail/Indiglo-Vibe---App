import {useToast} from 'react-native-toast-notifications';

let toastRef: ReturnType<typeof useToast> | null = null;

export const setToastRef = (toast: ReturnType<typeof useToast>) => {
  toastRef = toast;
};

/**
 * A global utility function to show toast notifications.
 * @param type - Type of the toast ('success' | 'error' | 'warning' | 'info').
 * @param message - The message to display in the toast.
 * @param duration - Optional duration for the toast in milliseconds (default: 3000).
 * @param position - Optional position of the toast ('top' | 'bottom') (default: 'bottom').
 */
export const showToast = ({
  type = 'info',
  message = 'Default message',
  duration = 3000,
  position = 'bottom',
}: {
  type?: 'success' | 'error' | 'warning' | 'info' | 'danger';
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
}) => {
  if (toastRef) {
    toastRef.show(message, {
      type,
      duration,
      placement: position,
    });
  }
};
