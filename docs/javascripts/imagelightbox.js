(function (factory) {
    // http://blog.npmjs.org/post/112712169830/making-your-jquery-plugin-work-better-with-npm
    // If there is a variable named module and it has an exports property,
    // then we're working in a Node-like environment. Use require to load
    // the jQuery object that the module system is using and pass it in.
    if(typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), window, document);
    }
    // Otherwise, we're working in a browser, so just pass in the global
    // jQuery object.
    else {
        factory(jQuery, window, document);
    }
}(function ($, window, document) {
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
        $buttonObject =  $('<button/>', {
            type: 'button',
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
        }),
        $body = $('body');

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
            options[prefix + 'transform'] = 'translateX(' + positionX + ') translateY(-50%)';
            options[prefix + 'transition'] = prefix + 'transform ' + speed + 's linear';
            element.css(options);
        },

        hasTouch = ('ontouchstart' in window),
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
        hasFullscreenSupport = fullscreenSupport() !== false,
        hasHistorySupport = !!(window.history && history.pushState);

    $.fn.imageLightbox = function (opts) {
        var targetSet = '',
            targets = $([]),
            target = $(),
            videos = $([]),
            targetIndex = -1,
            image = $(),
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            inProgress = false,
            currentIndex = 0,
            options = $.extend({
                selector:       'a[data-imagelightbox]',
                id:             'imagelightbox',
                allowedTypes:   'png|jpg|jpeg|gif',
                animationSpeed: 250,
                activity:       false,
                arrows:         false,
                button:         false,
                caption:        false,
                enableKeyboard: true,
                history:        false,
                fullscreen:     false,
                gutter:         10,     // percentage of client height
                offsetY:        0,      // percentage of gutter
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
            _addQueryField = function (query, key, value) {
                var newField = key + '=' + value;
                var newQuery = '?' + newField;

                if (query) {
                    var keyRegex = new RegExp('([?&])' + key + '=[^&]*');
                    if (query.match(keyRegex) !== null) {
                        newQuery = query.replace(keyRegex, '$1' + newField);
                    } else {
                        newQuery = query + '&' + newField;
                    }
                }
                return newQuery;
            },
            _pushToHistory = function () {
                if(!hasHistorySupport || !options.history) {
                    return;
                }
                var newIndex = targets[targetIndex].dataset.ilb2Id;
                if(!newIndex) {
                    newIndex = targetIndex;
                }
                var newState = {imageLightboxIndex: newIndex};
                var set = targets[targetIndex].dataset.imagelightbox;
                if(set) {
                    newState.imageLightboxSet = set;
                }
                var newQuery = _addQueryField(document.location.search, 'imageLightboxIndex', newIndex);
                if(set) {
                    newQuery = _addQueryField(newQuery, 'imageLightboxSet', set);
                }
                window.history.pushState(newState, '', document.location.pathname + newQuery);
            },
            _removeQueryField = function(query, key) {
                var newQuery = query;
                if (newQuery) {
                    var keyRegex1 = new RegExp('[?]' + key + '=[^&]*');
                    var keyRegex2 = new RegExp('&' + key + '=[^&]*');
                    newQuery = newQuery.replace(keyRegex1, '?');
                    newQuery = newQuery.replace(keyRegex2, '');
                }
                return newQuery;
            },
            _pushQuitToHistory = function () {
                if(!hasHistorySupport || !options.history) {
                    return;
                }
                var newQuery = _removeQueryField(document.location.search, 'imageLightboxIndex');
                newQuery = _removeQueryField(newQuery, 'imageLightboxSet');
                window.history.pushState({}, '', document.location.pathname + newQuery);
            },
            _getQueryField = function(key) {
                var keyValuePair = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)').exec(document.location.search);
                if(!keyValuePair || !keyValuePair[2]) {
                    return undefined;
                }
                return decodeURIComponent(keyValuePair[2].replace(/\+/g, ' '));
            },
            _openHistory = function () {
                if(!hasHistorySupport || !options.history) {
                    return;
                }
                var id = _getQueryField('imageLightboxIndex');
                if(!id) {
                    return;
                }
                var element = targets.filter('[data-ilb2-id="' + id + '"]');
                if(element.length > 0) {
                    targetIndex = targets.index(element);
                } else {
                    targetIndex = id;
                    element = $(targets[targetIndex]);
                }
                var set = _getQueryField('imageLightboxSet');
                if(!element[0] || (!!set && set !== element[0].dataset.imagelightbox)) {
                    return;
                }
                _openImageLightbox(element, true);
            },
            _popHistory = function (event) {
                var newState = event.originalEvent.state;
                if(!newState) {
                    _quitImageLightbox(true);
                    return;
                }
                var newId = newState.imageLightboxIndex;
                if(newId === undefined) {
                    _quitImageLightbox(true);
                    return;
                }
                var element = targets.filter('[data-ilb2-id="' + newId + '"]');
                if(element.length > 0) {
                    var newIndex = targets.index(element);
                } else {
                    newIndex = newId;
                    element = $(targets[newIndex]);
                }
                if(!element[0] || (newState.imageLightboxSet && newState.imageLightboxSet !== element[0].dataset.imagelightbox)) {
                    return;
                }
                if(targetIndex < 0) {
                    _openImageLightbox(element, true);
                    return;
                }
                var direction = +1;
                if(newIndex > targetIndex) {
                    direction = -1;
                }
                target = element;
                targetIndex = newIndex;
                _loadImage(direction);
            },
            _previousTarget = function () {
                targetIndex--;
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
                _pushToHistory();
                $wrapper.trigger('previous.ilb2', target);
                _loadImage(+1);
            },
            _nextTarget = function () {
                targetIndex++;
                if (targetIndex >= targets.length) {
                    if (options.quitOnEnd === true) {
                        _quitImageLightbox();
                        return false;
                    }
                    else {
                        targetIndex = 0;
                    }
                }
                _pushToHistory();
                target = targets.eq(targetIndex);
                $wrapper.trigger('next.ilb2', target);
                _loadImage(-1);
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

            isTargetValid = function (element) {
                // eslint-disable-next-line
                return $(element).prop('tagName').toLowerCase() === 'a' && ((new RegExp('\.(' + options.allowedTypes + ')$', 'i')).test($(element).attr('href')) || $(element).data('ilb2Video'));
            },

            _setImage = function () {
                if (!image.length) {
                    return true;
                }

                var captionHeight = options.caption ? $captionObject.outerHeight() : 0,
                    screenWidth = $(window).width(),
                    screenHeight = $(window).height() - captionHeight,
                    gutterFactor = Math.abs(1 - options.gutter/100);

                function setSizes () {
                    if (imageWidth > screenWidth || imageHeight > screenHeight) {
                        var ratio = imageWidth / imageHeight > screenWidth / screenHeight ? imageWidth / screenWidth : imageHeight / screenHeight;
                        imageWidth /= ratio;
                        imageHeight /= ratio;
                    }
                    var cssHeight = imageHeight*gutterFactor,
                        cssWidth = imageWidth*gutterFactor,
                        cssLeft = ($(window).width() - cssWidth ) / 2;

                    image.css({
                        'width': cssWidth + 'px',
                        'height': cssHeight + 'px',
                        'left':  cssLeft + 'px'
                    });
                }

                if(image.get(0).videoWidth !== undefined) {
                    imageWidth = image.get(0).videoWidth;
                    imageHeight = image.get(0).videoHeight;
                    setSizes();
                    return;
                }

                var tmpImage = new Image();
                tmpImage.src = image.attr('src');
                tmpImage.onload = function() {
                    imageWidth = tmpImage.width;
                    imageHeight = tmpImage.height;
                    setSizes();
                };
            },

            _loadImage = function (direction) {
                if (inProgress) {
                    return false;
                }

                if (image.length) {
                    var params = {'opacity': 0};
                    if (hasCssTransitionSupport) {
                        cssTransitionTranslateX(image, (100 * direction) - swipeDiff + 'px', options.animationSpeed / 1000);
                    }
                    else {
                        params.left = parseInt(image.css('left')) + (100 * direction) + 'px';
                    }
                    image.animate(params, options.animationSpeed, function () {
                        _removeImage();
                    });
                    swipeDiff = 0;
                }

                inProgress = true;
                _onLoadStart();

                setTimeout(function () {
                    var imgPath = target.attr('href'),
                        swipeStart = 0,
                        swipeEnd = 0,
                        imagePosLeft = 0;

                    // if (imgPath === undefined) {
                    //     imgPath = target.attr('data-lightbox');
                    // }

                    var videoOptions = target.data('ilb2Video');
                    var preloadedVideo, element;
                    if (videoOptions) {
                        videos.each(function() {
                            if(this.i === target.data('ilb2VideoId')) {
                                preloadedVideo = this.l;
                                element = this.e;
                                if(this.a) {
                                    if(preloadedVideo === false) {
                                        element.attr('autoplay', this.a);
                                    }
                                    if(preloadedVideo === true) {
                                        element.get(0).play();
                                    }
                                }
                            }
                        });
                    } else {
                        element = $('<img id=\'' + options.id + '\' />')
                            .attr('src', imgPath);
                    }
                    function onload () {
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
                        $wrapper.trigger('loaded.ilb2');
                    }
                    image = element
                        .on('load.ilb7', onload)
                        .on('error.ilb7', function () {
                            _onLoadEnd();
                        })
                        .on(hasPointers ? 'pointerup.ilb7 MSPointerUp.ilb7' : 'click.ilb7', function (e) {
                            e.preventDefault();
                            if (options.quitOnImgClick) {
                                _quitImageLightbox();
                                return false;
                            }
                            if (wasTouched(e.originalEvent)) {
                                return true;
                            }
                            var posX = (e.pageX || e.originalEvent.pageX) - e.target.offsetLeft;
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
                    if(preloadedVideo === true) {
                        onload();
                    }
                    if(preloadedVideo === false) {
                        image = image.on('loadedmetadata.ilb7', onload);
                    }

                }, options.animationSpeed + 100);
            },

            _removeImage = function () {
                if (!image.length) {
                    return false;
                }
                image.remove();
                image = $();
            },

            _openImageLightbox = function ($target, noHistory) {
                if (inProgress) {
                    return false;
                }
                inProgress = false;
                target = $target;
                targetIndex = targets.index(target);
                if(!noHistory) {
                    _pushToHistory();
                }
                _onStart();
                $body.append($wrapper)
                    .addClass('imagelightbox-open');
                $wrapper.trigger('start.ilb2', $target);
                _loadImage(0);
            },

            _quitImageLightbox = function (noHistory) {
                targetIndex = -1;
                if(!noHistory) {
                    _pushQuitToHistory();
                }
                $wrapper.trigger('quit.ilb2');
                $body.removeClass('imagelightbox-open');
                if (!image.length) {
                    return false;
                }
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    _removeImage();
                    inProgress = false;
                    $wrapper.remove().find('*').remove();
                });
            },

            _addTargets = function (newTargets) {
                newTargets.each(function() {
                    targets = newTargets.add($(this));
                });
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
            },

            _preloadVideos = function () {
                targets.each(function() {
                    var videoOptions = $(this).data('ilb2Video');
                    if (videoOptions) {
                        var id = $(this).data('ilb2Id');
                        if(!id) {
                            id = 'a' + (((1+Math.random())*0x10000)|0).toString(16); // Random id
                        }
                        $(this).data('ilb2VideoId', id);
                        var container = {e: $('<video id=\'' + options.id + '\' preload=\'metadata\'>'), i: id, l: false, a: undefined}; // e = element, i = id, l = is metadata loaded, a = autoplay
                        $.each(videoOptions, function(key, value) {
                            if(key === 'autoplay') {
                                container.a = value;
                            } else if(key !== 'sources') {
                                container.e = container.e.attr(key, value);
                            }
                        });
                        if(videoOptions.sources) {
                            $.each(videoOptions.sources, function (_, source) {
                                var sourceElement = $('<source>');
                                $.each(source, function(key, value) {
                                    sourceElement = sourceElement.attr(key, value);
                                });
                                container.e.append(sourceElement);
                            });
                        }
                        container.e.on('loadedmetadata.ilb7', function() {
                            container.l = true;
                        });
                        videos = videos.add(container);
                    }
                });
            };

        $(window).on('resize.ilb7', _setImage);
        if(hasHistorySupport && options.history) {
            $(window).on('popstate', _popHistory);
        }

        $(document).ready(function() {

            if (options.quitOnDocClick) {
                $(document).on(hasTouch ? 'touchend.ilb7' : 'click.ilb7', function (e) {
                    if (image.length && !$(e.target).is(image)) {
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                });
            }

            if (options.fullscreen && hasFullscreenSupport) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return true;
                    }
                    if([9,32,38,40].indexOf(e.which) > -1) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    if ([13].indexOf(e.which) > -1) {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFullScreen();
                    }
                });
            }

            if (options.enableKeyboard) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return true;
                    }
                    if ([27].indexOf(e.which) > -1 && options.quitOnEscKey) {
                        e.stopPropagation();
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                    if ([37].indexOf(e.which) > -1) {
                        e.stopPropagation();
                        e.preventDefault();
                        _previousTarget();
                    }
                    if ([39].indexOf(e.which) > -1) {
                        e.stopPropagation();
                        e.preventDefault();
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

        _openHistory();

        _preloadVideos();

        this.addToImageLightbox = function (elements)  {
            _addTargets(elements);
        };

        this.openHistory = function() {
            _openHistory();
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

        this.startImageLightbox = function (element) {
            if (element)
                element.trigger('click.ilb7');
            else
                $(this).trigger('click.ilb7');
        };

        return this;
    };
}));
