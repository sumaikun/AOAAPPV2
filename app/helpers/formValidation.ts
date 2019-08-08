import { alert, prompt } from "tns-core-modules/ui/dialogs";

export class formValidation {

    static validateFields(data: any, fields: any[]) {
        let validation = true;

        fields.reverse().forEach(field => {
            if (data[field.field] == null) {
                alert({
                    title: "error",
                    message: "El campo "+field.title+" no tiene ningun valor",
                    okButtonText: "Ok"
                });
                validation = false;
            }
        });

        return validation;
    }
}
