/**
 * ISO 7064 (MOD 11, 10) validation function.
 * Validates strings containing only digits and a check digit at the end.
 */
export function iso7064Check(str: string): boolean {
    if (!/^\d{11}$/.test(str)) {
        throw new Error("iso7064Check expects a string of 11 digits.");
    }

    let checkvalue = 10;
    for (let i = 0; i < str.length - 1; i++) {
        const digit = parseInt(str[i], 10);
        const temp = (digit + checkvalue) % 10;
        checkvalue = (temp === 0 ? 10 : temp) * 2 % 11;
    }
    checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;

    return checkvalue === parseInt(str[str.length - 1], 10);
}

/**
 * Luhn (mod 10) algorithm for validating numbers like credit cards.
 */
export function luhnCheck(str: string): boolean {
    if (!/^\d+$/.test(str)) {
        throw new Error("luhnCheck expects a string of digits.");
    }

    let checksum = 0;
    let doubleDigit = false;

    for (let i = str.length - 1; i >= 0; i--) {
        let digit = parseInt(str[i], 10);
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9; // same as summing the digits
            }
        }
        checksum += digit;
        doubleDigit = !doubleDigit;
    }

    return checksum % 10 === 0;
}

/**
 * Reverse Multiply and Sum utility function for MOD11 checks.
 * Multiplies each digit by a decreasing base and returns the sum.
 */
export function reverseMultiplyAndSum(digits: number[], base: number): number {
    if (!Array.isArray(digits) || digits.some(d => !Number.isInteger(d) || d < 0 || d > 9)) {
        throw new Error("Expected an array of digits (0-9).");
    }

    return digits.reduce((sum, digit, i) => sum + digit * (base - i), 0);
}

/**
 * Verhoeff algorithm for validating identity numbers using permutation tables.
 */
export function verhoeffCheck(str: string): boolean {
    if (!/^\d+$/.test(str)) {
        throw new Error("verhoeffCheck expects a string of digits.");
    }

    const d_table: number[][] = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p_table: number[][] = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    const strReversed = str.split('').reverse();
    let checksum = 0;

    for (let i = 0; i < strReversed.length; i++) {
        const digit = parseInt(strReversed[i], 10);
        checksum = d_table[checksum][p_table[i % 8][digit]];
    }

    return checksum === 0;
}
