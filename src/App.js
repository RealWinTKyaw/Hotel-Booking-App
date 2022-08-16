import './App.css';
import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import DestinationResult from "./pages/DestinationResult";
import Form from "./pages/BookingForm";
import Error from "./pages/Error";
import SelectedHotel from './pages/SelectedHotel';
import Layout from './pages/Layout';
import BookingConfirm from './pages/BookingConfirmed';


import SearchProvider from './context/SearchContext';
import Dashboard from './pages/Dashboard';

export default class App extends Component {
    render() {
        return (
            <SearchProvider>
                <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="destination" >
                        <Route index element={<DestinationResult />}/>
                        <Route path=":id">
                            <Route index element={<SelectedHotel />}/>
                            <Route path=":room" element={<Form />}/>
                        </Route>
                    </Route>
                    <Route path="form" element={<Form />} />
                    <Route path="profile" element={<Dashboard/>} />
                    <Route path="bookingCfm" element = {<BookingConfirm/>}/>
                    <Route path="*" element={<Error />} />
                </Route>
                </Routes>
            </SearchProvider>
        );
    }

}