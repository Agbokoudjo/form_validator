/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Map) &&
        !(value instanceof Set) &&
        !(value instanceof Date) &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
}

/**
 * 
 * @param arr1 
 * @param arr2 
 * @returns 
 * @example 
 * ```typescript
 * // --- Exemples d'utilisation ---

// Cas où les longueurs sont égales (fonctionne)
const array1 = [1, 2, 3];
const array2 = ['a', 'b', 'c'];
try {
    const zippedResult = zip(array1, array2);
    console.log("Zipping result:", zippedResult); // Affiche: [[1, 'a'], [2, 'b'], [3, 'c']]
} catch (error: any) {
    console.error("Zipping error:", error.message);
}


// Cas où les longueurs sont différentes (lance une exception)
const array3 = [1, 2];
const array4 = ['a', 'b', 'c'];
try {
    const zippedError = zip(array3, array4);
    console.log("Zipping result:", zippedError);
} catch (error: any) {
    console.error("Zipping error:", error.message); // Affiche: Zipping error: Arrays must have the same length to be zipped.
}
 * ```
 */
export function zipArray<T>(arr1: T[], arr2: T[]): [T, T][] {

    if (arr1.length !== arr2.length) {
        throw new Error("Arrays must have the same length to be zipped.");
    }

    const len = arr1.length;
    let result_array: [T, T][] = [];

    for (let d = 0; d < len; d++) {
        result_array.push([arr1[d], arr2[d]]);
    }

    return result_array;
}