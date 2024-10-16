document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');
    const dynamicFields = document.getElementById('dynamic-fields');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    const imageUpload = document.querySelector('.image-upload');
    const noteSection = document.querySelector('.note-section');
    let totalPrice = 0;
    let selectedItems = [];

    function updateTotalPrice() {
        totalPrice = 0;
        selectedItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        totalPriceElem.textContent = totalPrice;
    }

    function createFieldsForItem(itemName) {
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('item-fieldset');
        fieldset.setAttribute('data-item', itemName);

        // Input para la cantidad
        const labelCantidad = document.createElement('label');
        labelCantidad.textContent = `Cantidad de ${itemName}: `;
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 1;
        inputCantidad.value = 1;
        inputCantidad.classList.add('quantity-input');
        inputCantidad.setAttribute('data-item', itemName);

        fieldset.appendChild(labelCantidad);
        fieldset.appendChild(inputCantidad);

        // Si es café, agregar opción para tipo
        if (itemName === 'Café') {
            const labelTipo = document.createElement('label');
            labelTipo.textContent = 'Tipo de café: ';
            const selectTipo = document.createElement('select');
            const optionAmericano = document.createElement('option');
            optionAmericano.textContent = 'Americano';
            const optionEspresso = document.createElement('option');
            optionEspresso.textContent = 'Espresso';
            selectTipo.appendChild(optionAmericano);
            selectTipo.appendChild(optionEspresso);

            fieldset.appendChild(labelTipo);
            fieldset.appendChild(selectTipo);
        }

        dynamicFields.appendChild(fieldset);

        // Actualizar precio cuando cambie la cantidad
        inputCantidad.addEventListener('input', () => {
            const selectedItem = selectedItems.find(i => i.name === itemName);
            selectedItem.quantity = parseInt(inputCantidad.value);
            updateTotalPrice();
            const li = cartItems.querySelector(`li[data-name="${itemName}"]`);
            if (li) {
                li.textContent = `${itemName} - $${selectedItem.price} x ${selectedItem.quantity}`;
            }
        });
    }

    items.forEach(item => {
        item.addEventListener('click', (event) => {
            const itemName = item.getAttribute('data-name');
            const itemPrice = parseInt(item.getAttribute('data-price'));

            item.classList.toggle('selected');

            if (item.classList.contains('selected')) {
                // Agregar el item al resumen
                createFieldsForItem(itemName);
                const li = document.createElement('li');
                li.setAttribute('data-name', itemName);
                li.textContent = `${itemName} - $${itemPrice} x 1`;
                cartItems.appendChild(li);

                // Añadir el item a la lista de seleccionados
                selectedItems.push({ name: itemName, price: itemPrice, quantity: 1 });

                // Mostrar campos adicionales
                imageUpload.style.display = 'block';
                noteSection.style.display = 'block';

            } else {
                // Remover el item del resumen
                const liToRemove = cartItems.querySelector(`li[data-name="${itemName}"]`);
                if (liToRemove) {
                    cartItems.removeChild(liToRemove);
                }

                // Remover de la lista de seleccionados
                selectedItems = selectedItems.filter(i => i.name !== itemName);

                // Remover los campos dinámicos asociados
                const fieldsetToRemove = dynamicFields.querySelector(`fieldset[data-item="${itemName}"]`);
                if (fieldsetToRemove) {
                    dynamicFields.removeChild(fieldsetToRemove);
                }

                // Ocultar opciones si no hay productos seleccionados
                if (selectedItems.length === 0) {
                    imageUpload.style.display = 'none';
                    noteSection.style.display = 'none';
                }
            }

            updateTotalPrice();
        });
    });
});
