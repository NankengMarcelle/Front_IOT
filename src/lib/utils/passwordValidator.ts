/**
 * Validates that a password meets the following requirements:
 * - At least 9 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one digit
 * 
 * @param password The password string to validate
 * @returns An error message string if invalid, or null if valid
 */
export function validatePassword(password: string): string | null {
    if (!password) return "Le mot de passe est requis";

    if (password.length < 9) {
        return "Le mot de passe doit contenir au moins 9 caractères";
    }

    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
        return "Le mot de passe doit contenir au moins une lettre majuscule";
    }

    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
        return "Le mot de passe doit contenir au moins un chiffre";
    }

    return null;
}

/**
 * Checks if two passwords match
 * 
 * @param p1 First password
 * @param p2 Second password (confirmation)
 * @returns true if they match, false otherwise
 */
export function passwordsMatch(p1: string, p2: string): boolean {
    return p1 === p2;
}
