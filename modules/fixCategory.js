export default function fixCategory(data) {
    // Loop over every value
    for(let key in data) { 
        // Fix top category
        if (data[key].upperCategory.includes('Functionele categorie')) {
            data[key].upperCategory = data[key].categoryName;
        }
    }
    return data;
}