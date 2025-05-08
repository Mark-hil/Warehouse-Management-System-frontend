import React, { createContext, useReducer, useContext } from 'react';

// UI State interface
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

// Notification interface
interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Initial state
const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
};

// Action types
type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'read' | 'createdAt'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

// Context type
interface UIContextType {
  state: UIState;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Create context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Reducer function
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            id: Date.now().toString(),
            ...action.payload,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

// Provider component
export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebar = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR', payload: open });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  return (
    <UIContext.Provider
      value={{
        state,
        toggleSidebar,
        setSidebar,
        toggleTheme,
        setTheme,
        addNotification,
        markNotificationRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};