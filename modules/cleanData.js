export default function cleanData(results) {
    for(let key in results) { // Loop over every value
        results[key].categoryName = results[key].categoryName.value.charAt(0).toUpperCase() + results[key].categoryName.value.slice(1); // Change first character to uppercase + full string except first character
        results[key].upperCategory = results[key].upperCategory.value.charAt(0).toUpperCase() + results[key].upperCategory.value.slice(1); // Change first character to uppercase + full string except first character
        results[key].categoryAmount = parseInt(results[key].categoryAmount.value); // The number in every string will be converted into a number
        // Delete unneeded properties from object
        delete results[key].categoryAmount.type;
        delete results[key].categoryAmount.datatype;
        delete results[key].categoryName.type;
    }
    return results; // Return results
}