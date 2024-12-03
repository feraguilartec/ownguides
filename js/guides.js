let guidesButtons = ["back", "down", "follow", "fwd", "min", "play", "pause", "rotate", "step", "steps", "up"];
let guidesBackground = ["step_active", "cascade_bg", "page_bg", "screen_s"];
let guidesModels = ["bg"];

var is_volume = true; // Volumen
var is_playing = false; // Variable para videos
var user_click = false; // Variable de clic
var guideJSON;

fetch('js/guide.json')
.then(response => response.json())
.then(data => {
  guideJSON = data;

  // Procesar cada elemento del JSON
  guideJSON.forEach(item => {
    let text = item.Text;
    let lines = [];
    let currentLine = '';
    let currentLength = 0;

    // Dividir el texto en palabras y 60 caracteres aprox por línea
    text.split(' ').forEach(word => {
      if (currentLength + word.length > 60) {
        lines.push(currentLine.trim());
        currentLine = '';
        currentLength = 0;
      }
      // Agregar la palabra a la línea actual
      currentLine += word + ' ';
      currentLength += word.length + 1; // +1 para el espacio
    });

    if (currentLine.trim().length > 0) {
      lines.push(currentLine.trim());
    }

    item.TextLines = lines;
  });
  updateGuide();
})
.catch(error => console.error('Error fetching JSON:', error));

