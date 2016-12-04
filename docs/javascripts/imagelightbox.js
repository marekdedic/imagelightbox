//
// By Osvaldas Valutis, www.osvaldas.info
// Available for use under the MIT License
//
;(function ($, window, document, undefined) {
    'use strict';
    // COMPONENTS //
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
        $navItem = $('<a/>', {
            href:'#',class:"imagelightbox-navitem"
        }),
        $navObject = $('<div/>', {
            id: 'imagelightbox-nav'
        }),
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
                allowedTypes:   'png|jpg|jpeg|gif', // TODO make it work again
                animationSpeed: 250,
                activity:       false,
                arrows:         false,
                button:         false,
                caption:        false,
                enableKeyboard: true,
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
                if (options.onStart) {
                    options.onStart();
                }
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
                if (options.lockBody) {
                    lockBody(true);
                }
            },
            _onEnd = function () {
                targets = $([]);
                $wrapper.remove().find("*").remove();
                if (options.lockBody) {
                    lockBody(false);
                }
                if (options.onEnd) {
                    options.onEnd();
                }
            },
            _onLoadStart = function () {
                if (options.onLoadStart) {
                    options.onLoadStart();
                }
                if (options.activity) {
                    activityIndicatorOn();
                }
                if (options.caption) {
                    captionOff();
                }
            },
            _onLoadEnd = function () {
                if (options.activity) {
                    activityIndicatorOff();
                }
                if (options.arrows) {
                    $arrows.css('display', 'block');
                }
                if (options.navigation) {
                    navigationUpdate(options.selector);
                }
                if (options.caption) {
                    captionOn();
                }
                if (options.onLoadEnd) {
                    options.onLoadEnd();
                }
            },
            _previousTarget = function () {
                return this.previousTargetDefault();
            },
            _previousTargetDefault = function () {
                $wrapper.trigger("previous.ilb2");
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
            },
            _nextTarget = function () {
                return this.nextTargetDefault();
            },
            _nextTargetDefault = function () {
                $wrapper.trigger("next.ilb2");
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
            },
            activityIndicatorOn = function () {
                $wrapper.append($activityObject);
            },
            activityIndicatorOff = function () {
                $('#imagelightbox-loading').remove();
            },
            lockBody = function (toggle) {
                if (toggle) {
                    $("body").css("overflow","hidden");
                } else {
                    $("body").css("overflow","scroll");
                }
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
            captionOn = function () {
                var captionText = "";
                if ($(target).data("ilb2-caption")) {
                    captionText = $(target).data("ilb2-caption");
                } else if ($(target).find('img').length) {
                    captionText = $(target).find('img').attr('alt');
                }
                if (captionText && captionText.length > 0) {
                    $wrapper.append($captionObject.text(captionText));
                }
            },
            captionOff = function () {
                $captionObject.html("&nbsp;");
            },
            navigationOn = function () {
                var images = targets;
                if (images.length) {
                    for (var i = 0; i < images.length; i++) {
                        $navObject.append($navItem.clone());
                    }
                    $wrapper.append($navObject);
                    $navObject.on('click.ilb7 touchend.ilb7', function () {
                        return false;
                    });
                    var navItems = $navObject.find('a');
                    navItems.on('click.ilb7 touchend.ilb7', function () {
                        var $this = $(this);
                        if (images.eq($this.index()).attr('href') !== $('#imagelightbox').attr('src')) {
                            var tmpTarget = targets.eq($this.index());
                            if (tmpTarget.length) {
                                var currentIndex = targets.index(target);
                                target = tmpTarget;
                                _loadImage($this.index() < currentIndex ? 'left' : 'right');
                            }
                        }
                        navItems.removeClass('active');
                        navItems.eq($this.index()).addClass('active');
                        return false;
                    }).on('touchend.ilb7', function () {
                        return false;
                    });
                }
            },
            navigationUpdate = function () {
                var items = $navObject.find('a');
                items.removeClass('active');
                items.eq(targets.index(target)).addClass('active');
            },
            arrowsOn = function () {
                $wrapper.append($arrows);
                $arrows.on('click.ilb7 touchend.ilb7', function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('imagelightbox-arrow-left')) {
                        _loadPreviousImage();
                    } else {
                        _loadNextImage();
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
            inProgress = false,

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
                var URL = validImage.attr("href");
                var ext = parseURL(URL).pathname;
                var re = new RegExp(allowedTypes,"i");
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

            _loadImage = function (direction) {
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
                            var params = {'opacity': 1};

                            image.appendTo($wrapper);
                            _setImage();
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
                            _loadPreviousImage();
                        } else {
                            _loadNextImage();
                        }
                    })
                        .on('touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (isCssTransitionSupport) {
                                imagePosLeft = parseInt(image.css('left'));
                            }
                            swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                        })
                        .on('touchmove.ilb7 pointermove.ilb7 MSPointerMove.ilb7', function (e) {
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
                        .on('touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7', function (e) {
                            if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                                return true;
                            }
                            if (Math.abs(swipeDiff) > 50) {
                                if (swipeDiff < 0) {
                                    _loadPreviousImage();
                                } else {
                                    _loadNextImage();
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

            _loadPreviousImage = function () {
                if (_previousTargetDefault() !== false) {
                    _loadImage('left');
                }
            },

            _loadNextImage = function () {
                if (_nextTargetDefault() !== false) {
                    _loadImage('right');
                }
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
                _onStart();
                $('body').append($wrapper);
                $wrapper.trigger("start.ilb2");
                target = $target;
                _loadImage();
            },

            _quitImageLightbox = function () {
                $wrapper.trigger("quit.ilb2");
                if (!image.length) {
                    return false;
                }
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    _removeImage();
                    inProgress = false;
                    _onEnd();
                });
            },

            _addTargets = function( newTargets ) {
                newTargets.on('click.ilb7', {set: targetSet}, function (e) {
                    e.preventDefault();
                    targetSet = $(e.currentTarget).data("imagelightbox");
                    filterTargets();
                    _openImageLightbox($(this));
                });
                function filterTargets () {
                    newTargets
                        .filter(function () {
                            return $(this).data("imagelightbox") === targetSet;
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
            if (options.quitOnDocClick) {
                $(document).on(hasTouch ? 'touchend.ilb7' : 'click.ilb7', function (e) {
                    if (image.length && !$(e.target).is(image)) {
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                });
            }

            if (options.lockBody) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return true;
                    }
                    if([9,32,38,40].indexOf(e.which) > -1) {
                        e.preventDefault();
                        return false;
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
                        _loadPreviousImage();
                    } else if ([39].indexOf(e.which) > -1) {
                        _loadNextImage();
                    }
                });
            }
        });

        $(document).off('click', this.selector);

        _addTargets($(this));

        this.addToImageLightbox = function(elements)  {
            _addTargets(elements);
        };

        this.loadPreviousImage = function () {
            _loadPreviousImage();
        };

        this.loadNextImage = function () {
            _loadNextImage();
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
