import React, {useContext} from 'react'
import Avatar from '@mui/material/Avatar';
import { UserContext } from '../context/UserContext';
import { Link } from "react-router-dom";

function Popup(){
    const {value, setValue} = useContext(UserContext);
    function handleSignOut(){
        setValue({
            state :false,
            user:{}
        })
        document.getElementById("signInDiv").hidden = false;
    }
    return (value.state)?(
        <div className = "popup">
            <div className='popup-row1'>
                <div className='signOutBtn' onClick={()=>handleSignOut()}>Sign out</div>
            </div>
            <div className='popup-row2'>
                <div className='image-column'>
                    <Avatar 
                    alt={value.user.name}
                    src={value.user.picture}
                    sx={{ width: 88, height: 88 }}
                     /> 
                </div>
                <div className='details-column'>
                    <div className="username">{value.user.name}</div>
                    <br/>
                    <div className='email'>{value.user.email}</div>
                    <Link to={`/`}>my bookings</Link>
                </div>
            </div>
        </div>
    ):"";
}
export default Popup