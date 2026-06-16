const CATEGORY_STORAGE_KEY = 'prosport_categories';

// Initialize default categories if none exist
const initializeCategories = () => {
    const existing = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!existing) {
        const defaultCategories = ['camisetas', 'pantalones', 'accesorios', 'calzado'];
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(defaultCategories));
        return defaultCategories;
    }
    return JSON.parse(existing);
};

export const getCategories = async () => {
    // Simulando delay de red
    return new Promise(resolve => {
        setTimeout(() => {
            const categories = initializeCategories();
            resolve({
                success: true,
                data: categories
            });
        }, 300);
    });
};

export const addCategory = async (categoryName) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const categories = initializeCategories();
            const lowerCategory = categoryName.toLowerCase().trim();
            if (categories.includes(lowerCategory)) {
                resolve({ success: false, message: 'La categoría ya existe' });
                return;
            }
            categories.push(lowerCategory);
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
            resolve({ success: true, data: categories });
        }, 300);
    });
};

export const deleteCategory = async (categoryName) => {
    return new Promise(resolve => {
        setTimeout(() => {
            let categories = initializeCategories();
            categories = categories.filter(c => c !== categoryName);
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
            resolve({ success: true, data: categories });
        }, 300);
    });
};
