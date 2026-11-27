(function() {
    'use strict';

    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var lightboxClose = document.getElementById('lightbox-close');

    var items = [];        // gallery items of the project that is open
    var currentIndex = 0;
    var lastFocus = null;
    var touchStartX = 0;
    var touchStartY = 0;
    var dragOffset = 0;

    function groupOf(item) {
        var scope = item.closest('.project-detail') || document;
        return Array.prototype.slice.call(scope.querySelectorAll('.project-gallery-item'));
    }

    function resetDrag() {
        dragOffset = 0;
        lightboxImage.style.transform = '';
    }

    function updateImage() {
        var item = items[currentIndex];
        lightboxImage.src = item.getAttribute('data-lightbox-src');
        lightboxImage.alt = item.getAttribute('data-lightbox-alt') || ('Gallery image ' + (currentIndex + 1));
        var label = (currentIndex + 1) + ' / ' + items.length;
        if (item.getAttribute('data-rendering')) label = 'Rendering \u00b7 ' + label;
        lightboxCounter.textContent = label;
        var single = items.length < 2;
        lightboxPrev.style.display = single ? 'none' : '';
        lightboxNext.style.display = single ? 'none' : '';
    }

    function openLightbox(item) {
        items = groupOf(item);
        currentIndex = Math.max(0, items.indexOf(item));
        lastFocus = item;
        updateImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetDrag();
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function nextImage() {
        if (items.length < 2) return;
        currentIndex = (currentIndex + 1) % items.length;
        updateImage();
        resetDrag();
    }

    function prevImage() {
        if (items.length < 2) return;
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateImage();
        resetDrag();
    }

    // Open from any gallery item (click, Enter or Space)
    document.addEventListener('click', function(e) {
        var item = e.target.closest && e.target.closest('.project-gallery-item');
        if (item) openLightbox(item);
    });

    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
            return;
        }
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var item = document.activeElement && document.activeElement.closest && document.activeElement.closest('.project-gallery-item');
        if (item) {
            e.preventDefault();
            openLightbox(item);
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
    lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });

    // Click outside the image to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Touch handlers for swipe
    lightbox.addEventListener('touchstart', function(e) {
        if (!e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchmove', function(e) {
        if (!e.touches[0] || items.length < 2) return;
        var dx = e.touches[0].clientX - touchStartX;
        var dy = e.touches[0].clientY - touchStartY;
        // Only track horizontal swipes
        if (Math.abs(dy) > Math.abs(dx)) return;
        dragOffset = dx;
        lightboxImage.style.transform = 'translateX(' + dragOffset + 'px)';
        lightboxImage.style.transition = 'none';
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        var endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartX;
        var dx = endX - touchStartX;
        lightboxImage.style.transition = 'transform 0.3s ease';

        if (dx < -50) {
            nextImage();
        } else if (dx > 50) {
            prevImage();
        } else {
            resetDrag();
        }
    });
})();
