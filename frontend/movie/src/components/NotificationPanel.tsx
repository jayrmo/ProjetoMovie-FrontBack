import { useNotification } from '../contexts/NotificationContext';

export const NotificationPanel = () => {
  const { notifications, removeNotification } = useNotification();

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'error':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'warning':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      case 'info':
      default:
        return 'bg-blue-900 text-blue-200 border-blue-700';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed right-4 top-4 w-80 max-h-screen overflow-y-auto space-y-2 pointer-events-none z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-3 rounded border-l-4 flex gap-3 items-start text-sm pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity ${getColors(notification.type)}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span className="text-lg font-bold flex-shrink-0">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <p className="break-words">{notification.message}</p>
            <p className="text-xs opacity-70 mt-1">
              {notification.timestamp.toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
            className="text-lg font-bold flex-shrink-0 hover:opacity-70"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
