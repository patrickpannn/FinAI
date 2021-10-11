import React from 'react';
import './styles/app.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";


interface Props { }

const App: React.FC<Props> = () => {
    return (
        <div className='app'>
            <ToastContainer autoClose={3000}/>
        </div>
    );
};

export default App;
