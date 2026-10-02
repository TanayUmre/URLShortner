import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { ToastProvider } from './components/ToastContext';

function App(){
    return (
        <BrowserRouter>
            <ToastProvider>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </ToastProvider>
        </BrowserRouter>
    )
}

export default App;