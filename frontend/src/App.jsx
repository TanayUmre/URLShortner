import Home from './pages/Home';
import SignIn from './pages/SignIn';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/signin" element={<SignIn/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;