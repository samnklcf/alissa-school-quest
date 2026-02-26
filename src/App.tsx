import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnboardingSteps from "./pages/OnboardingSteps";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import CourseGenerate from "./pages/CourseGenerate";
import QuizSession from "./pages/QuizSession";
import AssistantPage from "./pages/Assistant";
import Library from "./pages/Library";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import QuizList from "./pages/QuizList";
import AppShell from "./components/AppShell";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-dvh bg-background flex items-center justify-center">
    <i className="fa-solid fa-spinner fa-spin text-primary text-2xl" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  if (user && !user.onboarding_completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated && user?.onboarding_completed) return <Navigate to="/" replace />;
  if (isAuthenticated && !user?.onboarding_completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/onboarding" element={<OnboardingSteps />} />
    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="/subject/:id" element={<ProtectedRoute><SubjectDetail /></ProtectedRoute>} />
    <Route path="/course/new/:matiereId" element={<ProtectedRoute><CourseGenerate /></ProtectedRoute>} />
    <Route path="/quiz/:id" element={<ProtectedRoute><QuizSession /></ProtectedRoute>} />
    <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
    <Route path="/assistant/:matiereId" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
    <Route path="/library/:matiereId" element={<ProtectedRoute><Library /></ProtectedRoute>} />
    <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
    <Route path="/quizzes/:matiereId" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/welcome" replace />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
