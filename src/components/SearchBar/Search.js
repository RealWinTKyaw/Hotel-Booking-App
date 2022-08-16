import React, {useState, useContext} from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import SearchBar from "./SearchBar";
import destinations from "./destinations.json"
import DatePicker from "./Datepicker/Datepicker"

import { Button } from '@mui/material';

import { SearchContext } from "../../context/SearchContext";

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function Search({fail,pass}) {
	const {updateQuery} = useContext(SearchContext);
	const theme = useTheme();
	const navigate = useNavigate();

	const [dest, setDest] = useState(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));
	const MaxDateLimit= new Date(2099,11,31);
	const MinDateLimit = new Date();
	MinDateLimit.setDate(MinDateLimit.getDate()-1);
	const [rooms, setRooms] = useState(1);
	const [guests, setGuests] = useState(1);

	const [valDest, setValDest] = useState(false);
	const [valCheckIn, setValCheckIn] = useState(false);
	const [valCheckOut, setValCheckOut] = useState(false);
	const [valRooms, setValRooms] = useState(false);
	const [valGuests, setValGuests] = useState(false);

	const helperText = {
		dest: "Select a destination",
		in: "Select check in date", 
		out: "Select check out date", 
		rooms: "Required", 
		guests: "Required"
	}

	const getHelperText = (field, value) => !value ? " " : helperText[field];

	const getValidator = (field) => {
		const values = {
			dest: valDest,
			in: valCheckIn,
			out: valCheckOut,
			rooms: valRooms,
			guests: valGuests
		}

		return {error: values[field], helperText: getHelperText(field, values[field])}
	}

	const setValid = (field, value) => {
		const callbacks = {
			dest: setValDest,
			in: setValCheckIn, 
			out: setValCheckOut, 
			rooms: setValRooms, 
			guests: setValGuests
		}
		console.log(`validator set ${field}:${value}`)
		callbacks[field](value);
	}



	// const destValid = e => e ? setValProps({error: false, helperText: " "}) : setValProps({error: true, helperText: "Select a destination"});


	const submit = async () => {
		let count = 0
		if(!dest) {
			setValid("dest", true);
			count++
		}

		if( isNaN(startDate) || startDate < MinDateLimit){
			setValid("in", true);
			count++
		}

		if( isNaN(endDate) || startDate > endDate || endDate > MaxDateLimit ){
			setValid("out", true);
			count++
		}

		if( !rooms || rooms < 0 ){
			setValid("rooms", true);
			count++
		}	  
		if ( !guests || guests < 0){
			setValid("guests", true);
			count++
		}

		if (count) {

			setDest("");
			setStartDate(new Date());
			setEndDate(new Date(Date.now() + 86400000));
			setRooms(1);
			setGuests(1);

			fail()

		} else {
			// setValid("dest", false);
			// setValid("in", false);
			// setValid("out", false);
			// setValid("rooms", false);
			// setValid("guests", false);

			const query = {
				destination_id: dest.uid,
				checkin: formatDate(startDate),
				checkout: formatDate(endDate),
				currency: "SGD",
				guests: guests
			}

			updateQuery(dest.term, query);
			navigate({
				pathname: "/destination",
				search: `?${createSearchParams(query)}`
			})

			pass()
		}
	}

	return (
			<Box 
				data-testid = "box1"
				id="search-form"
				sx={{
					minWidth: 200,
					width: '50%',
					maxWidth: 400,
					minHeight: 300,
					p: 2,
					display: 'grid',
					gridTemplateColumns: useMediaQuery(theme.breakpoints.up('sm')) ? 'repeat(2, 1fr)' : '1fr',
					gridTemplateRows: 'repeat(3, 1fr)',
					gap: 1
				}}>
				<Box data-testid = "box2" sx={{ gridColumn: useMediaQuery(theme.breakpoints.up('sm')) ? 'span 2' : 'span 1'}}>
					<SearchBar 
						data-testid = "SearchBar"
						placeholder="I want to fly to…"
						data={destinations}
						setValue={setDest}
						validator={getValidator("dest")}
						setValid={()=> setValid("dest", true)}
					/>
				</Box>
				<DatePicker 
					data-testid = "DatePicker"
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
					name='destsearch'
				/>
				<TextField
					data-testid = "RoomInput"
					type='number'
					name='destsearch'
					label="No. Of Rooms"
					value={rooms}
					error={valRooms}
					helperText={getHelperText("rooms", valRooms)}
					onChange={(event) => {
						const newValue = event.target.value
						if (newValue>0){
							setRooms(newValue);
						}
						else{
							setRooms(rooms);
						}
							
						}}
					inputProps={{min: 1}}
				/>
				<TextField
					data-testid = "GuestInput"
					type='number'
					name='destsearch'
					label="No. Of Guests"
					value={guests}
					error={valGuests}
					helperText={getHelperText("guests", valGuests)}
					onChange={(event) => {
						const newValue = event.target.value
						if (newValue>0){
							setGuests(newValue);
						}
						else{
							setGuests(guests);
						};
						}}
					inputProps={{min: 1}}

				/>
				<Box 
					data-testid="box3"
					sx={{ 
						gridColumn: useMediaQuery(theme.breakpoints.up('sm')) ? 'span 2' : 'span 1',
						justifySelf: 'center'
					}}
				>
					<Button  data-testid = "goBtn" variant="contained" onClick={submit}>
						Go!
					</Button>
				</Box>
			</Box>
	)
}

export default Search;

  