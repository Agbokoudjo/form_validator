import {
    CRUDActionConfirmationHandle,
    CRUDActionEventDetail,
    processCRUDAction
} from '../User';
import { fetchErrorTranslator } from '../Translation';

// Handle button click
jQuery(document).on('click','.btn-toggle-account', async (event) => {
    event.preventDefault();

    const confirmed = await CRUDActionConfirmationHandle({
        element: event.currentTarget as HTMLElement,
        eventName: 'account:toggle:confirmed'
    });

    if (confirmed) {
        console.log('User confirmed the action');
    }
});

// 1. Listen for toggle confirmation event
document.addEventListener('account:toggle:confirmed', async (event:Event) => {
    try {
        console.log(event);
        const customEvent = event as CustomEvent;
        const detail = customEvent.detail as CRUDActionEventDetail;
        const response = await processCRUDAction({
            eventDetail: detail ,
            httpMethod: 'PATCH',
            retryCount: 2,

            onSuccess: async (data) => {
                console.log('Toggle successful:', data);
                // Reload page after 2 seconds
                setTimeout(() => location.reload(), 2000);
            },
            translator: (key, error, lang) => {
                const error_name = error ? error.name : "NetWork";
                    return fetchErrorTranslator.translate(error_name, error,'fr');
               
               ;
            },
            onError: (error) => {
                console.error('Toggle failed:', error);
            }
        });

        console.log('Response:', response);
    } catch (error) {
        console.error('Process failed:', error);
    }
});