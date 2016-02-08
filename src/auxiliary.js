var light = (function ($) {
    "use strict";

    var activityIndicatorOn = function () {
        console.log("ILB: activityIndicatorOn()");
        $('<div id="imagelightbox-loading"><div></div></div>').appendTo('body');
    },
        activityIndicatorOff = function () {
            console.log("ILB: activityIndicatorOff()");
            $('#imagelightbox-loading').remove();
        },

        overlayOn = function () {
            console.log("ILB: overlayOn()");
            $('<div id="imagelightbox-overlay"></div>').appendTo('body');
        },
        overlayOff = function () {
            console.log("ILB: overlayOff()");
            $('#imagelightbox-overlay').remove();
        },

        closeButtonOn = function (instance) {
            console.log("ILB: closeButtonOn()");
            $('<a href="#" id="imagelightbox-close"></a>').appendTo('body').on('click', function () {
                $(this).remove();
                instance.quitImageLightbox();
                return false;
            });
        },
        closeButtonOff = function () {
            console.log("ILB: closeButtonOff()");
            $('#imagelightbox-close').remove();
        },

        captionOn = function () {
            console.log("ILB: captionOn()");
            var description = $('a[href="' + $('#imagelightbox').attr('src') + '"] img').attr('alt');
            if (description.length > 0)
                $('<div id="imagelightbox-caption">' + description + '</div>').appendTo('body');
        },
        captionOff = function () {
            console.log("ILB: captionOff()");
            $('#imagelightbox-caption').remove();
        },

        navigationOn = function (instance, selector) {
            console.log("ILB: navigationOn()");
            var images = $(selector);
            if (images.length) {
                var nav = $('<div id="imagelightbox-nav"></div>');
                for (var i = 0; i < images.length; i++)
                    nav.append('<a href="#"></a>');

                nav.appendTo('body');
                nav.on('click touchend', function () {
                    return false;
                });

                var navItems = nav.find('a');
                navItems.on('click touchend', function () {
                    var $this = $(this);
                    if (images.eq($this.index()).attr('href') != $('#imagelightbox').attr('src'))
                        instance.switchImageLightbox($this.index());

                    navItems.removeClass('active');
                    navItems.eq($this.index()).addClass('active');

                    return false;
                })
                    .on('touchend', function () {
                        return false;
                    });
            }
        },
        navigationUpdate = function (selector) {
            console.log("ILB: navigationUpdate()");
            console.log("ILB: navigationUpdate()");
            var items = $('#imagelightbox-nav').find('a');
            items.removeClass('active');
            items.eq($(selector).filter('[href="' + $('#imagelightbox').attr('src') + '"]').index(selector)).addClass('active');
        },
        navigationOff = function () {
            console.log("ILB: navigationOff()");
            $('#imagelightbox-nav').remove();
        },
        arrowsOn = function( instance, selector ) {
            console.log("ILB: arrowsOn()");
            var $arrows = $( '<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"></button>' +
                             '<button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"></button>' );
            $arrows.appendTo( 'body' );
            $arrows.on( 'click touchend', function( e ) {
                e.preventDefault();

                var $this = $( this );

                if( $this.hasClass('imagelightbox-arrow-left')) {
                    instance.loadPreviousImage();
                } else {
                    instance.loadNextImage();
                }

                return false;
            });
        },
        arrowsOff = function() {
            console.log("ILB: arrowsOn()");
            $('.imagelightbox-arrow').remove();
        };

    
    var Foo = {
        init: function(selector,options) {
            
            var instance = $(selector).imageLightbox(
                {
                    quitOnDocClick: !options.button,
                    onStart: function () {
                        //
                        if(options.arrows) {arrowsOn(instance,selector);}
                        if(options.navigation) {navigationOn(instance, selector);}
                        if(options.overlay) {overlayOn();}
                        if(options.button) {closeButtonOn(instance);}
                    },
                    onLoadStart: function () {
                        if(options.activity) { activityIndicatorOn();}
                        //
                        //
                        if(options.caption) { captionOff(); }
                    },
                    onLoadEnd: function () {
                        if(options.activity) {activityIndicatorOff();}
                        if(options.arrows) { $('.imagelightbox-arrow' ).css( 'display', 'block' );}
                        if(options.navigation) {navigationUpdate(selector);}
                        //
                        if(options.caption) { captionOn(); }
                    },
                    onEnd: function () {
                        if(options.activity) {activityIndicatorOff();}
                        if(options.arrows) {arrowsOff();}
                        if(options.navigation) {navigationOff();}
                        if(options.overlay) {overlayOff();}
                        if(options.caption) {captionOff();}
                        if(options.button) {closeButtonOff();}
                    }
                });
        }
    };
    
    var Bar = Object.create(Foo);

    return {
        box:function box (input) {
            var defaultOptions = {
                activity:false,
                arrows:false,
                button:false,
                navigation:false,
                overlay:false,
                caption:false
            };

            if (typeof input[1] == 'object') {
                input[1] = $.extend(defaultOptions,input[1]);
            } else {
                input[1] = defaultOptions;
            }
            
            Bar.init(input[0],
                     input[1]
                    );
        }
    };
    
})(jQuery);
