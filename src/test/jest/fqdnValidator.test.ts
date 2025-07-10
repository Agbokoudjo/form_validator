// ... (Initialisation et Mocks : validator, mockTarget, defaultFQDNOptions) ...

import { fqdnInputValidator as validator } from "../../Validation";
// FQDNInputValidator.test.ts

// =================================================================
// 🛑 Bloc de Définition des Mocks (À ajouter en haut du fichier)
// =================================================================
const mockFormErrorStore = {
    // jest.fn() est maintenant reconnu
    clearFieldState: jest.fn() as jest.Mock,
    setError: jest.fn() as jest.Mock,
    getErrors: jest.fn() as jest.Mock,

    // Ajoutez le type 'any[]' pour le paramètre 'call'
    isFieldValid: (fieldName: string) => !mockFormErrorStore.getErrors.mock.calls.some((call: any[]) => call[0] === fieldName),
};

// MOCKS : Ajoutez les types aux paramètres 'options' et 'defaults'
const deepMerge = jest.fn((options: any, defaults: any) => ({ ...defaults, ...options })) as jest.Mock;
const escapeHtmlBalise = (input: string) => input;

// 2. Définition des Constantes utilisées par les tests (mockTarget, Options, Helpers)
const mockTarget = 'hostname';
const defaultFQDNOptions = { /* ... vos options par défaut ... */ };
const longLabel = 'a'.repeat(64) + '.com'; // Helper pour le test n°10

describe('FQDNInputValidator - 10 Tests Complémentaires', () => {
    // ... (Définition de 'validator', configuration beforeEach) ...

    // Helper pour générer une chaîne trop longue
    const longLabel = 'a'.repeat(64) + '.com';

    // 1. Succès : FQDN standard
    test('1. SUCCESS: Standard valid FQDN', async () => {
        await validator.validate('mon-domaine.fr', mockTarget, {});
        expect(mockFormErrorStore.setError).not.toHaveBeenCalled();
    });

    // 2. Succès : FQDN avec Unicode
    test('2. SUCCESS: FQDN with Unicode characters', async () => {
        await validator.validate('schön.ch', mockTarget, {});
        expect(mockFormErrorStore.setError).not.toHaveBeenCalled();
    });

    // 3. Échec : TLD Numérique non autorisé (défaut)
    test('3. FAILURE: Numeric TLD (domain.123) by default', async () => {
        await validator.validate('domaine.123', mockTarget, {});
        expect(mockFormErrorStore.setError).toHaveBeenCalled();
    });

    // 4. Succès : TLD Numérique autorisé
    test('4. SUCCESS: Numeric TLD when allowed', async () => {
        await validator.validate('domaine.123', mockTarget, { allowNumericTld: true });
        expect(mockFormErrorStore.setError).not.toHaveBeenCalled();
    });

    // 5. Échec : Underscore non autorisé (défaut)
    test('5. FAILURE: Underscore (_) not allowed by default', async () => {
        await validator.validate('mon_site.com', mockTarget, {});
        expect(mockFormErrorStore.setError).toHaveBeenCalledWith(
            mockTarget,
            expect.stringContaining("must not contain underscores")
        );
    });

    // 6. Échec : Étiquette commence par un tiret
    test('6. FAILURE: Label starts with a hyphen', async () => {
        await validator.validate('-domaine.com', mockTarget, {});
        expect(mockFormErrorStore.setError).toHaveBeenCalledWith(
            mockTarget,
            expect.stringContaining("contains a label starting or ending with '-'")
        );
    });

    // 7. Échec : Point final non autorisé (défaut)
    test('7. FAILURE: Trailing dot (.) not allowed by default', async () => {
        await validator.validate('domaine.com.', mockTarget, {});
        // L'échec se produit ici généralement sur la regex des parties, car le point est un caractère invalide
        expect(mockFormErrorStore.setError).toHaveBeenCalled();
    });

    // 8. Succès : Wildcard autorisé
    test('8. SUCCESS: Wildcard (*) allowed and processed', async () => {
        await validator.validate('*.example.com', mockTarget, { allowWildcard: true });
        expect(mockFormErrorStore.setError).not.toHaveBeenCalled();
    });

    // 9. Échec : TLD manquant
    test('9. FAILURE: Missing TLD when required', async () => {
        await validator.validate('monsite', mockTarget, {});
        expect(mockFormErrorStore.setError).toHaveBeenCalledWith(
            mockTarget,
            expect.stringContaining("does not contain a valid top-level domain")
        );
    });

    // 10. Échec : Étiquette trop longue
    test('10. FAILURE: Label exceeds 63 characters', async () => {
        await validator.validate(longLabel, mockTarget, {});
        expect(mockFormErrorStore.setError).toHaveBeenCalledWith(
            mockTarget,
            expect.stringContaining("contains a label longer than 63 characters")
        );
    });
});