var app = (function () {

    var estado,
        myScroll,
        myScrollMenu,
        preload = {
            cargaOK: false,
            imageURL: "../img/ring.svg"
        };

    preload.imagen = new Image();
    preload.imagen.src = preload.imageURL;
    preload.imagen.onload = preload.cargaOK = true;

    function login() {
        var user = $('#txtuser').val();
        var pass = $('#txtpass').val();

        $.post("http://10.30.15.218/API_Preguntados/login/", {
            user: user,
            pass: pass
        })
        .done(function (data) {
            var data = eval(data);
            if (!data) {
                $('#message').text('Error de inicio de sesion');
            } else {
                window.localStorage.setItem("name", data[0].firstname);

                var options = {
                    "direction": "right", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
                    "duration": 600, // in milliseconds (ms), default 400
                    "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
                    "androiddelay": 70, // same as above but for Android, default 70
                    "winphonedelay": 150, // same as above but for Windows Phone, default 200
                    //"href"           : "main-view/list-courses.html"
                    "href": "ranking/ranking.html"
                };
                window.plugins.nativepagetransitions.flip(
                        options,
                        function (msg) {
                            console.log("success: " + msg)
                        },
                        function (msg) {
                            alert("error: " + msg)
                        }
                );
            }
        });
    }

    function StyleApp(topParam) {
        var heightCuerpo = window.innerHeight - 46;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.auxCSS { position:absolute; z-index:2; left:0; top:' +
                topParam + 'px; width:100%; height: ' + heightCuerpo + 'px; overflow:auto;}';

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function addClass(classname, element) {
        var cn = element.className;
        if (cn.indexOf(classname) != -1) {
            return;
        }
        if (cn != '') {
            classname = ' ' + classname;
        }
        element.className = cn + classname;
    }

    function removeClass(classname, element) {
        var cn = element.className;
        var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
        cn = cn.replace(rxp, '');
        element.className = cn;
    }

    function InitmenuSlide() {
        estado = "cuerpo";

        StyleApp(92);

        $('#cuerpo').addClass('page center');
        $('#menuprincipal').css({'display': 'block'}).addClass('page center');
        $('#wrapper').addClass('auxCSS');

        $.get('../opciones/opcion1.html')
        .done(function (data) {
            $('#contenidoCuerpo').html(data);
        });

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('wrapper', {hideScrollbar: true});
        myScrollMenu = new iScroll('wrapperMenu', {hideScrollbar: true});

        new FastClick(document.body);
    }

    function menuSlide(opt) {
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
            addClass('li-menu-activo', document.getElementById("ulMenu").getElementsByTagName("li")[opt]);

            $.get("../opciones/opcion" + opt + ".html")
            .done(function (data) {
                $('#contenidoCuerpo').html(data);
            });

            myScroll.refresh();
            myScroll.scrollTo(0, 0);

            $('#cuerpo').removeClass('right').addClass('center');
            estado = "cuerpo";

            setTimeout(function () {
                removeClass('li-menu-activo', document.getElementById("ulMenu").getElementsByTagName("li")[opt]);
            }, 300);
        }
    }

    function ListCourses() {

        StyleApp(45);

        $('#wrapper').addClass('auxCSS');
        $('#listaCursos').html($("<center style='padding:11%;'></center>").append(preload.imagen));
        /*$.mobile.loading('show', {
         text : 'Cargando...',
         textVisible : true,
         theme : 'a',
         textonly : false
         });*/

        $.ajax({
            type: 'GET',
            url: "http://10.30.15.218/API_Preguntados/list-courses/",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function (data) {
            var data = eval(data);
            var lista = '<div class="list">';
            for (var i = 0; i < data.length; i++) {
                lista += '<a class="item item-icon-left" href="#">';
                lista += '<i class="icon ion-ios-redo-outline"></i>' + data[i].title;
                lista += '</a>';
            }

            lista += '</div>';

            $('#listaCursos').html(lista);

            myScroll = new iScroll('wrapper', {hideScrollbar: true});
            //$.mobile.loading( "hide" );
        });

        new FastClick(document.body);
    }

    return {
        login: login,
        ListCourses: ListCourses,
        InitmenuSlide: InitmenuSlide,
        menuSlide: menuSlide
    };

})();