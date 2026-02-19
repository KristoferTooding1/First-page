// ===== SEARCH & FILTER SYSTEM =====
// This file handles searching and filtering BMW products by name and price
// It lets users find exactly what they're looking for without page reloads

// ===== INITIALIZE FILTER =====
// Get all product cards from the HTML page
// querySelectorAll finds all elements with class "card"
// These are the BMW M3, M4, M5 product containers
const productCards = document.querySelectorAll('.card');

// ===== MAIN FILTER FUNCTION =====
// This function runs every time the user types in search or changes price
// It checks each product against the search term and price range
function filterProducts() {
    // Get what the user typed in the search box
    // toLowerCase() converts it to lowercase so "M3" and "m3" both work
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Get the minimum price the user entered (or 0 if empty)
    // parseInt() converts the text to a number
    // || 0 means "if nothing, use 0 instead"
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    
    // Get the maximum price the user entered (or Infinity if empty)
    // Infinity means "no limit" - it will accept any high price
    // || Infinity means "if nothing, use Infinity instead"
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    
    // ===== LOOP THROUGH EACH PRODUCT CARD =====
    // forEach runs the code inside {} for each card
    productCards.forEach(card => {
        // Get the product name from the card's data-name attribute
        // HTML example: <div class="card" data-name="BMW M3" data-price="89900">
        // getAttribute gets the value of these custom attributes
        // We stored the name and price here for easy filtering
        const productName = card.getAttribute('data-name').toLowerCase();
        
        // Get the product price from the card's data-price attribute
        // parseInt() converts the text "89900" to the number 89900
        const productPrice = parseInt(card.getAttribute('data-price'));
        
        // ===== CHECK IF PRODUCT MATCHES SEARCH =====
        // includes() checks if the product name contains the search term
        // Example: if user types "M3" and productName is "BMW M3", it returns true
        // || searchTerm === '' means "or if search box is empty (show all)"
        const matchesSearch = productName.includes(searchTerm) || searchTerm === '';
        
        // ===== CHECK IF PRODUCT IS IN PRICE RANGE =====
        // >= means "greater than or equal to"
        // && means "and"
        // So this checks: is price 89900 >= minPrice AND <= maxPrice?
        const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
        
        // ===== SHOW OR HIDE CARD =====
        // classList is a way to add/remove CSS classes to elements
        // We use .hidden class (defined in pood.css) to hide cards
        // If product matches BOTH search AND price, remove the hidden class (show it)
        // Otherwise, add the hidden class (hide it)
        if (matchesSearch && matchesPrice) {
            card.classList.remove('hidden');  // Make it visible
        } else {
            card.classList.add('hidden');     // Make it invisible
        }
    });
    
    // Log to console for debugging - helps see what's happening
    console.log(`Filter: search="${searchTerm}", price: €${minPrice}-€${maxPrice}`);
}

// ===== RESET ALL FILTERS FUNCTION =====
// When user clicks "Reset Filters" button, this clears everything
function resetFilters() {
    // Clear the search input by setting its value to empty string
    document.getElementById('searchInput').value = '';
    
    // Clear min and max price inputs
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    // Show all products by removing hidden class from every card
    productCards.forEach(card => {
        card.classList.remove('hidden');  // Remove hidden class = make visible
    });
    
    // Log
    console.log('Filters reset - showing all products');
}

// ===== QUICK FILTER BUTTONS =====
// These buttons let users quickly filter without typing
// Examples: "M3" button, "Affordable" button, etc.
function quickFilter(type) {
    // Get the search input element
    const searchInput = document.getElementById('searchInput');
    
    // First, clear any previous filters so quick filter starts fresh
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    // ===== SET FILTERS BASED ON WHICH BUTTON WAS CLICKED =====
    // The type parameter tells us which button was clicked
    
    if (type === 'affordable') {
        // "Affordable" button: show cars under €100,000
        document.getElementById('maxPrice').value = 100000;
        searchInput.value = '';  // Clear search box
        
    } else if (type === 'luxury') {
        // "Luxury" button: show cars €100,000 and above
        document.getElementById('minPrice').value = 100000;
        searchInput.value = '';  // Clear search box
        
    } else if (type === 'model') {
        // type = model name like 'M3', 'M4', 'M5'
        searchInput.value = type;
        
    } else {
        // For model buttons (M3, M4, M5), type is the model name
        searchInput.value = type;
    }
    
    // After setting filters, run filterProducts to show/hide cards
    filterProducts();
}

// ===== ATTACH EVENT LISTENERS =====
// Event listeners wait for user actions and run code when they happen
// This code runs when the page loads (DOMContentLoaded)
window.addEventListener('DOMContentLoaded', function() {
    // When user types in search box, run filterProducts immediately
    // 'input' event fires every time the user types a character
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    
    // When user changes minimum price and clicks away, run filterProducts
    // 'change' event fires when user finishes editing the input
    document.getElementById('minPrice').addEventListener('change', filterProducts);
    
    // When user changes maximum price and clicks away, run filterProducts
    document.getElementById('maxPrice').addEventListener('change', filterProducts);
    
    // Note: We use 'change' for price (fires when user finishes)
    // but 'input' for search (fires as user types in real-time)
});

