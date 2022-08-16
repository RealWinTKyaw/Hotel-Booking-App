/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import App from '../App';
import {render, fireEvent} from "@testing-library/react"
import { waitFor } from '@testing-library/react';
import Search , {destValid} from '../components/SearchBar/Search';
import SearchBar from "../components/SearchBar/SearchBar";
import DatePicker from "../components/SearchBar/Datepicker/Datepicker";
import { SearchProvider } from '../context/SearchContext';
import { UserProvider } from '../context/UserContext';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from "react-router-dom";
import theme from '../themes/globalTheme';
import userEvent from '@testing-library/user-event';

describe("Rendering everything on search UI",()=>{
    test("renders correctly",()=>{
        const{queryByTestId, queryByPlaceholderText} = render(
          <ThemeProvider theme={theme}>
            <UserProvider>
              <SearchProvider>
                  <BrowserRouter>
                    <Search/>
                  </BrowserRouter>
              </SearchProvider>
            </UserProvider>
          </ThemeProvider>);
        expect(queryByTestId("box1")).toBeTruthy();
        expect(queryByTestId("box2")).toBeTruthy();
        expect(queryByTestId("box3")).toBeTruthy();
        expect(queryByTestId("GuestInput")).toBeTruthy();
        expect(queryByTestId("RoomInput")).toBeTruthy();
        expect(queryByTestId("goBtn")).toBeTruthy();
        expect(queryByTestId("searchInput")).toBeTruthy();
        expect(queryByTestId("checkin")).toBeTruthy();
        expect(queryByTestId("checkout")).toBeTruthy();
    })
})

describe("DatePicker",()=>{
  test("work as intended",async ()=>{

    const{queryByTestId, getAllByPlaceholderText, getByTestId} = render(
      <ThemeProvider theme={theme}>
            <UserProvider>
              <SearchProvider>
                <BrowserRouter>
                  <Search/>
                </BrowserRouter>
              </SearchProvider>
            </UserProvider>
          </ThemeProvider>);
      const checkInDate = new Date();
      const checkInDay = checkInDate.getDate() <10 ? `0${checkInDate.getDate()}`:checkInDate.getDate();
      const checkInMonth = checkInDate.getMonth()+1 <10 ? `0${checkInDate.getMonth()+1}`:checkInDate.getMonth()+1;
      const checkInYear = checkInDate.getFullYear();
      const checkInDateS= `${checkInDay}/${checkInMonth}/${checkInYear}`;

      const checkOutDate = new Date(Date.now() + 86400000);
      const checkOutDay = checkOutDate.getDate() <10 ? `0${checkOutDate.getDate()}`:checkOutDate.getDate();
      const checkOutMonth = checkOutDate.getMonth()+1 <10 ? `0${checkOutDate.getMonth()+1}`:checkOutDate.getMonth()+1;
      const checkOutYear = checkOutDate.getFullYear();
      const checkOutDateS= `${checkOutDay}/${checkOutMonth}/${checkOutYear}`;

      const checkInLabel = queryByTestId("checkin").getElementsByTagName("label")[0];
      const checkInInput = queryByTestId("checkin").getElementsByTagName("input")[0];
      const checkOutLabel = queryByTestId("checkout").getElementsByTagName("label")[0];
      const checkOutInput = queryByTestId("checkout").getElementsByTagName("input")[0];

      const button8Aug = getByTestId("checkout").getElementsByTagName("input")[0];
      const temp = button8Aug.getAttribute('value');
      console.log(temp);

      expect(checkInLabel.textContent).toStrictEqual("Check In");
      expect(checkInInput.value).toBe(checkInDateS);
      // expect(checkInInput.placeholder).toStrictEqual("dd/mm/yyyy");

      expect(checkOutLabel.textContent).toStrictEqual("Check Out");
      expect(checkOutInput.value).toBe(checkOutDateS);
      // expect(checkOutInput.placeholder).toStrictEqual("dd/mm/yyyy");
      
      userEvent.type(checkInInput,"08/08/2022")
      // await fireEvent.change(checkInInput, {target: {value:"08/08/2022"}}); // tries to set past checkOutDate (3/8), fails
      expect(checkInInput.value).toBe(checkInDateS)

      userEvent.type(checkOutInput,"01/08/2022")
      // await fireEvent.change(checkOutInput, {target: {value:"01/08/2022"}}); //tries to set before checkInDate, fails
      expect(checkOutInput.value).toBe(checkOutDateS)

      // userEvent.type(checkOutInput,"08/08/2022")
      // await fireEvent.change(checkOutInput, {target: {value: ""}}); //set new date for checkOut, pass
      // expect(checkOutInput.value).toBe("08/08/2022")

      // userEvent.type(checkInInput,"04/08/2022")
      // await fireEvent.change(checkInInput, {target: {value:"05/08/2022"}}); // set new date for checkin, pass
      // expect(checkInInput.value).toBe("04/08/2022")
  })
})


describe("Input value",()=>{
    test("updates on change", async () =>{
        const {queryByTestId} = render(
          <ThemeProvider theme={theme}>
            <UserProvider>
              <SearchProvider>
                  <BrowserRouter>
                    <Search/>
                  </BrowserRouter>
              </SearchProvider>
            </UserProvider>
          </ThemeProvider>
        );
        const searchInput = queryByTestId("searchInput").getElementsByTagName("input")[0];
        const searchLabel = queryByTestId("searchInput").getElementsByTagName("label")[0];
        expect(searchLabel.textContent).toBe("I want to fly to…")

        userEvent.type(searchInput, "test");
        // await fireEvent.change(searchInput, {target:{value:"test"}});
        // searchInput.setAttribute("value","test")
        expect(searchInput.value).toBe("test");
    })
})


