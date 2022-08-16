import Cleave from 'cleave.js/react';
import "cleave.js/dist/addons/cleave-phone.sg";
import React, { useState, useContext } from "react";
import { SearchContext } from '../context/SearchContext';
import { UserContext } from '../context/UserContext';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

function Form(props) {
  const d = new Date();
  let min = d.toISOString().slice(0,7);
  const context = useContext(SearchContext);
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    requests: "",
    CCN: null,
    expDate: "",
    CVC: "",
    billaddrs: "",
  });

  function update(e) {
    setBookingData({...bookingData, [e.target.name]: e.target.value});
  };

  function onSubmit(e) {
    
    if ( !validator.isCreditCard(bookingData.CCN) ) {
      e.preventDefault();
      alert("Credit card details invalid, please try again.");
      return
    }
    else if ( !validator.isMobilePhone(bookingData.phoneNumber) ){
      e.preventDefault();
      alert("Phone number invalid, please try again.");
      return
    }
    else {
      e.preventDefault();
      context.handleBooking(userInfo.user, bookingData);
      navigate({
				pathname: "/bookingCfm"
			})
    }
    
  }

  return (
    <Container>
      <Box sx={{py:2}}>
        <Typography variant="h4">Confirm Booking</Typography>
        <Paper sx={{width: '50%', minWidth: '400px', p:2}}>
          <Typography>
            {context.selectedHotel.info.name} <br/>
            {context.query.checkin} to {context.query.checkout} <br/>
            {context.selectedRoom.roomNormalizedDescription} <br/>
            {context.selectedRoom.price}
          </Typography>
        </Paper>
      </Box>
        <form onSubmit={onSubmit} className="banner3">

          <span>Personal Details</span><br></br>
          <input type="text" name="salutation" id="salutation" title="How may we address you? (eg. Mr / Ms)"
          pattern="[a-zA-Z'-'\s]*" maxLength="20" placeholder="Salutation" onChange={update} required/>
          <br></br>

          <input type="text" name="firstName" id="firstName" title="Your first name"
          pattern="[a-zA-Z'-'\s]*" maxLength="20" placeholder="First Name" onChange={update} required />
          <br></br>

          <input type="text" name="lastName" id="lastName" title="Your last name"
          pattern="[a-zA-Z'-'\s]*" maxLength="20" placeholder="Last Name" onChange={update} required />
          <br></br><br></br>

          <span>Contact Details</span><br></br>
          <Cleave placeholder="Phone Number" options={{phone: true, phoneRegionCode: "SG"}}
          name="phoneNumber" onChange={update} className="form-field" required/><br></br>

          <input type="email" name="email" id="email" placeholder="myemail@example.com"
          onChange={update} title="Your email address" required/><br></br>
          <br></br>

          <span>Special Requests</span><br></br>
          <textarea name="requests" id="requests" rows="5" cols="50"
          className="textarea" onChange={update} /><br></br>
          <br></br>

          <span>Credit Card Information</span><br></br>
          <Cleave placeholder="Enter credit card number" options={{creditCard: true,
          onCreditCardTypeChanged: function(type){console.log(type)}}}
          name="CCN" onChange={update} className="form-field" required/>
          <br></br>

          <Cleave placeholder="Expiry Date: MM/YY" options={{date: true, dateMin: min, datePattern: ["m", "y"]}} 
          name="expDate" onChange={update} className="form-field" required/>
          <br></br>

          <Cleave placeholder="CVC/CVV" options={{blocks: [3], numericOnly: true}} 
          name="CVC" onChange={update} className="form-field" required />
          <br></br><br></br>

          <span>Billing Address</span><br></br>
          <textarea name="billaddrs" id="billaddrs" rows="3" cols="50"
          className="textarea" onChange={update} />
          <br></br><br></br>

          <button type="submit" name="submit">Submit</button>

        </form>
    </Container>
  );
}

  export default Form
  