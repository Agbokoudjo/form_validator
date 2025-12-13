import { Logger } from "../_Utils";
jQuery(function TestLogger() {
    // 1. Sélectionner le bouton de test et les autres éléments avec jQuery
    const $testLoggerButton = $('#testLogger');
    // 2. Attacher un écouteur d'événement 'click' au bouton
    $testLoggerButton.on('click', function () {
        const $loggerMessageInput = $('#loggerMessage');
        const $loggerLevelSelect = $('#loggerLevel');
        const $loggerContextTextarea = $('#loggerContext');
        const $resultLoggerDiv = $('#resultLogger');
        // Réinitialiser le div de résultat
        $resultLoggerDiv.html('<p class="mb-0 text-muted">Exécution du log...</p>');
        $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded text-muted'); // Réinitialiser les classes Bootstrap

        const message = $loggerMessageInput.val() as string; // val() retourne string | number | string[]
        const level = $loggerLevelSelect.val() as string;
        let context: Record<string, any> | undefined = undefined;

        // Tenter de parser le contexte JSON
        const contextValue = $loggerContextTextarea.val() as string;
        if (contextValue.trim() !== '') {
            try {
                context = JSON.parse(contextValue);
                if (typeof context !== 'object' || context === null || Array.isArray(context)) {
                    throw new Error("Le contexte doit être un objet JSON valide.");
                }
            } catch (e: any) {
                $resultLoggerDiv.html(`<p class="mb-0 text-danger">Erreur de Parsing JSON du Contexte: ${e.message}</p>`);
                $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
                console.error("Erreur de Parsing JSON du Contexte:", e);
                return; // Arrêter l'exécution si le JSON est invalide
            }
        }

        // Exécuter la méthode du Logger en fonction du niveau sélectionné
        try {
            switch (level) {
                case 'log':
                    Logger.log(message, context);
                    break;
                case 'info':
                    Logger.info(message, context);
                    break;
                case 'warn':
                    Logger.warn(message, context);
                    break;
                case 'error':
                    // Pour les erreurs, on peut créer un objet Error si le message est une simple chaîne
                    if (context) {
                        Logger.error(new Error(message), context);
                    } else {
                        Logger.error(new Error(message));
                    }
                    break;
                default:
                    console.error('Niveau de log inconnu:', level);
                    $resultLoggerDiv.html(`<p class="mb-0 text-danger">Niveau de log "${level}" inconnu.</p>`);
                    $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
                    return;
            }

            // Afficher un message de succès
            $resultLoggerDiv.html(`<p class="mb-0 text-success">Log de niveau "${level}" envoyé avec succès !</p><p class="mb-0 text-success">Vérifiez la console de votre navigateur pour le résultat.</p>`);
            $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-success text-success');

        } catch (err: any) {
            // Gérer les erreurs inattendues lors de l'appel du Logger
            console.error('Erreur lors de l\'appel de Logger:', err);
            $resultLoggerDiv.html(`<p class="mb-0 text-danger">Erreur lors de l'appel de Logger: ${err.message}</p>`);
            $resultLoggerDiv.attr('class', 'mt-3 p-3 border rounded border-danger text-danger');
        }
    });
})