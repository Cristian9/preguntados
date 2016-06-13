var app = (function(){

    var estado,
        myScroll,
        myScrollMenu,
        numberPage = 1,
        loadingImage = {
            cargaOK : false,
            imageURL : "../../statics/img/ring.svg"
        },
        domainURL = "http://10.30.15.218/API_Preguntados";

    loadingImage.preload = new Image();
    loadingImage.preload.src = loadingImage.imageURL;
    loadingImage.preload.onload = loadingImage.cargaOK = true;

    function login() {
        var user = $('#txtuser').val();
        var pass = $('#txtpass').val();

        spinnerplugin.show();

        $.post(domainURL + "/login/", {
            user : user,
            pass : pass
        })
        .done(function(data) {
            var data = eval(data);
            if(!data) {
                $('#message').text('Error de inicio de sesion');
            } else {
                window.localStorage.setItem("name", data[0].firstname);

                var options = {
                    "direction"      : "right",
                    "duration"       :  600,
                    "iosdelay"       :   -1,
                    "androiddelay"   :  -1,
                    "winphonedelay"  :  150,
                    "href"           : "views/main-view/list-main.html"
                };
                window.plugins.nativepagetransitions.flip(
                    options,
                    function (msg) {console.log("success: " + msg)},
                    function (msg) {alert("error: " + msg)}
                );
            }
        });
        
    }

    function StyleApp(topParam) {
        var heightCuerpo=window.innerHeight-92/*46*/;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.auxCSS { position:absolute; z-index:2; left:0; top:' + 
                topParam + 'px; width:100%; height: ' + heightCuerpo + 'px; overflow:auto;}';

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function addClass( classname, element ) {
        var cn = element.className;
        if( cn.indexOf( classname ) != -1 ) {
            return;
        }
        if( cn != '' ) {
            classname = ' '+classname;
        }
        element.className = cn+classname;
    }

    function removeClass( classname, element ) {
        var cn = element.className;
        var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
        cn = cn.replace( rxp, '' );
        element.className = cn;
    }

    function InitmenuSlide() {
        estado = "cuerpo";

        StyleApp(92);

        $('#cuerpo').addClass('page center');
        $('#menuprincipal').css({'display' : 'block'}).addClass('page center');
        $('#wrapper').addClass('auxCSS');

        $.get('../opciones/opcion1.html')
        .done(function(data){
            $('#contenidoCuerpo').html(data);
        });

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('wrapper', { hideScrollbar: true });
        myScrollMenu = new iScroll('wrapperMenu', { hideScrollbar: true });
        
        new FastClick(document.body);
    }

    function menuSlide( opt ) {
        $('#cuerpo').addClass('page transition');

        if (opt == "menu") {
            if (estado == "cuerpo") {
                $('#cuerpo').removeClass('center').addClass('right');
                estado = "menuprincipal";
            } else {
                $('#cuerpo').removeClass('right').addClass('center');
                estado = "cuerpo";
            }
        } else {
            addClass('li-menu-activo' , document.getElementById("ulMenu").getElementsByTagName("li")[opt]);

            $.get("../opciones/opcion" + opt + ".html")
            .done(function(data) {
                $('#contenidoCuerpo').html(data);
            });

            myScroll.refresh();
            myScroll.scrollTo(0,0);

            $('#cuerpo').removeClass('right').addClass('center');
            estado = "cuerpo";

            setTimeout(function() {
                removeClass('li-menu-activo' , document.getElementById("ulMenu").getElementsByTagName("li")[opt]);
            }, 300);
        }
    }

    function loadMoreData(page){
        $('.tab-item').each(function(){
            if($(this).hasClass('active')){
                var href = $(this).attr('id');
                $.ajax({
                    type        : 'GET',
                    url         : domainURL + "/" + href + "/",
                    contentType : "application/json; charset=utf-8",
                    dataType    : "json",
                    data        : {
                        'page' : page
                    }
                })
                .done(function(data){
                    var data = eval(data);
                    var lista = "";
                    if(data[0] == null) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = 'No hay registros para mostrar.';
                        return false;
                    }
                    for (var i = 0; i < data.length; i++) {
                        lista += '<li class="item item-icon-left" alt="' + data[i].id + '">';
                        lista += '<i class="icon ion-ios-redo-outline"></i>' + data[i].description;
                        lista += '</li>';
                    }

                    $('#list').append(lista);
                    myScroll.refresh();
                });
            }
        });
    }

    function ScrollMove() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');   
        pullUpOffset = pullUpEl.offsetHeight;

        myScroll = new iScroll('wrapper', { 
            hideScrollbar: true,
            onRefresh : function(){
                if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Desliza para cargar...';
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Suelta para cargar...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Suelta para cargar...';
                    this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function () {
                if (pullDownEl.className.match('flip')) {

                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Cargando...';                
                    loadMoreData((++numberPage));
                }
            }
        });
    }

    function renderDefaultList(data) {
        var lista = '';

        for (var i = 0; i < data.length; i++) {
            lista += '<li class="item item-icon-left" alt="' + data[i].id + '">';
            lista += '<i class="icon ion-ios-redo-outline"></i>' + data[i].description;
            lista += '</li>';
        }

        return lista;
    }

    function renderRanking(data) {
        var lista = "";

        for (var i = 0; i < data.length; i++) {
            lista += '<div class="item item-button-right">' + data[i].usuario +  
                    '<button class="button button-positive">' + 
                    'RETAR' + 
                    '</button></div>';
        };

        return lista;
    }

    function getMainList(option) {

        var href = option.href,
            func = option.func,
            args = option.args || "";

        StyleApp(92);

        $('#wrapper').addClass('auxCSS');

        $('#list').html($("<center style='padding:11%;'></center>").append(loadingImage.preload));

        if(typeof myScroll != "undefined") {
            myScroll.destroy();
            myScroll = null;
            
            numberPage > 1 && (numberPage = 1);
        }

        $.ajax({
            type        : 'GET',
            url         : domainURL + "/" + href + "/" + args,
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            data        : {
                'page'  : numberPage
            }
        })
        .done(function(data){
            var data = eval(data);

            if(data[0] == null) {
                $('#list').html($("<center style='padding:11%; color:#B33831; font-size:15px; font-weight:bold;'></center>")
                          .append('No hay registros para mostrar'));

                return false;
            }

            var list = eval(func + "(data)");
            
            $('#list').html(list);

            $('#pullUp, #pullDown').removeClass('hide').addClass('show');

            ScrollMove();
        });
        
        new FastClick(document.body);
    }

    function transition( href, direction ) {
        spinnerplugin.show();
        
        var options = {
            "href" : href,
            "direction" : direction,
            "duration" : 600,
            "androiddelay" : 500,
            "iosdelay" : 500
        };

        window.plugins.nativepagetransitions.slide(
            options,
            function (msg) {console.log("success: " + msg)},
            function (msg) {alert("error: " + msg)}
        );
        new FastClick(document.body);
    }

    function TabNav() {
        $('.tab-item').each(function(){
            $(this).click(function(e){
                e.preventDefault();
                var uri = $(this).attr("href");
                $('#contenidoCuerpo').load("../" + uri + "/" + uri + ".html");
                $('.tab-item').not($(this)).removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    return {
        login           : login,
        getMainList     : getMainList,
        InitmenuSlide   : InitmenuSlide,
        menuSlide       : menuSlide,
        TabNav          : TabNav,
        transition      : transition
    };
})();