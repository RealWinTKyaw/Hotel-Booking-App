import React from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { memo } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import noMedia from "../../images/no-image.jpg";

const HotelCard = memo((props) => {
    const { hotel } = props;
    const [query] = useSearchParams()
    const navigate = useNavigate();

    let image = hotel.image_details && hotel.image_details.count ? hotel.image_details.prefix + 0 + hotel.image_details.suffix : noMedia;

    const handleClick = () => {
      navigate({
        pathname: hotel.id,
        search: `?${createSearchParams(query)}`
      })
    }

  return (
    <Card sx={{ height: 150,
    width: 1,
    display: 'flex'
      }}>
        <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={image}
            alt={hotel.name}
        />
        <CardActionArea 
          onClick={handleClick}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <CardContent sx={{ flex: '0 1 auto' }}>
              <Typography component="div" variant="h5">
                {hotel.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                {hotel.address}
              </Typography>
              <Rating value={hotel.rating} readOnly size= "small"
              emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />} />
            </CardContent>
          </Box>
        </CardActionArea>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ flex: '2 0 auto', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              ${hotel.price}
            </Typography>
          </CardContent>
        </Box>
    </Card>
  );
});

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired
  })
};
export default HotelCard;