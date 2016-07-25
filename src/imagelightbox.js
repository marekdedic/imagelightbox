/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
;(function ($, window, document, undefined) {
    'use strict';

    var cssTransitionSupport = function () {
            var s = document.body || document.documentElement;
            s = s.style;
            if (s.WebkitTransition === '') {
                return '-webkit-';
            }
            if (s.MozTransition === '') {
                return '-moz-';
            }
            if (s.OTransition === '') {
                return '-o-';
            }
            if (s.transition === '') {
                return '';
            }
            return false;
        },

        isCssTransitionSupport = cssTransitionSupport() !== false,

        cssTransitionTranslateX = function (element, positionX, speed) {
            var options = {}, prefix = cssTransitionSupport();
            options[prefix + 'transform'] = 'translateX(' + positionX + ')';
            options[prefix + 'transition'] = prefix + 'transform ' + speed + 's linear';
            element.css(options);
        },

        hasTouch = ( 'ontouchstart' in window ),
        hasPointers = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        wasTouched = function (event) {
            if (hasTouch) {
                return true;
            }

            if (!hasPointers || typeof event === 'undefined' || typeof event.pointerType === 'undefined') {
                return false;
            }

            if (typeof event.MSPOINTER_TYPE_MOUSE !== 'undefined') {
                if (event.MSPOINTER_TYPE_MOUSE !== event.pointerType) {
                    return true;
                }
            }
            else if (event.pointerType !== 'mouse') {
                return true;
            }

            return false;
        };

    $.fn.imageLightbox = function (opts) {
        var options = $.extend({
            selector:       'a[data-imagelightbox]',
            id:             'imagelightbox',
            allowedTypes:   'png|jpg|jpeg||gif', // TODO make it work again
            animationSpeed: 250,
            activity:       false,
            arrows:         false,
            button:         false,
            caption:        false,
            enableKeyboard: true,
            navigation:     false,
            overlay:        false,
            preloadNext:    true,
            quitOnEnd:      false,
            quitOnImgClick: false,
            quitOnDocClick: true,
            quitOnEscKey:   true,
            onStart: function () {
                if (options.arrows) {
                    arrowsOn(this);
                }
                if (options.navigation) {
                    navigationOn(this, options.selector);
                }
                if (options.overlay) {
                    overlayOn();
                }
                if (options.button) {
                    closeButtonOn();
                }
            },
            onEnd: function () {
                if (options.activity) {
                    activityIndicatorOff();
                }
                if (options.arrows) {
                    arrowsOff();
                }
                if (options.navigation) {
                    navigationOff();
                }
                if (options.overlay) {
                    overlayOff();
                }
                if (options.caption) {
                    captionOff();
                }
                if (options.button) {
                    closeButtonOff();
                }
            },
            onLoadStart: function () {
                if (options.activity) {
                    activityIndicatorOn();
                }
                if (options.caption) {
                    captionOff();
                }
            },
            onLoadEnd: function () {
                if (options.activity) {
                    activityIndicatorOff();
                }
                if (options.arrows) {
                    $('.imagelightbox-arrow').css('display', 'block');
                }
                if (options.navigation) {
                    navigationUpdate(options.selector);
                }
                if (options.caption) {
                    captionOn();
                }
            },
            previousTarget: function () {
                return this.previousTargetDefault();
            },
            previousTargetDefault: function () {
                var targetIndex = targets.index(target) - 1;
                if (targetIndex < 0) {
                    if (options.quitOnEnd === true) {
                        quitLightbox();
                        return false;
                    }
                    else {
                        targetIndex = targets.length - 1;
                    }
                }
                target = targets.eq(targetIndex);
            },
            nextTarget: function () {
                return this.nextTargetDefault();
            },
            nextTargetDefault: function () {
                var targetIndex = targets.index(target) + 1;
                if (targetIndex >= targets.length) {
                    if (options.quitOnEnd === true) {
                        quitLightbox();
                        return false;
                    }
                    else {
                        targetIndex = 0;
                    }
                }
                target = targets.eq(targetIndex);
            }
        }, opts),
            activityIndicatorOn = function () {
                $('<div id="imagelightbox-loading"><div></div></div>').appendTo('body');
            },
            activityIndicatorOff = function () {
                $('#imagelightbox-loading').remove();
            },
            overlayOn = function () {
                $('<div id="imagelightbox-overlay"></div>').appendTo('body');
            },
            overlayOff = function () {
                $('#imagelightbox-overlay').remove();
            },
            closeButtonOn = function () {
                $('<a href="#" id="imagelightbox-close"></a>').appendTo('body').on('click', function () {
                    $(this).remove();
                    quitLightbox();
                    return false;
                });
            },
            closeButtonOff = function () {
                $('#imagelightbox-close').remove();
            },
            captionOn = function () {
                var description = $(target).find('img').attr('alt');
                if (description && description.length > 0) {
                    $('<div id="imagelightbox-caption">' + description + '</div>').appendTo('body');
                }
            },
            captionOff = function () {
                $('#imagelightbox-caption').remove();
            },
            navigationOn = function (instance, selector) {
                var images = $(selector);
                if (images.length) {
                    var nav = $('<div id="imagelightbox-nav"></div>');
                    for (var i = 0; i < images.length; i++) {
                        nav.append('<a href="#"></a>');
                    }
                    nav.appendTo('body');
                    nav.on('click touchend', function () {
                        return false;
                    });
                    var navItems = nav.find('a');
                    navItems.on('click touchend', function () {
                        var $this = $(this);
                        if (images.eq($this.index()).attr('href') !== $('#imagelightbox').attr('src')) {
                            var tmpTarget = targets.eq($this.index());
                            if (tmpTarget.length) {
                                var currentIndex = targets.index(target);
                                target = tmpTarget;
                                loadImage($this.index() < currentIndex ? 'left' : 'right');
                            }
                        }
                        navItems.removeClass('active');
                        navItems.eq($this.index()).addClass('active');
                        return false;
                    }).on('touchend', function () {
                        return false;
                    });
                }
            },
            navigationUpdate = function (selector) {
                var items = $('#imagelightbox-nav').find('a');
                items.removeClass('active');
                items.eq($(selector).filter('[href="' + $('#imagelightbox').attr('src') + '"]').index(selector)).addClass('active');
            },
            navigationOff = function () {
                $('#imagelightbox-nav').remove();
            },
            arrowsOn = function (instance) {
                var $arrows = $('<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"></button>' +
                    '<button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"></button>');
                $arrows.appendTo('body');
                $arrows.on('click touchend', function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('imagelightbox-arrow-left')) {
                        loadPreviousImage(instance);
                    } else {
                        loadNextImage(instance);
                    }
                    return false;
                });
            },
            arrowsOff = function () {
                $('.imagelightbox-arrow').remove();
            },

            targets = $([]),
            target = $(),
            image = $(),
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            inProgress = false,

            /* NOT used ATM
            isTargetValid = function (element) {
                var classic = $(element).prop('tagName').toLowerCase() === 'a' && ( new RegExp('.(' + options.allowedTypes + ')$', 'i') ).test($(element).attr('href'));
                var html5 = $(element).attr('data-lightbox') !== undefined;
                return classic || html5;
            },
            */

            setImage = function () {
                if (!image.length) {
                    return true;
                }

                var screenWidth = $(window).width() * 0.8,
                    wHeight = (window.innerHeight) ? window.innerHeight : $(window).height(),                    
                    screenHeight = wHeight * 0.9,
                    tmpImage = new Image();

                tmpImage.src = image.attr('src');
                tmpImage.onload = function () {
                    imageWidth = tmpImage.width;
                    imageHeight = tmpImage.height;

                    if (imageWidth > screenWidth || imageHeight > screenHeight) {
                        var ratio = imageWidth / imageHeight > screenWidth / screenHeight ? imageWidth / screenWidth : imageHeight / screenHeight;
                        imageWidth /= ratio;
                        imageHeight /= ratio;
                    }

                    image.css({
                        'width': imageWidth + 'px',
                        'height': imageHeight + 'px',
                        'top': ( wHeight - imageHeight ) / 2 + 'px',
                        'left': ( $(window).width() - imageWidth ) / 2 + 'px'
                    });
                };
            },

            loadImage = function (direction) {
                if (inProgress) {
                    return false;
                }

                direction = typeof direction === 'undefined' ? false : direction === 'left' ? 1 : -1;

                if (image.length) {
                    var params = {'opacity': 0};
                    if (isCssTransitionSupport) {
                        cssTransitionTranslateX(image, ( 100 * direction ) - swipeDiff + 'px', options.animationSpeed / 1000);
                    }
                    else {
                        params.left = parseInt(image.css('left')) + 100 * direction + 'px';
                    }
                    image.animate(params, options.animationSpeed, function () {
                        removeImage();
                    });
                    swipeDiff = 0;
                }

                inProgress = true;
                if (options.onLoadStart !== false) {
                    options.onLoadStart();
                }

                setTimeout(function () {
                    var imgPath = target.attr('href');
                    // if ( imgPath === undefined ) {
                    //     imgPath = target.attr( 'data-lightbox' );
                    // }
                    image = $('<img id="' + options.id + '" />')
                        .attr('src', imgPath)
                        .on('load', function () {
                            var params = {'opacity': 1};

                            image.appendTo('body');
                            setImage();
                            image.css('opacity', 0);
                            if (isCssTransitionSupport) {
                                cssTransitionTranslateX(image, -100 * direction + 'px', 0);
                                setTimeout(function () {
                                    cssTransitionTranslateX(image, 0 + 'px', options.animationSpeed / 1000);
                                }, 50);
                            } else {
                                var imagePosLeft = parseInt(image.css('left'));
                                params.left = imagePosLeft + 'px';
                                image.css('left', imagePosLeft - 100 * direction + 'px');
                            }

                            image.animate(params, options.animationSpeed, function () {
                                inProgress = false;
                                if (options.onLoadEnd !== false) {
                                    options.onLoadEnd();
                                }
                            });
                            if (options.preloadNext) {
                                var nextTarget = targets.eq(targets.index(target) + 1);
                                if (!nextTarget.length) {
                                    nextTarget = targets.eq(0);
                                }
                                $('<img />').attr('src', nextTarget.attr('href'));
                            }
                        })
                        .on('error', function () {
                            if (options.onLoadEnd !== false) {
                                options.onLoadEnd();
                            }
                        });

                    var swipeStart = 0,
                        swipeEnd = 0,
                        imagePosLeft = 0;

                    image.on(hasPointers ? 'pointerup MSPointerUp' : 'click', function (e) {
                            e.preventDefault();
                            if (options.quitOnImgClick) {
                                quitLightbox();
                                return false;
                            }
                            if (wasTouched(e.originalEvent)) {
                                return true;
                            }
                            var posX = ( e.pageX || e.originalEvent.pageX ) - e.target.offsetLeft;
                            if (imageWidth / 2 > posX) {
                                loadPreviousImage();
                            } else {
                                loadNextImage();
                            }
                        })
                        .on('touchstart pointerdown MSPointerDown', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (isCssTransitionSupport) {
                                imagePosLeft = parseInt(image.css('left'));
                            }
                            swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                        })
                        .on('touchmove pointermove MSPointerMove', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            e.preventDefault();
                            swipeEnd = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                            swipeDiff = swipeStart - swipeEnd;
                            if (isCssTransitionSupport) {
                                cssTransitionTranslateX(image, -swipeDiff + 'px', 0);
                            } else {
                                image.css('left', imagePosLeft - swipeDiff + 'px');
                            }
                        })
                        .on('touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (Math.abs(swipeDiff) > 50) {
                                if (swipeDiff < 0) {
                                    loadPreviousImage();
                                } else {
                                    loadNextImage();
                                }
                            } else {
                                if (isCssTransitionSupport) {
                                    cssTransitionTranslateX(image, 0 + 'px', options.animationSpeed / 1000);
                                } else {
                                    image.animate({'left': imagePosLeft + 'px'}, options.animationSpeed / 2);
                                }
                            }
                        });

                }, options.animationSpeed + 100);
            },

            loadPreviousImage = function () {
                if (options.previousTarget() !== false) {
                    loadImage('left');
                }
            },

            loadNextImage = function () {
                if (options.nextTarget() !== false) {
                    loadImage('right');
                }
            },

            removeImage = function () {
                if (!image.length) {
                    return false;
                }
                image.remove();
                image = $();
            },

            quitLightbox = function () {
                if (!image.length) {
                    return false;
                }
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    removeImage();
                    inProgress = false;
                    if (options.onEnd !== false) {
                        options.onEnd();
                    }
                });
            },
            addTargets = function( newTargets ) {
                newTargets.each(function () {
                    targets = targets.add($(this));
                });

                newTargets.on('click.imageLightbox', function (e) {
                        e.preventDefault();
                        if (inProgress) return false;
                        inProgress = false;
                        if (options.onStart !== false) options.onStart();
                        target = $(this);
                        loadImage();
                    }
                );
            };

        $(window).on('resize', setImage);

        if (options.quitOnDocClick) {
            $(document).on(hasTouch ? 'touchend' : 'click', function (e) {
                if (image.length && !$(e.target).is(image)) {
                    e.preventDefault();
                    quitLightbox();
                }
            });
        }

        if (options.enableKeyboard) {
            $(document).on('keyup', function (e) {
                if (!image.length) {
                    return true;
                }
                e.preventDefault();
                if (e.keyCode === 27 && options.quitOnEscKey === true) {
                    quitLightbox();
                }
                if (e.keyCode === 37) {
                    loadPreviousImage();
                } else if (e.keyCode === 39) {
                    loadNextImage();
                }
            });
        }

        $(document).off('click', this.selector);
        addTargets($(this));

        this.loadPreviousImage = function () {
            loadPreviousImage();
        };

        this.loadNextImage = function () {
            loadNextImage();
        };

        this.quitImageLightbox = function () {
            quitLightbox();
            return this;
        };

        this.addToImageLightbox = function(elements)  {
            addTargets(elements);
        };

        return this;
    };
})(jQuery, window, document);
