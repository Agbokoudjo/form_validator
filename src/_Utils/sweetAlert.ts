/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */
import { SweetAlertOptions } from "sweetalert2";
export const baseSweetAlert2Options: SweetAlertOptions = {
    toast: true,
    position: "top-end",
    animation: true,
    allowEscapeKey: false,
    background: "#283c63",
    color: "#fff",
    didOpen: () => {
        document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';
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