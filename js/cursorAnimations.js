AFRAME.registerComponent('log-on-intersect', {
  init: function () {
    const buttons = document.querySelectorAll('#fwd_button, #back_button, #up_button, #down_button');
    const cursor = document.querySelector('#cursor-animado');
    const resetCursor = () => {
      // Configurar el estado inicial (toro completo)
      cursor.setAttribute('geometry', {
        primitive: 'torus',
        radius: 0.01,
        radiusTubular: 0.002,
        segmentsTubular: 32,
        segmentsRadial: 3,
        arc: 360, // Mostrar el toro completo
      });
    };

    function animateCursor() {
      const cursor = document.querySelector('#cursor-animado');
      if (!cursor) {
        console.warn('animateCursor: No se encontró #cursor-animado');
        return;
      }

      // Iniciar las animaciones de carga
      cursor.setAttribute('animation__arc', {
        property: 'geometry.arc',
        from: 0,
        to: 360,
        loop: false,
        dur: 1400,
        easing: 'linear',
        enabled: true,
      });

      cursor.setAttribute('animation__segments', {
        property: 'geometry.segmentsTubular',
        from: 1,
        to: 32,
        loop: false,
        dur: 1400,
        easing: 'linear',
        enabled: true,
      });
    }

    function reverseAnimateCursor() {
      const cursor = document.querySelector('#cursor-animado');
      if (!cursor) {
        console.warn('reverseAnimateCursor: No se encontró #cursor-animado');
        return;
      }

      // Obtener progreso actual
      const arcProgress = parseFloat(cursor.getAttribute('geometry').arc || 0);
      const segmentProgress = parseFloat(cursor.getAttribute('geometry').segmentsTubular || 1);

      // Configurar animación inversa
      cursor.setAttribute('animation__arc', {
        property: 'geometry.arc',
        from: arcProgress,
        to: 0,
        loop: false,
        dur: 1400 * (arcProgress / 360),
        easing: 'linear',
        enabled: true,
      });

      cursor.setAttribute('animation__segments', {
        property: 'geometry.segmentsTubular',
        from: segmentProgress,
        to: 1,
        loop: false,
        dur: 1400 * ((segmentProgress - 1) / 31),
        easing: 'linear',
        enabled: true,
      });

      cursor.addEventListener('animationcomplete', (event) => {
        resetCursor();
      });
    }

    // Aquí reactivamos el fuse sólo cuando se detecta una nueva intersección (nuevo objetivo)
    buttons.forEach(button => {
      button.addEventListener('raycaster-intersected', () => {
        const cursor = document.querySelector('#cursor-animado');
        if (cursor) {
          // Reactivar el fuse al detectar una nueva intersección con un botón
          cursor.setAttribute('cursor', 'fuse', true);
        }
        animateCursor();
      });

      button.addEventListener('raycaster-intersected-cleared', reverseAnimateCursor);
    });
  },
});

// Agregar el componente al cursor (o donde uses el raycaster)
document.querySelector('[raycaster]').setAttribute('log-on-intersect', '');
