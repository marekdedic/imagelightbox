//
// By Osvaldas Valutis, www.osvaldas.info
// Available for use under the MIT License
//
(function ($, window, document) {
    'use strict';
    // COMPONENTS //
    var $activityObject = $('<div/>')
            .attr('class','imagelightbox-loading')
            .append($('<div/>')),
        $arrowLeftObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-left'}),
        $arrowRightObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-right'}),
        $arrows = $arrowLeftObject.add($arrowRightObject),
        $captionObject = $('<div/>', {
            class: 'imagelightbox-caption',
            html: '&nbsp;'
        }),
        $buttonObject =  $('<a/>', {
            class: 'imagelightbox-close'
        }),
        $overlayObject = $('<div/>', {
            class:'imagelightbox-overlay'
        }),
        $navItem = $('<a/>', {
            href:'#',
            class:'imagelightbox-navitem'
        }),
        $navObject = $('<div/>', {
            class: 'imagelightbox-nav'
        }),
        $wrapper = $('<div/>', {
            class: 'imagelightbox-wrapper'
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

        hasCssTransitionSupport = cssTransitionSupport() !== false,

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
        },

        fullscreenSupport = function () {
            return !!(document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled);

        },
        hasFullscreenSupport = fullscreenSupport() !== false;

    $.fn.imageLightbox = function (opts) {
        var options = $.extend({
                selector:       'a[data-imagelightbox]',
                id:             'imagelightbox',
                allowedTypes:   'png|jpg|jpeg|gif', // TODO make it work again
                animationSpeed: 250,
                activity:       false,
                arrows:         false,
                button:         false,
                caption:        false,
                enableKeyboard: true,
                fullscreen:     false,
                gutter:         10,     // percentage of client height
                offsetY:        0,    // percentage of gutter
                lockBody:       false,
                navigation:     false,
                overlay:        false,
                preloadNext:    true,
                quitOnEnd:      false,
                quitOnImgClick: false,
                quitOnDocClick: true,
                quitOnEscKey:   true
            }, opts),
            _onStart = function () {
                if (options.arrows) {
                    arrowsOn(this);
                }
                if (options.navigation) {
                    navigationOn();
                }
                if (options.overlay) {
                    overlayOn();
                }
                if (options.button) {
                    closeButtonOn();
                }
                if (options.caption) {
                    $wrapper.append($captionObject);
                }
            },
            _onLoadStart = function () {
                if (options.activity) {
                    activityIndicatorOn();
                }
                if (options.caption) {
                    captionReset();
                }
            },
            _onLoadEnd = function () {
                if (options.activity) {
                    activityIndicatorOff();
                }
                if (options.arrows) {
                    $arrows.css('display', 'block');
                }
            },
            _previousTarget = function () {
                var targetIndex = targets.index(target) - 1;
                if (targetIndex < 0) {
                    if (options.quitOnEnd === true) {
                        _quitImageLightbox();
                        return false;
                    }
                    else {
                        targetIndex = targets.length - 1;
                    }
                }
                target = targets.eq(targetIndex);
                $wrapper.trigger('previous.ilb2');
                _loadImage(-1);
            },
            _nextTarget = function () {
                var targetIndex = targets.index(target) + 1;
                if (targetIndex >= targets.length) {
                    if (options.quitOnEnd === true) {
                        _quitImageLightbox();
                        return false;
                    }
                    else {
                        targetIndex = 0;
                    }
                }
                target = targets.eq(targetIndex);
                $wrapper.trigger('next.ilb2');
                _loadImage(+1);
            },
            activityIndicatorOn = function () {
                $wrapper.append($activityObject);
            },
            activityIndicatorOff = function () {
                $('.imagelightbox-loading').remove();
            },
            overlayOn = function () {
                $wrapper.append($overlayObject);
            },
            closeButtonOn = function () {
                $buttonObject.appendTo($wrapper).on('click.ilb7', function () {
                    _quitImageLightbox();
                    return false;
                });
            },
            captionReset = function () {
                $captionObject.html('&nbsp;');
                if ($(target).data('ilb2-caption')) {
                    $captionObject.html($(target).data('ilb2-caption'));
                } else if ($(target).find('img').length > 0) {
                    $captionObject.html($(target).find('img').attr('alt'));
                }
            },
            navigationOn = function () {
                if (targets.length) {
                    for (var i = 0; i < targets.length; i++) {
                        $navObject.append($navItem.clone());
                    }
                    var $navItems = $navObject.children('a');
                    $navItems.eq(targets.index(target)).addClass('active');
                    //
                    $wrapper.on('previous.ilb2 next.ilb2', function () {
                        $navItems.removeClass('active').eq(targets.index(target)).addClass('active');
                    });
                    $wrapper.append($navObject);
                    //
                    $navObject
                        .on('click.ilb7 touchend.ilb7', function () {
                            return false;
                        })
                        .on('click.ilb7 touchend.ilb7', 'a', function () {
                            var $this = $(this);
                            if (targets.eq($this.index()).attr('href') !== $('.imagelightbox').attr('src')) {
                                var tmpTarget = targets.eq($this.index());
                                if (tmpTarget.length) {
                                    currentIndex = targets.index(target);
                                    target = tmpTarget;
                                    _loadImage($this.index() < currentIndex ? -1 : 1);
                                }
                            }
                            $this.addClass('active').siblings().removeClass('active');
                        });
                }
            },
            arrowsOn = function () {
                $wrapper.append($arrows);
                $arrows.on('click.ilb7 touchend.ilb7', function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    if ($(this).hasClass('imagelightbox-arrow-left')) {
                        _previousTarget();
                    } else {
                        _nextTarget();
                    }
                    return false;
                });
            },
            targetSet = '',
            targets = $([]),
            target = $(),
            image = $(),
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            inProgress = false,
            currentIndex = 0,

            isTargetValid = function (validImage) {
                var allowedTypes = options.allowedTypes;

                //test that RegExp is restricted to disjunction format
                var isGoodRE = /^(?!\|)[\w\|]+(?!\|)$/.test(allowedTypes);
                //
                if (!isGoodRE) {
                    //allowedTypes = 'png|jpg|jpeg|gif';
                    return false;
                }
                //
                var URL = validImage.attr('href');
                var ext = parseURL(URL).pathname;
                var re = new RegExp(allowedTypes,'i');
                //
                var isAllowed = re.test(ext);
                // function by Cory LaViska
                function parseURL(url) {
                    var parser = document.createElement('a'),
                        searchObject = {},
                        queries, split, i;
                    // Let the browser do the work
                    parser.href = url;
                    // Convert query string to object
                    queries = parser.search.replace(/^\?/, '').split('&');
                    for( i = 0; i < queries.length; i++ ) {
                        split = queries[i].split('=');
                        searchObject[split[0]] = split[1];
                    }
                    return {
                        protocol: parser.protocol,
                        host: parser.host,
                        hostname: parser.hostname,
                        port: parser.port,
                        pathname: parser.pathname,
                        search: parser.search,
                        searchObject: searchObject,
                        hash: parser.hash
                    };
                }
                return isAllowed;
            },
            // TODO make it work again
            // isTargetValid = function (element) {
            //   var classic = $(element).prop('tagName').toLowerCase() === 'a' && ( new RegExp('.(' + options.allowedTypes + ')$', 'i') ).test($(element).attr('href'));
            //   var html5 = $(element).attr('data-lightbox') !== undefined;
            //   return classic || html5;
            // },

            _setImage = function () {
                if (!image.length) {
                    return true;
                }
                var captionHeight = options.caption ? $captionObject.outerHeight() : 0;

                var screenWidth = $(window).width(),
                    screenHeight = $(window).height() - captionHeight,
                    gutterFactor = Math.abs(1 - options.gutter/100),
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
                    var cssHeight = imageHeight*gutterFactor,
                        cssWidth = imageWidth*gutterFactor,
                        cssTop = (1 + options.offsetY/100)*(imageHeight - cssHeight)/2,
                        cssLeft = ($(window).width() - cssWidth ) / 2;

                    image.css({
                        'width': cssWidth + 'px',
                        'height': cssHeight + 'px',
                        'top': cssTop + 'px',
                        'left':  cssLeft + 'px'
                    });
                };
            },

            _loadImage = function (direction) {
                if (inProgress) {
                    return false;
                }

                if (image.length) {
                    var params = {'opacity': 0};
                    if (hasCssTransitionSupport) {
                        cssTransitionTranslateX(image, ( 100 * direction ) - swipeDiff + 'px', options.animationSpeed / 1000);
                    }
                    else {
                        params.left = parseInt(image.css('left')) + 100 * direction + 'px';
                    }
                    image.animate(params, options.animationSpeed, function () {
                        _removeImage();
                    });
                    swipeDiff = 0;
                }

                inProgress = true;
                _onLoadStart();

                setTimeout(function () {
                    var imgPath = target.attr('href');
                    // if ( imgPath === undefined ) {
                    //     imgPath = target.attr( 'data-lightbox' );
                    // }
                    image = $('<img id="' + options.id + '" />')
                        .attr('src', imgPath)
                        .on('load.ilb7', function () {
                            $wrapper.trigger('loaded.ilb2');
                            var params = {'opacity': 1};

                            image.appendTo($wrapper);
                            _setImage();
                            image.css('opacity', 0);
                            if (hasCssTransitionSupport) {
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
                        .on('error.ilb7', function () {
                            _onLoadEnd();
                        });

                    var swipeStart = 0,
                        swipeEnd = 0,
                        imagePosLeft = 0;

                    image.on(hasPointers ? 'pointerup.ilb7 MSPointerUp.ilb7' : 'click.ilb7', function (e) {
                        e.preventDefault();
                        if (options.quitOnImgClick) {
                            _quitImageLightbox();
                            return false;
                        }
                        if (wasTouched(e.originalEvent)) {
                            return true;
                        }
                        var posX = ( e.pageX || e.originalEvent.pageX ) - e.target.offsetLeft;
                        if (imageWidth / 2 > posX) {
                            _previousTarget();
                        } else {
                            _nextTarget();
                        }
                    })
                        .on('touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (hasCssTransitionSupport) {
                                imagePosLeft = parseInt(image.css('left'));
                            }
                            swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                        })
                        .on('touchmove.ilb7 pointermove.ilb7 MSPointerMove.ilb7', function (e) {
                            if ((!hasPointers && e.type === 'pointermove') || !wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            e.preventDefault();
                            swipeEnd = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                            swipeDiff = swipeStart - swipeEnd;
                            if (hasCssTransitionSupport) {
                                cssTransitionTranslateX(image, -swipeDiff + 'px', 0);
                            } else {
                                image.css('left', imagePosLeft - swipeDiff + 'px');
                            }
                        })
                        .on('touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (Math.abs(swipeDiff) > 50) {
                                if (swipeDiff < 0) {
                                    _previousTarget();
                                } else {
                                    _nextTarget();
                                }
                            } else {
                                if (hasCssTransitionSupport) {
                                    cssTransitionTranslateX(image, 0 + 'px', options.animationSpeed / 1000);
                                } else {
                                    image.animate({'left': imagePosLeft + 'px'}, options.animationSpeed / 2);
                                }
                            }
                        });

                }, options.animationSpeed + 100);
            },
            _removeImage = function () {
                if (!image.length) {
                    return false;
                }
                image.remove();
                image = $();
            },

            _openImageLightbox = function ($target) {
                if (inProgress) {
                    return false;
                }
                inProgress = false;
                target = $target;
                _onStart();
                $('body')
                    .append($wrapper)
                    .addClass('imagelightbox-disable-select');

                if (options.lockBody) {
                    $('body').addClass('imagelightbox-scroll-lock');
                }
                $wrapper.trigger('start.ilb2');
                _loadImage(0);
            },

            _quitImageLightbox = function () {
                $wrapper.trigger('quit.ilb2');
                $('body').removeClass('imagelightbox-disable-select');
                if (options.lockBody) {
                    $('body').removeClass('imagelightbox-scroll-lock');
                }
                if (!image.length) {
                    return false;
                }
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    _removeImage();
                    inProgress = false;
                    targets = $([]);
                    $wrapper.remove().find('*').remove();
                });
            },

            _addTargets = function( newTargets ) {
                newTargets.on('click.ilb7', {set: targetSet}, function (e) {
                    e.preventDefault();
                    targetSet = $(e.currentTarget).data('imagelightbox');
                    filterTargets();
                    if (targets.length < 1) {
                        _quitImageLightbox();
                    } else {
                        _openImageLightbox($(this));
                    }
                });
                function filterTargets () {
                    newTargets
                        .filter(function () {
                            return $(this).data('imagelightbox') === targetSet;
                        })
                        .filter(function () {
                            return isTargetValid($(this));
                        })
                        .each(function () {
                            targets = targets.add($(this));
                        });
                }
            };

        $(window).on('resize.ilb7', _setImage);

        $(document).ready(function() {
            // prevent overloading
            $(document).on('keydown.ilb7', function (e) {
                if ([13].indexOf(e.which) > -1) {
                    e.preventDefault();
                }});


            if (options.quitOnDocClick) {
                $(document).on(hasTouch ? 'touchend.ilb7' : 'click.ilb7', function (e) {
                    if (image.length && !$(e.target).is(image)) {
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                });
            }

            if (options.lockBody || (options.fullscreen && hasFullscreenSupport)) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return true;
                    }
                    if([9,32,38,40].indexOf(e.which) > -1) {
                        e.preventDefault();
                    }
                    if ([13].indexOf(e.which) > -1) {
                        toggleFullScreen();
                    }
                });
            }

            if (options.enableKeyboard) {
                $(document).on('keyup.ilb7', function (e) {
                    if (!image.length) {
                        return true;
                    }
                    e.preventDefault();
                    if ([27].indexOf(e.which) > -1 && options.quitOnEscKey) {
                        _quitImageLightbox();
                    }
                    if ([37].indexOf(e.which) > -1) {
                        _previousTarget();
                    } else if ([39].indexOf(e.which) > -1) {
                        _nextTarget();
                    }
                });
            }
        });

        function launchIntoFullscreen(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            return false;
        }

        function exitFullscreen() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            return false;
        }


        function toggleFullScreen() {
            launchIntoFullscreen(document.getElementById(options.id).parentElement) ||
            exitFullscreen();
        }

        $(document).off('click', options.selector);

        _addTargets($(this));

        this.addToImageLightbox = function(elements)  {
            _addTargets(elements);
        };

        this.loadPreviousImage = function () {
            _previousTarget();
        };

        this.loadNextImage = function () {
            _nextTarget();
        };

        this.quitImageLightbox = function () {
            _quitImageLightbox();
            return this;
        };

        this.startImageLightbox = function () {
            $(this).trigger('click.ilb7');
        };

        return this;
    };
})(jQuery, window, document);
