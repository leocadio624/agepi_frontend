import './App.css';
import AppRouter from './routers/AppRouter';
import AuthProvider from './auth/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';




function App() {
  return (
    <div> 
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}
export default App;
