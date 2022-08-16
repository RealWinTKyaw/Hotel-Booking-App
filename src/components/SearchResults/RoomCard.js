import React, {useState, useContext, useMemo} from "react";
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { paramsToObj } from "../../services/router-utils";
import PropTypes from "prop-types";
import { memo } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import noMedia from "../../images/no-image.jpg";
import PopModal from "./PopModal";
const RoomCard = memo((props) => {

    const context = useContext(SearchContext);
    const [ searchParams ] = useSearchParams();
    const query = useMemo(() => paramsToObj(searchParams), [searchParams]);

    const navigate = useNavigate();
    /* 
    for each object element in rooms array,render a room card based on the elements in the object. Pass in the following attributes:
        description
        long_description --> to put in popup
        images (an array of objects) --> put SOME in popup
        ammenities --> to put in popup
        chargableRate
    */
    // images value is an array of objects with url, high resolution url and hero image keys. Each object is one image
    // let images = props.room.images;
    // images.map((pic) => console.log(pic.url));
    // ammenities is an array of string elements
    const {description: name, images, chargeableRate: price} = props.room;
    const [open, setOpen] = useState(false);
    const handleClose= () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const handleSelect = () => {
        context.setSelectedRoom(props.room)
        navigate({
            pathname: "/form",
            search: `?${createSearchParams(query)}`
        })
    }

    return (
        <Card sx={{ height: 150,
        display: 'flex'
        }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                src={images.length > 0 ? images[0].url : noMedia}
                alt={props.room.description}
            />
            <CardActionArea sx={{display: 'flex'}} onClick={handleOpen}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6">
                    {name}
                </Typography>
                
                {/* change={setOpen} handleClose={() => {setOpen(false);
                console.log("triggered")}} */}
                {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                    {amenities}
                </Typography> */}
                </CardContent>
            </Box>
            </CardActionArea>
            <PopModal details={props.room} open={open} handleClose={handleClose} handleBooking={handleSelect} canBook={props.canBook}/>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                    ${price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleSelect} disabled={!props.canBook}>
                        {props.canBook ? "Select room" : "Log in to book"}
                    </Button>
                </CardActions>
                
            </Box>
        </Card>
    );
});

RoomCard.propTypes = {
  room: PropTypes.shape({
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    price: PropTypes.number.isRequired
  })
};
export default RoomCard;