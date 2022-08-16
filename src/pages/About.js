import SearchBar from "../components/SearchBar/SearchBar";
import destinations from "./destinations.json"
import DatePicker from 'react-date-picker';
import 'react-datepicker/dist/react-datepicker.css';

const Home = () => {
  return (
    <div className="App">
      <SearchBar placeholder="Where are you going?" data={destinations} />
    </div>
    );
  }

  export default Home