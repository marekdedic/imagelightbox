/*
 By Osvaldas Valutis, www.osvaldas.info
 Available for use under the MIT License
 */
;(function ($, window, document, undefined) {
    'use strict';
    ///////////////////////
    // VARIABLES
    ///////////////////////
    var App = "imageLightbox";
    //
    // OBJECTS //
    var $image = $('<img/>'),
        $activityObject = $('<div/>')
            .attr('id','imagelightbox-loading')
            .append($('<div/>')),
        $arrowLeftObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-left'}),
        $arrowRightObject = $('<button/>',{
            type: 'button',
            class: 'imagelightbox-arrow imagelightbox-arrow-right'}),
        $captionObject =  $('<div/>', {
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
        //
        $wrapper = $('<div/>', {
            id: 'imagelightbox-wrapper'
        });
    //
    var FLAG_onStart = 1<<0,
        FLAG_onLoadStart = 1<<2,
        FLAG_onLoadEnd = 1<<3,
        FLAG_onEnd = 1<<4,
        //
        FLAG_activity = 1<<5,
        FLAG_arrows = 1<<6,
        FLAG_button = 1<<7,
        FLAG_caption = 1<<8,
        FLAG_overlay = 1<<9,
        FLAG_navigation = 1<<10;
    //
    var flow = FLAG_onStart
            | FLAG_onLoadStart
            | FLAG_onLoadEnd
            | FLAG_onEnd;
    //
    var action = FLAG_activity
            | FLAG_arrows
            | FLAG_button
            | FLAG_caption
            | FLAG_overlay
            | FLAG_navigation;
    //
    var machine = flow | action;  
    //
    // client tests
    var isHistory =
            window.history.pushState !== undefined ? true:false;
    //isHistory = false;
    //
    var dataHistory = {
        'home': {
            'href':window.location.href,
            'title': document.title
        },
        'pushSpace':{
            'pathname':"#!imagelightbox/",
            'title': document.title+' | ImageLightBox'
        }
    };
    //
    //
    ///////////////////////
    // CORE FUNCTION
    ///////////////////////
    $.fn.imageLightbox = (function (opts) {
        var options = $.extend({
            selector:       'a[data-imagelightbox]',
            id:             'imagelightbox',
<<<<<<< HEAD
            wrapper: "imagelightbox-wrapper",
            deepLinks: true,
            allowedTypes:   'png|jpg|jpeg||gif',
=======
            allowedTypes:   'png|jpg|jpeg||gif', // TODO make it work again
>>>>>>> rejas/master
            animationSpeed: 250,
            activity:       false,
            arrows:         false,
            button:         false,
            caption:        false,
            enableKeyboard: true,
            disableBackgroundMovement: true,
            navigation:     false,
            overlay:        false,
            preloadNext:    true,
            quitOnEnd:      false,
            quitOnImgClick: false,
            quitOnDocClick: true,
            quitOnEscKey:   true,
            history:        false
            //
            //
        }, opts);
        //
        //
        var navTargetDefault = function (navTarget) {
            //
            target = targets.eq(navTarget);
            loadImage('left');
            
        },
            previousTargetDefault = function () {
                console.log(App+ ": previousTargetDefault called.");
                targetIndex = targets.index(target) - 1;
                //
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
                loadImage('right');
                console.log("prev "+targetIndex);
                return true;
            },
            nextTargetDefault = function () {
                console.log(App+": nextTargetDefault called");
                targetIndex = targets.index(target) + 1;
                
                //
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
                loadImage('right');
                return targetIndex;
            };

        //
        var targets = $([]),
            target = $(),
            targetIndex,
            image = $(),
            imageWidth = 0,
            imageHeight = 0,
            swipeDiff = 0,
            inProgress = false;
        // State Manager
        var lightboxState = function (state) {
            //
            if (machine & FLAG_activity)
                activityIndicatorToggle(state);
            if (machine & FLAG_arrows)
                arrowsToggle(state);
            if (machine & FLAG_button)
                closeButtonToggle(state);
            if (machine & FLAG_caption)
                captionToggle(state);
            if (machine & FLAG_overlay)
                overlayToggle(state);
            if (machine & FLAG_navigation)
                navigationToggle(state);
        };
        // State methods
        var activityIndicatorToggle = function (state) {
            //
            if (state & FLAG_onLoadStart) {
                console.log(App + ": Start loading Indicator.");
                $activityObject.appendTo($wrapper);
                //
            } else if (state & (FLAG_onLoadEnd)) {
                console.log(App + ": Deactivate Indicator on end or load end");
                $activityObject.remove();
            }
            return false;
        };
        //
        var loadNextImage = function () {
            //
            nextTargetDefault();
            loadImage('right');
        };
        var loadPreviousImage = function () {
            console.log(App+": loadPreviousImage called.");
            previousTargetDefault();
            loadImage('left');
        };
        var loadNavImage = function (navIndex) {
            //
            console.log("ladNavImage " +navIndex);
            navTargetDefault(navIndex);
            loadImage('right');
        };
        ///
        ///
        var arrowsToggle = function (state) {
            if (FLAG_onStart & state) {
                console.log(App + ": activate arrows on start");
                
                $wrapper.append($arrowLeftObject,
                                [$arrowRightObject]);
                //
            } else if (FLAG_onLoadEnd & state) {
                console.log(App + ": display arrows on load end.");
                $arrowLeftObject
                    .add($arrowRightObject).css('display', 'block');
            }
        };
        var captionToggle = function (state) {
            if (state & FLAG_onStart) {
                $captionObject.appendTo($wrapper);
            } else if (state & FLAG_onLoadEnd) {
                console.log(App + ": activate caption on load end");
                var description = $(target).find('img').attr('alt');
                if (description && description.length > 0) {

                    $captionObject.text(description);
                }
            }
        };
        var closeButtonToggle = function (state) {
            if (state & FLAG_onStart) {
                console.log(App + ": activate button on load end");
                $buttonObject.appendTo($wrapper);
            }
        };
        //
        var navigationToggle = function (state) {
            if (FLAG_onStart & state) {
                var images = $(options.selector);
                console.log(App+": Activate navigation.");
                $navObject.on('click touchend', function () {
                    return false;
                });
                if (images.length) {
                    for (var i = 0, len = images.length; i < len; i++) {
                        // add nav buttons
                        $navObject
                            .append(
                                $('<a/>'));
                    }
                }
                $navObject.appendTo($wrapper);
                //
            }
        };
        //
        var overlayToggle = function (state) {
            if (state & FLAG_onStart) {
                $overlayObject.appendTo($wrapper);
            }
        };
        //
        // helper methods
        var loadImage = function (direction) {
            console.log(App+ ": loadImage called.");

            if (inProgress) {
                return false;
            }
            //      
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
            //
            lightboxState(FLAG_onLoadStart);
            
            window.setTimeout(function () {
                if (isHistory) {
                    var imageName = target.attr('href').split('/').pop();
                    // window.history.pushState(null,'','');
                    window.history.replaceState('','',"#!imagelightbox/"+imageName);
                    
                    document.title = dataHistory.pushSpace.title + " | "+imageName;
                }
                var imgPath = target.attr('href');
                
                //
                image = $image
                    .attr('id',options.id) // hook point
                    .attr('src', imgPath)
                    .load(function () {
                        var params = {'opacity': 1};
                        //
                        $wrapper.append(image);
                        setImage();
                        image.css('opacity', 1);
                        if (isCssTransitionSupport) {
                            cssTransitionTranslateX(image, -100 * direction + 'px', 0);
                            window.setTimeout(function () {
                                cssTransitionTranslateX(image, 0 + 'px', options.animationSpeed / 1000);
                            }, 50);
                        } else {
                            var imagePosLeft = parseInt(image.css('left'));
                            params.left = imagePosLeft + 'px';
                            image.css('left', imagePosLeft - 100 * direction + 'px');
                        }

                        image.animate(params, options.animationSpeed, function () {
                            inProgress = false;
                            lightboxState(FLAG_onLoadEnd);
                        });
                        if (options.preloadNext) {
                            console.log(App+": Preloading nextimage.");
                            var nextTarget = targets.eq(targets.index(target) + 1);
                            if (!nextTarget.length) {
                                nextTarget = targets.eq(0);
                            }
                            
                            $('<img />').attr('src', nextTarget.attr('href')).load();
                        }
                    })
                    .error(function () {
                        lightboxState(FLAG_onLoadEnd);
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
                    return undefined;
                })
                    .on('touchstart pointerdown MSPointerDown', function (e) {
                        if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                            return true;
                        }
                        if (isCssTransitionSupport) {
                            imagePosLeft = parseInt(image.css('left'));
                        }
                        swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                        return undefined;
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
                        return undefined;
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
                        return undefined;
                    });

            }, options.animationSpeed + 100);
            return undefined;
        };
        //
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

<<<<<<< HEAD
            cssTransitionTranslateX = function (element, positionX, speed) {
                var options = {}, prefix = cssTransitionSupport();
                options[prefix + 'transform'] = 'translateX(' + positionX + ')';
                options[prefix + 'transition'] = prefix + 'transform ' + speed + 's linear';
                element.css(options);
=======
            /* TODO make it work again
            isTargetValid = function (element) {
                var classic = $(element).prop('tagName').toLowerCase() === 'a' && ( new RegExp('.(' + options.allowedTypes + ')$', 'i') ).test($(element).attr('href'));
                var html5 = $(element).attr('data-lightbox') !== undefined;
                return classic || html5;
>>>>>>> rejas/master
            },
            */

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
        //
        var isTargetValid = function (element) {
            var classic = $(element).prop('tagName').toLowerCase() === 'a' && ( new RegExp('.(' + options.allowedTypes + ')$', 'i') ).test($(element).attr('href'));
            var html5 = $(element).attr('data-lightbox') !== undefined;
            return classic || html5;
        },
            //
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
                return undefined;
            },
<<<<<<< HEAD
            //        
=======

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

>>>>>>> rejas/master
            removeImage = function () {
                console.log(App+ ": removeImage called.");
                if (!image.length) {
                    return false;
                }
                $(image).remove();
                image = $();
                return undefined;
            },
            quitLightbox = function () {
                if (isHistory) {
                    //   window.history.back();
                    window.history.replaceState('','','/');
                    document.title = dataHistory.home.title;
                }
                console.log(App+": quitLightbox called");
                if (!image.length) {
                    return false;
                }
                //
                image.animate({'opacity': 0}, options.animationSpeed, function () {
                    removeImage();
                    inProgress = false;
                    lightboxState(FLAG_onEnd);

                });
<<<<<<< HEAD
                $wrapper.remove();
                
                
                // console.log($wrapper.toSource());
                $(window,document).off('.imagelightbox');
                console.log(App+": So long and thanks for all the fish!");
                return false;
            };

        //
        

        var tryQuitonDocClick = function (e) {
            if (options.quitOnDocClick) {
                console.log("Quitting on doc click");
                if (image.length && !$(e.target).is(image)) {
                    e.preventDefault();
                    quitLightbox();
                }
            }
        };

        var tryEnableKeyboard = function (e) {
            if (options.enableKeyboard) {
                //        console.log("keyboard is working");
                if (!image.length) {
                    return true;
                }
                e.preventDefault();
                if (e.which === 27 && options.quitOnEscKey === true) {
                    quitLightbox();
                }
                if (1<<e.which & (1<<37 | 1<<40)) {
                    previousTargetDefault();
                } else if (1<<e.which & (1<<39 | 1<<38) ) {
                    nextTargetDefault();
                } else {
                    //          console.log(App+": unmapped key command.");
                }
            }
            return undefined;
        };
        //
        this.startImageLightbox = function (e) {
            // history modification
            // var historyHome 
            if (isHistory) {

                window.history.pushState(dataHistory,null,
                                         dataHistory.pushSpace.pathname);
                
                document.title = dataHistory.pushSpace.title;
            }
            
            // Listeners for $(document) delegated to imageLightbox components (must come first)
            $(window)
                .on('popstate.imagelightbox', function (e) {
                    console.log("popping");
                })
                .on('resize.imagelightbox', setImage)
                .on('keydown.imagelightbox',function(e) {
                    if([32,33,34,35,36,37,38,39,40].indexOf(e.which) > -1) {
                        e.preventDefault();
                    }
                    return false;
                });
            //
            $(document)
                .on('keyup.imagelightbox', tryEnableKeyboard)
                .on(hasTouch ? 'touchend.imagelightbox' : 'click.imagelightbox', tryQuitonDocClick);
            
            //
            //
            $buttonObject
                .on('click', quitLightbox);
            $arrowLeftObject
                .on('click touchend',function (e) {
                    e.preventDefault();
                    options.previousTargetDefault();
                });
            $arrowRightObject
                .on('click touchend',function (e) {
                    e.preventDefault();
                    nextTargetDefault();
                });
            //
            $navObject
                .on('click touchend', function (e) {
                    e.preventDefault();
                    if (!($(e.target).hasClass('active'))) {
                        // yerp this works finally
                        var navIndex = $(this).find('a').index($(e.target));
                        $(this).find('a').removeClass('active');
                        $(e.target).addClass('active');
                        loadNavImage(navIndex);
                    }
                    return false;
                });

            $wrapper.appendTo($('body'));
            
            if (!isTargetValid(this)) {
                return true;
            }
            if (e !== undefined) {
                e.preventDefault();
            }
            if (inProgress) {
                return false;
            }
            inProgress = false;
            //
            // Here I turn-off options not wanted by user.
            machine ^= (!options.activity * FLAG_activity)
                | (!options.arrows * FLAG_arrows)
                | (!options.button * FLAG_button)
                | (!options.caption * FLAG_caption)
                | (!options.overlay * FLAG_overlay)
                | (!options.navigation * FLAG_navigation);
            //
            // console.log(options.activity * FLAG_activity);
            
            lightboxState(FLAG_onStart);
            target = $(this);
            loadImage();
            //
            return undefined;
        };

        
        $(document)
            .off('click', this.selector)
            .ready(function () {
                if(window.location.hash) {
                    $(options.selector).first().trigger('click.imagelightbox.initiate');
                }
            })
            .on('click.imagelightbox.initiate', this.selector, this.startImageLightbox);
        
        ///////////////////////
        // PUBLIC METHODS
        ///////////////////////
        //         
        //
        this.each(function () {
            if (!isTargetValid(this)) {
                return true;
            }
            //    
            targets = targets.add($(this));
            return undefined;
        });
=======
            },

            addTargets = function( newTargets ) {
                newTargets.each(function () {
                    targets = targets.add($(this));
                });

                newTargets.on('click', function (e) {
                    e.preventDefault();
                    if (inProgress) {
                        return false;
                    }
                    inProgress = false;
                    if (options.onStart !== false) {
                        options.onStart();
                    }
                    target = $(this);
                    loadImage();
                });
            };

        $(window).on('resize', setImage);

        $(document).ready(function() {
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
        });

        $(document).off('click', this.selector);

        addTargets($(this));
>>>>>>> rejas/master


        this.loadPreviousImage = function () {
            loadPreviousImage();
        };

        this.loadNextImage = function () {
            loadNextImage();
        };

        this.loadNavImage = function () {
            loadNavImage();
        };

        this.quitImageLightbox = function () {
            quitLightbox();
            return this;
        };

<<<<<<< HEAD
        // You can add the other targets to the image queue.
        this.addToImageLightbox = function (elements) {
            elements.each(function () {
                if (!isTargetValid(this)) {
                    return true;
                }
                targets = targets.add($(this));
                return undefined;
            });
            elements.click(this.startImageLightbox);
            return this;
=======
        this.addToImageLightbox = function(elements)  {
            addTargets(elements);
>>>>>>> rejas/master
        };

        return this;
    });
    var pro = false;
    if (pro) console.log = function(){};
})(jQuery, window, document, undefined);
// create a style for 'forward' direction
// use state object
//remove options that shoiuldn't be options
// there is still a lot of abstraction that can be cut out
// append doesn't seem to work with jquery objects
// try to reduce number of methods
// finish namespacing events, so they can be removed on quit
// for multiple instance support, these events should depend on group name as well.
// i n order to allow for multiple instances, the user would ned to specifiy different values for the 'data-imagelightbox' attribute
//
// use hashtags if browser doesn't support pushstate
// not working without preloading.. hmm
