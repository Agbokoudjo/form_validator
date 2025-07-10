import {
    FormValidateController,
    FieldValidationFailed,
    FieldValidationSuccess,
    FieldValidationEventData
} from "../Validation";

import {
    addErrorMessageFieldDom,
    addHashToIds,
    HTMLFormChildrenElement,
    clearErrorInput
} from "../_Utils";

jQuery(function TestvalidateInput() {
    const formValidate = new FormValidateController('#form_validate');
    const idsBlur = addHashToIds(formValidate.idChildrenUsingEventBlur).join(",");
    const idsInput = addHashToIds(formValidate.idChildrenUsingEventInput).join(",");
    const idsChange = addHashToIds(formValidate.idChildrenUsingEventChange).join(",");
    const __form = formValidate.form
    __form.on("blur", `${idsBlur}`, async (event: JQuery.BlurEvent) => {
        const target = event.target;

        if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
            await formValidate.validateChildrenForm(event.target as HTMLFormChildrenElement)

        }
    })
    __form.on(FieldValidationFailed, (event: JQuery.TriggeredEvent) => {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;
        addErrorMessageFieldDom(jQuery(data.targetChildrenForm), data.message)


    })
    __form.on(FieldValidationSuccess, (event: JQuery.TriggeredEvent) => {
        const data = (event.originalEvent as CustomEvent<FieldValidationEventData>).detail;


    })
    __form.on('input', `${idsInput}`, (event: JQuery.Event | any) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            if (target) {
                clearErrorInput(jQuery(target))
            }
        }

    });
    __form.on('change', `${idsChange}`, async (event: JQuery.ChangeEvent) => {
        const target = event.target;
        console.log(target.files)
        clearErrorInput(jQuery(target))

        if (target instanceof HTMLInputElement && target.type === "file") {
            await formValidate.validateChildrenForm(event.target)
        }

    });
})