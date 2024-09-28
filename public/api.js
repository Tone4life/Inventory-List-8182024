// POST form submission
export async function submitForm(formData) {
    try {
        const response = await fetch('/submit_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

// GET inventory items
export async function getInventoryItems() {
    try {
        const response = await fetch('/api/inventory');
        return await response.json();
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
    }
}

// POST new inventory item
export async function addInventoryItem(itemData) {
    try {
        const response = await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
    }
}