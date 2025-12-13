/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */

import { EventEmitter } from 'events';

export interface CustomEventOptions {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}

export interface EventEmitterInterface{

    /**
    * Emit an event (works in both environments)
    */
    emit(eventName: string, data:any,options?: CustomEventInit): void;

    /**
   * Listen to an event (works in both environments)
   */
    on(eventName: string, handler: (data: any) => void): void;

    /**
     * Listen to an event once (works in both environments)
     */
    once(eventName: string, handler: (data: any) => void): void;

    /**
    * Remove event listener (works in both environments)
    */
    off(eventName: string, handler: (data: any) => void): void;

    /**
   * Remove all listeners for an event
   */
    removeAllListeners(eventName?: string): void ;
}

/**
 * Universal event emitter that works in both browser and Node.js
 */
export class UniversalEventEmitter implements EventEmitterInterface{ 
    private target: Window | Document | EventEmitter;
    private isNodeEnvironment: boolean;

    constructor(target?: Window | Document | EventEmitter) {
        this.isNodeEnvironment = typeof window === 'undefined';

        if (this.isNodeEnvironment) {
            // Node.js : créer un EventEmitter
            this.target = target instanceof EventEmitter
                ? target
                : new EventEmitter();
        } else {
            // Navigateur : utiliser window ou document
            this.target = target || (typeof document !== 'undefined' ? document : window);
        }
    }

    emit(
        eventName: string,
        data: any,
        options?: CustomEventOptions
    ): void {
        if (this.isNodeEnvironment) {
            // Node.js
            (this.target as EventEmitter).emit(eventName, data);
        } else {
            // Navigateur
            const event = new CustomEvent(eventName, {
                detail: data,
                bubbles: options?.bubbles ?? false,
                cancelable: options?.cancelable ?? true,
                composed: options?.composed ?? true
            });
            (this.target as Window | Document).dispatchEvent(event);
        }
    }

    
    on(eventName: string, handler: (data: any) => void): void {
        if (this.isNodeEnvironment) {
            // Node.js
            (this.target as EventEmitter).on(eventName, handler);
        } else {
            // Navigateur
            (this.target as Window | Document).addEventListener(
                eventName,
                ((event: CustomEvent) => handler(event.detail)) as EventListener
            );
        }
    }

    once(eventName: string, handler: (data: any) => void): void {
        if (this.isNodeEnvironment) {
            // Node.js
            (this.target as EventEmitter).once(eventName, handler);
        } else {
            // Navigateur
            (this.target as Window | Document).addEventListener(
                eventName,
                ((event: CustomEvent) => handler(event.detail)) as EventListener,
                { once: true }
            );
        }
    }

    off(eventName: string, handler: (data: any) => void): void {
        if (this.isNodeEnvironment) {
            // Node.js
            (this.target as EventEmitter).off(eventName, handler);
        } else {
            // Navigateur
            (this.target as Window | Document).removeEventListener(
                eventName,
                handler as EventListener
            );
        }
    }


    removeAllListeners(eventName?: string): void {
        if (this.isNodeEnvironment) {
            (this.target as EventEmitter).removeAllListeners(eventName);
        } else {
            // Navigateur n'a pas de méthode native pour ça
            console.warn('removeAllListeners not fully supported in browser');
        }
    }
}