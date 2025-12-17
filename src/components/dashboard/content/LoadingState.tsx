/**
 * Loading state component for dashboard
 */
export const LoadingState: React.FC<{ message?: string }> = ({
  message = "Loading Dashboard",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we prepare your dashboard...
        </p>
      </div>
    </div>
  );
};

/**
 * Redirect state component
 */
export const RedirectState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we redirect you to the login page.
        </p>
      </div>
    </div>
  );
};
