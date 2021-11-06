import React from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Order from './pages/Orders';

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
                        <Dashboard />
                    </Route>
                    <Route path='/forgotpassword'>
                        <ForgotPassword />
                    </Route>
                    <Route path='/userorder'>
                        <Order />
                    </Route>
                </Switch>

            </Router>
        </>
    );
};

export default App;
