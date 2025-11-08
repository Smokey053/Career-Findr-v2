// Import only Bootstrap's grid and utilities (not components)
// This avoids conflicts with Material UI components
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";

// Custom Bootstrap overrides to avoid conflicts with MUI
const style = document.createElement("style");
style.textContent = `
  /* Prevent Bootstrap from overriding MUI styles */
  * {
    box-sizing: border-box;
  }
  
  /* Use Bootstrap only for grid and spacing utilities */
  /* MUI handles all component styling */
`;
document.head.appendChild(style);
