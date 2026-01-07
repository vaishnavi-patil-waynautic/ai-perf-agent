// // components/SearchBar.jsx
// import React from "react";
// import { TextField, Button } from "@mui/material";

// export default function SearchBar({
//   value,
//   onChange,
//   onSearch,
//   placeholder = "Search...",
//   debounceMs = 0,
//   fullWidth = true,
// }) {
//   const debounceRef = React.useRef(null);

//   const handleChange = (e) => {
//     const newValue = e.target.value;
//     onChange(newValue);

//     if (debounceMs > 0 && onSearch) {
//       clearTimeout(debounceRef.current);
//       debounceRef.current = setTimeout(() => {
//         onSearch(newValue);
//       }, debounceMs);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       onSearch?.(value);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 w-full">
//       <TextField
//         value={value}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         size="small"
//         fullWidth={fullWidth}
//         className="bg-white"
//       />

//       {/* <Button
//         variant="contained"
//         onClick={() => onSearch?.(value)}
//         className="!normal-case !px-4"
//       >
//         Search
//       </Button> */}
//     </div>
//   );
// }


// components/SearchBar.jsx
import React from "react";
import { TextField, IconButton, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = "Search...",
    debounceMs = 0,
}) {
    const [open, setOpen] = React.useState(false);
    const debounceRef = React.useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);

        if (debounceMs > 0 && onSearch) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onSearch(val);
            }, debounceMs);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch?.(value);
            setOpen(false);
        }
    };

    const handleClose = () => {
        if (!value) setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div className="flex items-center">
                {!open && (
                    <IconButton
                        size="small"
                        onClick={() => setOpen(true)}
                        className="!p-1"
                    >
                        <SearchIcon fontSize="small" />
                    </IconButton>
                )}

                {open && (
                    <TextField
                        autoFocus
                        size="small"
                        value={value}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleClose}
                        className="w-40 bg-white"
                        inputProps={{
                            className: "text-xs py-0.5"
                        }}
                    />
                )}

            </div>
        </ClickAwayListener>
    );
}

