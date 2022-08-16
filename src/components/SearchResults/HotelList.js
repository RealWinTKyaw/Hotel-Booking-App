import React, {useState, useContext, useEffect, useCallback, useMemo} from "react";
import { SearchContext } from "../../context/SearchContext";
import Loading from "../Loading";
import HotelCard from "./HotelCard";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useSearchParams } from "react-router-dom";
import { paramsToObj } from "../../services/router-utils";
import Pagination from '@mui/material/Pagination';
import usePagination from "./Pagination";

const HotelList = (props) => {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => paramsToObj(searchParams), [searchParams]);
  const results = useContext(SearchContext);
  const { hotels: cHotels, prices: cPrices, getPrices, refreshQuery } = results;

  useEffect(() => {
    console.info(`Refreshed query: ${query}`)
    refreshQuery(query)
  }, [query, refreshQuery]);

  const [hotelInfo, setHotelInfo] = useState({hotels: [{name:'Getting your hotels...'}], prices: 'Retrieving prices...'});

  const [hotelPrices, setHotelPrices] = useState([]);
  
  /** Retrieve hotel info and prices from api */
  const getHotels = useCallback(async () => {
    let hotels = await cHotels
    let prices = await cPrices

    if (prices.hotels.length < Math.min(hotels.length /100, 10)) {
      [prices] = await Promise.all([
        getPrices(),
        new Promise((res)=> setTimeout(res, 2000)) // timeout
      ]);
      
    } else {
      let linked = prices.hotels.map(pHotel => {
        let match = hotels.find((iHotel) => {
          return iHotel.id === pHotel.id
        })
        if (match !== undefined) match.price = pHotel.price;
        return match
      }).filter((hotel) => hotel !== undefined);

      linked.sort((a,b) => {
        if (b.rating - a.rating === 0) {
          return b.price - a.price;
        }
        return b.rating - a.rating 
      })
      setHotelPrices(linked);
    }
    setHotelInfo({hotels: hotels, prices: prices});
  }, [getPrices, cHotels, cPrices])

  // const [hotelCards, setHotelCards] = useState({page: 1, count: 0, currentHotels:[], currentPrices: [], });

  useEffect(() => {
    getHotels();
  }, [getHotels])


  let [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const count = Math.ceil(hotelPrices.length / PER_PAGE);

  const currentHotels = usePagination(hotelPrices, PER_PAGE);
  // const currentPrices = usePagination(hotelInfo.prices, PER_PAGE);
  // combine currentHotels and currentPrices to pass all hotel and price in the same mapping (maybe use concat since both are arrays)

  const handleChange = (e, p) => {
    setPage(p);
    currentHotels.jump(p);
    // currentPrices.jump(p);
  };


  if ( hotelInfo.hotels === null || count === 0) {
    return <Loading />;
  }
  else if (currentHotels !== undefined || count !== undefined) {
    return (
      <Container sx={{
        minWidth: 400,
        width: "80%",
        maxWidth: 800,
        display: 'flex',
        justifyContent: "center"
      }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 1
          }}
        >
          {currentHotels.currentData().map((hotel, idx) => <HotelCard key={`hotel-${idx}`} hotel={hotel}/>)}
          {/* {hotelInfo.currentHotels.map((hotel) => <HotelCard hotel={hotel} price={1}/>)} */}
    
          <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
          showFirstButton
          showLastButton />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{
      display: 'flex',
      justifyContent: "center"
    }}>
      <Box
        sx={{
          minWidth: 400,
          width: "60%",
          maxWidth: 800,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {hotelInfo.hotels.slice(0,20).map((hotel) => <HotelCard hotel={hotel} price={1}/>)}
      </Box>
    </Container>
    
  );
}

export default HotelList;