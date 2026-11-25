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
        }

        new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: slideCount > 1,
            speed: 1000,
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
    });
})();
