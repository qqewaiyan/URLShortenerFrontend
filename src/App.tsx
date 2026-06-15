import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UrlProvider } from './contexts/UrlContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute.tsx';
import { HomePage } from './components/pages/HomePage.tsx';
import { LoginPage } from './components/auth/Login.tsx';
import { RegisterPage } from './components/auth/Register.tsx';
import { DashboardPage } from './components/pages/DashboardPage';
import { MyUrlsPage } from './components/pages/MyUrlsPage.tsx';
import { ProfilePage } from './components/pages/ProfilePage.tsx';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UrlProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/urls"
                element={
                  <ProtectedRoute>
                    <MyUrlsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </UrlProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
