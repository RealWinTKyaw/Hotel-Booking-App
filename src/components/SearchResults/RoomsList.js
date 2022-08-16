import React, {memo, useState, useContext, useEffect} from "react";
import { SearchContext } from "../../context/SearchContext";
import Loading from "../Loading";
import RoomCard from "./RoomCard";
import Container from "@mui/material/Container";
import Pagination from '@mui/material/Pagination';
import usePagination from "./Pagination"
import ErrorLoading from "../ErrorLoading";

const RoomsList = memo((props) => {
  const {rooms, canBook} = props;

  const results = useContext(SearchContext);
  const { loading } = results;

  let [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const [pageCount, setPageCount] = useState(0);
  const [roomList, setRooms] = useState([]);

  const currentRooms = usePagination(roomList, PER_PAGE);
  console.log(rooms.length);

  useEffect(() => {
    if (rooms.length) {
      let count = Math.ceil(rooms.length / PER_PAGE);
      setPageCount(count);
      setRooms(rooms)
    }
  }, [rooms])

  

  const handleChange = (e, p) => {
    setPage(p);
    currentRooms.jump(p);
  };

  if (loading) {
    return <Loading />;
  }

  if (rooms.length === 0){
    return <ErrorLoading />;
  }

  return (
    <Container
      sx={{
        minWidth: 400,
        width: "70%",
        maxWidth: 800,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >

        {currentRooms.currentData().map((room, idx) => {
        return(
          <RoomCard key={`room-${idx}`} room={room} canBook={canBook} />)}
        )}
      <Pagination
      count={pageCount}
      size="large"
      page={page}
      variant="outlined"
      shape="rounded"
      onChange={handleChange} />
    </Container>
  );
})

export default RoomsList;