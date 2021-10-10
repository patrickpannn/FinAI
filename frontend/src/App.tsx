import React from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

interface Props { }

const App: React.FC<Props> = () => {
    return (
        <>
            <ToastContainer autoClose={3000} />
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <HomePage />
                    </Route>
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <Route path='/signup'>
                        <Signup />
                    </Route>
                    <Route path='/dashboard'>
                        <h1>welcome</h1>
                    </Route>
                </Switch>

            </Router>
        </>
    );
};

export default App;
