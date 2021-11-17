import React from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Dashboard from './pages/Dashboard';

interface Props { }

const App: React.FC<Props> = () => {
    const [logined, setLogined] = React.useState(false);
    return (
        <>
            <ToastContainer autoClose={3000} />
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <HomePage />
                    </Route>
                    <Route path='/login'>
                        <Login updateLogin={(val): void => setLogined(val)} />
                    </Route>
                    <Route path='/signup'>
                        <Signup updateLogin={(val): void => setLogined(val)} />
                    </Route>
                    <Route path='/dashboard'>
                        {logined || sessionStorage.getItem('access_token') !== null
                            ? <Dashboard
                                updateLogin={(val): void => setLogined(val)}
                            />
                            : <Redirect to='/' />
                        }
                    </Route>
                    <Route path='/forgotpassword'>
                        <ForgotPassword />
                    </Route>
                </Switch>
            </Router>
        </>
    );
};

export default App;
