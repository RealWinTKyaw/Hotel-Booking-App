import BannerBG from "../components/BannerComponents/BannerBG";
import React from 'react';
import Button from '@mui/material/Button';
import Banner from "../components/BannerComponents/Banner";
import { useNavigate } from 'react-router-dom';
export default function BookingConfirm() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate({
            pathname: "/"
        });
    }

  return (
    <div>
      <BannerBG bannerBG='defaultBannerBG'>
        <Banner title={"Booking Confirmed"}>
            <Button onClick={handleBack} variant="contained">Back to search</Button>
        </Banner>
      </BannerBG>
    
    </div>
  )
}