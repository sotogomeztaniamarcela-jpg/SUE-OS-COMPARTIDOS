// VARIABLES DEL DOM
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Arreglo para almacenar los productos en el carrito
let cart = [];

// MANEJO DE APERTURA/CIERRE DEL CARRITO
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
});

const closeCart = () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
};

closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// FUNCIÓN PARA AGREGAR PRODUCTOS
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const id = productCard.getAttribute('data-id');
        const title = productCard.querySelector('h3').innerText;
        const priceText = productCard.querySelector('.price').innerText;
        
        // Convertir el precio de texto a número entero (ej: "\$45.000" -> 45000)
        const price = parseInt(priceText.replace('\$', '').replace('.', ''));

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }

        updateCartUI();
    });
});

// FUNCIÓN PARA ELIMINAR UN PRODUCTO
const removeItem = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// FUNCIÓN PARA ACTUALIZAR LA INTERFAZ DEL CARRITO
const updateCartUI = () => {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Tu carrito está vacío</p>';
        cartCount.innerText = '0';
        cartTotal.innerText = '\$0';
        return;
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        // Crear el elemento HTML del item
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.title} (x${item.quantity})</h4>
                <p>$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">Eliminar</button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    // Actualizar los números superiores e inferiores
    cartCount.innerText = totalQuantity;
    cartTotal.innerText = `$${totalPrice.toLocaleString('es-CO')}`;

    // Añadir eventos a los nuevos botones de eliminar creados dinámicamente
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removeItem(id);
        });
    });
};

// ACCIÓN DE COMPRA
checkoutBtn.addEventListener('click', () => {
    if(cart.length > 0) {
        alert('¡Gracias por tu compra! Tu pedido de pijamas está en camino.');
        cart = [];
        updateCartUI();
        closeCart();
    } else {
        alert('Tu carrito está vacío.');
    }
});
