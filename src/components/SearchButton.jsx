import React from 'react';
import {Button} from 'react-bootstrap';
import { getData } from '../services/api/Api';

export const SearchButton = (props) => {
    const clickedSearch = () => {
        console.log(getData("https://xkcd.com/2627/info.0.json"));
    }

    return (
        <Button onClick={clickedSearch}>Search</Button>
    )

}