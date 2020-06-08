var $ = jQuery;
let arrangements = [{
    name: "50 x 50cm Square Monolithic",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrangement-square-monolithic.png",
    dataPattern: "square"
},
{
    name: "50 x 50cm Square Vertical Ashlar",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrangement-square-vert-ashlar.png",
    dataPattern: "v-ashlar"
},
{
    name: "50 x 50cm Square Horizontal Ashlar",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrange-square-horiz-ashlar.png",
    dataPattern: "h-ashlar"
},
{
    name: "25 x 75cm Plank Monolithic",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrangement-plank-monolithic.png",
    dataPattern: "plank-monolithic"
},
{
    name: "25 x 75cm Plank Ashlar",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrangement-plank-ashlar.png",
    dataPattern: "plank-ashlar"
},
{
    name: "25 x 75cm Plank Herringbone",
    icon: "https://wayflorusa.com/wf2/wp-content/uploads/2020/02/arrangement-plank-herringbone.png",
    dataPattern: "herringbone"
}
];
function setArrangement(id) {
    $('#arrangementBtn').html(`<img src="${arrangements[id].icon}" height="40" width="40" /><span>${arrangements[id].name.substr(10)}</span>`);
}
jQuery(document).ready(function () {


    let logo = null;
    function getDataUri(url, callback) {
        let image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);
            // Get raw image data
            callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }

    getDataUri("https://whd.nju.mybluehost.me/wayflor-usa/wp-content/uploads/2019/11/Wayflor-Logo-RGB-200.png", function (dataUri) {
        logo = dataUri;
    });

    function getTilesDetails(arr) {
        if (arr.lentgh === 0) {
            return "";
        }

        let result = arr.map(el => [{
            alignments: ['right'],
            style: 'label',
            columns: [{
                width: 30,
                height: 90,
                image: el.src
            },
            ['STYLE', 'SHAPE', 'CODE', 'COLOR', 'SIZE', 'THICKNESS', 'WEIGHT', 'AVAILIBILITY'],
            ['STYLE', 'SHAPE', el.productSKU, el.productColor, el.productSize, el.productThickness, el.productWeight, 'AVAILIBILITY']
            ]
        }, '\n']);

        return result;
    }

    function downloadPDF() {
        // playground requires you to assign document definition to a variable called dd
        let canvas = document.getElementById('others-div').getElementsByClassName('lower-canvas')[0];
        let generatedImage = canvas.toDataURL();

        let dd = {
            content: [{
                alignments: ['left', 'right'],
                columns: [
                    [{
                        width: 150,
                        image: logo
                    },
                        '\n\n\n\n',
                    getTilesDetails(window.tilesFinal)
                    ],
                    {
                        width: 300,
                        height: 300,
                        image: generatedImage
                    }]
            }],
            styles: {
                label: {
                    fontSize: 10,
                    color: 'grey'
                }
            },
            defaultStyle: {
                columnGap: 20
            }
        };
        pdfMake.createPdf(dd).download();
    };

    $("#printPDF").on("click", downloadPDF);





    let arrangementsHTML = "";

    $('#arrangementBtn').html(`<img src="${arrangements[0].icon}" height="40" width="40" /><span>${arrangements[0].name.substr(10)}</span>`);

    arrangements.map(({ name, icon, dataPattern }, index) => {
        arrangementsHTML += `<li style="cursor:pointer" onclick="setArrangement(${index})"><a class="product-pattern" data-pattern="${dataPattern}"><img src="${icon}" height="40" width="40" /><span>${name}</span></a></li>`;
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
        let tiles = $('#pseudoTileList img');
        let template = "";
        let twillProducts = [];
        let shadowcreteProducts = [];
        let marbleridgeProducts = [];
        let mysticProducts = [];

        tiles.map(tileIndex => {
            if (tiles[tileIndex].dataset.name.includes('Twill')) twillProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.name.includes('Shadowcrete')) shadowcreteProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.name.includes('Marbleridge')) marbleridgeProducts.push(tiles[tileIndex]);
            if (tiles[tileIndex].dataset.name.includes('Mystic')) mysticProducts.push(tiles[tileIndex]);
        });

        if (productType === "square") {
            template += '<li class="tile-item">' +
                '<span class="tile-category">Twill</span>' +
                '<span class="tile-images">' + twillProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Shadowcrete</span>' +
                '<span class="tile-images">' + shadowcreteProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Marbleridge</span>' +
                '<span class="tile-images">' + marbleridgeProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';
        } else {
            template += '<li class="tile-item">' +
                '<span class="tile-category">Twill</span>' +
                '<span class="tile-images">' + twillProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';

            template += '<li class="tile-item">' +
                '<span class="tile-category">Mystic</span>' +
                '<span class="tile-images">' + mysticProducts.map(product => getHTML(product, true)).join('') + '</span>' +
                '</li>';
        }

        $('#tile-list').html(template);
        jQuery(".single-tile-image").click(function (ret) {
            jQuery('#productBtn').html(`<img src="${ret.target.src}"/><span>${ret.target.dataset.name}</span>`);
            var vertCtx = verticalTempCanvas.getContext("2d");
            var horiCtx = horizontalTempCanvas.getContext("2d");

            if (currentTileImageSource !== "") {
                horiCtx.rotate(-Math.PI / 2);
                horiCtx.translate(
                    -verticalTempCanvas.width / 2,
                    -verticalTempCanvas.height / 2
                );
                horiCtx.clearRect(0, 0, 450, 450);
            }

            currentTileSize = ret.target.dataset.size;
            currentTileColor = ret.target.dataset.color;
            currentTileWeight = ret.target.dataset.weight;
            currentTileThickness = ret.target.dataset.thickness;


            currentTileImageSource = ret.target.src;
            currentTileImageID = ret.target.dataset.slug;
            currentTileImageSKU = ret.target.dataset.sku;
            currentTileImageName = ret.target.dataset.name;
            currentTileProductID = ret.target.dataset.productId;
            currentTileProductCartURL = ret.target.dataset.addToCartUrl;

            // verticalTempCanvas.clear();
            // horizontalTempCanvas.clear();
            vertCtx.clearRect(0, 0, 450, 450);

            // horiCtx.clearRect(0, 0, 450, 450);

            var vertImage = new Image();
            vertImage.onload = startVert;

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
            horizontalImage.src = currentTileImageSource;

            function startHorizontal() {
                horiCtx.drawImage(
                    horizontalImage,
                    -verticalTempCanvas.width / 2,
                    -horizontalImage.height / 2
                );
            }
        });
    }



    $('#productBtn').html(`<img src="${$('#pseudoTileList img')[0].src}"/><span>${$('#pseudoTileList img')[0].dataset.name}</span>`);

    function setupGalleryImage(key) {
        let canvas = document.getElementById('others-div').getElementsByClassName('lower-canvas')[0];
        let setupObj = galleryImgs[key];

        for (const prop in galleryImgs) {
            galleryImgs[prop].isVisible = false;
            $('#' + prop)[0].style.display = "none";
        }

        setupObj.isVisible = true;
        $('#' + key)[0].style.display = "block";


        let generatedImage = canvas.toDataURL();

        $('#' + key + ' img')[0].src = generatedImage || "https://www.publicdomainpictures.net/download-picture.php?id=28763&check=40d0c7d2a335794339b3a2023655e58f";
        $('#' + key + ' img')[0].style.transform = setupObj.transform;
    }

    $("#hospitalityBtn").on('click', function () { setupGalleryImage('hospitality') });
    $("#workspaceBtn").on('click', function () { setupGalleryImage('workspace') });
    $("#publicspaceBtn").on('click', function () { setupGalleryImage('publicspace') });
    $("#myphotoBtn").on('click', function () { setupGalleryImage('myphoto') });

    $('#tabList').on('shown.bs.tab', function (e) {
    });



    //// END
    // document.getElementById('abcd').addEventListener('click',function(){ handleGridSelector(selectedProduct, currentTileImageSource)});
    var selectedProduct = "";
    var currentTileImageSource = "";
    var currentTileImageID = "";
    var rectArray = [];
    var actionArray = [];
    var currentAngle = 0;

    // The crop function
    var crop = function (canvas, offsetX, offsetY, width, height) {
        var ctx;
        if (currentAngle == 0) {
            ctx = verticalTempCanvas.getContext("2d");
        } else {
            ctx = horizontalTempCanvas.getContext("2d");
        }
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

    jQuery(".product-pattern").on("click", function (event) {
        canvas.clear();
        rectArray = [];
        selectedProduct = event.currentTarget.dataset.pattern;
        handleGridSelector(event.currentTarget.dataset.pattern);
    });

    jQuery("#d_horizontal").on("click", function (event) {
        currentAngle = 90;
        if (this.style.filter === "none") {
            this.style.filter = "brightness(.5) invert(1.5)";
        } else {
            this.style.filter = "none";
        }
        jQuery("#d_vertical")[0].style.filter = "none";
    });

    jQuery("#d_vertical").on("click", function (event) {
        currentAngle = 0;
        if (this.style.filter === "none") {
            this.style.filter = "brightness(.5) invert(1.5)";
        } else {
            this.style.filter = "none";
        }
        jQuery("#d_horizontal")[0].style.filter = "none";
    });



    jQuery("#fillAll").on("click", function (ret) {
        handleGridSelector(selectedProduct, currentTileImageSource, true);
        setupGalleryImage('hospitality');
    });

    jQuery("#undo").on("click", function (ret) {
        canvas.loadFromJSON(actionArray[actionArray.length - 2], function () {
            var objects = canvas.getObjects();
            objects.map(obj => {
                obj.on("mousedown", function (event) {
                    handleAddTile(event.target);
                });
            });
            actionArray.pop();
            canvas.renderAll();

            calculateSelectedTiles();
        });
        setupGalleryImage('hospitality');
    });

    jQuery("#clear").on("click", function (ret) {
        actionArray = [];
        canvas.clear();
        handleGridSelector(selectedProduct);
        document.getElementById("selected-product-list").innerHTML = "";
        document.getElementById("printPDF").style.display = "none";
        document.getElementById("printPDFLabel").style.display = "none";
        setupGalleryImage('hospitality');
    });

    jQuery("#rotate").on("click", function (ret) {
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
        switch (selectedProduct) {
            case "square":
                createProductDropdown('square');
                createSquareMonolithic(selectedTile);
                break;
            case "v-ashlar":
                createProductDropdown('square');
                createVerticalSquareAshlar(selectedTile);
                break;
            case "h-ashlar":
                createProductDropdown('square');
                createHorizontalSquareAshlar(selectedTile);
                break;
            case "plank-monolithic":
                createProductDropdown('plank');
                createPlankMonolithic(selectedTile);
                break;
            case "plank-ashlar":
                createProductDropdown('plank');
                createPlankAshlar(selectedTile);
                break;
            case 'herringbone':
                createProductDropdown('plank');
                createHerringbone(selectedTile);
                break;
            default:
                createSquareMonolithic(selectedTile);
        }
    }

    function createHerringbone(tileImage = null) {
        canvas.clear();
        const grid = 25 * 1.5;
        let canvasDiagonal = Math.sqrt((600 * 600) + (600 * 600));
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
                stroke: 2,
                opacity: 1,
                fill: "rgba(0,0,0,0)"
            });
            rectArray.push(rect1);
            rect1.on("mousedown", function (event) {
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
                stroke: 2,
                opacity: 1,
                fill: "rgba(0,0,0,0)"
            });
            rectArray.push(rect2);
            rect2.on("mousedown", function (event) {
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
                    stroke: 2,
                    opacity: 1,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect1);
                rect1.on("mousedown", function (event) {
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
                    stroke: 2,
                    opacity: 1,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect2);
                rect2.on("mousedown", function (event) {
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
                    stroke: 2,
                    opacity: 1,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect3);
                rect3.on("mousedown", function (event) {
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
                    stroke: 2,
                    opacity: 1,
                    fill: "rgba(0,0,0,0)"
                });
                rectArray.push(rect4);
                rect4.on("mousedown", function (event) {
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

        for (var i = 0; i <= 600 / grid; i++) {
            for (var j = 0; j <= 600 / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        left: i * grid,
                        stroke: 2,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
                        handleAddTile(event.target);
                    });
                    canvas.add(rect);
                } else {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        stroke: 2,
                        left: i * grid,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
        const grid = 25 * 1.5;
        for (var i = 0; i <= 600 / grid; i++) {
            for (var j = 0; j <= 600 / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3),
                        left: i * grid,
                        stroke: 1,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
        for (var i = 0; i <= 600 / grid; i++) {
            for (var j = 0; j <= 600 / grid; j++) {
                if (j % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        hasControls: false,
                        selectable: false,
                        top: j * grid,
                        left: i * grid,
                        stroke: 2,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)"
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
        var objs = [];
        var objs = rectArray.map(function (o) {
            currentAngle = o.width >= o.height ? 90 : 0;
            handleAddTile(o);
            return o.set("active", true);
        });

        setupGalleryImage('hospitality');
    }

    function handleAddTile(target) {
        const { left, top, height, width } = target;
        var tempLeft = 0;
        var tempTop = 0;

        if (currentAngle == 0) {
            var tempWidth = 300;
            var tempHeight = 450;
            tempLeft =
                (Math.floor(Math.random() * (tempWidth / width) - 1) + 1) * width;
            tempTop =
                (Math.floor(Math.random() * (tempHeight / height) - 1) + 1) * height;
        }

        if (currentAngle == 90) {
            var tempWidth = 450;
            var tempHeight = 300;

            tempLeft =
                (Math.floor(Math.random() * (tempWidth / width) - 1) + 1) * width;
            tempTop =
                (Math.floor(Math.random() * (tempHeight / height) - 1) + 1) * height;
        }

        fabric.Image.fromURL(
            crop(verticalTempCanvas, tempLeft, tempTop, width, height),
            function (myImg) {
                var img1 = myImg.set({
                    top: top,
                    left: left,
                    product: currentTileImageID,
                    productSize: currentTileSize,
                    productWeight: currentTileWeight,
                    productThickness: currentTileThickness,
                    productColor: currentTileColor,
                    productSKU: currentTileImageSKU,
                    productName: currentTileImageName,
                    productURL: currentTileProductCartURL,
                    productID: currentTileProductID,
                    evented: true,
                    hasControls: false,
                    selectable: false
                });

                img1.on("mousedown", function (event) {
                    handleImageTileClick(event.target);
                });

                canvas.add(img1);
                actionArray.push(
                    JSON.stringify(
                        canvas.toDatalessJSON([
                            "productURL",
                            "productID",
                            "product",
                            "productSize",
                            "productWeight",
                            "productColor",
                            "productThickness",
                            "productSKU",
                            "productName",
                            "selectable",
                            "hasControls",
                            "mousedown"
                        ])
                    )
                );

                calculateSelectedTiles();
            }
        );
        setupGalleryImage('hospitality');
    }

    function calculateSelectedTiles() {
        var tilesTemp = _.filter(
            canvas.toDatalessJSON([
                "productURL",
                "productID",
                "product",
                "productSKU",
                "productSize",
                "productWeight",
                "productColor",
                "productThickness",
                "productName",
                "selectable",
                "hasControls",
                "mousedown"
            ]).objects,
            function (o) {
                return o.type === "image";
            }
        );


        var tilesFinal = _.uniqBy(tilesTemp, "product");
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
        document.getElementById("printPDF").style.display = "block";
        document.getElementById("printPDFLabel").style.display = "block";
        jQuery(".single_add_to_cart_button").click(function (event) {

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

                beforeSend: function (response) {
                    $thisbutton.removeClass("added").addClass("loading");
                },

                complete: function (response) {
                    $thisbutton.addClass("added").removeClass("loading");
                },

                success: function (response) {
                    if (response.error & response.product_url) {
                        window.location = response.product_url;

                        return;
                    } else {
                        jQuery.each(response.fragments, function (key, value) {
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
    }

    function handleImageTileClick(target) {
        var tempTarget = target;
        canvas.remove(target);
        handleAddTile(tempTarget);
    }

    // VERTICAL ASHLAR
    function createVerticalSquareAshlar(tileImage = null) {
        const grid = 50 * 1.5;

        for (var i = 0; i <= 600 / grid; i++) {
            for (var j = 0; j <= 600 / grid; j++) {
                if (i % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid,
                        top: j * grid,
                        left: i * grid,
                        stroke: 2,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
        const grid = 25 * 1.5;

        for (var i = 0; i <= 600 / grid; i++) {
            for (var j = 0; j <= 600 / grid; j++) {
                if (i % 2 == 0) {
                    var rect = new fabric.Rect({
                        width: grid,
                        height: grid * 3,
                        top: j * (grid * 3),
                        left: i * grid,
                        stroke: 2,
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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
                        opacity: 1,
                        fill: "rgba(0,0,0,0)",
                        hasControls: false,
                        selectable: false
                    });
                    rectArray.push(rect);
                    rect.on("mousedown", function (event) {
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

    jQuery(".btn-pref .btn").click(function () {
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
});