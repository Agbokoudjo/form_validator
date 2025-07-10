import Swal from "sweetalert2"
import {
    Logger,
    handleErrorsManyForm,
    addParamToUrl,
    mapStatusToResponseType,
    httpFetchHandler,
    HttpFetchError,
    HttpResponse
} from "../_Utils";
const BASE_HOST = 'http://127.0.0.1:8001';
const APP_URL_SUBMIT = "/api/test-submission"
/**
 * @type {SweetAlert2Options}
 */
export const baseSweetAlert2Options = {
    animation: true,
    allowEscapeKey: false,
    background: "#00427E",
    color: "#fff",
    didOpen: () => {
        const swalContainer = document.querySelector<HTMLElement>('.swal2-container')!
        swalContainer.style.zIndex = '99999';
    },
    showClass: {
        popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
                `
    },
    hideClass: {
        popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
                `
    }
}

jQuery(function testFormSubmit() {
    /**
             * @var {string}
             */
    let originalText;
    jQuery(document).on('submit', 'form.form_submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = jQuery(event.target);
        const $submitButton = jQuery('button[type="submit"]', form);
        originalText = $submitButton.text();
        $submitButton.prop('disabled', true);
        $submitButton.text(" Envoi en cours...");

        let timerInterval: string | number | NodeJS.Timeout;
        Swal.fire({
            title: `Traitement`,
            icon: 'info',
            html: `<div class="alert alert-info" role="alert">
                        Transmission des données en cours. Merci de votre patience
                    </div>`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            background: "#00427E",
            color: "#fff",
            timer: 60000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector<HTMLElement>('.swal2-container')!
                swalContainer.style.zIndex = '99999';
                Swal.showLoading();
                const timerElement = Swal.getPopup()?.querySelector("b");
                timerInterval = setInterval(() => {
                    if (timerElement) {
                        timerElement.textContent = `${Swal.getTimerLeft()}ms`;
                    }
                }, 100);
            },
            willClose: () => clearInterval(timerInterval),
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
            customClass: {
                loader: 'spinner-border text-info',
                timerProgressBar: "bg-info"
            }
        });
        try {
            const response_data = await httpFetchHandler({
                url: addParamToUrl(APP_URL_SUBMIT, { test_form_submit: true }, true, BASE_HOST),
                data: new FormData(form.get()[0]),
                methodSend: "POST",
                timeout: 60000,
                retryCount: 2,
                responseType: "json"
            });

            if (mapStatusToResponseType(response_data.status) === "error") {
                throw response_data;
            }

            /**
             * @type { title:string,
             *          details:string,
             *          message:string;
             *          }
             */
            const data = response_data.data;
            Swal.close();
            Swal.fire({
                title: data.title,
                icon: "success",
                html: `<div class="alert alert-success" role="alert">${data.message}</div>`,
                allowOutsideClick: false,
                timer: 40000,
                showConfirmButton: false,
                ...baseSweetAlert2Options,
                showCloseButton: true
            });
            form.get()[0].reset();
            $submitButton.text(originalText);
            Logger.log(originalText)
            $submitButton.prop('disabled', false);
            $submitButton.removeAttr('disabled');
            return;
        } catch (error) {
            Logger.error('fetch result error', error)
            if (error instanceof HttpResponse) {
                const errors_data = error.data;
                let message = "une erreur s'est produite";
                let title = "Erreur"
                if (error.status === 422) {
                    message = errors_data.details;
                    title = errors_data.title;
                    handleErrorsManyForm(
                        form.attr('name') || '',
                        form.attr('id') || '',
                        errors_data.violations || {}
                    );
                }
                else if (error.status === 404) {
                    message = errors_data;
                    title = `Erreur 404 : Page introuvable pour Url ${window.location.href}`;
                }
                else {
                    message = errors_data;
                }
                Swal.close();
                Swal.fire({
                    title: title,
                    icon: "error",
                    html: `<div class="alert alert-danger" role="alert">${message}</div>`,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    showCloseButton: true,
                    ...baseSweetAlert2Options
                });
                originalText = "Réessayer"
                Logger.log(originalText)
                $submitButton.prop('disabled', false);
                $submitButton.removeAttr('disabled');
                return;
            }

            if (error instanceof HttpFetchError) {
                Swal.close();
                Swal.fire({
                    title: "Erreur réseau",
                    icon: "error",
                    html: `<div class="alert alert-danger" role="alert">${error.message}</div>`,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    ...baseSweetAlert2Options,
                    showCloseButton: true
                });
            }
            originalText = "Réessayer"
            Logger.log(originalText)
            $submitButton.prop('disabled', false);
            $submitButton.removeAttr('disabled');

        }
    })

})