import React, {useState} from "react";
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import Typography from '@mui/material/Typography';

// import { matchSorter } from 'match-sorter';

const filterOptions = (options, { inputValue }) => {
    if (inputValue === "") return [];
    else {
        return options.filter((item) => {
            return item.term.toLowerCase().includes(inputValue.toLowerCase())
        })
        // return matchSorter(options, inputValue, {keys: ["term"]}).slice(0,20)
    }
};

const LISTBOX_PADDING = 8; // px
function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
      ...style,
      top: style.top + LISTBOX_PADDING,
    };
  
    if (dataSet.hasOwnProperty('group')) {
      return (
        <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
          {dataSet.group}
        </ListSubheader>
      );
    }
  
    return (
      <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
        {dataSet[1]}
      </Typography>
    );
}
  
const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
  
// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
        noSsr: true,
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (child.hasOwnProperty('group')) {
        return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
        return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
        <OuterElementContext.Provider value={other}>
            <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
            >
            {renderRow}
            </VariableSizeList>
        </OuterElementContext.Provider>
        </div>
    );
});
  
ListboxComponent.propTypes = {
    children: PropTypes.node,
};
  
const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
        padding: 0,
        margin: 0,
        },
    },
});


function SearchDest(props){
    const { placeholder, data, value, setValue } = props

    const [inputValue, setInputValue] = useState('');

    return(
        <Autocomplete
            data-testid = "Autocomplete"
            id="country-select"
            name="destsearch"
            value={value}
            onChange={(event, newValue) => {
                // console.log("hello")
                setValue(newValue);
                props.setValid();
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
            // console.log("Heelo2")
            setInputValue(newInputValue);
            setValue(newInputValue);
            props.setValid();
            }}

            autoHighlight
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}

            options={data}
            getOptionLabel={(option) => option.term}
            filterOptions={filterOptions}

            noOptionsText={inputValue.length ? "No matching destination" : "e.g. city or region"}

            renderInput={(params) => (
                <TextField
                    data-testid="searchInput"
                    {...params}
                    label={placeholder}
                    inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    error={props.validator.error}
                    helperText={props.validator.helperText}
                />
            )}
            renderOption={(props, option) => [props, option.term]}
            // renderGroup={(params) => params}
        />
    );
}
export default SearchDest