describe("Search button", ()=>{
  describe("with empty query", ()=>{
      test("submit fails, fail is called", ()=>{
          const fail= jest.fn();
          const pass= jest.fn();
          const {getByTestId} = render( 
                <ThemeProvider theme={theme}>
                  <UserProvider>
                    <SearchProvider>
                        <BrowserRouter>
                          <Search fail = {fail} pass= {pass}/>
                        </BrowserRouter>
                    </SearchProvider>
                  </UserProvider>
                </ThemeProvider>
          );
          fireEvent.click(getByTestId("goBtn"));
          expect(fail).toHaveBeenCalled();
          expect(pass).not.toHaveBeenCalled();
      })
  })
  describe("with query",()=>{
      test("pass is called",async ()=>{
          const pass = jest.fn();
          const fail = jest.fn();
          const {getByTestId} = render( 
            <ThemeProvider theme={theme}>
              <UserProvider>
                <SearchProvider>
                    <BrowserRouter>
                      <Search fail = {fail} pass = {pass}/>
                    </BrowserRouter>
                </SearchProvider>
              </UserProvider>
            </ThemeProvider>
      );
        const GuestInput = getByTestId("GuestInput").getElementsByTagName("input")[0];
        const RoomInput = getByTestId("RoomInput").getElementsByTagName("input")[0];
        const checkInInput= getByTestId("checkin").getElementsByTagName('input')[0];
        const checkOutInput = getByTestId('checkout').getElementsByTagName('input')[0];
        const searchInput = getByTestId("searchInput").getElementsByTagName("input")[0];
    
        await userEvent.type(searchInput,"Bali, Indonesia");
        // await fireEvent.change(searchInput, {target:{value:"B"}});

        // console.log(GuestInput.value)
        // console.log(RoomInput.value)
        // console.log(checkInInput.value)
        // console.log(checkOutInput.value)
        // console.log(searchInput.value)
        // expect(searchInput.value).toBe("Bali, Indonesia");
        await fireEvent.click(getByTestId("goBtn"));
        expect(getByTestId("goBtn").textContent).toBe("Go!")
        expect(fail).not.toHaveBeenCalled();
        expect(pass).toHaveBeenCalled();
      })
  })
})

describe("Guest button",()=>{
    test("increment & decrement", ()=>{
        const {queryByTestId} = render(
          <ThemeProvider theme={theme}>
            <UserProvider>
              <SearchProvider>
                  <BrowserRouter>
                    <Search/>
                  </BrowserRouter>
              </SearchProvider>
            </UserProvider>
          </ThemeProvider>
        );
        const GuestInput = queryByTestId("GuestInput").getElementsByTagName("input")[0];
        const GuestLabel = queryByTestId("GuestInput").getElementsByTagName("label")[0];
        // console.log(GuestInput)
        expect(GuestLabel.textContent).toStrictEqual("No. Of Guests");
        expect(GuestInput.min).toStrictEqual("1");
        expect(GuestInput.value).toStrictEqual("1");
        fireEvent.change(GuestInput, {target: {value:"test"}});
        expect(GuestInput.value).toStrictEqual("1");
        fireEvent.change(GuestInput, {target: {value:"0"}});
        expect(GuestInput.value).toStrictEqual("1");
        fireEvent.change(GuestInput, {target: {value:"2"}});
        expect(GuestInput.value).toStrictEqual("2");
        fireEvent.change(GuestInput, {target: {value:"-1"}});
        expect(GuestInput.value).toStrictEqual("2");
        fireEvent.change(GuestInput, {target: {value:"1"}});
        expect(GuestInput.value).toStrictEqual("1");
    })
})

describe("Room button",()=>{
    test("increment & decrement", ()=>{
      const {queryByTestId} = render(
        <ThemeProvider theme={theme}>
          <UserProvider>
            <SearchProvider>
                <BrowserRouter>
                  <Search/>
                </BrowserRouter>
            </SearchProvider>
          </UserProvider>
        </ThemeProvider>
      );
      const RoomInput = queryByTestId("RoomInput").getElementsByTagName("input")[0];
      const RoomLabel = queryByTestId("RoomInput").getElementsByTagName("label")[0];
      expect(RoomLabel.textContent).toStrictEqual("No. Of Rooms");
      expect(RoomInput.min).toStrictEqual("1");
      expect(RoomInput.value).toStrictEqual("1");
      fireEvent.change(RoomInput, {target: {value:"test"}});
      expect(RoomInput.value).toStrictEqual("1");
      fireEvent.change(RoomInput, {target: {value:"0"}});
      expect(RoomInput.value).toStrictEqual("1");
      fireEvent.change(RoomInput, {target: {value:"2"}});
      expect(RoomInput.value).toStrictEqual("2");
      fireEvent.change(RoomInput, {target: {value:"-1"}});
      expect(RoomInput.value).toStrictEqual("2");
      fireEvent.change(RoomInput, {target: {value:"1"}});
      expect(RoomInput.value).toStrictEqual("1");
    })
})