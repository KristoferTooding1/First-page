// ===== SHOPPING CART SYSTEM =====
// This file manages a shopping cart that saves items to the browser's localStorage
// localStorage is like a small database in the browser that remembers data even after closing
//
// Key concepts:
// - cart array: stores all items user has added
// - localStorage: browser's built-in storage that persists across page reloads
// - JSON.stringify/parse: converts between JavaScript objects and text for storage

// ===== INITIALIZE CART FROM BROWSER STORAGE =====
// When the page loads, this line runs first
// It checks if there's a saved cart in localStorage
// If yes, it loads the saved items; if no, it starts with an empty array []

// localStorage.getItem('cart') retrieves data stored under the key 'cart'
// JSON.parse converts the stored text back into a JavaScript array we can work with
// Example: stored text '{"id":1,"name":"M3","price":89900}' becomes a real JavaScript object
// || [] is the "fallback": if nothing is stored, use an empty array instead
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== ADD ITEM TO CART FUNCTION =====
// This runs when user clicks a "Purchase now!" button
function addToCart(productName, price, productId) {
    // Log to browser console for debugging - shows what was clicked
    console.log('addToCart called →', productName, price, productId);
    
    // ===== CREATE PRODUCT OBJECT =====
    // This is a JavaScript object that holds information about one product
    // Objects are like containers that store data in key-value pairs
    // Example: { id: 1, name: "BMW M3", price: 89900, quantity: 1 }
    const product = {
        id: productId,           // Unique ID to identify this specific BMW model
        name: productName,       // Car name, e.g., "BMW M3"
        price: price,            // Price in euros
        quantity: 1              // How many of this product user is buying (start with 1)
    };
    
    // ===== CHECK IF PRODUCT ALREADY IN CART =====
    // find() searches through the cart array looking for a matching product
    // It returns the first match, or undefined if not found
    // This allows us to handle duplicate purchases (increase quantity instead of adding twice)
    const existingProduct = cart.find(item => item.id === productId);
    
    // ===== HANDLE DUPLICATE PURCHASE =====
    // If user clicks "Purchase now!" for M3 twice, we increase quantity instead of adding twice
    if (existingProduct) {
        // Product already in cart, so just increase its quantity by 1
        existingProduct.quantity += 1;  // '+= 1' is shorthand for 'quantity = quantity + 1'
    } else {
        // Product not in cart yet, so add it as a new entry
        // push() adds the new product to the end of the cart array
        cart.push(product);
    }
    
    // ===== SAVE TO BROWSER STORAGE =====
    // This is crucial! Without this line, cart would be lost when user refreshes the page
    // localStorage.setItem(key, value) stores data for later
    // JSON.stringify converts our JavaScript array into text that can be stored
    // localStorage persists even after the browser is closed
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ===== CALCULATE TOTAL ITEMS FOR TOAST MESSAGE =====
    // We want to show user "✓ BMW M3 added! (3 in cart)"
    // So we count total items: if user has M3(qty=2) and M4(qty=1), total is 3
    // reduce() is a powerful function that accumulates a result by looping through items
    // (sum, item) => sum + item.quantity:
    //   - sum starts at 0
    //   - for each item, add its quantity to sum
    //   - return the final total
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // ===== SHOW CONFIRMATION MESSAGE =====
    // Instead of using alert() (which blocks everything), we show a toast
    // Toast is a small notification that appears and disappears automatically
    // It shows what was added and current cart count
    showToast(`✓ ${productName} added! (${totalItems} in cart)`);
    
    // ===== UPDATE CART BADGE =====
    // The red badge next to the cart icon shows "3 items"
    // Call updateCartCount() to refresh this badge with the new total
    updateCartCount();
}

// ===== FUNCTION TO REMOVE ITEM FROM CART =====
function removeFromCart(productId) {
    // Find the index (position) of the item in the cart array
    const index = cart.findIndex(item => item.id === productId);
    
    // If item was found (index is not -1)
    if (index > -1) {
        // Remove the item from the cart array
        // splice(index, 1) removes 1 item at the specified index
        cart.splice(index, 1);
    }
    
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Refresh the cart display on the page
    displayCart();
    
    // Update the cart count
    updateCartCount();
}

