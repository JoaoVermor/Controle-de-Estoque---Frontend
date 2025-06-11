import React from 'react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { InventoryPage } from './pages/InventoryPage';

function App() {
  return (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  );
}

export default App;