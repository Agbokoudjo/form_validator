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

## Table of Contents

- [@wlindabla/form\_validator](#wlindablaform_validator)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [Why use this library?](#why-use-this-library)
  - [Installation](#installation)
    - [Requirements](#requirements)
  - [Architecture](#architecture)
  - [Core Types \& Interfaces](#core-types--interfaces)
    - [CRUDActionEventDetail](#crudactioneventdetail)
    - [ExtractedCRUDActionData](#extractedcrudactiondata)
    - [CRUDActionConfirmationParams](#crudactionconfirmationparams)
    - [ProcessCRUDActionParams](#processcrudactionparams)
  - [API Reference](#api-reference)
    - [CRUDActionConfirmationHandle](#crudactionconfirmationhandle)
    - [processCRUDAction](#processcrudaction)
    - [Utility Functions](#utility-functions)
      - [extractCRUDActionData](#extractcrudactiondata)
      - [hasRequiredCRUDActionAttributes](#hasrequiredcrudactionattributes)
      - [createCRUDActionEvent](#createcrudactionevent)
  - [Framework Integration Examples](#framework-integration-examples)
    - [Vanilla JavaScript](#vanilla-javascript)
      - [Example 1: Delete User with Confirmation](#example-1-delete-user-with-confirmation)
      - [Example 2: Toggle Account Status](#example-2-toggle-account-status)
    - [React](#react)
      - [Example 1: Delete Button Component (Functional)](#example-1-delete-button-component-functional)
      - [Example 2: Hook-based Implementation](#example-2-hook-based-implementation)
      - [Example 3: Multiple Actions in User Table](#example-3-multiple-actions-in-user-table)
    - [jQuery](#jquery)
      - [Example 1: Basic Setup](#example-1-basic-setup)
      - [Example 2: Delete with Confirmation](#example-2-delete-with-confirmation)
    - [Angular](#angular)
      - [Example 1: Service-based Approach](#example-1-service-based-approach)
      - [Example 2: Directive-based Approach](#example-2-directive-based-approach)
  - [Support](#support)

---

## Introduction

**@wlindabla/form_validator** is a powerful, **framework-agnostic** library for managing CRUD (Create, Read, Update, Delete) actions in modern web applications and admin dashboards (SonataAdminBundle, EasyAdmin, Django, etc.).

### Why use this library?

🚀 **Lightning-fast implementation** - Confirmation dialogs, HTTP requests, and callbacks in one function call  
🎯 **Framework-agnostic** - Works seamlessly with React, Vue, Angular, jQuery, or vanilla JS  
🛡️ **Bulletproof error handling** - Built-in retry logic, network error handling, and user feedback  
♿ **Legacy support** - IE8+ compatibility via jQuery  
🎨 **Fully customizable** - Custom dialogs, headers, callbacks, and event names  
⚡ **Production-ready** - Used in enterprise applications handling thousands of transactions daily

---

## Installation

```bash
npm install @wlindabla/form_validator
# or
yarn add @wlindabla/form_validator
# or
pnpm add @wlindabla/form_validator
```

### Requirements

- **jQuery** (for legacy browser support, bundled or external)
- **SweetAlert2** (for beautiful confirmation dialogs)
- **TypeScript** (optional, but recommended)

---

## Architecture

The library follows a clean two-phase architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   PHASE 1: CONFIRMATION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User clicks CRUD button                                    │
│           ↓                                                  │
│  extractCRUDActionData() reads DOM attributes              │
│           ↓                                                  │
│  CRUDActionConfirmationHandle() shows dialog               │
│           ↓                                                  │
│  User confirms → CustomEvent dispatched                    │
│           ↓                                                  │
│  onConfirm callback executed                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PHASE 2: PROCESSING                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Listener catches 'crud:action:confirmed' event           │
│           ↓                                                  │
│  processCRUDAction() starts                                │
│           ↓                                                  │
│  Loading dialog displayed                                   │
│           ↓                                                  │
│  HTTP request with auto-retry (network errors)             │
│           ↓                                                  │
│  Success/Error dialog shown                                │
│           ↓                                                  │
│  onSuccess/onError callbacks executed                      │
│           ↓                                                  │
│  onComplete always called (finally block)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Types & Interfaces

### CRUDActionEventDetail

The event payload dispatched when a CRUD action is confirmed.

```typescript
export interface CRUDActionEventDetail {
  /** Custom data from data-additional attribute */
  data: { [key: string]: unknown };
  
  /** URL for the HTTP request */
  urlActionRequest: string;
  
  /** DOM element that triggered the action */
  sourceElement: HTMLElement;
  
  /** ISO timestamp of the event */
  timestamp: string;
  
  /** HTTP method (GET, POST, PATCH, DELETE, etc.) */
  httpMethodRequestAction: HttpMethod;
}

// Event name constant
export const CRUD_ACTION_CONFIRMED_EVENT = "crud:action:confirmed";
```

---

### ExtractedCRUDActionData

Data extracted and validated from DOM element attributes.

```typescript
export interface ExtractedCRUDActionData {
  /** Modal title (from title attribute) */
  title: string;
  
  /** Confirmation message text */
  actionConfirmText: string;
  
  /** Action URL endpoint */
  actionUrl: string;
  
  /** Custom data as Record */
  additionalData: Record<string, unknown>;
  
  /** HTTP method (default: PATCH) */
  httpMethodRequestAction: HttpMethod;
}
```

---

### CRUDActionConfirmationParams

Configuration for the confirmation phase.

```typescript
export interface CRUDActionConfirmationParams {
  /** DOM element containing CRUD attributes */
  element: HTMLElement;
  
  /** Custom event name (default: 'crud:action:confirmed') */
  eventName?: string;
  
  /** SweetAlert2 config for confirmation dialog */
  confirmDialogConfig?: Partial<SweetAlertOptions>;
  
  /** SweetAlert2 config for cancellation dialog */
  cancelDialogConfig?: Partial<SweetAlertOptions>;
  
  /** Called after user confirms */
  onConfirm?: ((data: ExtractedCRUDActionData, event: CustomEvent) => void | Promise<void>) | null;
  
  /** Called after user cancels */
  onCancel?: ((data: ExtractedCRUDActionData) => void | Promise<void>) | null;
  
  /** Called if extraction fails */
  onError?: ((error: Error) => void) | null;
}
```

---

### ProcessCRUDActionParams

Configuration for the processing phase (HTTP request).

```typescript
export interface ProcessCRUDActionParams {
  /** Event detail from CustomEvent */
  eventDetail: CRUDActionEventDetail;
  
  /** Custom HTTP headers */
  optionsheaders?: HeadersInit;
  
  /** Translation function for errors */
  translator?: Translator | null;
  
  /** SweetAlert2 config for loading dialog */
  loadingConfig?: Partial<SweetAlertOptions>;
  
  /** SweetAlert2 config for success dialog */
  successConfig?: Partial<SweetAlertOptions>;
  
  /** SweetAlert2 config for error dialog */
  errorConfig?: Partial<SweetAlertOptions>;
  
  /** HTTP method (default: PATCH) */
  httpMethod?: HttpMethod;
  
  /** Number of retry attempts (default: 2) */
  retryCount?: number;
  
  /** Called after successful response */
  onSuccess?: ((data: unknown, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
  
  /** Called after error response */
  onError?: ((error: Error | HttpResponse<unknown>, eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
  
  /** Called always (finally block) */
  onComplete?: ((eventDetail: CRUDActionEventDetail) => void | Promise<void>) | null;
}
```

---

## API Reference

### CRUDActionConfirmationHandle

Main orchestrator for the confirmation phase. Shows a beautiful confirmation dialog and dispatches a custom event.

```typescript
export async function CRUDActionConfirmationHandle(
  params: CRUDActionConfirmationParams
): Promise<boolean>
```

**Execution Flow:**
1. Validates DOM element and jQuery availability
2. Extracts data from element attributes
3. Shows SweetAlert2 confirmation dialog
4. Dispatches custom event if confirmed
5. Executes onConfirm callback
6. Shows cancellation dialog if rejected
7. Executes onCancel callback

**Returns:** `Promise<boolean>` - `true` if confirmed, `false` if cancelled

**Throws:**
- `TypeError` - Element is null or undefined
- `Error` - jQuery not available
- `MissingAttributeError` - Required DOM attributes missing
- `CRUDActionConfirmationError` - Confirmation processing failed

**Key Features:**
- Automatic retry on network errors
- Beautiful animations via Animate.css
- Customizable dialog colors, buttons, text
- Full async/await support
- Error propagation to onError callback

---

### processCRUDAction

Main orchestrator for the processing phase. Handles HTTP requests with automatic retries, error handling, and user feedback.

```typescript
export async function processCRUDAction(
  params: ProcessCRUDActionParams
): Promise<HttpResponse<unknown>>
```

**Execution Flow:**
1. Closes any open modals
2. Shows loading dialog with progress bar
3. Executes HTTP request with retry logic
4. Validates HTTP response status
5. Shows success/error dialog
6. Executes appropriate callbacks
7. Returns response data

**Server Requirements:**
- Must accept XMLHttpRequest (AJAX)
- Must return JSON response (any HTTP status)
- Response format: `{ title: string, message: string }`
- Example (PHP/Symfony): `new JsonResponse(['title' => 'Success', 'message' => '...'], 200)`

**Returns:** `Promise<HttpResponse<unknown>>` - The server response

**Throws:** `Error` - After displaying error dialog to user

**Key Features:**
- Automatic retry for network/timeout errors
- Real-time timer display in loading dialog
- Dual callback system (success/error)
- Always executes onComplete (finally)
- Translatable error messages
- Custom HTTP headers support

---

### Utility Functions

#### extractCRUDActionData

Safely extracts and validates CRUD action data from DOM element.

```typescript
export function extractCRUDActionData(element: HTMLElement): ExtractedCRUDActionData
```

**DOM Attributes:**
- `data-action-confirm` (required) - Confirmation message text
- `title` or `data-bs-original-title` or `data-original-title` (required) - Modal title
- `href` or `data-href` or `data-url` (required) - Action URL endpoint
- `data-http-method-request-action` (optional, default: "PATCH") - HTTP method
- `data-additional` (optional) - JSON string of additional data

**Throws:**
- `MissingAttributeError` - If required attributes missing
- `TypeError` - If element is null/undefined

---

#### hasRequiredCRUDActionAttributes

Pre-check if element has all required attributes before processing.

```typescript
export function hasRequiredCRUDActionAttributes(element: HTMLElement): boolean
```

**Returns:** `boolean` - `true` if all required attributes present

**Use Case:** Validate elements before calling extractCRUDActionData

---

#### createCRUDActionEvent

Creates a custom event with full CRUDActionEventDetail payload.

```typescript
export function createCRUDActionEvent(
  eventName: string,
  crudActionData: ExtractedCRUDActionData,
  sourceElement: HTMLElement
): CustomEvent<CRUDActionEventDetail>
```

**Returns:** `CustomEvent<CRUDActionEventDetail>` - Ready to dispatch

---

## Framework Integration Examples

### Vanilla JavaScript

#### Example 1: Delete User with Confirmation

**HTML:**
```html
<button 
  id="deleteUserBtn"
  class="btn btn-danger"
  title="Delete User"
  data-action-confirm="Are you absolutely sure? This action cannot be undone."
  data-href="/api/users/42/delete"
  data-http-method-request-action="DELETE"
  data-additional='{"userId":"42","reason":"admin-request"}'>
  🗑️ Delete User
</button>
```

**JavaScript:**
```typescript
import { 
  CRUDActionConfirmationHandle, 
  processCRUDAction,
  CRUD_ACTION_CONFIRMED_EVENT 
} from '@wlindabla/form_validator';

// === PHASE 1: Setup confirmation ===
document.getElementById('deleteUserBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  
  try {
    await CRUDActionConfirmationHandle({
      element: e.currentTarget,
      confirmDialogConfig: {
        background: '#ff4757',
        confirmButtonText: 'Yes, delete permanently',
        confirmButtonColor: '#ff4757'
      },
      onError: (error) => {
        console.error('❌ Confirmation failed:', error.message);
      }
    });
  } catch (error) {
    console.error('Fatal error:', error);
  }
});

// === PHASE 2: Setup processing ===
document.addEventListener(CRUD_ACTION_CONFIRMED_EVENT, async (event) => {
  try {
    await processCRUDAction({
      eventDetail: event.detail,
      httpMethod: 'DELETE',
      retryCount: 3,
      successConfig: {
        didClose: () => {
          console.log('✅ User deleted successfully');
          setTimeout(() => location.href = '/users', 1500);
        }
      },
      onSuccess: async (data) => {
        console.log('Server response:', data);
      },
      onError: async (error) => {
        console.error('❌ Deletion failed:', error);
      },
      onComplete: async () => {
        console.log('🏁 Process completed');
      }
    });
  } catch (error) {
    console.error('Error during processing:', error);
  }
});
```

#### Example 2: Toggle Account Status

**HTML:**
```html
<a 
  href="#"
  class="btn-action"
  title="Toggle Account Status"
  data-action-confirm="Toggle this account's active status?"
  data-url="/admin/accounts/toggle"
  data-http-method-request-action="PATCH"
  data-additional='{"accountId":"123"}'>
  Toggle Status
</a>
```

**JavaScript (Minimal Setup):**
```typescript
import { CRUDActionConfirmationHandle, processCRUDAction } from '@wlindabla/form_validator';

// Global listener for all CRUD actions
document.addEventListener('click', async (e) => {
  const actionBtn = e.target.closest('[data-action-confirm]');
  if (!actionBtn) return;
  
  e.preventDefault();
  await CRUDActionConfirmationHandle({ element: actionBtn });
});

// Global listener for processing
document.addEventListener('crud:action:confirmed', async (event) => {
  await processCRUDAction({
    eventDetail: event.detail,
    onSuccess: () => location.reload()
  });
});
```

---

### React

#### Example 1: Delete Button Component (Functional)

```typescript
import React, { useRef } from 'react';
import { 
  CRUDActionConfirmationHandle, 
  processCRUDAction,
  CRUD_ACTION_CONFIRMED_EVENT 
} from '@wlindabla/form_validator';

interface DeleteButtonProps {
  userId: string;
  userName: string;
  onDeleteSuccess?: () => void;
}

export const DeleteUserButton: React.FC<DeleteButtonProps> = ({ 
  userId, 
  userName, 
  onDeleteSuccess 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const confirmed = await CRUDActionConfirmationHandle({
        element: buttonRef.current!,
        confirmDialogConfig: {
          title: `Delete ${userName}?`,
          confirmButtonText: 'Delete'
        }
      });

      if (!confirmed) return;

      // Listen for the event
      const handleCRUDEvent = async (event: Event) => {
        const customEvent = event as CustomEvent;
        try {
          await processCRUDAction({
            eventDetail: customEvent.detail,
            httpMethod: 'DELETE',
            onSuccess: () => {
              console.log(`✅ ${userName} deleted`);
              onDeleteSuccess?.();
            }
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      };

      document.addEventListener(CRUD_ACTION_CONFIRMED_EVENT, handleCRUDEvent);
      
      return () => {
        document.removeEventListener(CRUD_ACTION_CONFIRMED_EVENT, handleCRUDEvent);
      };

    } catch (error) {
      console.error('Confirmation error:', error);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="btn btn-danger"
      title={`Delete ${userName}`}
      data-action-confirm={`Are you sure you want to delete ${userName}? This cannot be undone.`}
      data-href={`/api/users/${userId}`}
      data-http-method-request-action="DELETE"
      data-additional={JSON.stringify({ userId, action: 'delete_user' })}
    >
      🗑️ Delete
    </button>
  );
};
```

#### Example 2: Hook-based Implementation

```typescript
import { useEffect, useRef, useState } from 'react';
import { 
  CRUDActionConfirmationHandle, 
  processCRUDAction,
  CRUD_ACTION_CONFIRMED_EVENT,
  ExtractedCRUDActionData 
} from '@wlindabla/form_validator';

export const useCRUDAction = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const handleCRUDAction = async (
    onSuccessCallback?: (data: unknown) => Promise<void>,
    onErrorCallback?: (error: Error) => Promise<void>
  ) => {
    if (!buttonRef.current) return;

    setLoading(true);

    try {
      await CRUDActionConfirmationHandle({
        element: buttonRef.current
      });

      const handleEvent = async (event: Event) => {
        const customEvent = event as CustomEvent;
        try {
          await processCRUDAction({
            eventDetail: customEvent.detail,
            onSuccess: async (data) => {
              await onSuccessCallback?.(data);
            },
            onError: async (error) => {
              await onErrorCallback?.(error as Error);
            }
          });
        } finally {
          setLoading(false);
          document.removeEventListener(CRUD_ACTION_CONFIRMED_EVENT, handleEvent);
        }
      };

      document.addEventListener(CRUD_ACTION_CONFIRMED_EVENT, handleEvent);

    } catch (error) {
      setLoading(false);
      console.error('CRUD action failed:', error);
    }
  };

  return { buttonRef, handleCRUDAction, loading };
};

// Usage in component
export const UserActions: React.FC<{ userId: string }> = ({ userId }) => {
  const { buttonRef, handleCRUDAction, loading } = useCRUDAction();

  const handleDelete = () => {
    handleCRUDAction(
      async (data) => {
        console.log('✅ Success:', data);
        window.location.href = '/users';
      },
      async (error) => {
        console.error('❌ Error:', error.message);
      }
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-danger"
      title="Delete User"
      data-action-confirm="Delete this user permanently?"
      data-href={`/api/users/${userId}`}
      data-http-method-request-action="DELETE"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};
```

#### Example 3: Multiple Actions in User Table

```typescript
import React from 'react';
import { CRUDActionConfirmationHandle, processCRUDAction } from '@wlindabla/form_validator';

interface User {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export const UserTable: React.FC<{ users: User[] }> = ({ users }) => {
  const handleActionClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const button = e.currentTarget;

    await CRUDActionConfirmationHandle({
      element: button,
      onConfirm: async () => {
        await processCRUDAction({
          eventDetail: {
            data: { userId: button.dataset.userId },
            urlActionRequest: button.dataset.href!,
            sourceElement: button,
            timestamp: new Date().toISOString(),
            httpMethodRequestAction: (button.dataset.httpMethod as any) || 'PATCH'
          },
          onSuccess: () => {
            // Refresh table or update state
            location.reload();
          }
        });
      }
    });
  };

  return (
    <table>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.status}</td>
            <td>
              <button
                className="btn btn-sm btn-warning"
                title={`Toggle ${user.name}`}
                data-action-confirm={`Toggle status for ${user.name}?`}
                data-href={`/api/users/${user.id}/toggle`}
                data-http-method-request-action="PATCH"
                data-additional={JSON.stringify({ userId: user.id })}
                onClick={handleActionClick}
              >
                Toggle
              </button>
              
              <button
                className="btn btn-sm btn-danger"
                title={`Delete ${user.name}`}
                data-action-confirm={`Delete ${user.name} permanently?`}
                data-href={`/api/users/${user.id}`}
                data-http-method-request-action="DELETE"
                data-additional={JSON.stringify({ userId: user.id })}
                onClick={handleActionClick}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

### jQuery

#### Example 1: Basic Setup

```javascript
import { 
  CRUDActionConfirmationHandle, 
  processCRUDAction,
  CRUD_ACTION_CONFIRMED_EVENT 
} from '@wlindabla/form_validator';

// === PHASE 1: All CRUD buttons ===
$(document).on('click', '[data-action-confirm]', async function(e) {
  e.preventDefault();
  
  const $button = $(this);
  
  try {
    const confirmed = await CRUDActionConfirmationHandle({
      element: this,
      confirmDialogConfig: {
        background: $button.data('dialog-bg') || '#00427E'
      }
    });

    if (!confirmed) {
      console.log('Action cancelled');
    }
  } catch (error) {
    console.error('Error:', error.message);
    $button.prop('disabled', false);
  }
});

// === PHASE 2: Process all confirmed actions ===
$(document).on(CRUD_ACTION_CONFIRMED_EVENT, async function(event) {
  try {
    const response = await processCRUDAction({
      eventDetail: event.detail,
      retryCount: 3,
      onSuccess: async (data) => {
        console.log('✅ Success:', data);
        // Show success toast
        $.notify('Action completed successfully!', 'success');
      },
      onError: async (error) => {
        console.error('❌ Error:', error);
      },
      onComplete: async () => {
        console.log('Refreshing page...');
        setTimeout(() => location.reload(), 2000);
      }
    });
  } catch (error) {
    console.error('Fatal error:', error);
  }
});
```

#### Example 2: Delete with Confirmation

**HTML:**
```html
<button 
  class="btn btn-danger delete-user"
  data-user-id="42"
  title="Delete User"
  data-action-confirm="Delete this user permanently? This cannot be undone."
  data-href="/admin/users/42/delete"
  data-http-method-request-action="DELETE"
  data-additional='{"userId":"42"}'>
  Delete
</button>
```

**JavaScript:**
```javascript
import { CRUDActionConfirmationHandle, processCRUDAction } from '@wlindabla/form_validator';

$('.delete-user').on('click', async function(e) {
  e.preventDefault();
  const $btn = $(this);
  const userId = $btn.data('user-id');

  await CRUDActionConfirmationHandle({
    element: this,
    confirmDialogConfig: {
      icon: 'warning',
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ff4757'
    }
  });
});

$(document).on('crud:action:confirmed', async function(event) {
  await processCRUDAction({
    eventDetail: event.detail,
    onSuccess: async () => {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'User has been deleted.'
      }).then(() => location.reload());
    }
  });
});
```

---

### Angular

#### Example 1: Service-based Approach

**CRUD Action Service:**
```typescript
import { Injectable } from '@angular/core';
import { 
  CRUDActionConfirmationHandle, 
  processCRUDAction,
  CRUD_ACTION_CONFIRMED_EVENT 
} from '@wlindabla/form_validator';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CRUDActionService {
  private actionSuccess$ = new Subject<any>();
  private actionError$ = new Subject<Error>();

  constructor() {
    this.setupGlobalListener();
  }

  async confirmAction(element: HTMLElement): Promise<boolean> {
    return await CRUDActionConfirmationHandle({
      element,
      onError: (error) => console.error('Confirmation failed:', error)
    });
  }

  async processAction(eventDetail: any, retryCount: number = 2): Promise<any> {
    try {
      const response = await processCRUDAction({
        eventDetail,
        retryCount,
        onSuccess: (data) => this.actionSuccess$.next(data),
        onError: (error) => this.actionError$.next(error)
      });
      return response;
    } catch (error) {
      this.actionError$.next(error as Error);
      throw error;
    }
  }

  private setupGlobalListener(): void {
    document.addEventListener(CRUD_ACTION_CONFIRMED_EVENT, async (event) => {
      const customEvent = event as CustomEvent;
      await this.processAction(customEvent.detail);
    });
  }

  getSuccessObservable() {
    return this.actionSuccess$.asObservable();
  }

  getErrorObservable() {
    return this.actionError$.asObservable();
  }
}
```

**Delete User Component:**
```typescript
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CRUDActionService } from './services/crud-action.service';

@Component({
  selector: 'app-delete-user',
  template: `
    <button
      #deleteBtn
      class="btn btn-danger"
      title="Delete User"
      [attr.data-action-confirm]="'Delete ' + user.name + '?'"
      [attr.data-href]="'/api/users/' + user.id"
      data-http-method-request-action="DELETE"
      [attr.data-additional]="getAdditionalData()"
      (click)="onDelete($event)">
      🗑️ Delete
    </button>
  `
})
export class DeleteUserComponent implements OnInit {
  @ViewChild('deleteBtn') deleteBtn!: ElementRef<HTMLButtonElement>;

  user = { id: '42', name: 'John Doe' };

  constructor(private crudService: CRUDActionService) {}

  ngOnInit(): void {
    this.crudService.getSuccessObservable().subscribe(() => {
      console.log('✅ User deleted successfully');
      location.reload();
    });

    this.crudService.getErrorObservable().subscribe((error) => {
      console.error('❌ Delete failed:', error);
    });
  }

  async onDelete(event: MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      await this.crudService.confirmAction(this.deleteBtn.nativeElement);
    } catch (error) {
      console.error('Confirmation error:', error);
    }
  }

  getAdditionalData(): string {
    return JSON.stringify({ userId: this.user.id, action: 'delete' });
  }
}
```

#### Example 2: Directive-based Approach

**CRUD Action Directive:**
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CRUDActionService } from './services/crud-action.service';

@Directive({
  selector: '[appCrudAction]'
})
export class CRUDActionDirective {
  @Input() appCrudAction: boolean = true;
  @Input() onActionSuccess?: (data: any) => void;
  @Input() onActionError?: (error: Error) => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private crudService: CRUDActionService
  ) {}

  @HostListener('click', ['$event'])
  async onClick(event: MouseEvent): Promise<void> {
    if (!this.appCrudAction) return;

    event.preventDefault();
    const button = this.el.nativeElement;

    try {
      await this.crudService.confirmAction(button);
    } catch (error) {
      console.error('Error:', error);
      this.onActionError?.(error as Error);
    }
  }
}
```

**Usage in Template:**
```html
<button
  appCrudAction
  class="btn btn-danger"
  title="Delete User"
  data-action-confirm="Delete this user?"
  data-href="/api/users/42"
  data-http-method-request-action="DELETE"
    data-additional='{"reason":"user-request"}'>
    Remove my account
</button>
```
## Support

Pour toute question ou bug report:
- 📧 Email: internationaleswebservices@gmail.com
- 📱 Phone: +229 0167 25 18 86
- 🔗 LinkedIn: [internationales-web-apps-services-120520193](https://www.linkedin.com/in/internationales-web-apps-services-120520193/)
- 💻 GitHub: [Agbokoudjo](https://github.com/Agbokoudjo/)

---

**MIT License © 2024 INTERNATIONALES WEB APPS & SERVICES**