import { fqdnInputValidator } from "../Validation"


// --- FONCTION UTILITAIRE DE JOURNALISATION ---
const logResult = (testName: string, targetName: string, expectedValid: boolean) => {
    // Supposons que validator.getState(targetName) retourne un objet avec 'isValid'
    const state = fqdnInputValidator.getState(targetName);
    const result = state.isValid === expectedValid;
    const emoji = result ? '✅ SUCCÈS' : '❌ ÉCHEC';
    const message = state.errors || 'Aucune erreur';

    console.log(`\n${emoji} | ${testName}`);
    console.log(`   Attendu: ${expectedValid ? 'VALIDE' : 'INVALIDE'} | Réel: ${state.isValid ? 'VALIDE' : 'INVALIDE'}`);
    if (!result) {
        console.error(`   Raison de l'échec (si INVALIDE) : ${message}`);
    }
};

// --- LE BLOC DE TESTS FQDN ---
jQuery(async function runFQDNValidatorTests() {
    console.log('--- Démarrage des Tests FQDN Input Validator (jQuery) ---');

    // Mocks/Constantes pour les tests
    const longLabel = 'a'.repeat(64) + '.com'; // Étiquette > 63 chars
    const targetBase = 'test_fqdn_';

    // =================================================================
    // TESTS DE SUCCÈS (Expected Valid: true)
    // =================================================================

    // Test 1: FQDN standard valide
    const target1 = targetBase + 'standard';
    await fqdnInputValidator.validate('mon-domaine.fr', target1, {});
    logResult('1. SUCCÈS: FQDN standard avec tiret', target1, true);

    // Test 2: FQDN avec caractères Unicode (IDN)
    const target2 = targetBase + 'unicode';
    await fqdnInputValidator.validate('schön.ch', target2, {});
    logResult('2. SUCCÈS: FQDN avec caractères Unicode (accents)', target2, true);

    // Test 3: TLD numérique autorisé (avec option)
    const target3 = targetBase + 'num_tld_ok';
    await fqdnInputValidator.validate('domaine.123', target3, { allowNumericTld: true });
    logResult('3. SUCCÈS: TLD numérique autorisé', target3, true);

    // Test 4: Hôte simple autorisé (sans TLD)
    const target4 = targetBase + 'no_tld_ok';
    await fqdnInputValidator.validate('localhost', target4, { requireTLD: false });
    logResult('4. SUCCÈS: Hôte simple (no TLD) autorisé', target4, true);

    // Test 5: Wildcard autorisé (avec option)
    const target5 = targetBase + 'wildcard_ok';
    await fqdnInputValidator.validate('*.example.com', target5, { allowWildcard: true });
    logResult('5. SUCCÈS: Wildcard (*) autorisé', target5, true);

    // =================================================================
    // TESTS D'ÉCHEC (Expected Valid: false)
    // =================================================================

    // Test 6: FAILURE: TLD numérique refusé (par défaut)
    const target6 = targetBase + 'num_tld_fail';
    await fqdnInputValidator.validate('domaine.123', target6, {});
    logResult('6. ÉCHEC: TLD numérique refusé (par défaut)', target6, false);

    // Test 7: FAILURE: Étiquette commence par un tiret
    const target7 = targetBase + 'start_hyphen';
    await fqdnInputValidator.validate('-domaine.com', target7, {});
    logResult('7. ÉCHEC: Étiquette commence par un tiret', target7, false);

    // Test 8: FAILURE: Point final non autorisé
    const target8 = targetBase + 'trailing_dot';
    await fqdnInputValidator.validate('domaine.com.', target8, {});
    logResult('8. ÉCHEC: Point final non autorisé', target8, false);

    // Test 9: COMPLEX: Échec MaxLength (étiquette > 63)
    const target9 = targetBase + 'max_length_fail';
    await fqdnInputValidator.validate(longLabel, target9, {});
    logResult('9. ÉCHEC: Étiquette trop longue (> 63)', target9, false);

    // Test 10: COMPLEX: Échec Underscore (_) non autorisé
    const target10 = targetBase + 'underscore_fail';
    await fqdnInputValidator.validate('mon_site.com', target10, {});
    logResult('10. ÉCHEC: Underscore (_) non autorisé (par défaut)', target10, false);

    // Test 11: COMPLEX: Validation FQDN sans TLD (requireTLD: true par défaut)
    const target11 = targetBase + 'missing_tld';
    // Le FQDN Validator devrait échouer ici si 'requireTLD' est true (par défaut)
    await fqdnInputValidator.validate('monsite', target11, {});
    logResult('11. ÉCHEC: TLD manquant (requireTLD par défaut)', target11, false);

    // Test 12: COMPLEX: Échec de MaxLength, puis SUCCÈS avec l'option ignoreMaxLength
    const target12 = targetBase + 'max_length_override';
    // Le domaine est trop long, mais l'option ignoreMaxLength est true
    await fqdnInputValidator.validate(longLabel, target12, { ignoreMaxLength: true });
    logResult('12. SUCCÈS: MaxLength ignoré', target12, true);

    console.log('\n--- Tests FQDN terminés ---');
});