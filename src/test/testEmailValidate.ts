import { emailInputValidator } from "../Validation";
// --- FONCTION UTILITAIRE DE JOURNALISATION ---
const logEmailResult = (testName: string, targetName: string, expectedValid: boolean) => {
    // Supposons que emailInputValidator.formErrorStore.getErrors(targetName) retourne un tableau
    const errors = emailInputValidator.formErrorStore.getFieldErrors(targetName);
    const isValid = errors.length === 0;
    const result = isValid === expectedValid;
    const emoji = result ? '✅ SUCCÈS' : '❌ ÉCHEC';
    const message = errors.length > 0 ? errors[0] : 'Aucune erreur';

    console.log(`\n${emoji} | ${testName}`);
    console.log(`   Attendu: ${expectedValid ? 'VALIDE' : 'INVALIDE'} | Réel: ${isValid ? 'VALIDE' : 'INVALIDE'}`);
    if (!result) {
        console.error(`   Raison de l'échec (si INVALIDE) : ${message}`);
    }
    // Nettoyer l'état pour le prochain test
    emailInputValidator.formErrorStore.clearFieldState(targetName);
};

// --- DÉFINITION DES MOCKS NÉCESSAIRES ---
// Dans un environnement jQuery, vous devez mocker ces fonctions ou vous assurer qu'elles existent.
// const isIP = (input) => input.includes('.'); // Simplifié : juste pour les tests IP
// const checkHost = (domain, list) => list.includes(domain); // Simplifié : vérifie si le domaine est dans la liste
// const validateDisplayName = (name) => null; // Simule le succès
// const validateLocalPart = (local, options) => null; // Simule le succès

// =================================================================
// LE BLOC DE TESTS EMAIL
// =================================================================

jQuery(async function runEmailValidatorTests() {
    console.log('--- Démarrage des Tests Email Input Validator (jQuery) ---');

    const targetBase = 'test_email_';

    // --- Configuration par défaut pour la plupart des tests ---
    const defaultOptions = {
        minLength: 6,
        allowIpDomain: false,
        allowDisplayName: false,
        requireDisplayName: false,
        allowUtf8LocalPart: false,
        blacklistedChars: undefined
        // ... toutes les options FQDN par défaut (requireTLD: true, etc.)
    };

    // =================================================================
    // TESTS DE SUCCÈS (Expected Valid: true)
    // =================================================================

    // Test 1: Validation de base (FQDN, longueur, format ASCII OK)
    const email1 = 'user@example.com';
    const target1 = targetBase + 'standard';
    await emailInputValidator.validate(email1, target1, defaultOptions);
    logEmailResult('1. SUCCÈS: E-mail standard', target1, true);

    // Test 2: Nom d'affichage autorisé et valide
    const email2 = '"John Doe" <user@example.com>';
    const target2 = targetBase + 'display_name_allowed';
    await emailInputValidator.validate(email2, target2, { ...defaultOptions, allowDisplayName: true });
    logEmailResult('2. SUCCÈS: Nom d\'affichage autorisé', target2, true);

    // Test 3: Domaine IP autorisé (nécessite une IP entre crochets)
    const email3 = 'test@[192.168.1.1]';
    const target3 = targetBase + 'ip_domain_allowed';
    await emailInputValidator.validate(email3, target3, { ...defaultOptions, allowIpDomain: true, requireTLD: false });
    logEmailResult('3. SUCCÈS: Domaine IP autorisé', target3, true);

    // Test 4: Partie locale UTF-8 autorisée (suppose que 'validateLocalPart' gère l'UTF-8)
    const email4 = 'rêve@example.com';
    const target4 = targetBase + 'utf8_local_part';
    await emailInputValidator.validate(email4, target4, { ...defaultOptions, allowUtf8LocalPart: true });
    logEmailResult('4. SUCCÈS: Partie locale UTF-8 autorisée', target4, true);

    // =================================================================
    // TESTS D'ÉCHEC (Expected Valid: false)
    // =================================================================

    // Test 5: Échec : Domaine sur liste noire (Host Blacklist)
    const email5 = 'spam@badhost.com';
    const target5 = targetBase + 'blacklist_fail';
    await emailInputValidator.validate(email5, target5, { ...defaultOptions, hostBlacklist: ['badhost.com'] });
    logEmailResult('5. ÉCHEC: Domaine sur liste noire', target5, false);

    // Test 6: Échec : Domaine non sur liste blanche (Host Whitelist)
    const email6 = 'test@other.com';
    const target6 = targetBase + 'whitelist_fail';
    await emailInputValidator.validate(email6, target6, { ...defaultOptions, hostWhitelist: ['example.com'] });
    logEmailResult('6. ÉCHEC: Domaine non sur liste blanche', target6, false);

    // Test 7: Échec : Domaine IP non autorisé (Par défaut)
    const email7 = 'test@[1.1.1.1]';
    const target7 = targetBase + 'ip_domain_fail';
    await emailInputValidator.validate(email7, target7, defaultOptions);
    logEmailResult('7. ÉCHEC: Domaine IP non autorisé (allowIpDomain: false)', target7, false);

    // Test 8: Échec : Nom d'affichage requis mais manquant (requireDisplayName)
    const email8 = 'juste@mail.com';
    const target8 = targetBase + 'display_name_required_fail';
    await emailInputValidator.validate(email8, target8, { ...defaultOptions, requireDisplayName: true });
    logEmailResult('8. ÉCHEC: Nom d\'affichage requis mais manquant', target8, false);

    // Test 9: Échec : Caractères interdits dans la partie locale (blacklistedChars)
    const email9 = 'user(test)@domain.com';
    const target9 = targetBase + 'blacklisted_chars_fail';
    await emailInputValidator.validate(email9, target9, { ...defaultOptions, blacklistedChars: '()' });
    logEmailResult('9. ÉCHEC: Caractères interdits dans la partie locale', target9, false);

    // Test 10: Échec : Domaine TLD purement numérique (FQDN option héritée)
    const email10 = 'user@domain.123';
    const target10 = targetBase + 'numeric_tld_fail';
    await emailInputValidator.validate(email10, target10, defaultOptions);
    logEmailResult('10. ÉCHEC: TLD numérique non autorisé (FQDN option)', target10, false);

    // Test 11: Échec : Partir locale trop longue (Max Length local part = 64)
    const longLocal = 'a'.repeat(65);
    const email11 = `${longLocal}@example.com`;
    const target11 = targetBase + 'local_max_length_fail';
    // isByteLength doit être mocké pour échouer à 64
    await emailInputValidator.validate(email11, target11, defaultOptions);
    logEmailResult('11. ÉCHEC: Partie locale trop longue (> 64)', target11, false);

    // Test 12: Échec : Email trop court (hérité de TextInputOptions)
    const email12 = 'a@b.c'; // Longueur 5, minLength: 6
    const target12 = targetBase + 'min_length_fail';
    // textInputValidator doit être mocké pour échouer minLength: 6
    await emailInputValidator.validate(email12, target12, { ...defaultOptions, minLength: 6 });
    logEmailResult('12. ÉCHEC: Trop court (via TextInputOptions)', target12, false);


    console.log('\n--- Tests Email terminés ---');
});