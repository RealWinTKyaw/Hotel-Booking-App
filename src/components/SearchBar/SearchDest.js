import React, {useState} from "react";
import "./SearchDest.css";

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-date-picker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// import { matchSorter } from 'match-sorter';

export function SearchDest({placeholder,data, passData}){
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [numGuest, setNumGuest] = useState(1);
    const [numRoom, setNumRoom] = useState(1);
    const [uid,setUid] = useState("");

    const handleFilter = (event) => {              /* event represents the input by user*/
        const searchWord = event.target.value;
        const intermediate = searchWord.toLowerCase();
        setWordEntered(searchWord);
        const newFilter = data.filter((item) => {
            // console.log(item.term.toLowerCase().includes(intermediate));
            // console.log("done");
            return item.term.toLowerCase().includes(intermediate);
        });

        // const newFilter = matchSorter(data, searchWord, {keys: ["term"]})

        if (searchWord === ""){
            setFilteredData([]);
        }
        else{
            setFilteredData(newFilter);
        }
    }

    const handleSearch = () => {       
        if (wordEntered){
            const searchWord = wordEntered;
            const intermediate = searchWord.toLowerCase();
            let newFilter = data.filter((item) => {
                return item.term.toLowerCase().includes(intermediate);
            });
            setUid(newFilter[0].uid);
            console.log(newFilter[0].uid);
            passData(wordEntered);
        }
        else{
            console.log("empty");
        }
    
}

    const setInput = (value)=>{
        setWordEntered(value.term);
        setFilteredData([]);
        setUid(value.uid);
        console.log ("Set",value);
    }
    const searchInput = (value)=>{
        console.log ("Search",value);
    }
   
    const clearInput=()=>{
        setFilteredData([]);
        setWordEntered("");
    }
    const increaseRoom = () =>{
        setNumRoom(numRoom+1);
    }
    const decreaseRoom = () =>{
        if (numRoom!==1){
            setNumRoom(numRoom-1);
        }
        
    }
    const increaseGuest = () =>{
        setNumGuest(numGuest+1);
    }
    const decreaseGuest = () =>{
        if (numGuest !== 1){
            setNumGuest(numGuest-1);
        }
        
    }

    return(
        <div className="search">
            <div className="searchInputs">
                <input type="text" placeholder={placeholder} value= {wordEntered} onChange={handleFilter}/>
                <div className="searchIcon"><CloseIcon data-testid ="clear-button" id="clearBtn" onClick={clearInput}/></div>
                <div className="searchIcon"><SearchIcon data-testid="search-button" id = "searchBtn" onClick={handleSearch}/></div>
            </div>
           
            {filteredData.length !==0 && (
            <div className="dataResult">
                {filteredData.slice(0,15).map((value, key)=>{   /* slice makes the search result only show top 15 result*/
                    return (
                    <title data-testid= "auto-complete" onClick= {()=> setInput(value)} className="dataItem" >
                        <p> {value.term} </p>
                    </title>
                    );
                })}
            </div>
            )}
            <div className="datePickerText">
                <h2>
                    START:
                    <DatePicker data-testid="datepicker1"
                        value={startDate} 
                        onChange={date => setStartDate(date)}
                        minDate={new Date()}
                        format ='dd/MM/yyyy'
                        title="Start Date"
                    />
                    Number of Guests:
                    <button data-testid="+ Guest button" onClick={increaseGuest}>+</button>
                    <span data-testid="numGuest">{numGuest}</span>
                    <button data-testid="- Guest button" onClick={decreaseGuest}>-</button>
                </h2>
                <h2>
                    END:
                    <DatePicker data-testid= "Date"
                        value={endDate} 
                        onChange={date=>setEndDate(date)}
                        minDate={startDate}
                        format ='dd/MM/yyyy'
                    />
                    Number of Rooms:
                    <button data-testid="+ Room button" onClick={increaseRoom}>+</button>
                    <span data-testid = "numRoom">{numRoom}</span>
                    <button data-testid="- Room button" onClick={decreaseRoom}>-</button>
                </h2>     
            </div>
        </div>
    );
}
export default SearchDest