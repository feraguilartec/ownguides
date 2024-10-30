export async function fetchAndProcessJSON() {
    try {
        const response = await fetch('js/guide.json');
        const data = await response.json();

        // Procesar cada elemento del JSON
        data.forEach(item => {
            let text = item.Text;
            let newText = '';
            let currentLength = 0;

            // Dividir el texto en palabras
            text.split(' ').forEach(word => {
                // Si al agregar la palabra el total supera un múltiplo de 60
                if (currentLength + word.length > 30) {
                    // Agregar un salto de línea antes de la palabra si no es el principio
                    if (currentLength > 0) {
                        newText += '\n';
                        currentLength = 0;
                    }
                }

                // Agregar la palabra al nuevo texto
                newText += word + ' ';
                currentLength += word.length + 1; // +1 para el espacio
            });

            // Reasignar el texto modificado al objeto
            item.Text = newText.trim();
        });

        // Retornar el JSON procesado
        return data;

    } catch (error) {
        console.error('Error fetching or processing JSON:', error);
        throw error; // Re-lanzar el error para que sea manejado en main.js si es necesario
    }
}

