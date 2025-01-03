// Función para resetear el cursor (mostrar el torus completo)
const resetCursor = () => {
  const cursor = document.querySelector('#cursor-animado');
  if (!cursor) {
    console.warn('resetCursor: No se encontró #cursor-animado');
    return;
  }
  //console.log('resetCursor: Configurando torus completo.');
  cursor.setAttribute('geometry', {
    primitive: 'torus',
    radius: 0.01,
    radiusTubular: 0.002,
    segmentsTubular: 32,
    segmentsRadial: 3,
    arc: 360 // Mostrar el torus completo
  });
  //cursor.setAttribute('cursor', 'fuse', true);
};


// Función para detener las animaciones del cursor
const stopCursorAnimations = () => {
  const cursor = document.querySelector('#cursor-animado');
  if (!cursor) {
    console.warn('stopCursorAnimations: No se encontró #cursor-animado');
    return;
  }
  //console.log('stopCursorAnimations: Removiendo animaciones en curso.');
  cursor.removeAttribute('animation__arc');
  cursor.removeAttribute('animation__segments');
  // Si usas fuse, podrías desactivarlo temporalmente para confirmar que no se auto-reinicien las animaciones
  cursor.setAttribute('cursor', 'fuse', false);
};

AFRAME.registerComponent('cursor-fuse-click', {
  init: function () {
    var el = this.el;
    // Funciones para manejar eventos
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // Agregar listeners para mousedown y mouseup
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseup', this.onMouseUp);
  },
  remove: function () {
    var el = this.el;
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mouseup', this.onMouseUp);
  },
  onMouseDown: function (evt) {
    //console.log('onMouseDown: Se detectó un clic (mouse down). Reseteando cursor.');
    resetCursor();
  },
  onMouseUp: function (evt) {
    //console.log('onMouseUp: Soltando el click, deteniendo animaciones y reseteando.');
    const cursor = document.querySelector('#cursor-animado');
    if (!cursor) {
      console.warn('onMouseUp: No se encontró #cursor-animado');
      return;
    }
    // Detener cualquier animación activa en el cursor
    stopCursorAnimations();
    resetCursor();

    // Obtener las intersecciones actuales del raycaster
    var raycaster = this.el.components.raycaster;
    var intersections = raycaster ? raycaster.intersections : [];
    //console.log('onMouseUp: Intersecciones detectadas: ', intersections);
    // Volver a obtener intersecciones por si no se encontró antes la clase 'button'
    intersections = raycaster ? raycaster.intersections : [];
    if (intersections.length > 0) {
      var intersectedEl = intersections[0].object.el;
      // Verificar si el elemento tiene la clase 'button' o uno de los IDs específicos
      if (intersectedEl && (intersectedEl.classList.contains('button') 
         || intersectedEl.id === 'fwdButton' 
         || intersectedEl.id === 'backButton' 
         || intersectedEl.id === 'downButton' 
         || intersectedEl.id === 'upButton')) {
           console.log('onMouseUp: Se ha detectado un elemento con ID o clase relevante, emitiendo evento click.');
           //intersectedEl.emit('click', {intersectedEl: intersectedEl});
      }
    }
  }
});
