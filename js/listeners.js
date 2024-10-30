var currentPage = 0;
var totalPages = 0;

// Función para obtener cuántas páginas hay en el JSON
async function loadTotalPages() {
  try {
    const response = await fetch('js/guide.json');
    const data = await response.json();
    totalPages = data.length;
  } catch (error) {
    console.error('Error loading total.json:', error);
  }
}

loadTotalPages();

function setAnimationListeners() {
  var buttons = document.querySelectorAll(".button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("mouseenter", overHandler);
    buttons[i].addEventListener("mouseleave", outHandler);
    buttons[i].addEventListener("click", clickHandler);
  }

  setArrowsListeners();
}

let currentLineIndex = 0;

function updateGuide() {
  // Actualizar textos
  title_text.setAttribute("text", "value:" + guideJSON[currentPage].Title + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:35; align:left; anchor:left; baseline:top;");
  task_text.setAttribute("text", "value: Tarea " + guideJSON[currentPage].TaskNumber + ". " + guideJSON[currentPage].Task + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:35; align:left; anchor:left; baseline:top;");
  step_text.setAttribute("text", "value: Paso " + guideJSON[currentPage].StepNumber + ". " + guideJSON[currentPage].Step + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.5; wrapCount:45; align:left; anchor:left; baseline:top; opacity:0.8;");

  let linesToShow = guideJSON[currentPage].TextLines.slice(currentLineIndex, currentLineIndex + 8).join('\n');
  text_text.setAttribute(
    "text",
    "value:" + linesToShow + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.4; wrapCount:50; align:left; anchor:left; baseline:top; opacity:1;"
  );

  steps_text.setAttribute("text", "value: " + guideJSON[currentPage].ID + "/" + guideJSON.length + "; font:media/font/MYRIADPRO-REGULAR-msdf.json; negate:false; width:1.4; wrapCount:50; align:center; anchor:center; baseline:center; opacity:1;");

  // --- Sección de Multimedia ---
  let isThereAttachment = guideJSON[currentPage].Attachment;
  multimedia_video.removeAttribute('animation__fadein');
  multimedia_video.removeAttribute('animation__grow');
  multimedia_image.removeAttribute('animation__fadein');
  multimedia_image.removeAttribute('animation__grow');

  if (isThereAttachment) {
    let attachmentExtension = isThereAttachment.slice(-4).toLowerCase();
    let isVideo = (attachmentExtension === ".mp4");

    if (isVideo) {
      multimedia_image.setAttribute('visible', false);
      document.querySelector("#toggle_pause").setAttribute("visible", true);
    } else {
      is_playing = false;
      multimedia_image.setAttribute('visible', true);
      multimedia_video.setAttribute('visible', false);
      document.querySelector("#toggle_pause").setAttribute('visible', false);
      multimedia_image.setAttribute('src', isThereAttachment);

      // Añadir animación de fade-in y grow a la imagen
      multimedia_image.setAttribute('animation__fadein', {
        property: 'material.opacity',
        from: 0,
        to: 1,
        dur: 1000
      });

      multimedia_image.setAttribute('animation__grow', {
        property: 'scale',
        from: '0 0 0',
        to: '1 1 1',
        dur: 1000
      });

      // Ajustar las dimensiones de la imagen
      multimedia_image.addEventListener('materialtextureloaded', function adjustImageSize() {
        let img = multimedia_image.components.material.material.map.image;

        if (img) {
          let imgWidth = img.naturalWidth;
          let imgHeight = img.naturalHeight;

          if (imgWidth && imgHeight) {
            let aspectRatio = imgWidth / imgHeight;
            let fixedWidth = 1.92;
            let calculatedHeight = fixedWidth / aspectRatio;

            multimedia_image.setAttribute('geometry', {
              primitive: 'plane',
              width: fixedWidth,
              height: calculatedHeight
            });
          }
        }
      }, { once: true }); // El evento solo se ejecuta una vez para evitar acumulaciones
    }
  } else {
    // Si no hay attachment, ocultar ambos elementos multimedia y el fondo
    multimedia_image.setAttribute('visible', false);
    multimedia_video.setAttribute('visible', false);
    multimedia_video.setAttribute('muted', 'true'); // Asegurar que esté muteado
    document.querySelector("#toggle_pause").setAttribute('visible', false);
    is_playing = false;
  }
  updateButtonVisibility();
}


function updateButtonVisibility() {
  // Ocultar el botón "up" si estamos en la primera línea
  if (currentLineIndex === 0) {
    document.querySelector("#up_button").setAttribute("visible", "false");
  } else {
    document.querySelector("#up_button").setAttribute("visible", "true");
  }

  // Ocultar el botón "down" si no hay más líneas que mostrar
  if (currentLineIndex + 8 >= guideJSON[currentPage].TextLines.length) {
    document.querySelector("#down_button").setAttribute("visible", "false");
  } else {
    document.querySelector("#down_button").setAttribute("visible", "true");
  }

  // Ocultar el botón "back" si no hay contenidos anteriores
  if (guideJSON[currentPage].ID == 1) {
    const backButton = document.querySelector("#back_button");
    backButton.setAttribute("visible", "false");
    backButton.classList.remove('button');  // Remover clase que puede tener eventos de clic
    backButton.setAttribute("pointerEvents", "none");  // Desactivar eventos de puntero
  } else {
    const backButton = document.querySelector("#back_button");
    backButton.setAttribute("visible", "true");
    backButton.classList.add('button');  // Agregar clase si se necesita para eventos
    backButton.setAttribute("pointerEvents", "auto");  // Reactivar eventos de puntero
  }

  // Ocultar el botón "fwd" si no hay contenidos anteriores
  if (guideJSON[currentPage].ID == 6) {
    const fwdButton = document.querySelector("#fwd_button");
    fwdButton.setAttribute("visible", "false");
    fwdButton.classList.remove('button');  // Remover clase que puede tener eventos de clic
    fwdButton.setAttribute("pointerEvents", "none");  // Desactivar eventos de puntero
  } else {
    const fwdButton = document.querySelector("#fwd_button");
    fwdButton.setAttribute("visible", "true");
    fwdButton.classList.add('button');  // Agregar clase si se necesita para eventos
    fwdButton.setAttribute("pointerEvents", "auto");  // Reactivar eventos de puntero
  }
}

function setArrowsListeners() {
  document.querySelector("#back_button").addEventListener("click", backHandler);
  document.querySelector("#fwd_button").addEventListener("click", fwdHandler);
}

function fwdHandler() {
  if (currentPage < totalPages - 1) {
    currentPage++;
    currentLineIndex = 0; // Resetear el índice de la línea al avanzar de página
    updateGuide();
  }
}

function backHandler() {
  if (currentPage > 0) {
    currentPage--;
    currentLineIndex = 0; // Resetear el índice de la línea al retroceder de página
    updateGuide();
  }
}

function overHandler() {
  this.setAttribute("material", "src:#" + this.getAttribute("id").split("_")[0] + "_on");
  this.setAttribute("animation__position", "property:object3D.position.z; to:.04; dur:300; easing:easeOutQuad");
  this.setAttribute("animation__scale", "property:scale; to:1.2 1.2 1.2; dur:300; easing:easeOutQuad");
}

function outHandler() {
  this.removeAttribute("animation__scale");
  this.removeAttribute("animation__position");

  this.setAttribute("material", "src:#" + this.getAttribute("id").split("_")[0]);
  this.setAttribute("animation__scale", "property:scale; to:1 1 1; dur:300; easing:easeOutQuad");
  this.setAttribute("animation__position", "property:object3D.position.z; to:.02; dur:300; easing:easeOutQuad");
}

function clickHandler() {
  this.removeAttribute("animation__scale");
  this.removeAttribute("animation__position");

  this.setAttribute("animation__scale", "property:scale;from:1 1 1; to:1.1 1.1 1.1; dur:300; easing:easeOutQuad");
  this.setAttribute("animation__position", "property:object3D.position.z;from:.02; to:.04; dur:300; easing:easeOutQuad");
}
