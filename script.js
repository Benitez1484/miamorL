/**
 * Script para la carta interactiva
 * Versión mejorada con ventana flotante centrada
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const highlights = document.querySelectorAll('.highlight');
    const mensajeFlotante = document.getElementById('mensaje-flotante');
    const mensajeTexto = document.getElementById('mensaje-texto');
    const cerrarMensaje = document.getElementById('cerrar-mensaje');
    const mensajeFlecha = document.querySelector('.mensaje-flecha');
    const container = document.querySelector('.container');
    
    // Variable para almacenar el elemento activo
    let elementoActivo = null;
    
    // Función para calcular la posición vertical de la ventana flotante
    function calcularPosicionVertical(elemento) {
        // Dimensiones y posición del contenedor
        const containerRect = container.getBoundingClientRect();
        
        // Posición relativa del elemento dentro del contenedor
        const rect = elemento.getBoundingClientRect();
        const relativaTop = rect.top - containerRect.top;
        
        // Determinar posición y tipo de flecha
        let top = relativaTop;
        let flechaPos = 'arriba';
        
        // Comprobar si hay espacio suficiente en la parte inferior
        if (relativaTop < containerRect.height / 2) {
            // Colocar la ventana debajo del elemento
            top = relativaTop + rect.height + 15;
            flechaPos = 'arriba';
        } else {
            // Colocar la ventana encima del elemento
            top = relativaTop - 15;
            flechaPos = 'abajo';
        }
        
        // Ajustar si está demasiado arriba o abajo
        if (top < 20) top = 20;
        if (top > containerRect.height - 120) top = containerRect.height - 120;
        
        return { top, flechaPos };
    }
    
    // Función para mostrar el mensaje flotante
    function mostrarMensaje(elemento) {
        // Obtener el mensaje desde el atributo data-message
        const mensaje = elemento.getAttribute('data-message');
        if (!mensaje) return;
        
        // Establecer el texto del mensaje
        mensajeTexto.textContent = mensaje;
        
        // Calcular posición vertical
        const posicion = calcularPosicionVertical(elemento);
        
        // Aplicar posición
        mensajeFlotante.style.top = `${posicion.top}px`;
        
        // Posicionar la flecha
        if (posicion.flechaPos === 'arriba') {
            mensajeFlecha.className = 'mensaje-flecha arriba';
        } else {
            mensajeFlecha.className = 'mensaje-flecha abajo';
        }
        
        // Mostrar la ventana flotante
        mensajeFlotante.classList.add('visible');
        
        // Marcar como activo el elemento actual
        if (elementoActivo) {
            elementoActivo.classList.remove('active');
        }
        elemento.classList.add('active');
        elementoActivo = elemento;
        
        // Asegurarse de que el mensaje es visible (scroll automático)
        const containerScrollTop = container.scrollTop;
        const mensajeBottom = posicion.top + 120; // altura aproximada del mensaje
        
        // Si el mensaje está fuera de la vista (abajo), hacer scroll
        if (mensajeBottom > containerRect.height + containerScrollTop - 30) {
            container.scrollTo({
                top: containerScrollTop + 100,
                behavior: 'smooth'
            });
        }
        // Si el mensaje está fuera de la vista (arriba), hacer scroll
        else if (posicion.top < containerScrollTop + 30) {
            container.scrollTo({
                top: containerScrollTop - 100,
                behavior: 'smooth'
            });
        }
    }
    
    // Función para ocultar el mensaje flotante
    function ocultarMensaje() {
        mensajeFlotante.classList.remove('visible');
        
        // Quitar el estado activo
        if (elementoActivo) {
            elementoActivo.classList.remove('active');
            elementoActivo = null;
        }
    }
    
    // Agregar eventos a cada elemento resaltado
    highlights.forEach(highlight => {
        highlight.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mostrarMensaje(highlight);
        });
        
        // Para compatibilidad con dispositivos táctiles
        highlight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            mostrarMensaje(highlight);
        }, { passive: false });
    });
    
    // Evento para cerrar el mensaje
    cerrarMensaje.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ocultarMensaje();
    });
    
    // Cerrar el mensaje si se hace clic fuera del elemento resaltado y fuera del mensaje
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.highlight') && !e.target.closest('.mensaje-flotante')) {
            ocultarMensaje();
        }
    });
    
    // Reposicionar el mensaje al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (elementoActivo && mensajeFlotante.classList.contains('visible')) {
            const posicion = calcularPosicionVertical(elementoActivo);
            mensajeFlotante.style.top = `${posicion.top}px`;
            
            // Actualizar posición de la flecha
            if (posicion.flechaPos === 'arriba') {
                mensajeFlecha.className = 'mensaje-flecha arriba';
            } else {
                mensajeFlecha.className = 'mensaje-flecha abajo';
            }
        }
    });
    
    // Efecto de aparición al cargar la página
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 1s ease, transform 1s ease';
    
    // Mostramos el contenido con una pequeña animación
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 200);
});