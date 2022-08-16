import React, { Component } from 'react';
import structuredClone from '@ungap/structured-clone'; // for tests
import api from "../services/api";
import destinations from "../components/SearchBar/destinations.json";

//import FetchedData from './Contentful';
const SearchContext = React.createContext();
// CONTEXT PROVIDER allows all components in the component tree to access it
// to wrap component tree with RoomContext provider
// consumer is used to access the information
// use class to pass in a state as a value, methods can change the state thus making it more flexible
export default class SearchProvider extends Component {
  // default values for search results
  defaultState = {
    hotels: [],
    prices: {hotels: []},
    selectedHotel: {
      id: undefined,
      fetched: false,
      info: {name: undefined},
      image: null
    },
    roomPrices: {completed: false, rooms: []},
    selectedRoom: {
      roomNormalizedDescription: null,
      price: undefined
    }
  }

  state = { 
      loading: false,
      fetched: false,
      destination: undefined,
      query: {
        destination_id: undefined,
        checkin: undefined,
        checkout: undefined,
        currency: undefined,
        guests: undefined
      },
      ...structuredClone(this.defaultState),

      updateQuery: async (dest, newQuery) => {
        // update query params
        this.setState({
          loading: true, destination: dest, query: newQuery, 
          ...structuredClone(this.defaultState) });
        // update stored search results
        if (newQuery.destination_id) {
          // get data from api
          const hotels = await api.getHotelsByDestination(newQuery.destination_id);
          const prices = await api.getHotelPricesByDestination(newQuery);

          // update data in state
          this.state.updateResults(hotels, prices);
        } else {
          console.info("No query")
        }
      },
      updateResults: async (hotels, prices) => {
        this.setState({
          loading: false,
          hotels: hotels,
          prices: prices
        });
      },
      getPrices: async () => {
        const prices = await api.getHotelPricesByDestination(this.state.query);
        this.setState({prices: prices});
        // console.log(prices.hotels);
        return prices;
      },
      getHotel: async (id) => {
        const hotel = await api.getHotelById(id);
        const image = hotel.image_details.count ? hotel.image_details.prefix + 0 + hotel.image_details.suffix : false
        
        // if (this.state.selectedHotel.prices)

        this.setState({selectedHotel:{
          id: id, fetched: true, info: hotel, image: image}})
        return hotel
      },
      getHotelPrice: async (id, query) => {
        const prices = await api.getHotelPrice(id, query);
        if (prices.rooms.length > 0) {
          
          this.setState({roomPrices: prices});}
        return prices;
      },
      setSelectedRoom: (room) => {
        this.setState({...this.state, selectedRoom: room})
      },
      refreshQuery: (query) => {
        if (query.destination_id !== this.state.query.destination_id) {
          let dest = destinations.find((value) => value.uid === query.destination_id )
          this.state.updateQuery(dest.term, query)
        }
      },
      handleBooking: async (user, input) => {

        if (!this.state.query.destination_id || !this.state.selectedHotel.id) {
          alert("You have not selected a destination.");
          return;
        }

        let startDate = Date.parse(this.state.query.checkin)
        let endDate = Date.parse(this.state.query.checkout)
  
        const nights = (start, end) => {
          return Math.round((end-start)/86400000)
        }
        
  
        const booking = {
          destination_id: this.state.query.destination_id,

          destination_name: this.state.destination,

          hotel_id: this.state.selectedHotel.id,

          hotel_name: this.state.selectedHotel.info.name,

          booking_info: {
              nights: nights(startDate, endDate),
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              adults: this.state.query.guests,
              message: input.requests,
              room_type: this.state.selectedRoom.price_type
          },
          price: this.state.selectedRoom.price,
          sup_booking_response: {
              cost: this.state.selectedRoom.roomAdditionalInfo.displayFields.kaligo_service_fee,
          },
          guest_info: {
              salutation: input.salutation,
              firstname: input.firstName,
              lastname: input.lastName,
              phone: input.phoneNumber,
              email: input.email
          },
          payee_info: {
              payee_id: user.uid
          }
        }
        this.bookingDetails.formFields = input
        const res = await api.addBooking(user.uid, booking);
        return res
  
      }
    };

    bookingDetails = {
      formFields: [],
    }


    getRoom = slug => { 
      // returns the name of the room depending on the slug attribute of the room (see localdata)
      let tempRooms = [...this.state.rooms];
      const room = tempRooms.find(room => room.slug === slug);
      return room;
      };

  render() { // Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.
    return (
      // value prop to be passed to consuming components that are descendants of this Provider.
      // use this.state to lift the value to the parent state to prevent unintentional renders in consumers when a provider's parent re-renders
      // pass down state information to the value
    <SearchContext.Provider 
    value={{
      ...this.state,
      getRoom: this.getRoom,
      // passBooking: (user, input) => {return this.handleBooking(user, input)},
      bookingDetails: this.bookingDetails,
      params: this.query,
      handleChange: this.handleChange}}> 
          {/* All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes. */}
          {/* ensuring that children components are being accessed */}
        {this.props.children}
    </SearchContext.Provider>
    );
  }
}


const SearchConsumer = SearchContext.Consumer;

export{ SearchProvider, SearchConsumer, SearchContext} // room provider wraps the whole app in index.js

export function withSearchConsumer(Component) {
    return function ConsumerWrapper(props) {
      return ( // A React component that subscribes to context changes. Using this component lets you subscribe to a context within a function component
        <SearchConsumer> 
          {/* The value argument passed to the function will be equal to the value prop of the closest Provider for this context above in the tree. */}
          {value => <Component {...props} context={value} />}
        </SearchConsumer>
      );
    };
  }
// wrap router and app in the component tree
// allows you to avoid the step of passing data from one page to another
