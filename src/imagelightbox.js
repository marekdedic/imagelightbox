/*
  By Osvaldas Valutis, www.osvaldas.info
  Available for use under the MIT License
*/
;(function ($, window, document, undefined) {
    'use strict';

    // OBJECTS //
    var $activityObject = $('<div/>')
        .attr('id','imagelightbox-loading')
        .append($('<div/>')),
        $arrowLeftObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-left'}),
        $arrowRightObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-right'}),
        $arrows = $arrowLeftObject.add($arrowRightObject),
        $captionObject = $('<div/>', {
            id: 'imagelightbox-caption'
        }),
        $buttonObject =  $('<a/>', {
            id: 'imagelightbox-close'
        }),
        $overlayObject = $('<div/>', {
            id:'imagelightbox-overlay'
        }),
        $navObject = $('<div/>', {
            id: 'imagelightbox-nav'
        }),
        $navItem = $('<a/>',{href:'#',class:"imagelightbox-navitem"}),
        //
        $wrapper = $('<div/>', {
            id: 'imagelightbox-wrapper'
        });


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
            onStart:        function () {},
            onEnd:          function () {},
            onLoadStart:    function () {},
            onLoadEnd:      function () {},
            previousTarget: function () {},
            nextTarget:     function () {}
        }, opts),
            _onStart =  function () {
                if (options.arrows)
                    arrowsOn();

                if (options.navigation)
                    navigationOn();

                if (options.overlay)
                    overlayOn();

                if (options.button)
                    closeButtonOn();
            },
            _onEnd = function () {
                $wrapper.remove().find("*").remove();
            },
            _onLoadStart = function () {
                if (options.activity)
                    activityIndicatorOn();

                if (options.caption)
                    captionOff();
            },
            _onLoadEnd = function () {
                if (options.activity)
                    activityIndicatorOff();

                if (options.arrows)
                    $arrows.css('display', 'block');

                if (options.navigation)
                    navigationUpdate();

                if (options.caption)
                    captionOn();
            },
            _nextTarget = function () {
                return nextTargetDefault();
            },
            nextTargetDefault = function () {
                var targetIndex = targets.index(target) + 1;
                if (targetIndex >= targets.size()) {
                    if (options.quitOnEnd === true) {
                        quitImageLightbox();
                        return false;
                    }
                    else {
                        targetIndex = 0;
                    }
                }
                target = targets.eq(targetIndex);
            },
            _previousTarget = function () {
                return previousTargetDefault();
            },
            previousTargetDefault = function () {
                var targetIndex = targets.index(target) - 1;
                if (targetIndex < 0) {
                    if (options.quitOnEnd === true) {
                        quitImageLightbox();
                        return false;
                    }
                    else {
                        targetIndex = targets.length - 1;
                    }
                }
                target = targets.eq(targetIndex);
            },
            activityIndicatorOn = function () {
                $wrapper.append($activityObject);
            },
            activityIndicatorOff = function () {
                $activityObject.remove();
            },
            overlayOn = function () {
                $wrapper.append($overlayObject);
            },
            closeButtonOn = function () {
                $buttonObject.appendTo($wrapper).on('click.imagelightbox', function () {
                    quitImageLightbox();
                    return false;
                });
            },
            captionOn = function () {
                var description;//
                if ($(target).find('img').length) {
                    description = $(target).find('img').attr('alt');
                } else {
                    description = $(target).data("imagelightbox-caption");
                }
                if (description && description.length > 0) {
                    $wrapper.append($captionObject.text(description));
                }
            },
            captionOff = function () {
                $captionObject.remove();
            },
            navigationOn = function () {
                var images = targets;
                if (images.length) {
                    for (var i = 0; i < images.length; i++) {
                        $navObject.append($navItem.clone());
                    }
                    $wrapper.append($navObject);
                    navItems = $navObject.find('a');
                    //
                    navItems.on('click.imagelightbox touchend.imagelightbox', function () {
                        var $this = $(this);
                        if (images.eq($this.index()).attr('href') !== $('#imagelightbox').attr('src')) {
                            var tmpTarget = targets.eq($this.index());
                            if (tmpTarget.length) {
                                var currentIndex = targets.index(target);
                                target = tmpTarget;
                                loadImage($this.index() < currentIndex ? 1 : -1);
                            }
                        }
                        navItems.removeClass('active');
                        navItems.eq($this.index()).addClass('active');
                        return false;
                    }).on('touchend.imagelightbox', function () {
                        return false;
                    });
                }
            },
            navigationUpdate = function () {
                var items = navItems;
                items.removeClass('active');
                items.eq(targets.index(target)).addClass('active');
            },
            arrowsOn = function () {
                $wrapper.append($arrows);
                $arrows.on('click.imagelightbox touchend.imagelightbox', function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('imagelightbox-arrow-left')) {
                        loadPreviousImage();
                    } else if ($(this).hasClass('imagelightbox-arrow-right')) {
                        loadNextImage();
                    }
                    return false;
                });
            },
            targetSet = "",
            targets = $([]),
            target = $(),
            image = $(),
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            navItems = 0,
            inProgress = false,

            /* TODO make it work again
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
                options.onLoadStart();
                _onLoadStart();


                setTimeout(function () {
                    var imgPath = target.attr('href');
                    // if ( imgPath === undefined ) {
                    //     imgPath = target.attr( 'data-lightbox' );
                    // }
                    image = $('<img id="' + options.id + '" />')
                        .attr('src', imgPath)
                        .on('load.imagelightbox', function () {
                            var params = {'opacity': 1};

                            image.appendTo($wrapper);
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

                                options.onLoadEnd();
                                _onLoadEnd();

                            });
                            if (options.preloadNext) {
                                var nextTarget = targets.eq(targets.index(target) + 1);
                                if (!nextTarget.length) {
                                    nextTarget = targets.eq(0);
                                }
                                $('<img />').attr('src', nextTarget.attr('href'));
                            }
                        })
                        .on('error.imagelightbox', function () {
                            options.onLoadEnd();
                            _onLoadEnd();
                        });

                    var swipeStart = 0,
                    swipeEnd = 0,
                    imagePosLeft = 0;

                    image.on(hasPointers ? 'pointerup.imagelightbox MSPointerUp.imagelightbox' : 'click.imagelightbox', function (e) {
                        e.preventDefault();
                        if (options.quitOnImgClick) {
                            quitImageLightbox();
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
                        .on('touchstart.imagelightbox pointerdown.imagelightbox MSPointerDown.imagelightbox', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (isCssTransitionSupport) {
                                imagePosLeft = parseInt(image.css('left'));
                            }
                            swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                        })
                        .on('touchmove.imagelightbox pointermove.imagelightbox MSPointerMove.imagelightbox', function (e) {
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
                        .on('touchend.imagelightbox touchcancel.imagelightbox pointerup.imagelightbox pointercancel.imagelightbox MSPointerUp.imagelightbox MSPointerCancel.imagelightbox', function (e) {
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
                options.previousTarget();
                if (targets.length > 1) {
                    _previousTarget();
                    loadImage(1);
                }
            },
            loadNextImage = function () {
                options.nextTarget();
                if (targets.length > 1) {
                    _nextTarget();
                    loadImage(-1);
                }
            },
            removeImage = function () {
                if (!image.length) {
                    return false;
                }
                image.remove();
                image = $();
            },

            openLightbox = function ($target) {
                if (inProgress) {
                    return false;
                }
                inProgress = false;

                options.onStart();
                $('body').append($wrapper);
                _onStart();
                //
                //
                target = $target;
                loadImage(0);
            },

            quitImageLightbox = function () {
                if (!image.length) {
                    return false;
                }
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    inProgress = false;
                    options.onEnd();
                    _onEnd();
                });
            },
            addTargets = function( newTargets ) {
                newTargets.on('click.imagelightbox', {set: targetSet}, function (e) {
                    e.preventDefault();
                    targetSet = $(e.currentTarget).data("imagelightbox");
                    filterTargets();
                    openLightbox($(this));
                });
                function filterTargets () {
                    newTargets
                        .filter(function () {
                            return $(this).data("imagelightbox") === targetSet;
                        })
                        .each(function () {
                            targets = targets.add($(this));
                        });
                }
            };

        this.startImageLightbox = function () {
            if (this.length > 0) {
                openLightbox($(this[0]));
            }
        };


        var applyListeners;
        $(document).ready(function() {
            applyListeners = function () {
                //
                $(window).on('resize.imagelightbox', setImage)
                    .on('keydown.imagelightbox',function(e) {
                        if([33,34,35,36,37,38,39,40].indexOf(e.which) > -1) {
                            e.preventDefault();
                        }
                        return false;
                    });
                if (options.quitOnDocClick) {
                    $(document).on(hasTouch ? 'touchend.imagelightbox' : 'click.imagelightbox', function (e) {
                        if (image.length && !$(e.target).is(image)) {
                            e.preventDefault();
                            quitImageLightbox();
                        }
                    });
                }

                if (options.enableKeyboard) {
                    $(document).on('keyup.imagelightbox keydown.imagelightbox', function (e) {
                        if (!image.length) {
                            return true;
                        }
                        e.preventDefault();
                        if (e.keyCode === 27 && options.quitOnEscKey) {
                            quitImageLightbox();
                        }
                        if ([17,37].indexOf(e.which) > -1) {
                            loadPreviousImage();
                        } else if ([32,39].indexOf(e.which) > -1) {
                            loadNextImage();
                        }
                    });
                }
            };
        });

        $(document).off('click.imagelightbox');


        $(this).on('click.imagelightbox',function(e) {
            e.preventDefault();
            applyListeners();
        });


        addTargets($(this));

        // PUBLIC METHODS
        this.loadPreviousImage = function () {
            loadPreviousImage();
        };

        this.loadNextImage = function () {
            loadNextImage();
        };

        this.quitImageLightbox = function () {
            quitImageLightbox();
            return this;
        };

        this.addToImageLightbox = function(elements)  {
            addTargets(elements);
        };
        return this;
    };
})(jQuery, window, document);