AFRAME.registerComponent('guide', {
  schema: {
  },
  init: function() {

    var bg = document.createElement("a-entity");
    bg.setAttribute("gltf-model", "#bg");
    bg.setAttribute("scale", "1 1 .4");
    bg.setAttribute("position", "0 0 -.01");

    var screen = document.createElement("a-entity");
    screen.setAttribute("geometry", "primitive:plane; width:1.92; height:1.08");
    screen.setAttribute("material", "src:#screen; opacity:.95;");

    var back = document.createElement("a-entity");
    back.setAttribute("class", "button");
    back.setAttribute("id", "back_button");
    back.setAttribute("position", "-0.825 0.25 0.02");
    back.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    back.setAttribute("material", "src:#back; opacity:.99;");

    var fwd = document.createElement("a-entity");
    fwd.setAttribute("class", "button");
    fwd.setAttribute("id", "fwd_button");
    fwd.setAttribute("position", "0.795 0.22 0.02");
    fwd.setAttribute("geometry", "primitive:plane; width:.16; height:.16");
    fwd.setAttribute("material", "src:#fwd; opacity:.99;");
    fwd.setAttribute("event-set__mouseenter", "animation__arc.enabled: true; animation__segments.enabled: true");

    var up = document.createElement("a-entity");
    up.setAttribute("class", "button");
    up.setAttribute("id", "up_button");
    up.setAttribute("position", ".80 0.05 0.02");
    up.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    up.setAttribute("material", "src:#up; opacity:.99;");

    var down = document.createElement("a-entity");
    down.setAttribute("class", "button");
    down.setAttribute("id", "down_button");
    down.setAttribute("position", ".80 -0.30 0.02");
    down.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    down.setAttribute("material", "src:#down; opacity:.99;");

    var min = document.createElement("a-entity");
    min.setAttribute("class", "button");
    min.setAttribute("id", "min_button");
    min.setAttribute("position", "0.83 0.42 0.02");
    min.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    min.setAttribute("material", "src:#min; opacity:.99;");

    var follow = document.createElement("a-entity");
    follow.setAttribute("class", "button");
    follow.setAttribute("id", "follow_button");
    follow.setAttribute("position", ".7 0.42 0.02");
    follow.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    follow.setAttribute("material", "src:#follow; opacity:.99;");

    var volume_voice = document.createElement("a-entity");
    volume_voice.setAttribute("class", "button");
    volume_voice.setAttribute("id", "volume_voice");
    volume_voice.setAttribute("position", ".58 .42 0.02");
    volume_voice.setAttribute("geometry", "primitive:plane; width:.08; height:.08");
    volume_voice.setAttribute("material", "src:#volume_voice; opacity:.99;");

    var page_bg = document.createElement("a-entity");
    page_bg.setAttribute("position", "0 -.55 0.01");
    page_bg.setAttribute("geometry", "primitive:plane; width:.3; height:.1");
    page_bg.setAttribute("material", "src:#page_bg; opacity:.99;");

    var steps = document.createElement("a-entity");
    steps.setAttribute("class", "button");
    steps.setAttribute("id", "steps_button");
    steps.setAttribute("position", ".22 -.55 .01");
    steps.setAttribute("geometry", "primitive:plane; width:.1; height:.1");
    steps.setAttribute("material", "src:#steps; opacity:.99;");

    var title_text = document.createElement("a-entity");
    title_text.setAttribute("id", "title_text");
    title_text.setAttribute("position", "-0.835 0.435 .005");
    title_text.setAttribute("text", "value:" + guideJSON[0].Title + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:35; align:left;anchor:left;baseline:top;");

    var task_text = document.createElement("a-entity");
    task_text.setAttribute("id", "task_text");
    task_text.setAttribute("position", "-0.734 0.27 .005");
    task_text.setAttribute("text", "value: Tarea " + guideJSON[0].TaskNumber + ". " + guideJSON[0].Task + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:35; align:left;anchor:left;baseline:top;");

    var step_text = document.createElement("a-entity");
    step_text.setAttribute("id", "step_text");
    step_text.setAttribute("position", "-0.7 0.2 .005");
    step_text.setAttribute("text", "value: Paso " + guideJSON[0].StepNumber + ". " + guideJSON[0].Step + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:45; align:left;anchor:left;baseline:top;  width:1.4; wrapCount:60; align:left;anchor:left;baseline:top;opacity:0.8");

    var text_text = document.createElement("a-entity");
    text_text.setAttribute("id", "text_text");
    text_text.setAttribute("position", "-0.7 0.12 .005");

    let isThereAttachment = guideJSON[currentPage].Attachment;
    var multimedia_video = document.createElement("a-video");
    multimedia_video.setAttribute("id", "multimedia_video");
    multimedia_video.setAttribute("autoplay", "false");
    multimedia_video.setAttribute("muted", "true");
    multimedia_video.setAttribute("loop", "false");
    multimedia_video.setAttribute("material", "opacity: .95;");
    multimedia_video.setAttribute("position", "-2.5 0 -.01");
    multimedia_video.setAttribute("look-at", "#camara-cursor");

    var multimedia_image = document.createElement("a-image");
    multimedia_image.setAttribute("id", "multimedia_image");
    multimedia_image.setAttribute("position", "-2.5 0 -.01");
    multimedia_image.setAttribute("look-at", "#camara-cursor");

    var plano = document.createElement("a-plane");
    plano.setAttribute("id", "plano");
    plano.setAttribute("color", "#111");
    plano.setAttribute("height", ".2");
    plano.setAttribute("position", "-2.5 -.5 -.01");
    plano.setAttribute("look-at", "#camara-cursor");

    var bg_multimedia = document.createElement("a-entity");
    bg_multimedia.setAttribute("id", "bg_multimedia");
    bg_multimedia.setAttribute("gltf-model", "#bg");
    bg_multimedia.setAttribute("position", "-2.5 0 -.05");
    bg_multimedia.setAttribute("look-at", "#camara-cursor");
    
    var toggle_pause = document.createElement("a-entity");
    toggle_pause.setAttribute("class", "button");
    toggle_pause.setAttribute("id", "toggle_pause");
    toggle_pause.setAttribute("position", "-2.5 0 .2");
    toggle_pause.setAttribute("geometry", "primitive:plane; width:.5; height:.5");
    toggle_pause.setAttribute("material", "src:#play_on; opacity:.99;");
    toggle_pause.setAttribute("look-at", "#camara-cursor");

    // Animación al hacer hover
    toggle_pause.setAttribute("animation__mouseenter", {
      property: "material.opacity",
      to: 0.99,
      dur: 300,
      startEvents: "mouseenter"
    });
    
    // Animación al dejar de hacer hover
    toggle_pause.setAttribute("animation__mouseleave", {
      property: "material.opacity",
      to: 0,
      dur: 300,
      startEvents: "mouseleave"
    });

    let firstEightLines = guideJSON[0].TextLines.slice(0, 8).join('\n');

    text_text.setAttribute(
      "text",
      "value:" + firstEightLines + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.4; wrapCount:50; align:left;anchor:left;baseline:top;opacity:1"
    );

    var steps_text = document.createElement("a-entity");
    steps_text.setAttribute("id", "steps_text");
    steps_text.setAttribute("position", "0 -.54 .02");
    steps_text.setAttribute("text", "value: 1/" + guideJSON.length + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.4; wrapCount:50; align:center;anchor:center;baseline:center;opacity:1");

    this.el.appendChild(bg);
    this.el.appendChild(screen);
    this.el.appendChild(back);
    this.el.appendChild(fwd);
    this.el.appendChild(up);
    this.el.appendChild(down);
    this.el.appendChild(min);
    this.el.appendChild(follow);
    this.el.appendChild(volume_voice);
    this.el.appendChild(page_bg);
    this.el.appendChild(steps);
    this.el.appendChild(title_text);
    this.el.appendChild(task_text);
    this.el.appendChild(step_text);
    this.el.appendChild(text_text);
    this.el.appendChild(steps_text);
    this.el.appendChild(multimedia_image);
    this.el.appendChild(multimedia_video);
    this.el.appendChild(toggle_pause);

    updateGuide();
    playSpeechSynthesis(0, is_volume);

    // Gestión del volumen
    volume_voice.addEventListener('click', function () {
      is_volume = !is_volume;
      if (is_volume) {
        volume_voice.setAttribute("material", "src:#volume_voice; opacity:.99;");
      } else {
        volume_voice.setAttribute("material", "src:#volume_mute; opacity:.99;");
      }
      playSpeechSynthesis(0, is_volume);
    });
    
    // Mover texto para up
    down.addEventListener('click', function() {
      if (currentLineIndex + 8 < guideJSON[currentPage].TextLines.length) {
        currentLineIndex += 1;
        updateGuide();
      }
    });

    // Mover texto para abajo
    up.addEventListener('click', function() {
      if (currentLineIndex > 0) {
        currentLineIndex -= 1;
        updateGuide();
      }
    });

    // Cambiar slide para adelante
    fwd.addEventListener('click', function() {
      currentLineIndex = 0;
      playSpeechSynthesis(+1, is_volume);
      toggle_pause.setAttribute("material", "src:#play_on; opacity:.99;");
      if (is_playing == true && user_click == true){
        toggle_pause.click();
        is_playing = false;
        user_click = false;
      }
    });

    // Cambiar slide para atrás
    back.addEventListener('click', function() {
      currentLineIndex = 0;
      playSpeechSynthesis(-1, is_volume);
      toggle_pause.setAttribute("material", "src:#play_on; opacity:.99;");
      if (is_playing == true && user_click == true){
        toggle_pause.click();
        is_playing = false;
        user_click = false;
      }
    });

    // Función de reproducción de video
    toggle_pause.addEventListener('click', function () {
      user_click = true;
      let isThereAttachment = guideJSON[currentPage].Attachment;
      let currentSrc = multimedia_video.getAttribute('src');

      // Función para manejar el evento 'materialvideoloadeddata'
      function onVideoLoaded() {
        multimedia_video.removeEventListener('materialvideoloadeddata', onVideoLoaded); // Remover el listener
        var fixedWidthVideo = 1.92;

        // Obtener el nuevo elemento de video
        var videoElement;
        try {
          videoElement = multimedia_video.components.material.material.map.image;
        } catch (error) {
          console.log("Error al obtener el videoElement:", error);
        }

        if (videoElement && videoElement.tagName === 'VIDEO') {
          let videoWidth = videoElement.videoWidth;
          let videoHeight = videoElement.videoHeight;
          let aspectRatio = videoWidth / videoHeight;
          let calculatedHeight = fixedWidthVideo / aspectRatio;
          multimedia_video.setAttribute('width', fixedWidthVideo);
          multimedia_video.setAttribute('height', calculatedHeight);

          // Reproducir el video
          videoElement.muted = false;
          videoElement.play();
          toggle_pause.setAttribute("material", "src:#pause_on; opacity:.99;");
          is_playing = true;
        } else {
          console.error("No se pudo recuperar el elemento de video o no es un elemento de video.");
        }
      }

      if (currentSrc !== isThereAttachment) {
        // Obtener el elemento de video actual
        var videoElement;
        try {
          videoElement = multimedia_video.components.material.material.map.image;
        } catch (error) {
          console.log("Error al obtener el videoElement:", error);
        }

        // Si hay un video reproduciéndose, detenerlo y limpiar su fuente
        if (videoElement && videoElement.tagName === 'VIDEO') {
          videoElement.pause();
          videoElement.src = ''; 
          videoElement.load();
        }

        // Remover el 'src' anterior del 'multimedia_video'
        if (currentSrc) {
          multimedia_video.removeAttribute('src');
        }
        multimedia_video.setAttribute('src', isThereAttachment);
        multimedia_video.addEventListener('materialvideoloadeddata', onVideoLoaded);
        multimedia_video.setAttribute('visible', true);
      } else {
        // Si estamos en el mismo video, alternar play/pausa
        var videoElement;
        try {
          videoElement = multimedia_video.components.material.material.map.image;
        } catch (error) {
          console.log("Error al obtener el videoElement para reproducir/pausar:", error);
        }

        if (videoElement && videoElement.tagName === 'VIDEO') {
          if (is_playing) {
            videoElement.pause();
            toggle_pause.setAttribute("material", "src:#play_on; opacity:.99;");
            is_playing = false;
          } else {
            videoElement.play();
            toggle_pause.setAttribute("material", "src:#pause_on; opacity:.99;");
            is_playing = true;
          }
        } else {
          console.error("No se pudo recuperar el elemento de video o no es un elemento de video.");
        }
        multimedia_video.setAttribute('visible', true);
      }
    });
    setAnimationListeners();
  }
});
