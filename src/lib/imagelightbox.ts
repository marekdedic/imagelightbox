import "./imagelightbox.css";

import jQuery from "jquery";

import type { PreloadedVideo } from "./interfaces/PreloadedVideo";
import type { VideoOptions } from "./interfaces/VideoOptions";

const $ = jQuery;

// COMPONENTS //
const $activityObject = $("<div/>")
        .attr("id", "ilb-activity-indicator")
        .append($("<div/>")),
    $arrowLeftObject = $("<div/>", {
        class: "imagelightbox-arrow",
        id: "ilb-arrow-left",
    }),
    $arrowRightObject = $("<div/>", {
        class: "imagelightbox-arrow",
        id: "ilb-arrow-right",
    }),
    $arrows = $arrowLeftObject.add($arrowRightObject),
    $captionObject = $("<div/>", {
        id: "ilb-caption",
        html: "&nbsp;",
    }),
    $buttonObject = $("<div/>", {
        id: "ilb-close-button",
    }),
    $overlayObject = $("<div/>", {
        id: "ilb-overlay",
    }),
    $navItem = $("<a/>", {
        href: "#",
    }),
    $navObject = $("<div/>", {
        class: "ilb-navigation",
    }),
    $wrapper = $("<div/>", {
        class: "imagelightbox-wrapper",
    }),
    $body = $("body");

function cssTransitionTranslateX(
    element: JQuery,
    positionX: string,
    speed: number,
): void {
    element.css({
        transform: "translateX(" + positionX + ") translateY(-50%)",
        transition: "transform " + speed.toString() + "s ease-in",
    });
}

const hasTouch = "ontouchstart" in window,
    hasPointers = "PointerEvent" in window,
    wasTouched = (event: PointerEvent): boolean => {
        if (hasTouch) {
            return true;
        }

        if (!hasPointers || typeof event.pointerType === "undefined") {
            return false;
        }

        if (event.pointerType !== "mouse") {
            return true;
        }

        return false;
    },
    legacyDocument = document as LegacyDocument,
    hasFullscreenSupport: boolean =
        legacyDocument.fullscreenEnabled ||
        (legacyDocument.webkitFullscreenEnabled ?? false);

