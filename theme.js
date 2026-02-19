// ===== THEME TOGGLE SYSTEM =====
// This file manages light/dark mode switching
// It uses CSS variables to easily swap colors, and localStorage to remember user preference

// ===== INITIALIZE THEME ON PAGE LOAD =====
// When the page first loads, this function checks if user has a saved theme preference
function initTheme() {
    // localStorage.getItem() retrieves saved data from browser storage
    // It looks for a key called 'theme'
    // If user has switched themes before, we get 'light' or 'dark'
    // If they haven't, getItem returns null
    const savedTheme = localStorage.getItem('theme');
    
    // Decide which theme to use
    // If saved theme exists, use it; otherwise use 'dark' as default
    const theme = savedTheme || 'dark';
    
    // Apply the theme to the page
    applyTheme(theme);
    
    // Log to console for debugging
    console.log(`Theme initialized: ${theme}`);
}

// ===== APPLY THEME FUNCTION =====
// This function switches the page colors between light and dark
function applyTheme(theme) {
    // Get the <html> element (root of the page)
    // This is where we set CSS variables that cascade to all elements
    const root = document.documentElement;
    
    // Define what colors to use for each theme
    // CSS variables are defined with -- prefix (e.g., --bg-primary)
    // They can be used in CSS with var(--bg-primary)
    if (theme === 'light') {
        // LIGHT THEME: bright backgrounds, dark text
        root.style.setProperty('--bg-primary', '#f5f5f5');      // Light gray background
        root.style.setProperty('--bg-secondary', '#ffffff');    // Pure white for cards
        root.style.setProperty('--text-primary', '#000000');    // Black text
        root.style.setProperty('--text-secondary', '#333333');  // Dark gray text
        root.style.setProperty('--border-color', '#dddddd');    // Light gray borders
        root.style.setProperty('--card-bg', '#ffffff');         // White cards
        root.style.setProperty('--card-shadow', 'rgba(0,0,0,0.1)');  // Subtle shadow
        
    } else if (theme === 'dark') {
        // DARK THEME: dark backgrounds, light text (default, already in CSS)
        root.style.setProperty('--bg-primary', '#0a0a0a');      // Almost black
        root.style.setProperty('--bg-secondary', '#000000');    // Pure black
        root.style.setProperty('--text-primary', '#ffffff');    // White text
        root.style.setProperty('--text-secondary', '#cccccc');  // Light gray text
        root.style.setProperty('--border-color', '#333333');    // Dark gray borders
        root.style.setProperty('--card-bg', '#121212');         // Very dark gray
        root.style.setProperty('--card-shadow', 'rgba(0,0,0,0.6)');  // Stronger shadow
    }
    
    // Update the button text to show what theme WE'RE SWITCHING TO (opposite of current)
    // This helps users understand what clicking the button will do
    const themeButton = document.getElementById('themeToggle');
    if (themeButton) {
        // If we just applied dark theme, button shows "Light Mode" (offer to switch to light)
        // If we just applied light theme, button shows "Dark Mode" (offer to switch to dark)
        themeButton.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    
    // Save the current theme to localStorage so it's remembered next time
    localStorage.setItem('theme', theme);
    
    // Log for debugging
    console.log(`Theme applied: ${theme}`);
}

// ===== TOGGLE THEME FUNCTION =====
// When user clicks the theme button, this function switches themes
function toggleTheme() {
    // Get the currently saved theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Switch to the opposite theme
    // If currently dark, switch to light; if currently light, switch to dark
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply the new theme
    applyTheme(newTheme);
    
    // Log action for debugging
    console.log(`Theme toggled: ${currentTheme} → ${newTheme}`);
}

// ===== RUN INITIALIZATION ON PAGE LOAD =====
// When the page first loads and the DOM is ready, initialize the theme
window.addEventListener('DOMContentLoaded', function() {
    // Call initTheme to set up the correct theme on page load
    initTheme();
});

// Example comment explaining CSS variables:
// CSS variables (also called "custom properties") are a powerful way to manage themes
// They start with -- and can be used with var() function in CSS
// 
// How it works:
// 1. In JavaScript: root.style.setProperty('--bg-primary', '#f5f5f5')
//    This sets a CSS variable in the root <html> element
// 
// 2. In CSS: body { background: var(--bg-primary); }
//    This uses the variable, so background changes when variable changes
// 
// 3. All child elements inherit the variable, so entire page updates instantly
// 
// Advantages:
// - Easy to manage: change one variable, affects everything using it
// - Fast: just CSS properties, no DOM repainting needed
// - Clean: separates theme definition from styling logic
// - Persistent: localStorage remembers user choice
