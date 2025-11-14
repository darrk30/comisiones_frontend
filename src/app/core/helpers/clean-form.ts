export function transformFormData(obj: any): any {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof File) && !(obj[key] instanceof Blob)) {
            // Aplica la transformación recursivamente para objetos o arrays
            this.transformFormData(obj[key]);
        } else if (obj[key] === null) {
            delete obj[key]; // Elimina las propiedades con valor null
        } else if (obj[key] === "null") {
            delete obj[key]; // Elimina las propiedades con valor null
        } 
        // else if (obj[key] === true) {
        //     obj[key] = 1; // Convierte true a 1
        // } else if (obj[key] === false) {
        //     obj[key] = 0; // Convierte false a 0
        // }
    });
    return obj;
}


export function appendFormData(formData: FormData, data: any, parentKey: string | null = null): void {
    Object.keys(data).forEach((key) => {
        const value = data[key];
        const formKey = parentKey ? `${parentKey}[${key}]` : key;
    
        if (value === null || value === undefined || value === '') {
            // No agregar valores nulos, indefinidos o vacíos
            return;
        }
    
        if (value instanceof File || value instanceof Blob) {
            // Manejar archivos
            formData.append(formKey, value);
        } else if (typeof value === 'object' && !(value instanceof Date)) {
            // Llamada recursiva para objetos anidados
            appendFormData(formData, value, formKey);
        } else {
            // Agregar otros valores
            formData.append(formKey, String(value));
        }
    });
}

export function toDateInputValue(value: string | Date | null): string | null {
    if (!value) return null;
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export function limpiarCamposVacios(obj: any): any {
    const limpio: any = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];

        // Si es objeto (anidado) recursivo
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nested = limpiarCamposVacios(value);
            if (Object.keys(nested).length > 0) {
                limpio[key] = nested;
            }
        }
        else if (value !== null && value !== '' && value !== undefined && value !== 'null' && !(Array.isArray(value) && value.length == 0)) {
            limpio[key] = value;
        }
    });
    return limpio;
}


export function objectToText(obj: any): string {
	let result = '';

	if (obj === null || obj === undefined) return '';

	if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
		return obj.toString();
	}

	if (Array.isArray(obj)) {
		for (const item of obj) {
			result += ' ' + objectToText(item);
		}
		return result;
	}

	if (typeof obj === 'object') {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				result += ' ' + objectToText(obj[key]);
			}
		}
	}

	return result;
}