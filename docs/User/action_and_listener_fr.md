# @wlindabla/form_validator

**Version:** 2.1.0  
**License:** MIT  
**Author:** AGBOKOUDJO Franck  
**Company:** INTERNATIONALES WEB APPS & SERVICES  
**Contact:** internationaleswebservices@gmail.com  
**Phone:** +229 0167 25 18 86  
**LinkedIn:** [internationales-web-apps-services-120520193](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)  
**GitHub:** [Agbokoudjo](https://github.com/Agbokoudjo/)

---

## Table des matières

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
  - [Installation](#installation)
  - [Architecture](#architecture)
  - [Types \& Interfaces](#types--interfaces)
    - [CRUDActionEventDetail](#crudactioneventdetail)
    - [ExtractedCRUDActionData](#extractedcrudactiondata)
    - [CRUDActionConfirmationParams](#crudactionconfirmationparams)
    - [ProcessCRUDActionParams](#processcrudactionparams)
  - [API Principal](#api-principal)
    - [CRUDActionConfirmationHandle](#crudactionconfirmationhandle)
    - [processCRUDAction](#processcrudaction)
  - [Fonctions Utilitaires](#fonctions-utilitaires)
    - [extractCRUDActionData](#extractcrudactiondata)
    - [hasRequiredCRUDActionAttributes](#hasrequiredcrudactionattributes)
    - [createCRUDActionEvent](#createcrudactionevent)
  - [Gestion des Erreurs](#gestion-des-erreurs)
    - [CRUDActionConfirmationError](#crudactionconfirmationerror)
  - [Exemples Complets](#exemples-complets)
    - [Exemple 1: Suppression avec confirmation](#exemple-1-suppression-avec-confirmation)
    - [Exemple 2: Toggle avec traduction](#exemple-2-toggle-avec-traduction)
    - [Exemple 3: Utilisation avec React](#exemple-3-utilisation-avec-react)
  - [Bonnes Pratiques](#bonnes-pratiques)
    - [✅ À FAIRE](#-à-faire)
    - [❌ À ÉVITER](#-à-éviter)
  - [Support](#support)

---

## Présentation

`@wlindabla/form_validator` est une bibliothèque **framework-agnostique** et **réutilisable** pour gérer les actions CRUD (Create, Read, Update, Delete) dans les dashboards (SonataAdminBundle, EasyAdmin, Django, etc.).

**Caractéristiques principales:**
- ✅ Compatible avec tous les frameworks modernes (jQuery, React, Angular, Vue, Vanilla JS)
- ✅ Support des navigateurs legacy (IE8+) via jQuery
- ✅ Système de confirmation modulaire avec SweetAlert2
- ✅ Gestion complète des requêtes HTTP avec retry automatique
- ✅ Événements personnalisés et callbacks
- ✅ Gestion d'erreurs robuste

---

## Installation

```bash
npm install @wlindabla/form_validator
# ou
yarn add @wlindabla/form_validator
```

---

## Architecture

La bibliothèque fonctionne selon ce flux:

```
1. Utilisateur clique sur un élément CRUD
   ↓
2. CRUDActionConfirmationHandle extrait les données du DOM
   ↓
3. Affichage du dialogue de confirmation (SweetAlert2)
   ↓
4. Dispatch d'un événement personnalisé si confirmé
   ↓
5. processCRUDAction écoute l'événement
   ↓
6. Affichage du dialogue de chargement
   ↓
7. Requête HTTP avec retry automatique
   ↓
8. Affichage de succès/erreur
   ↓
9. Exécution des callbacks
```

---

## Types & Interfaces

### CRUDActionEventDetail

Interface représentant les détails d'un événement d'action CRUD.

```typescript
export interface CRUDActionEventDetail {
    /** Données CRUD incluant le statut et données supplémentaires */
    data: { [key: string]: unknown };
    
    /** URL de la requête HTTP */
    urlActionRequest: string;
    
    /** Élément DOM source */
    sourceElement: HTMLElement;
    
    /** Timestamp ISO de l'événement */
    timestamp: string;
    
    /** Méthode HTTP (GET, POST, PATCH, DELETE, etc.) */
    httpMethodRequestAction: HttpMethod;
}
```

**Constante événement:**
```typescript
export const CRUD_ACTION_CONFIRMED_EVENT = "crud:action:confirmed";
```

---

### ExtractedCRUDActionData

Interface représentant les données extraites du DOM.

```typescript
export interface ExtractedCRUDActionData {
    /** Titre du modal */
    title: string;
    
    /** Texte du message de confirmation */
    actionConfirmText: string;
    
    /** URL de l'action */
    actionUrl: string;
    
    /** Données supplémentaires personnalisées */
    additionalData: Record<string, unknown>;
    
    /** Méthode HTTP (défaut: 'PATCH') */
    httpMethodRequestAction: HttpMethod;
}
```

---

### CRUDActionConfirmationParams

Paramètres pour configurer la confirmation d'action CRUD.

```typescript
export interface CRUDActionConfirmationParams {
    /** Élément DOM qui a déclenché l'action */
    element: HTMLElement;
    
    /** Nom d'événement personnalisé (défaut: 'crud:action:confirmed') */
    eventName?: string;
    
    /** Configuration personnalisée du dialogue de confirmation */
    confirmDialogConfig?: Partial<SweetAlertOptions>;
    
    /** Configuration personnalisée du dialogue d'annulation */
    cancelDialogConfig?: Partial<SweetAlertOptions>;
    
    /** Callback exécuté après confirmation */
    onConfirm?: ((data: ExtractedCRUDActionData, event: CustomEvent) => void | Promise<void>) | null;
    
    /** Callback exécuté après annulation */
    onCancel?: ((data: ExtractedCRUDActionData) => void | Promise<void>) | null;
    
    /** Callback exécuté en cas d'erreur */
    onError?: ((error: Error) => void) | null;
}
```

---

### ProcessCRUDActionParams

Paramètres pour traiter l'action CRUD reçue.

```typescript
export interface ProcessCRUDActionParams {
    /** Détails de l'événement personnalisé */
    eventDetail: CRUDActionEventDetail;
    
    /** Headers HTTP personnalisés */
    optionsheaders?: HeadersInit;
    
    /** Fonction traducteur (optionnel) */
    translator?: Translator | null;
    
    /** Configuration personnalisée du dialogue de chargement */
    loadingConfig?: Partial<SweetAlertOptions>;
    
    /** Configuration personnalisée du dialogue de succès */
    successConfig?: Partial<SweetAlertOptions>;
    
    /** Configuration personnalisée du dialogue d'erreur */
    errorConfig?: Partial<SweetAlertOptions>;
    
    /** Méthode HTTP (défaut: 'PATCH') */
    httpMethod?: HttpMethod;
    
    /** Nombre de tentatives (défaut: 2) */
    retryCount?: number;
    
    /** Callback après succès */
    onSuccess?: ((data: unknown, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
    
    /** Callback après erreur */
    onError?: ((error: Error | HttpResponse<unknown>, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
    
    /** Callback après complétion (toujours exécuté) */
    onComplete?: ((eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
}
```

---

## API Principal

### CRUDActionConfirmationHandle

Fonction principale qui orchestre tout le processus de confirmation d'action CRUD.

**Signature:**
```typescript
export async function CRUDActionConfirmationHandle(
    params: CRUDActionConfirmationParams
): Promise<boolean>
```

**Flux d'exécution:**
1. Extraction et validation des données du DOM
2. Affichage du dialogue de confirmation
3. Dispatch d'un événement personnalisé si confirmé
4. Exécution du callback `onConfirm`
5. Affichage du dialogue d'annulation si rejeté
6. Exécution du callback `onCancel`

**Returns:** `Promise<boolean>` - `true` si confirmé, `false` si annulé

**Throws:**
- `TypeError` si l'élément est null/undefined
- `Error` si jQuery n'est pas disponible
- `MissingAttributeError` si des attributs requis manquent
- `CRUDActionConfirmationError` si la confirmation échoue

**Exemple d'utilisation:**
```typescript
const button = document.querySelector('.btn-toggle-account');

await CRUDActionConfirmationHandle({
    element: button,
    eventName: 'account:toggle:confirmed',
    confirmDialogConfig: {
        background: '#00427E',
        confirmButtonText: 'Oui, confirmer'
    },
    onConfirm: async (data, event) => {
        console.log('Action confirmée:', data);
    },
    onCancel: async (data) => {
        console.log('Action annulée');
    },
    onError: (error) => {
        console.error('Erreur:', error.message);
    }
});
```

---

### processCRUDAction

Fonction principale qui traite l'action CRUD avec requête HTTP.

**Signature:**
```typescript
export async function processCRUDAction(
    params: ProcessCRUDActionParams
): Promise<HttpResponse<unknown>>
```

**Flux d'exécution:**
1. Fermeture des modales précédentes
2. Affichage du dialogue de chargement
3. Exécution de la requête HTTP avec retry
4. Vérification du statut de réponse
5. Affichage du dialogue de succès/erreur
6. Exécution des callbacks appropriés

**Requirements serveur:**
- Le contrôleur doit accepter les requêtes XMLHttpRequest
- Doit retourner une réponse JSON peu importe le statut
- Format réponse: `{ title: string, message: string }`
- Exemple: `new JsonResponse(['title' => 'Succès', 'message' => '...'], status, headers)`

**Returns:** `Promise<HttpResponse<unknown>>` - La réponse HTTP

**Throws:** `Error` - Après affichage du dialogue d'erreur

**Exemple d'utilisation:**
```typescript
document.addEventListener('crud:action:confirmed', async (event) => {
    try {
        const response = await processCRUDAction({
            eventDetail: event.detail,
            httpMethod: 'PATCH',
            retryCount: 3,
            onSuccess: async (data) => {
                console.log('✅ Action réussie:', data);
                setTimeout(() => location.reload(), 1500);
            },
            onError: async (error) => {
                console.error('❌ Action échouée:', error);
            },
            onComplete: async () => {
                console.log('Action terminée');
            }
        });
    } catch (error) {
        console.error('Erreur fatale:', error);
    }
});
```

---

## Fonctions Utilitaires

### extractCRUDActionData

Extrait et valide les données d'action CRUD depuis un élément DOM.

**Signature:**
```typescript
export function extractCRUDActionData(
    element: HTMLElement
): ExtractedCRUDActionData
```

**Attributs DOM recherchés:**
- `data-action-confirm` (requis) - Texte de confirmation
- `title` ou `data-bs-original-title` ou `data-original-title` (requis) - Titre
- `href` ou `data-href` ou `data-url` (requis) - URL de l'action
- `data-http-method-request-action` (optionnel, défaut: "PATCH") - Méthode HTTP
- `data-additional` (optionnel) - Données JSON supplémentaires

**Throws:**
- `TypeError` si l'élément est null/undefined
- `Error` si jQuery n'est pas disponible
- `MissingAttributeError` si attributs requis manquent

**Exemple:**
```typescript
const button = document.querySelector('[data-action-confirm]');
const data = extractCRUDActionData(button);
console.log(data.title);           // "Supprimer le compte"
console.log(data.actionUrl);       // "/api/account/delete"
console.log(data.httpMethodRequestAction); // "DELETE"
```

**HTML requis:**
```html
<button 
    class="btn btn-danger"
    title="Supprimer le compte"
    data-action-confirm="Êtes-vous sûr de vouloir supprimer votre compte ?"
    data-href="/api/account/delete"
    data-http-method-request-action="DELETE"
    data-additional='{"reason":"user-request"}'>
    Supprimer mon compte
</button>
```

---

### hasRequiredCRUDActionAttributes

Vérifie si un élément possède tous les attributs requis.

**Signature:**
```typescript
export function hasRequiredCRUDActionAttributes(
    element: HTMLElement
): boolean
```

**Returns:** `boolean` - `true` si tous les attributs requis sont présents

**Exemple:**
```typescript
const button = document.querySelector('.btn-action');

if (hasRequiredCRUDActionAttributes(button)) {
    const data = extractCRUDActionData(button);
    console.log('✅ Tous les attributs sont présents');
} else {
    console.log('❌ Attributs manquants');
}
```

---

### createCRUDActionEvent

Crée un événement personnalisé pour l'action CRUD.

**Signature:**
```typescript
export function createCRUDActionEvent(
    eventName: string,
    crudActionData: ExtractedCRUDActionData,
    sourceElement: HTMLElement
): CustomEvent<CRUDActionEventDetail>
```

**Returns:** `CustomEvent<CRUDActionEventDetail>` - L'événement personnalisé

**Exemple:**
```typescript
const event = createCRUDActionEvent(
    'mon-action:confirmee',
    data,
    element
);

document.dispatchEvent(event);

// Écouter l'événement
document.addEventListener('mon-action:confirmee', (e) => {
    console.log('URL:', e.detail.urlActionRequest);
    console.log('Données:', e.detail.data);
    console.log('Timestamp:', e.detail.timestamp);
});
```

---

## Gestion des Erreurs

### CRUDActionConfirmationError

Erreur lancée quand le traitement de la confirmation échoue.

```typescript
export class CRUDActionConfirmationError extends Error {
    constructor(message: string, public readonly cause?: Error);
}
```

**Exemple de gestion:**
```typescript
try {
    await CRUDActionConfirmationHandle({ element: button });
} catch (error) {
    if (error instanceof CRUDActionConfirmationError) {
        console.error('Erreur CRUD:', error.message);
        console.error('Cause:', error.cause);
    }
}
```

---

## Exemples Complets

### Exemple 1: Suppression avec confirmation

**HTML:**
```html
<button 
    id="deleteBtn"
    class="btn btn-danger"
    title="Supprimer l'utilisateur"
    data-action-confirm="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    data-href="/admin/users/123/delete"
    data-http-method-request-action="DELETE"
    data-additional='{"userId":"123"}'>
    🗑️ Supprimer
</button>
```

**JavaScript:**
```typescript
import { 
    CRUDActionConfirmationHandle, 
    processCRUDAction,
    CRUD_ACTION_CONFIRMED_EVENT
} from '@wlindabla/form_validator';

// Étape 1: Configuration du bouton
const deleteBtn = document.getElementById('deleteBtn');

deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    await CRUDActionConfirmationHandle({
        element: deleteBtn,
        confirmDialogConfig: {
            background: '#ff4757',
            confirmButtonText: 'Oui, supprimer'
        }
    });
});

// Étape 2: Écoute de l'événement et traitement
document.addEventListener(CRUD_ACTION_CONFIRMED_EVENT, async (event) => {
    try {
        await processCRUDAction({
            eventDetail: event.detail,
            httpMethod: 'DELETE',
            onSuccess: async () => {
                console.log('✅ Utilisateur supprimé');
                // Redirection après succès
                setTimeout(() => location.href = '/admin/users', 2000);
            }
        });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
});
```

---

### Exemple 2: Toggle avec traduction

**HTML:**
```html
<button 
    class="btn btn-primary"
    title="Activer le compte"
    data-action-confirm="Voulez-vous activer ce compte ?"
    data-href="/api/account/123/toggle-status"
    data-http-method-request-action="PATCH">
    ✓ Activer
</button>
```

**JavaScript:**
```typescript
import { 
    CRUDActionConfirmationHandle, 
    processCRUDAction
} from '@wlindabla/form_validator';

// Traducteur personnalisé
const translations = {
    'en': {
        'NetworkError': 'Connection error. Check your internet.',
        'Timeout': 'Request took too long. Please retry.'
    },
    'fr': {
        'NetworkError': 'Erreur de connexion. Vérifiez votre internet.',
        'Timeout': 'Requête trop longue. Veuillez réessayer.'
    }
};

function translator(key, error, language = 'fr') {
    return translations[language]?.[key] || key;
}

// Traitement
document.addEventListener('click', async (e) => {
    const button = e.target.closest('[data-action-confirm]');
    
    if (!button) return;
    
    e.preventDefault();
    
    await CRUDActionConfirmationHandle({
        element: button,
        onConfirm: async (data) => {
            await processCRUDAction({
                eventDetail: {
                    ...data,
                    urlActionRequest: data.actionUrl
                },
                translator,
                retryCount: 3
            });
        }
    });
});
```

---

### Exemple 3: Utilisation avec React

```typescript
import React, { useRef } from 'react';
import { 
    CRUDActionConfirmationHandle, 
    processCRUDAction 
} from '@wlindabla/form_validator';

export const DeleteUserButton = ({ userId, onDelete }) => {
    const buttonRef = useRef(null);

    const handleClick = async (e) => {
        e.preventDefault();

        const confirmed = await CRUDActionConfirmationHandle({
            element: buttonRef.current,
            onConfirm: async (data) => {
                try {
                    await processCRUDAction({
                        eventDetail: {
                            data: { userId },
                            urlActionRequest: `/api/users/${userId}/delete`,
                            sourceElement: buttonRef.current,
                            timestamp: new Date().toISOString(),
                            httpMethodRequestAction: 'DELETE'
                        },
                        onSuccess: () => {
                            if (onDelete) onDelete(userId);
                        }
                    }); 
                } catch (error) {
                    console.error('Erreur:', error);
                }
            }
        });
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className="btn btn-danger"
            title="Supprimer l'utilisateur"
            data-action-confirm="Êtes-vous sûr ?"
            data-href={`/api/users/${userId}/delete`}
            data-http-method-request-action="DELETE">
            Supprimer
        </button>
    );
};
```

---

## Bonnes Pratiques

### ✅ À FAIRE

```typescript
// Vérifier les attributs avant d'utiliser
if (hasRequiredCRUDActionAttributes(element)) {
    const data = extractCRUDActionData(element);
}

// Utiliser try-catch
try {
    await CRUDActionConfirmationHandle({ element });
} catch (error) {
    console.error('Erreur:', error);
}

// Fournir des callbacks
await processCRUDAction({
    eventDetail: event.detail,
    onSuccess: async (data) => { /* ... */ },
    onError: async (error) => { /* ... */ },
    onComplete: async () => { /* ... */ }
});
```

### ❌ À ÉVITER

```typescript
// Ne pas oublier de vérifier les attributs
extractCRUDActionData(element); // Peut lever une exception

// Ne pas ignorer les erreurs
CRUDActionConfirmationHandle({ element }); // Promise non attendue

// Ne pas oublier les headers si authentification
processCRUDAction({
    eventDetail: event.detail
    // Manque d'headers si authentification requise
});
```

---

## Support

Pour toute question ou bug report:
- 📧 Email: internationaleswebservices@gmail.com
- 📱 Phone: +229 0167 25 18 86
- 🔗 LinkedIn: [internationales-web-apps-services-120520193](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)
- 💻 GitHub: [Agbokoudjo](https://github.com/Agbokoudjo/)

---

**MIT License © 2024 INTERNATIONALES WEB APPS & SERVICES**