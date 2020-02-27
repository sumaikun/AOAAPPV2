import { alert } from "tns-core-modules/ui/dialogs";
import { properties } from "../properties";

export class serverResponse {  

  
    static checkServerError(error) {       

        //console.log(error)
        if(error.status === 401 || error.status === 403)
        {
            alert({
                title: "error",
                message: "¡Su sesión se ha vencido! vuelva a ingresar las credenciales",
                okButtonText: "Ok"
            });
            
            if(properties.getInstance().getLogoutAction())
            {
                const action = properties.getInstance().getLogoutAction()
                action()
            }

            return false
        }

        else if(error.status === 500)
        {
            alert({
                title: "error",
                message: "¡Sucedió un error! hay un problema en el servidor, consulte con el administrador ",
                okButtonText: "Ok"
            });

            return false
        }
        else if(error.status === 0){
            alert({
                title: "error",
                message: "¡Sucedió un error inesperado, puede no haber conexión al servidor! ",
                okButtonText: "Ok"
            });
        }

        return true
    }
}