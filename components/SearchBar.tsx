// import React from "react";
// import { TextField, IconButton, ClickAwayListener } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";

// export default function SearchBar({
//     value,
//     onChange,
//     onSearch,
//     placeholder = "Search...",
//     debounceMs = 0,
// }) {
//     const [open, setOpen] = React.useState(false);
//     const debounceRef = React.useRef(null);

//     const handleChange = (e) => {
//         const val = e.target.value;
//         onChange(val);

//         if (debounceMs > 0 && onSearch) {
//             clearTimeout(debounceRef.current);
//             debounceRef.current = setTimeout(() => {
//                 onSearch(val);
//             }, debounceMs);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             onSearch?.(value);
//             setOpen(false);
//         }
//     };

//     const handleClose = () => {
//         if (!value) setOpen(false);
//     };

//     return (
//         <ClickAwayListener onClickAway={handleClose}>
//             <div className="flex items-center">
//                 {!open && (
//                     <IconButton
//                         size="small"
//                         onClick={() => setOpen(true)}
//                         className="!p-1"
//                     >
//                         <SearchIcon fontSize="small" />
//                     </IconButton>
//                 )}

//                 {open && (
//                     <TextField
//                         autoFocus
//                         size="small"
//                         value={value}
//                         placeholder={placeholder}
//                         onChange={handleChange}
//                         onKeyDown={handleKeyDown}
//                         onBlur={handleClose}
//                         className="w-56 bg-white"
//                         inputProps={{
//                             className: "text-xs py-0.5"
//                         }}
//                     />
//                 )}

//             </div>
//         </ClickAwayListener>
//     );
// }


import React from "react";
import { TextField, IconButton, ClickAwayListener, InputAdornment } from "@mui/material";
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
      debounceRef.current = setTimeout(() => onSearch(val), debounceMs);
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
      <div
        style={{
          width: open ? 240 : 36,
          transition: "width 0.3s ease",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {open ? (
          <TextField
            autoFocus
            size="small"
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleClose}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            }}
          />
        ) : (
          <IconButton size="small" onClick={() => setOpen(true)}>
            <SearchIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </ClickAwayListener>
  );
}

