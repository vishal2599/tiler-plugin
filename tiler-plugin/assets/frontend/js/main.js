let arrangements = [];
var globalWidth = 600;
var vertCtx, horiCtx;
jQuery(function() {


    var $ = jQuery;
    var pluginDir = $('input[name="plugindir"]').val();
    arrangements = [{
            name: "50 x 50cm Square Monolithic",
            icon: pluginDir + "assets/images/arrangement-square-monolithic.png",
            dataPattern: "square"
        },
        {
            name: "50 x 50cm Square Vertical Ashlar",
            icon: pluginDir + "assets/images/arrangement-square-vert-ashlar.png",
            dataPattern: "v-ashlar"
        },
        {
            name: "50 x 50cm Square Horizontal Ashlar",
            icon: pluginDir + "assets/images/arrange-square-horiz-ashlar.png",
            dataPattern: "h-ashlar"
        },
        {
            name: "25 x 75cm Plank Monolithic",
            icon: pluginDir + "assets/images/arrangement-plank-monolithic.png",
            dataPattern: "plank-monolithic"
        },
        {
            name: "25 x 75cm Plank Ashlar",
            icon: pluginDir + "assets/images/arrangement-plank-ashlar.png",
            dataPattern: "plank-ashlar"
        },
        {
            name: "25 x 75cm Plank Herringbone",
            icon: pluginDir + "assets/images/arrangement-plank-herringbone.png",
            dataPattern: "herringbone"
        }
    ];



    let logo = logo1 = pdf1 = pdf2 = null;

    function getDataUri(url, callback) {
        let image = new Image();

        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);
            // Get raw image data
            callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };
        image.setAttribute('crossorigin', 'anonymous');

        image.src = url;
    }

    getDataUri(pluginDir + "assets/images/Wayflor-Logo.jpg", function(dataUri) {
        logo = dataUri;
    });
    getDataUri(pluginDir + "assets/images/Wayflor-FeatureIcons.jpg", function(dataUri) {
        logo1 = dataUri;
    });
    getDataUri(pluginDir + "assets/images/bottom-contact.png", function(dataUri) {
        pdf1 = dataUri;
    });
    getDataUri(pluginDir + "assets/images/bottom-logos.png", function(dataUri) {
        pdf2 = dataUri;
    });

    function getDataUrl(fileSrc) {
        // Create canvas

        var myCanvas = document.getElementById('procreate');
        var ctx = myCanvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            return myCanvas.toDataURL();
        };
        img.src = fileSrc;
    }

    function getTilesDetails(arr) {
        if (arr.lentgh === 0) {
            return "";
        }
        var hgt = 80,
            width = 30,
            pattern = jQuery('.product-pattern.selected')[0].dataset.pattern;
        if (pattern == "square" || pattern == "v-ashlar" || pattern == "h-ashlar") {
            hgt = width = 40;
        }

        let result = arr.map(el => [{
            alignments: ['right'],
            style: 'label',
            columns: [{
                    width: width,
                    height: hgt,
                    image: el.src
                },
                {
                    style: 'specs',
                    width: 140,
                    table: {
                        widths: [35, 105],
                        body: [
                            ['STYLE:', el.currentProCat],
                            ['CODE:', el.productSKU],
                            ['COLOR:', el.productName]
                        ]
                    },
                    layout: 'noBorders',
                }
            ]
        }, '_______________________________________\n\n']);

        return result;
    }

    function downloadPDF(inspiration = '') {
        // playground requires you to assign document definition to a variable called dd
        let canvas = document.getElementById('others-div').getElementsByClassName('lower-canvas')[0];
        let generatedImage = canvas.toDataURL();
        var bigImg = (inspiration != '') ? inspiration : generatedImage;
        var WWidth = (inspiration != '') ? 710 : 460;
        if (inspiration != '' && jQuery('.tiler-area .plugin-red-btn[data-key="publicspace"]').parent('.configurator-item').hasClass('active')) {
            WWidth = 530;
        }
        if (inspiration != '' && jQuery('.tiler-area .plugin-red-btn[data-key="workspace"]').parent('.configurator-item').hasClass('active')) {
            WWidth = 750;
        }
        let dd = {
            pageSize: 'LETTER',
            pageOrientation: 'landscape',
            content: [{
                alignments: ['left', 'right'],
                columns: [{
                        width: 240,
                        stack: [{
                                width: 150,
                                image: logo
                            },
                            '\n\n\n\n',
                            getTilesDetails(window.tilesFinal)
                        ]
                    },
                    [{
                        width: WWidth,
                        image: bigImg,
                        alignment: 'right'
                    }]
                ]
            }],
            footer: function(currentPage, pageCount) {
                if (currentPage == pageCount)
                    return [{
                            image: pdf1,
                            width: 240,
                            alignment: 'left',
                            absolutePosition: { x: 30, y: -50 }
                        },
                        {
                            image: pdf2,
                            width: 320,
                            alignment: 'right',
                            margin: [40, 0, 0, 0],
                            absolutePosition: { x: -30, y: -30 }
                        }
                    ];
            },
            styles: {
                label: {
                    fontSize: 9,
                    color: 'grey'
                },
            },
            defaultStyle: {
                columnGap: 10
            }
        };
        pdfMake.createPdf(dd).download('Wayflor.pdf');
        jQuery("#printPDF").text('Save spec sheet PDF').removeClass('downloading');
    };

    jQuery("#printPDF").on("click", function() {
        if (!jQuery(this).hasClass('downloading')) {
            jQuery(this).text('Downloading PDF ...').addClass('downloading');
            if (jQuery('a[href="#tab2default"]').parent('li').hasClass('active')) {
                var key = jQuery('#tab2default .configurator-item.active button').data('key');
                var node = document.getElementById(key);
                domtoimage.toPng(node).then(function(dataUrl) {
                    downloadPDF(dataUrl);
                });
            } else {
                downloadPDF();
            }
        }
    });





    let arrangementsHTML = "";

    $('#arrangementBtn').html(`<img crossorigin="anonymous" src="${arrangements[0].icon}" height="40" width="40" /><span>${arrangements[0].name.substr(10)}</span>`);

    arrangements.map(({ name, icon, dataPattern }, index) => {
        var selected = '';
        if (index == 0)
            selected = 'selected';
        arrangementsHTML += `<li><a class="product-pattern ${selected}"  data-id="${index}" data-pattern="${dataPattern}"><img crossorigin="anonymous" src="${icon}" height="40" width="40" /><span>${name}</span></a></li>`;
    });

    $('#arrangement').html(arrangementsHTML);

    function getHTML(who, deep) {
        if (!who || !who.tagName) return '';
        var txt, ax, el = document.createElement("div");
        el.appendChild(who.cloneNode(false));
        txt = el.innerHTML;
        if (deep) {
            ax = txt.indexOf('>') + 1;
            txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
        }
        el = null;
        return txt;
    }

    function createProductDropdown(productType) {
        $('#pseudoTileList img').sort(sort_pro) // sort elements
            .appendTo('#pseudoTileList'); // append again to the list
        // sort function callback
        function sort_pro(a, b) {
            return ($(b).data('sku')) < ($(a).data('sku')) ? 1 : -1;
        }
        let tiles = $('#pseudoTileList img');
        let template = "";
        let twillProducts = [];
        let twillPlankProducts = [];
        let shadowcreteProducts = [];
        let marbleridgeProducts = [];
        let mysticProducts = [];
        let sandScriptProducts = [];

        tiles.map(tileIndex => {
            if (tiles[tileIndex].dataset.slug.includes('twill-square')) twillProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.slug.includes('twill-plank')) twillPlankProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.slug.includes('shadowcrete')) shadowcreteProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.slug.includes('marbleridge')) marbleridgeProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.slug.includes('mystic')) mysticProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.cat.includes('Sandscript')) sandScriptProducts.push(tiles[tileIndex]);
        });

        if (productType === "square") {
            template += '<li class="tile-item">' +
                '<span class="tile-category">Twill Square</span>' +
                '<span class="tile-images">' + twillProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Shadowcrete Square</span>' +
                '<span class="tile-images">' + shadowcreteProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Marbleridge Square</span>' +
                '<span class="tile-images">' + marbleridgeProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';
        } else {
            template += '<li class="tile-item">' +
                '<span class="tile-category">Twill Plank</span>' +
                '<span class="tile-images">' + twillPlankProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Mystic Plank</span>' +
                '<span class="tile-images">' + mysticProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Sandscript Major</span>' +
                '<span class="tile-images">' + sandScriptProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';
        }

        $('#tile-list').html(template);
        $('[data-toggle="tooltip"]').tooltip();
        jQuery(".single-tile-image").click(function(ret) {
            jQuery('#productBtn').html(`<img crossorigin="anonymous" src="${ret.target.src}"/><span>${ret.target.dataset.name}</span>`);
            vertCtx = verticalTempCanvas.getContext("2d");
            horiCtx = horizontalTempCanvas.getContext("2d");

            if (currentTileImageSource !== "") {
                horiCtx.rotate(-Math.PI / 2);
                horiCtx.translate(-verticalTempCanvas.width / 2, -verticalTempCanvas.height / 2);
                horiCtx.clearRect(0, 0, 450, 450);
            }

            console.log(ret.target.dataset.cat);

            currentTileSize = ret.target.dataset.size;
            currentProCat = ret.target.dataset.cat;
            currentTileColor = ret.target.dataset.color;
            currentTileWeight = ret.target.dataset.weight;
            currentTileThickness = ret.target.dataset.thickness;


            currentTileImageSource = ret.target.src;
            currentTileImageID = ret.target.dataset.slug;
            currentTileImageSKU = ret.target.dataset.sku;
            currentTileImageName = ret.target.dataset.name;
            currentTileProductID = ret.target.dataset.productId;
            currentTileProductCartURL = ret.target.dataset.addToCartUrl;
            currentTileAvailability = ret.target.dataset.availability;

            // verticalTempCanvas.clear();
            // horizontalTempCanvas.clear();
            vertCtx.clearRect(0, 0, 450, 450);

            // horiCtx.clearRect(0, 0, 450, 450);

            var vertImage = new Image();
            vertImage.onload = startVert;
            vertImage.setAttribute('crossorigin', 'anonymous');

            vertImage.src = currentTileImageSource;

            function startVert() {
                vertCtx.drawImage(vertImage, 0, 0);
            }

            horiCtx.translate(
                verticalTempCanvas.width / 2,
                verticalTempCanvas.height / 2
            );

            // roate the canvas by +90% (==Math.PI/2)
            horiCtx.rotate(Math.PI / 2);

            // draw the signature
            // since images draw from top-left offset the draw by 1/2 width & height
            var horizontalImage = new Image();
            horizontalImage.onload = startHorizontal;
            horizontalImage.setAttribute('crossorigin', 'anonymous');
            horizontalImage.src = currentTileImageSource;

            function startHorizontal() {
                horiCtx.drawImage(
                    horizontalImage, -verticalTempCanvas.width / 2, -horizontalImage.height / 2
                );
            }
        });
    }

    function setupGalleryImage(key) {
        if (key == 'hospitality') {
            $('.configurator-item').removeClass('active');
            $("#hospitalityBtn").parent().addClass('active');
        }

        let canvas = document.getElementById('others-div').getElementsByClassName('lower-canvas')[0];
        let canvas1 = document.getElementById('hospitality');
        let setupObj = galleryImgs[key];

        for (const prop in galleryImgs) {
            galleryImgs[prop].isVisible = false;
            $('#' + prop)[0].style.display = "none";
        }

        setupObj.isVisible = true;
        $('#' + key)[0].style.display = "block";


        let generatedImage = canvas.toDataURL();

        // console.log(canvas1.toDataURL());

        $('#' + key + ' img')[0].src = generatedImage || "https://www.publicdomainpictures.net/download-picture.php?id=28763&check=40d0c7d2a335794339b3a2023655e58f";
        $('#' + key + ' img')[0].style.transform = setupObj.transform;
    }

    $("#hospitalityBtn").on('click', function() {
        $('.configurator-item').removeClass('active');
        $(this).parent().addClass('active');
        setupGalleryImage('hospitality')
    });
    $("#workspaceBtn").on('click', function() {
        $('.configurator-item').removeClass('active');
        $(this).parent().addClass('active');
        setupGalleryImage('workspace')
    });
    $("#publicspaceBtn").on('click', function() {
        $('.configurator-item').removeClass('active');
        $(this).parent().addClass('active');
        setupGalleryImage('publicspace')
    });
    $("#myphotoBtn").on('click', function() {
        $('.configurator-item').removeClass('active');
        $(this).parent().addClass('active');
        setupGalleryImage('myphoto')
    });

    $('#tabList').on('shown.bs.tab', function(e) {});



    //// END
    // document.getElementById('abcd').addEventListener('click',function(){ handleGridSelector(selectedProduct, currentTileImageSource)});
    var selectedProduct = "";
    var currentTileImageSource = "";
    var currentTileImageID = "";
    var rectArray = [];
    var actionArray = [];
    var currentAngle = 0;

    // The crop function
    var crop = function(url, offsetX, offsetY, width, height) {
        var ctx;
        // if (currentAngle == 0) {
        //     ctx = verticalTempCanvas.getContext("2d");
        // } else {
        //     ctx = horizontalTempCanvas.getContext("2d");
        // }
        ctx = verticalTempCanvas.getContext("2d");
        var imgData = ctx.getImageData(offsetX, offsetY, width, height);
        // create an in-memory canvas
        var buffer = document.createElement("canvas");
        var b_ctx = buffer.getContext("2d");
        // set its width/height to the required ones
        buffer.width = width;
        buffer.height = height;
        b_ctx.putImageData(imgData, 0, 0);
        // draw the main canvas on our buffer one
        // drawImage(source, source_X, source_Y, source_Width, source_Height,
        //  dest_X, dest_Y, dest_Width, dest_Height)
        // b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
        //     0, 0, buffer.width, buffer.height);
        // now call the callback with the dataURL of our buffer canvas
        return buffer.toDataURL();
    };

    jQuery(".product-pattern").on("click", function(event) {
        canvas.clear();

        jQuery(".product-pattern").removeClass('selected');
        jQuery(this).addClass('selected');
        var id = jQuery(this).data('id');
        $('#arrangementBtn').html(`<img crossorigin="anonymous" src="${arrangements[id].icon}" height="40" width="40" /><span>${arrangements[id].name.substr(10)}</span>`);
        $('#productBtn').html(`Select`);
        calculateSelectedTiles();
        handleGridSelector(event.currentTarget.dataset.pattern);
        $('#printPDF,#printPDFLabel').hide();
    });

    jQuery('.set-angle').on('click', function() {
        currentAngle = $(this).data('angle');
        jQuery(".set-angle").removeClass('active');
        jQuery(this).addClass('active');
    });

    jQuery("#fillAll").on("click", function(ret) {
        canvas.clear();
        selectedProduct = jQuery('.product-pattern.selected')[0].dataset.pattern;
        handleGridSelector(selectedProduct);
        fillAll();
    });

    jQuery("#undo").on("click", function(ret) {

        var h = [];
        if (canvas._objects.length > 0) {
            h.push(canvas._objects.pop());
            canvas.renderAll();
            calculateSelectedTiles();
        }
        setupGalleryImage('hospitality');
    });

    jQuery("#clear").on("click", function(ret) {
        actionArray = [];
        canvas.clear();
        selectedProduct = jQuery('.product-pattern.selected')[0].dataset.pattern;
        handleGridSelector(selectedProduct);
        document.getElementById("selected-product-list").innerHTML = "";
        document.getElementById("printPDF").style.display = "none";
        document.getElementById("printPDFLabel").style.display = "none";
        setupGalleryImage('hospitality');
    });

    jQuery("#rotate").on("click", function(ret) {
        if (currentAngle == 270) {
            currentAngle = 0;
        } else {
            currentAngle = currentAngle + 90;
        }

        setupGalleryImage('hospitality');
    });

    const grid = 50 * 1.5;

    var canvas = new fabric.Canvas("c", {
        selection: false
    });

    var verticalTempCanvas = new fabric.Canvas("tempV", {
        selection: false
    });

    var horizontalTempCanvas = new fabric.Canvas("tempH", {
        selection: false
    });

    function handleGridSelector(selectedProduct, selectedTile = null) {
        rectArray = [];
        $('#d_vertical').trigger('click');
        switch (selectedProduct) {
            case "square":
                $('p.title').show();
                $('.right-control p.title').hide();
                $('.left-control').removeAttr('style');
                createProductDropdown('square');
                createSquareMonolithic(selectedTile);
                break;
            case "v-ashlar":
                $('p.title').show();
                $('.right-control p.title').hide();
                $('.left-control').removeAttr('style');
                createProductDropdown('square');
                createVerticalSquareAshlar(selectedTile);
                break;
            case "h-ashlar":
                $('p.title').show();
                $('.right-control p.title').hide();
                $('.left-control').removeAttr('style');
                createProductDropdown('square');
                createHorizontalSquareAshlar(selectedTile);
                break;
            case "plank-monolithic":
                $('p.title').hide();
                $('.right-control p.title').show();
                $('.left-control').css({
                    'opacity': 0,
                    'visibility': 'hidden',
                    'z-index': '-1111px'
                });
                createProductDropdown('plank');
                createPlankMonolithic(selectedTile);
                break;
            case "plank-ashlar":
                $('p.title').hide();
                $('.right-control p.title').show();
                $('.left-control').css({
                    'opacity': 0,
                    'visibility': 'hidden',
                    'z-index': '-1111px'
                });
                createProductDropdown('plank');
                createPlankAshlar(selectedTile);
                break;
            case 'herringbone':
                console.log('here');
                $('p.title').hide();
                $('.right-control p.title').show();
                $('.left-control').css({
                    'opacity': 0,
                    'visibility': 'hidden',
                    'z-index': '-1111px'
                });
                createProductDropdown('plank');
                createHerringbone(selectedTile);
                break;
            default:
                createSquareMonolithic(selectedTile);
        }
    }

    function createHerringbone(tileImage = null) {

        canvas.clear();
        const grid = 25 * 2;
        let canvasDiagonal = Math.sqrt((globalWidth * globalWidth) + (globalWidth * globalWidth));
        let tileDiagonal = Math.sqrt((grid * grid) + (grid * grid));
        let tileHeight = grid * 3;
        for (let i = 0; i < canvasDiagonal / tileDiagonal; i++) {
            let rect1 = new fabric.Rect({
                width: grid * 3,
                height: grid,
                hasControls: false,
                selectable: false,
                top: i * grid,
                left: i * grid,
                stroke: 0.5,
                opacity: 0.2,
                fill: "rgba(0,0,0,0)"
            });
            rectArray.push(rect1);
            rect1.on("mousedown", function(event) {
                handleAddTile(event.target);
            });
            canvas.add(rect1);
            let rect2 = new fabric.Rect({
                width: grid,
                height: grid * 3,
                hasControls: false,
                selectable: false,
                top: (i * grid) + grid,
                left: i * grid,
                stroke: 0.5,
                opacity: 0.2,
                fill: "rgba(0,0,0,0)"
            });
            rectArray.push(rect2);
            rect2.on("mousedown", function(event) {
                handleAddTile(event.target);
            });
            canvas.add(rect2);

            for (let j = 1; j <= 3; j++) {
                let rect1 = new fabric.Rect({
                    width: grid * 3,
                    height: grid,
                    hasControls: false,
                    selectable: false,
                    left: (grid * i) - ((tileHeight - grid) * j),
                    top: (grid * i) + ((grid + tileHeight) * j),
                    stroke: 0.5,
                    opacity: 0.2,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect1);
                rect1.on("mousedown", function(event) {
                    handleAddTile(event.target);
                });
                canvas.add(rect1);
                let rect2 = new fabric.Rect({
                    width: grid,
                    height: grid * 3,
                    hasControls: false,
                    selectable: false,
                    left: (grid * i) - ((tileHeight - grid) * j),
                    top: (grid * i) + ((grid + tileHeight) * j) + grid,
                    stroke: 0.5,
                    opacity: 0.2,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect2);
                rect2.on("mousedown", function(event) {
                    handleAddTile(event.target);
                });
                canvas.add(rect2);
                let rect3 = new fabric.Rect({
                    width: grid * 3,
                    height: grid,
                    hasControls: false,
                    selectable: false,
                    left: (grid * i) + ((tileHeight - grid) * j),
                    top: (grid * i) - ((grid + tileHeight) * j),
                    stroke: 0.5,
                    opacity: 0.2,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect3);
                rect3.on("mousedown", function(event) {
                    handleAddTile(event.target);
                });
                canvas.add(rect3);
                let rect4 = new fabric.Rect({
                    width: grid,
                    height: grid * 3,
                    hasControls: false,
                    selectable: false,
                    left: (grid * i) + ((tileHeight - grid) * j),
                    top: (grid * i) - ((grid + tileHeight) * j) + grid,
                    stroke: 0.5,
                    opacity: 0.2,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect4);
                rect4.on("mousedown", function(event) {
                    handleAddTile(event.target);
                });
                canvas.add(rect4);
            }
        }

        if (tileImage !== null) {
            fillAll();
        }

    }

    // Create square monolithic
    function createSquareMonolithic(tileImage = null) {
        const grid = 50 * 1.5;

        for (var i = 0; i <= globalWidth / grid; i++) {
            for (var j = 0; j <= globalWidth / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        left: i * grid,
                        stroke: 1,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        stroke: 1,
                        left: i * grid,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                }
            }
        }

        if (tileImage !== null) {
            fillAll();
        }
    }

    // PLANK MONOLITHIC
    function createPlankMonolithic(tileImage) {
        const grid = 25 * 2;
        for (var i = 0; i <= globalWidth / grid; i++) {
            for (var j = 0; j <= globalWidth / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3),
                        left: i * grid,
                        stroke: 1,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3),
                        stroke: 1,
                        left: i * grid,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                }
            }
        }

        if (tileImage !== null) {
            fillAll();
        }
    }

    // HORIZONTAL ASHLAR
    function createHorizontalSquareAshlar(tileImage = null) {
        const grid = 50 * 1.5;
        // canvas.clear();
        document.getElementById("others-div").style.display = "block";
        for (var i = 0; i <= globalWidth / grid; i++) {
            for (var j = 0; j <= globalWidth / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        hasControls: false,
                        selectable: false,
                        top: j * grid,
                        left: i * grid,
                        stroke: 2,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)"
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        stroke: 2,
                        left: i * grid - 25 * 1.5,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                }
            }
        }

        if (tileImage !== null) {
            fillAll();
        }
    }

    function fillAll() {
        fill(rectArray, 0, rectArray.length);
        setupGalleryImage('hospitality');
    }

    function fill(o, i, l) {
        var g = false;
        if (i < l) {
            g = handleAddTile(o[i]);
            setTimeout(function() {
                if (g) {
                    i = i + 1;
                    fill(o, i, l);
                }
            }, 300);
        }
    }

    function handleAddTile(target) {
        if ($('#productBtn').text() != 'Select') {
            // console.log(target);
            const { left, top, height, width } = target;
            var tempLeft1 = left;
            var tempTop1 = top;
            var tempHeight1 = height;
            var tempWidth1 = width;
            var tempWidth = 600;
            var tempHeight = 600;
            if (target.width > target.height) {
                $('#d_horizontal').trigger('click');
                tempLeft1 = left + 50;
                tempTop1 = top - 50;
                tempWidth1 = height;
                tempHeight1 = width;
                tempWidth = 600;
                tempHeight = 2000;
            } else if (target.width < target.height) {
                $('#d_vertical').trigger('click');
                tempWidth = 600;
                tempHeight = 2000;
            }

            tempLeft =
                (Math.floor(Math.random() * (tempWidth / tempWidth1) - 1) + 1) * tempWidth1;
            tempTop =
                (Math.floor(Math.random() * (tempHeight / tempHeight1) - 1) + 1) * tempHeight1;

            var m = 3;

            fabric.Image.fromURL(
                // $('#productBtn img').attr('src'),
                crop(verticalTempCanvas, tempLeft, tempTop, tempWidth1 * m, tempHeight1 * m),
                function(myImg) {
                    var img1 = myImg.set({
                        top: tempTop1,
                        left: tempLeft1,
                        product: currentTileImageID,
                        currentProCat: currentProCat,
                        productSize: currentTileSize,
                        productWeight: currentTileWeight,
                        productThickness: currentTileThickness,
                        productColor: currentTileColor,
                        productSKU: currentTileImageSKU,
                        productName: currentTileImageName,
                        productURL: currentTileProductCartURL,
                        productID: currentTileProductID,
                        productAvail: currentTileAvailability,
                        evented: true,
                        hasControls: false,
                        selectable: false
                    });

                    img1.crossOrigin = 'anonymous';

                    img1.on("mousedown", function(event) {
                        event.target.width = width;
                        event.target.height = height;
                        event.target.left = left;
                        event, target.top = top;
                        handleImageTileClick(event.target);
                    });

                    img1.scaleToHeight(tempHeight1);
                    img1.scaleToWidth(tempWidth1);
                    img1.rotate(currentAngle);
                    canvas.add(img1);
                    actionArray.push(
                        JSON.stringify(
                            canvas.toDatalessJSON([
                                "productURL",
                                "productID",
                                "product",
                                "currentProCat",
                                "productSize",
                                "productWeight",
                                "productColor",
                                "productThickness",
                                "productSKU",
                                "productName",
                                "productAvail",
                                "selectable",
                                "hasControls",
                                "mousedown"
                            ])
                        )
                    );

                    calculateSelectedTiles();
                }, { crossOrigin: 'anonymous' }
            );
            setupGalleryImage('hospitality');
            return true;
        }

    }

    function calculateSelectedTiles() {
        var tilesTemp = _.filter(
            canvas.toDatalessJSON([
                "productURL",
                "productID",
                "product",
                "currentProCat",
                "productSKU",
                "productSize",
                "productWeight",
                "productColor",
                "productThickness",
                "productName",
                "productAvail",
                "selectable",
                "hasControls",
                "mousedown"
            ]).objects,
            function(o) {
                return o.type === "image";
            }
        );


        var obj = {};

        for (var i = 0, len = tilesTemp.length; i < len; i++)
            obj[tilesTemp[i]['product']] = tilesTemp[i];

        tilesFinal = new Array();

        for (var key in obj) {
            obj[key].imgSrc = $('img[data-product-id="' + obj[key].productID + '"]').attr('src');
            tilesFinal.push(obj[key]);
        }

        var template = jQuery("#handlebars-demo").html();

        var context = {
            tilesFinal: tilesFinal
        };

        // Making product list global
        window.tilesFinal = tilesFinal;

        //Compile the template data into a function
        var templateScript = Handlebars.compile(template);

        var html = templateScript(context);
        document.getElementById("selected-product-list").innerHTML = html;
        if (html) {
            document.getElementById("printPDF").style.display = "block";
            document.getElementById("printPDFLabel").style.display = "block";
        } else {
            document.getElementById("printPDF").style.display = "none";
            document.getElementById("printPDFLabel").style.display = "none";
        }
        jQuery(".single_add_to_cart_button").click(function(event) {

            event.preventDefault();

            $thisbutton = jQuery(this);

            var product_id = $thisbutton.data("product_id");

            var data = {
                action: "ql_woocommerce_ajax_add_to_cart",

                product_id: product_id
            };

            jQuery.ajax({
                type: "post",

                url: wc_add_to_cart_params.ajax_url,

                data: data,

                beforeSend: function(response) {
                    $thisbutton.removeClass("added").addClass("loading");
                },

                complete: function(response) {
                    $thisbutton.addClass("added").removeClass("loading");
                },

                success: function(response) {
                    if (response.error & response.product_url) {
                        window.location = response.product_url;

                        return;
                    } else {
                        jQuery.each(response.fragments, function(key, value) {
                            jQuery(key).replaceWith(value);
                        });

                        jQuery(document.body).trigger("added_to_cart", [
                            response.fragments,
                            response.cart_hash,
                            $thisbutton
                        ]);
                    }
                }
            });
        });
        if (tilesFinal.length == 0) {
            document.getElementById("printPDF").style.display = "none";
            document.getElementById("printPDFLabel").style.display = "none";
        }
    }

    function handleImageTileClick(target) {
        var tempTarget = target;
        canvas.remove(target);
        handleAddTile(tempTarget);
    }

    // VERTICAL ASHLAR
    function createVerticalSquareAshlar(tileImage = null) {
        const grid = 50 * 1.5;

        for (var i = 0; i <= globalWidth / grid; i++) {
            for (var j = 0; j <= globalWidth / grid; j++) {
                if (i % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        left: i * grid,
                        stroke: 2,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid - 25 * 1.5,
                        stroke: 2,
                        left: i * grid,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                }
            }
        }

        if (tileImage !== null) {
            fillAll();
        }
    }

    // // PLANK ASHLAR
    function createPlankAshlar(tileImage = null) {
        const grid = 25 * 2;
        for (var i = 0; i <= globalWidth / grid; i++) {
            for (var j = 0; j <= globalWidth / grid; j++) {
                if (i % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3),
                        left: i * grid,
                        stroke: 2,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3) - (grid * 3) / 2,
                        stroke: 2,
                        left: i * grid,
                        opacity: 0.2,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function(event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                }
            }
        }

        if (tileImage !== null) {
            fillAll();
        }
    }

    jQuery(".btn-pref .btn").click(function() {
        jQuery(".btn-pref .btn")
            .removeClass("btn-primary")
            .addClass("btn-default");
        // jQuery(".tab").addClass("active"); // instead of this do the below
        jQuery(this)
            .removeClass("btn-default")
            .addClass("btn-primary");
    });

    handleGridSelector(jQuery('.product-pattern')[0].dataset.pattern);
    setupGalleryImage('hospitality');

    jQuery('a[href="#tab2default"]').on('click', function() {
        setupGalleryImage('hospitality');
    });


});