$.fn.imageLightbox = function (opts?: Partial<ILBOptions>): JQuery {
    let currentIndex = 0;
    let image = $();
    let inProgress = false;
    let swipeDiff = 0;
    let target = $();
    let targetIndex = -1;
    let targets: JQuery = $([]);
    let targetSet = "";
    const videos: Array<PreloadedVideo> = [],
        options = $.extend(
            {
                selector: "a[data-imagelightbox]",
                allowedTypes: "png|jpg|jpeg|gif",
                animationSpeed: 250,
                activity: false,
                arrows: false,
                button: false,
                caption: false,
                enableKeyboard: true,
                history: false,
                fullscreen: false,
                gutter: 10, // percentage of client height
                offsetY: 0, // percentage of gutter
                navigation: false,
                overlay: false,
                preloadNext: true,
                quitOnEnd: false,
                quitOnImgClick: false,
                quitOnDocClick: true,
                quitOnEscKey: true,
            },
            opts,
        ),
        _removeQueryField = (query: string, key: string): string => {
            let newQuery = query;
            if (newQuery) {
                const keyRegex1 = new RegExp("\\?" + key + "=[^&]*");
                const keyRegex2 = new RegExp("&" + key + "=[^&]*");
                newQuery = newQuery.replace(keyRegex1, "?");
                newQuery = newQuery.replace(keyRegex2, "");
            }
            return newQuery;
        },
        _pushQuitToHistory = (): void => {
            if (!options.history) {
                return;
            }
            let newQuery = _removeQueryField(
                document.location.search,
                "imageLightboxIndex",
            );
            newQuery = _removeQueryField(newQuery, "imageLightboxSet");
            window.history.pushState(
                {},
                "",
                document.location.pathname + newQuery,
            );
        },
        _removeImage = (): void => {
            if (!image.length) {
                return;
            }
            image.remove();
            image = $();
        },
        _quitImageLightbox = (noHistory = false): void => {
            targetIndex = -1;
            if (!noHistory) {
                _pushQuitToHistory();
            }
            $wrapper.trigger("quit.ilb2");
            $body.removeClass("ilb-open");
            if (!image.length) {
                return;
            }
            image.animate({ opacity: 0 }, options.animationSpeed, (): void => {
                _removeImage();
                inProgress = false;
                $wrapper.remove().find("*").remove();
            });
        },
        _addQueryField = (
            query: string,
            key: string,
            value: string,
        ): string => {
            const newField = key + "=" + value;
            let newQuery = "?" + newField;

            if (query) {
                const keyRegex = new RegExp("([?&])" + key + "=[^&]*");
                if (keyRegex.exec(query) !== null) {
                    newQuery = query.replace(keyRegex, "$1" + newField);
                } else {
                    newQuery = query + "&" + newField;
                }
            }
            return newQuery;
        },
        _pushToHistory = (): void => {
            if (!options.history) {
                return;
            }
            const newIndex =
                targets[targetIndex].dataset.ilb2Id ?? targetIndex.toString();
            const newState = {
                imageLightboxIndex: newIndex,
                imageLightboxSet: "",
            };
            const set = targets[targetIndex].dataset.imagelightbox;
            let newQuery = _addQueryField(
                document.location.search,
                "imageLightboxIndex",
                newIndex,
            );
            if (set !== undefined) {
                newState.imageLightboxSet = set;
                newQuery = _addQueryField(newQuery, "imageLightboxSet", set);
            }
            window.history.pushState(
                newState,
                "",
                document.location.pathname + newQuery,
            );
        },
        activityIndicatorOn = (): void => {
            $wrapper.append($activityObject);
        },
        captionReset = (): void => {
            $captionObject.css("opacity", "0");
            $captionObject.html("&nbsp;");
            if ($(target).data("ilb2-caption") !== undefined) {
                $captionObject.css("opacity", "1");
                $captionObject.html($(target).data("ilb2-caption") as string);
            } else if ($(target).find("img").attr("alt") !== undefined) {
                $captionObject.css("opacity", "1");
                $captionObject.html($(target).find("img").attr("alt")!);
            }
        },
        _onLoadStart = (): void => {
            if (options.activity) {
                activityIndicatorOn();
            }
            if (options.caption) {
                captionReset();
            }
        },
        _setImage = function (): void {
            if (!image.length) {
                return;
            }

            const captionHeight = options.caption
                    ? $captionObject.outerHeight()!
                    : 0,
                screenWidth = $(window).width()!,
                screenHeight = $(window).height()! - captionHeight,
                gutterFactor = Math.abs(1 - options.gutter / 100);

            function setSizes(imageWidth: number, imageHeight: number): void {
                if (imageWidth > screenWidth || imageHeight > screenHeight) {
                    const ratio =
                        imageWidth / imageHeight > screenWidth / screenHeight
                            ? imageWidth / screenWidth
                            : imageHeight / screenHeight;
                    imageWidth /= ratio;
                    imageHeight /= ratio;
                }
                const cssHeight = imageHeight * gutterFactor,
                    cssWidth = imageWidth * gutterFactor,
                    cssLeft = ($(window).width()! - cssWidth) / 2;

                image.css({
                    width: cssWidth.toString() + "px",
                    height: cssHeight.toString() + "px",
                    left: cssLeft.toString() + "px",
                });
            }

            const videoId = image.data("ilb2VideoId") as string;
            let videoHasDimensions = false;
            $.each(videos, function (_, video) {
                if (videoId === this.i) {
                    setSizes(video.w!, video.h!);
                    videoHasDimensions = true;
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TypeScript can't detect possible overwrite in a loop
            if (videoHasDimensions) {
                return;
            }
            const videoElement = image.get(0) as HTMLVideoElement;
            if ((videoElement.videoWidth as number | undefined) !== undefined) {
                setSizes(videoElement.videoWidth, videoElement.videoHeight);
                return;
            }

            const tmpImage = new Image();
            tmpImage.src = image.attr("src")!;
            tmpImage.onload = (): void => {
                setSizes(tmpImage.width, tmpImage.height);
            };
        },
        activityIndicatorOff = (): void => {
            $("#ilb-loading-indicator").remove();
        },
        _onLoadEnd = (): void => {
            if (options.activity) {
                activityIndicatorOff();
            }
            if (options.arrows) {
                $arrows.css("display", "block");
            }
        },
        _previousTarget = (): void => {
            if (inProgress) {
                return;
            }

            targetIndex--;
            if (targetIndex < 0) {
                if (options.quitOnEnd) {
                    _quitImageLightbox();
                    return;
                } else {
                    targetIndex = targets.length - 1;
                }
            }
            target = targets.eq(targetIndex);
            _pushToHistory();
            $wrapper.trigger("previous.ilb2", target);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Cyclical dependency
            _loadImage(+1);
        },
        _nextTarget = (): void => {
            if (inProgress) {
                return;
            }

            targetIndex++;
            if (targetIndex >= targets.length) {
                if (options.quitOnEnd) {
                    _quitImageLightbox();
                    return;
                } else {
                    targetIndex = 0;
                }
            }
            _pushToHistory();
            target = targets.eq(targetIndex);
            $wrapper.trigger("next.ilb2", target);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Cyclical dependency
            _loadImage(-1);
        },
        _loadImage = (direction: number): void => {
            if (inProgress) {
                return;
            }

            if (image.length) {
                const params: JQuery.PlainObject = { opacity: 0 };
                cssTransitionTranslateX(
                    image,
                    (100 * direction - swipeDiff).toString() + "px",
                    options.animationSpeed / 1000,
                );
                image.animate(params, options.animationSpeed, (): void => {
                    _removeImage();
                });
                swipeDiff = 0;
            }

            inProgress = true;
            _onLoadStart();

            setTimeout((): void => {
                let swipeStart = 0;
                let swipeEnd = 0;
                const imgPath = target.attr("href");

                // if (imgPath === undefined) {
                //     imgPath = target.attr('data-lightbox');
                // }

                const videoOptions = target.data("ilb2Video") as
                    | VideoOptions
                    | undefined;
                let element = $();
                let preloadedVideo: boolean | undefined = undefined;
                if (videoOptions) {
                    $.each(videos, (_, video): void => {
                        if (video.i === target.data("ilb2VideoId")) {
                            preloadedVideo = video.l;
                            element = video.e;
                            if (video.a !== undefined) {
                                if (preloadedVideo) {
                                    void (
                                        element.get(0) as HTMLVideoElement
                                    ).play();
                                } else {
                                    element.attr("autoplay", video.a);
                                }
                            }
                        }
                    });
                } else {
                    element = $('<img id="ilb-image" />').attr("src", imgPath!);
                }
                function onload(): void {
                    const params: JQuery.PlainObject = { opacity: 1 };

                    image.appendTo($wrapper);
                    _setImage();
                    image.css("opacity", 0);
                    cssTransitionTranslateX(
                        image,
                        (-100 * direction).toString() + "px",
                        0,
                    );
                    setTimeout((): void => {
                        cssTransitionTranslateX(
                            image,
                            "0px",
                            options.animationSpeed / 1000,
                        );
                    }, 50);

                    image.animate(params, options.animationSpeed, (): void => {
                        inProgress = false;
                        _onLoadEnd();
                    });
                    if (options.preloadNext) {
                        let nextTarget = targets.eq(targets.index(target) + 1);
                        if (!nextTarget.length) {
                            nextTarget = targets.eq(0);
                        }
                        $("<img />").attr("src", nextTarget.attr("href")!);
                    }
                    $wrapper.trigger("loaded.ilb2");
                }
                function onclick(e: BaseJQueryEventObject): void {
                    e.preventDefault();
                    if (options.quitOnImgClick) {
                        _quitImageLightbox();
                        return;
                    }
                    if (wasTouched(e.originalEvent as PointerEvent)) {
                        return;
                    }
                    const posX =
                        (e.pageX || (e.originalEvent as PointerEvent).pageX) -
                        (e.target as HTMLImageElement).offsetLeft;
                    if ((e.target as HTMLImageElement).width / 3 > posX) {
                        _previousTarget();
                    } else {
                        _nextTarget();
                    }
                }
                image = element
                    .on("load.ilb7", onload)
                    .on("error.ilb7", (): void => {
                        _onLoadEnd();
                    })
                    .on(
                        "touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7",
                        (e: BaseJQueryEventObject): void => {
                            if (
                                !wasTouched(e.originalEvent as PointerEvent) ||
                                options.quitOnImgClick
                            ) {
                                return;
                            }
                            swipeStart =
                                (e.originalEvent as PointerEvent).pageX ||
                                (e.originalEvent as TouchEvent).touches[0]
                                    .pageX;
                        },
                    )
                    .on(
                        "touchmove.ilb7 pointermove.ilb7 MSPointerMove.ilb7",
                        (e: BaseJQueryEventObject): void => {
                            if (
                                (!hasPointers && e.type === "pointermove") ||
                                !wasTouched(e.originalEvent as PointerEvent) ||
                                options.quitOnImgClick
                            ) {
                                return;
                            }
                            e.preventDefault();
                            swipeEnd =
                                (e.originalEvent as PointerEvent).pageX ||
                                (e.originalEvent as TouchEvent).touches[0]
                                    .pageX;
                            swipeDiff = swipeStart - swipeEnd;
                            cssTransitionTranslateX(
                                image,
                                (-swipeDiff).toString() + "px",
                                0,
                            );
                        },
                    )
                    .on(
                        "touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7",
                        (e): void => {
                            if (
                                !wasTouched(e.originalEvent as PointerEvent) ||
                                options.quitOnImgClick
                            ) {
                                return;
                            }
                            if (Math.abs(swipeDiff) > 50) {
                                if (swipeDiff < 0) {
                                    _previousTarget();
                                } else {
                                    _nextTarget();
                                }
                            } else {
                                cssTransitionTranslateX(
                                    image,
                                    "0px",
                                    options.animationSpeed / 1000,
                                );
                            }
                        },
                    );
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Rule cannot handle loops
                if (preloadedVideo === true) {
                    onload();
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Rule cannot handle loops
                } else if (preloadedVideo === false) {
                    image = image.on("loadedmetadata.ilb7", onload);
                }
                if (!videoOptions) {
                    image = image.on(
                        hasPointers
                            ? "pointerup.ilb7 MSPointerUp.ilb7"
                            : "click.ilb7",
                        onclick,
                    );
                }
            }, options.animationSpeed + 100);
        },
        arrowsOn = (): void => {
            $wrapper.append($arrows);
            $arrowLeftObject.on("click.ilb7 touchend.ilb7", (e): void => {
                e.stopImmediatePropagation();
                e.preventDefault();
                _previousTarget();
            });
            $arrowRightObject.on("click.ilb7 touchend.ilb7", (e): void => {
                e.stopImmediatePropagation();
                e.preventDefault();
                _nextTarget();
            });
        },
        navigationOn = function (): void {
            if (!targets.length) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/prefer-for-of -- targets cannot be iterated in old jQuery and the result wouldn't be used anyway
            for (let i = 0; i < targets.length; i++) {
                $navObject.append($navItem.clone());
            }
            const $navItems = $navObject.children("a");
            $navItems.eq(targets.index(target)).addClass("active");

            $wrapper.on("previous.ilb2 next.ilb2", (): void => {
                $navItems
                    .removeClass("active")
                    .eq(targets.index(target))
                    .addClass("active");
            });
            $wrapper.append($navObject);

            $navObject
                .on("click.ilb7 touchend.ilb7", (): boolean => false)
                .on("click.ilb7 touchend.ilb7", "a", function (): void {
                    const $this = $(this);
                    if (
                        targets.eq($this.index()).attr("href") !==
                        $("#ilb-image").attr("src")
                    ) {
                        const tmpTarget = targets.eq($this.index());
                        if (tmpTarget.length) {
                            currentIndex = targets.index(target);
                            target = tmpTarget;
                            _loadImage($this.index() < currentIndex ? -1 : 1);
                        }
                    }
                    $this.addClass("active").siblings().removeClass("active");
                });
        },
        overlayOn = (): void => {
            $wrapper.append($overlayObject);
        },
        closeButtonOn = (): void => {
            $buttonObject.appendTo($wrapper).on("click.ilb7", (): boolean => {
                _quitImageLightbox();
                return false;
            });
        },
        _onStart = (): void => {
            if (options.arrows) {
                arrowsOn();
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
        _getQueryField = (key: string): string | undefined => {
            const keyValuePair = new RegExp(
                "[?&]" + key + "(=([^&#]*)|&|#|$)",
            ).exec(document.location.search);
            if (keyValuePair?.[2] === undefined) {
                return undefined;
            }
            return decodeURIComponent(keyValuePair[2].replace(/\+/g, " "));
        },
        _openImageLightbox = ($target: JQuery, noHistory: boolean): void => {
            if (inProgress) {
                return;
            }
            inProgress = false;
            target = $target;
            targetIndex = targets.index(target);
            if (!noHistory) {
                _pushToHistory();
            }
            _onStart();
            $body.append($wrapper).addClass("ilb-open");
            $wrapper.trigger("start.ilb2", $target);
            _loadImage(0);
        },
        _openHistory = (): void => {
            if (!options.history) {
                return;
            }
            const id = _getQueryField("imageLightboxIndex");
            if (id === undefined) {
                return;
            }
            let element = targets.filter('[data-ilb2-id="' + id + '"]');
            if (element.length > 0) {
                targetIndex = targets.index(element);
            } else {
                targetIndex = parseInt(id);
                element = $(targets[targetIndex]);
            }
            const set = _getQueryField("imageLightboxSet");
            if (
                element.length === 0 ||
                (set !== undefined && set !== element[0].dataset.imagelightbox)
            ) {
                return;
            }
            _openImageLightbox(element, true);
        },
        _popHistory = (event: BaseJQueryEventObject): void => {
            const newState = (event.originalEvent as PopStateEvent).state as
                | { imageLightboxIndex?: string; imageLightboxSet?: string }
                | undefined;
            if (!newState) {
                _quitImageLightbox(true);
                return;
            }
            const newId = newState.imageLightboxIndex;
            if (newId === undefined) {
                _quitImageLightbox(true);
                return;
            }
            const element = targets.filter('[data-ilb2-id="' + newId + '"]');
            if (
                element.length === 0 ||
                (newState.imageLightboxSet !== undefined &&
                    newState.imageLightboxSet !==
                        element[0].dataset.imagelightbox)
            ) {
                return;
            }
            if (targetIndex < 0) {
                _openImageLightbox(element, true);
                return;
            }
            const newIndex = targets.index(element);
            let direction = +1;
            if (newIndex > targetIndex) {
                direction = -1;
            }
            target = element;
            targetIndex = newIndex;
            _loadImage(direction);
        },
        isTargetValid = (element: JQuery): boolean =>
            (($(element).prop("tagName") as string).toLowerCase() === "a" &&
                new RegExp(".(" + options.allowedTypes + ")$", "i").test(
                    $(element).attr("href")!,
                )) ||
            $(element).data("ilb2Video") !== undefined,
        _addTargets = function (newTargets: JQuery): void {
            function filterTargets(): void {
                newTargets
                    .filter(function (): boolean {
                        return $(this).data("imagelightbox") === targetSet;
                    })
                    .filter(function (): boolean {
                        return isTargetValid($(this));
                    })
                    .each(function (): void {
                        targets = targets.add($(this));
                    });
            }
            newTargets.each(function (): void {
                targets = newTargets.add($(this));
            });
            newTargets.on("click.ilb7", { set: targetSet }, function (e): void {
                e.preventDefault();
                targetSet = $(e.currentTarget).data("imagelightbox") as string;
                filterTargets();
                if (targets.length < 1) {
                    _quitImageLightbox();
                } else {
                    _openImageLightbox($(this), false);
                }
            });
        },
        _preloadVideos = function (elements: JQuery): void {
            elements.each(function () {
                const videoOptions = $(this).data("ilb2Video") as
                    | VideoOptions
                    | undefined;
                if (videoOptions) {
                    let id = $(this).data("ilb2Id") as string;
                    if (!id) {
                        // Random id
                        id =
                            "a" +
                            (((1 + Math.random()) * 0x10000) | 0).toString(16);
                    }
                    $(this).data("ilb2VideoId", id);
                    const container: PreloadedVideo = {
                        e: $(
                            "<video id='ilb-image' preload='metadata' data-ilb2-video-id='" +
                                id +
                                "'>",
                        ),
                        i: id,
                        l: false,
                        a: undefined,
                        h: undefined,
                        w: undefined,
                    };
                    $.each(videoOptions, (key: string, value): void => {
                        switch (key) {
                            case "autoplay":
                                container.a = value as string;
                                break;
                            case "height":
                                container.h = value as number;
                                break;
                            case "sources":
                                break;
                            case "width":
                                container.w = value as number;
                                break;
                            default:
                                // TODO: Remove this general behaviour
                                container.e = container.e.attr(
                                    key,
                                    value as number | string,
                                );
                        }
                    });
                    if (videoOptions.sources) {
                        $.each(videoOptions.sources, (_, source): void => {
                            let sourceElement = $("<source>");
                            $.each(source, (key: string, value): void => {
                                // TODO: Remove this general behaviour
                                sourceElement = sourceElement.attr(key, value!);
                            });
                            container.e.append(sourceElement);
                        });
                    }
                    container.e.on("loadedmetadata.ilb7", (): void => {
                        container.l = true;
                    });
                    videos.push(container);
                }
            });
        };

    $(window).on("resize.ilb7", _setImage);
    if (options.history) {
        $(window).on("popstate", _popHistory);
    }

    function toggleFullScreen(): void {
        const doc = window.document as LegacyDocument;
        const docEl = document.getElementById("ilb-image")!
            .parentElement as LegacyHTMLElement;

        /* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/unbound-method -- Polyfills for very old browsers */
        const requestFullScreen =
            docEl.requestFullscreen || docEl.webkitRequestFullScreen;
        const exitFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen;
        /* eslint-enable */

        if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
            void requestFullScreen.call(docEl);
        } else {
            void exitFullScreen.call(doc);
        }
    }

    $((): void => {
        if (options.quitOnDocClick) {
            $(document).on(
                hasTouch ? "touchend.ilb7" : "click.ilb7",
                (e): void => {
                    if (image.length && !$(e.target).is(image)) {
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                },
            );
        }

        if (options.fullscreen && hasFullscreenSupport) {
            $(document).on("keydown.ilb7", (e): void => {
                if (!image.length) {
                    return;
                }
                if ([9, 32, 38, 40].includes(e.which!)) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                if ([13].includes(e.which!)) {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleFullScreen();
                }
            });
        }

        if (options.enableKeyboard) {
            $(document).on("keydown.ilb7", (e): void => {
                if (!image.length) {
                    return;
                }
                if ([27].includes(e.which!) && options.quitOnEscKey) {
                    e.stopPropagation();
                    e.preventDefault();
                    _quitImageLightbox();
                }
                if ([37].includes(e.which!)) {
                    e.stopPropagation();
                    e.preventDefault();
                    _previousTarget();
                }
                if ([39].includes(e.which!)) {
                    e.stopPropagation();
                    e.preventDefault();
                    _nextTarget();
                }
            });
        }
    });

    $(document).off(".ilb7 .ilb2", options.selector);

    _addTargets($(this));

    _openHistory();

    _preloadVideos(targets);

    this.addToImageLightbox = (elements: JQuery): void => {
        _addTargets(elements);
        _preloadVideos(elements);
    };

    this.openHistory = (): void => {
        _openHistory();
    };

    this.loadPreviousImage = (): void => {
        _previousTarget();
    };

    this.loadNextImage = (): void => {
        _nextTarget();
    };

    this.quitImageLightbox = function (): JQuery {
        _quitImageLightbox();
        return this;
    };

    this.startImageLightbox = function (element?: JQuery): void {
        if (element) {
            element.trigger("click.ilb7");
        } else {
            $(this).trigger("click.ilb7");
        }
    };

    return this;
};
