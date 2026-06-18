/**
 * Verifies a card number using the Luhn algorithm.
 * Operates on the sanitized (digits-only) string.
 * @see https://en.wikipedia.org/wiki/Luhn_algorithm
 */
export function verifyLuhn(sanitized: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized[i], 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit >= 10) {
                sum += (digit % 10) + 1;
            } else {
                sum += digit;
            }
        } else {
            sum += digit;
        }

        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}