// ===== FUNCTION TO CHANGE QUANTITY OF AN ITEM =====
function updateQuantity(productId, newQuantity) {
    // Find the product in the cart with this ID
    const product = cart.find(item => item.id === productId);
    
    // If product exists
    if (product) {
        // If new quantity is 0 or less, remove the product entirely
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            // Otherwise, update the quantity to the new value
            product.quantity = newQuantity;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Refresh the display
            displayCart();
            
            // Update cart count
            updateCartCount();
        }
    }
}

// ===== FUNCTION TO CALCULATE TOTAL PRICE =====
function calculateTotal() {
    // Start with 0
    // For each item in the cart, multiply price by quantity
    // Add to the running total
    // reduce() goes through each item and accumulates a result
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ===== FUNCTION TO DISPLAY CART ON THE PAGE =====
function displayCart() {
    // Get the HTML element where we want to show the cart
    const cartContainer = document.getElementById('cart-items');
    
    // If the cart is empty
    if (cart.length === 0) {
        // Show an empty message
        cartContainer.innerHTML = '<p>Cart is empty.</p>'; // "Cart is empty" in Estonian
        return; // Stop the function here
    }
    
    // Start building the HTML for the cart
    let html = '';
    
    // Loop through each item in the cart
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i]; // Get the current item
        
        // Create HTML for this item
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Hind: €${item.price}</p>
                </div>
                
                <div class="item-quantity">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <input type="number" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)" 
                           min="1">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                
                <div class="item-total">
                    <p>Kokku: €${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    }
    
    // Put all the HTML into the page
    cartContainer.innerHTML = html;
    
    // Display the total price
    const total = calculateTotal();
    document.getElementById('cart-total').innerHTML = `
        <h2>Total: €${total.toFixed(2)}</h2>
        <button class="btn-checkout">Pay</button>
        <button class="btn-continue" onclick="location.href='esileht.html'">Continue shopping</button>
    `;
}

// ===== FUNCTION TO UPDATE CART COUNT BADGE =====
function updateCartCount() {
    // Find the element that shows how many items are in the cart
    const cartBadge = document.getElementById('cart-count');
    
    // If the element exists
    if (cartBadge) {
        // Count total items in cart (sum of all quantities)
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Display the count
        cartBadge.textContent = totalItems;
        
        // Show the badge only if there are items
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// ===== FUNCTION TO CLEAR ENTIRE CART =====
function clearCart() {
    // Ask user for confirmation (prevent accidental deletion)
    if (confirm('Oled sa kindel? Kõik tooted eemaldatakse ostukorvist.')) {
        // Reset cart to empty array
        cart = [];
        // Remove from localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Refresh the display
        displayCart();
        
        // Update cart count
        updateCartCount();
    } else {
            // User cancelled, do nothing
            console.log('Cart clear cancelled by user');
        }
    }
// ===== RUN THESE FUNCTIONS WHEN PAGE LOADS =====
window.addEventListener('DOMContentLoaded', function() {
    // Display the cart when the page first loads
    displayCart();
    
    // Update the cart count badge
    updateCartCount();
});

// ===== TOAST NOTIFICATION HELPER =====
// Shows a small non-blocking message at the bottom-right of the page
function showToast(message, duration = 2500) {
    // Try to find an existing toast container
    let toast = document.getElementById('toast');

    // If not present, create it and append to body
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        // Basic styles — these can be overridden by page CSS
        toast.style.position = 'fixed';
        toast.style.right = '20px';
        toast.style.bottom = '20px';
        toast.style.background = '#222';
        toast.style.color = '#fff';
        toast.style.padding = '12px 18px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
        toast.style.zIndex = 9999;
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 200ms ease-in-out, transform 200ms ease-in-out';
        document.body.appendChild(toast);
    }

    // Set message and show
    toast.textContent = message;
    toast.style.display = 'block';
    // force reflow so transition works when changing opacity
    // eslint-disable-next-line no-unused-expressions
    toast.offsetWidth;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    // Hide after the duration
    setTimeout(() => {
        toast.style.opacity = '0';
        // after transition, remove from flow
        setTimeout(() => {
            toast.style.display = 'none';
        }, 220);
    }, duration);
}
