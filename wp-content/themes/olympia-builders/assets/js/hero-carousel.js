(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var heroSwiper = document.querySelector('.hero-swiper');
        if (!heroSwiper) return;

        // Slides in their original order. Only the first image ships with a real src;
        // the rest are filled in just before they are needed, so the page opens fast.
        var images = Array.prototype.slice.call(heroSwiper.querySelectorAll('.hero-slide-image'));
        var slideCount = images.length;

        function ensure(i) {
            var img = images[((i % slideCount) + slideCount) % slideCount];
            if (!img || !img.getAttribute('data-src')) return;
            var srcset = img.getAttribute('data-srcset');
            if (srcset) img.setAttribute('srcset', srcset);
            img.setAttribute('src', img.getAttribute('data-src'));
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
        }

        function loadAround(swiper) {
            var i = (swiper && swiper.realIndex) || 0;
            ensure(i);
            ensure(i + 1);
            ensure(i + 2);
            ensure(i - 1);
            ensure(i - 2);
        }

        var swiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: slideCount > 1,
            speed: 1000,
            loopPreventsSliding: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: slideCount > 8,
                dynamicMainBullets: 5,
            },
            on: {
                init: loadAround,
                slideChange: loadAround,
            },
        });

        // Left and right arrow keys step through the pictures while the banner is on screen.
        document.addEventListener('keydown', function(e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || slideCount < 2) return;
            var t = e.target;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            var box = heroSwiper.getBoundingClientRect();
            if (box.bottom <= 0 || box.top >= window.innerHeight) return;
            e.preventDefault();
            if (e.key === 'ArrowRight') swiper.slideNext(450); else swiper.slidePrev(450);
        });
    });
})();
