import React from "react";

import TextField from '@mui/material/TextField';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function DateRangePicker(props) {
    const {startDate, setStartDate, endDate, setEndDate} = props
    return(
        <LocalizationProvider data-testid = "provider" dateAdapter={AdapterDateFns}>
            <DatePicker
            data-testid= "datepicker1"
            label="Check In"
            inputFormat="dd/MM/yyyy"
            value={startDate}
            onChange={date => setStartDate(date)}
            disablePast
            minDate={new Date()}
            renderInput={(params) => <TextField data-testid = "checkin" {...params} />}
            sx={{
                px: 1
            }}
            />

            <DatePicker
            data-testid="datepicker2"
            label="Check Out"
            inputFormat="dd/MM/yyyy"
            value={endDate}
            onChange={date=>setEndDate(date)}
            disablePast
            minDate={startDate}
            renderInput={(params) => <TextField data-testid= "checkout" {...params} />}
            />
        </LocalizationProvider>
    );
}
export default DateRangePicker