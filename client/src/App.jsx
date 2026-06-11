import { useState } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;

