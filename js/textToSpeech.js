function playSpeechSynthesis(index, play_or_not) {
    // Cancelar cualquier audio en curso
    if(play_or_not != false){
        window.speechSynthesis.cancel();
            
        // Crear una instancia de SpeechSynthesisUtterance con el nuevo texto
        var msg = new SpeechSynthesisUtterance((guideJSON[currentPage+index].Text));
        msg.lang = guideJSON[currentPage+index].Lang;

        // Asegurarte de que la voz está disponible y seleccionarla
        window.speechSynthesis.onvoiceschanged = function() {
            var voices = window.speechSynthesis.getVoices();
            var selectedVoice;
            if(msg.lang == 'en-US'){
                selectedVoice = voices.find(voice => voice.name === 'Microsoft Zira - English (United States)');
            } else if (msg.lang == 'es-MX'){
                selectedVoice = voices.find(voice => voice.name === 'Microsoft Sabina - Spanish (Mexico)');
            } else {
                selectedVoice = voices.find(voice => voice.lang === msg.lang);
            }

            //  Función para todas las voces disponibles
            // voices.forEach(function(voice, index) {
            //   console.log(index + ': ' + voice.name + ' (' + voice.lang + ') - ' + (voice.gender || 'Unknown gender'));
            // });
            //
            //  Lista de voces en español:
            //  Microsoft Raul - Spanish (Mexico) (es-MX)
            //  Microsoft Sabina - Spanish (Mexico)
            //  Google español (es-ES)
            //  Google español de Estados Unidos (es-US)
            if (selectedVoice) {
                msg.voice = selectedVoice;
            } else {
                console.warn('No se encontró la voz especificada.');
            }
            
            // Reproducir el nuevo audio
            window.speechSynthesis.speak(msg);
        };
        if (window.speechSynthesis.getVoices().length > 0) {
            window.speechSynthesis.onvoiceschanged();
        }
    } else{
        window.speechSynthesis.cancel();
    }
}

// Cancelar cualquier audio en curso en primer ejecución
window.speechSynthesis.cancel();