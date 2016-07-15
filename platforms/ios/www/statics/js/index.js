var app = (function(){

    var myScroll,
        timerInicial = 30,
        myScrollMenu,
        numberPage = 1,
        clearTimer,
        apiRestDomain = "http://10.30.15.218/API_Preguntados";

    String.prototype.ucfirst = function(){
        return this.charAt(0).toUpperCase() + this.substr(1);
    }

    function getYears() {
        var fecha = new Date();
        var year = fecha.getFullYear();
        var select = "";
        
        for(var init = 2015; init <= year; init++) {
            select += "<option value='" + init + "'>" + init + "</option>";
        }

        select += "</select>";

        $('#year select').append(select);
    }

    function login() {
        $('#message').text("");

        var user = $('#txtuser').val();
        var pass = $('#txtpass').val();

        if(user == "" || pass == "") {
            $('#message').text('Debe llenar los campos de usuario y password');
            return false;
        }

        spinnerplugin.show();

        $.post(apiRestDomain + "/login/", {
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
                    "duration"       :  200,
                    "iosdelay"       :   -1,
                    "androiddelay"   :  -1,
                    "winphonedelay"  :  150,
                    "href"           : "views/main-view/list-main.html"
                };
                window.plugins.nativepagetransitions.fade(
                    options,
                    function (msg) {console.log("success: " + msg)},
                    function (msg) {alert("error: " + msg)}
                );
            }
        });
        
    }

    function StyleApp(topParam, heightParam) {
        var heightCuerpo=window.innerHeight-heightParam;//92/*46*/;
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

    function InitmenuSlide(top, height) {
        StyleApp(top, height);
        $('#wrapper, #wrapper-questions').addClass('auxCSS');

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('wrapper', { hideScrollbar: true });
        myScrollMenu = new iScroll('wrapperMenu', { hideScrollbar: true });
        
        new FastClick(document.body);
    }
    function loadMoreData(numberOfPage){

        var href = window.localStorage.getItem('href');
        $.ajax({
            type        : 'GET',
            url         : apiRestDomain + "/" + href + "/",
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            data        : {
                'page'  : numberOfPage,
                'course': window.localStorage.getItem('courseId')
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
                lista += '<li><a data-transition="slide" class="item item-icon-left" alt="' + data[i].id + '">';
                lista += '<i class="icon ion-compose"></i>' + data[i].description.toLowerCase().ucfirst();
                lista += '</a></li>';
            }

            $('#list').append(lista);
            myScroll.refresh();
        });
    }

    function ScrollMove() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');   
        pullUpOffset = pullUpEl.offsetHeight;

        if(typeof myScroll != "undefined" && myScroll != null) {
            myScroll.destroy();
            myScroll = null;
        }

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
                    loadMoreData(++numberPage);
                }
            }
        });
    }

    function renderDefaultList(data) {
        var lista = '';

        for (var i = 0; i < data.length; i++) {
            lista += '<li><a class="item item-icon-left" alt="' + data[i].id + '">';
            lista += '<i class="icon ion-compose"></i>' + data[i].description.toLowerCase().ucfirst();
            lista += '</a></li>';
        }

        return lista;
    }

    function renderRanking(data) {
        var lista = "";

        for (var i = 0; i < data.length; i++) {
            lista += '<div class="row">' + 
                '<div class="col col-33 item">' + 
                    data[i].usuario.toLowerCase().ucfirst() + 
                '</div>' + 
                '<div class="col col-33 item" style="text-align:center">' + 
                    data[i].puntaje + ' Pts.' + 
                '</div>' + 
                '<div class="col col-33 item" style="text-align:center">' + 
                    '<button class="button button-positive btn-retar">Retar</button>' + 
                '</div></div>';
        };

        return lista;
    }

    function getMainList(option) {

        var href = option.href,
            func = option.func,
            args = option.args || "",
            elem = option.elem || "list",
            ptop = option.ptop,
            pwid = option.pwid;

        window.localStorage.setItem('href', href);

        StyleApp(ptop, pwid);

        $('#wrapper, #wrapper-ranking').addClass('auxCSS');

        if(typeof myScroll != "undefined" && myScroll != null) {
            myScroll.destroy();
            myScroll = null;
            
            numberPage > 1 && (numberPage = 1);
        }

        $.mobile.loading('show', {
            text : 'Cargando...',
            textVisible : true,
            theme : 'b',
            textonly : false
        });

        $.ajax({
            type        : 'GET',
            url         : apiRestDomain + "/" + href + "/",
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            data        : {
                'page'  : numberPage,
                'course': args
            }
        })
        .done(function(data){
            var data = eval(data);
            
            $.mobile.loading("hide");

            if(data[0] == null) {
                $('#' + elem).html($("<center style='padding:11%; color:#B33831; font-size:15px; font-weight:bold;'></center>")
                          .append('No hay registros para mostrar'));

                return false;
            }

            var list = eval(func + "(data)");
            
            $('#' + elem).empty().html(list);

            $('#pullUp, #pullDown').removeClass('hide').addClass('show');

            ScrollMove();
        });
        
        new FastClick(document.body);
    }

    function transition( href ) {
        spinnerplugin.show();
        
        var options = {
            "href" : href,
            "duration" : 200,
            "androiddelay" : -1,
            "iosdelay" : -1
        };

        window.plugins.nativepagetransitions.fade(
            options,
            function (msg) {console.log("success: " + msg)},
            function (msg) {alert("error: " + msg)}
        );
        new FastClick(document.body);
    }

    function TabNav(href, fn, item, top, height) {
        item.classList.add('active');

        $('.tab-item').not(item).removeClass('active');

        getMainList({
            href : href,
            func : fn,
            args : window.localStorage.getItem("courseId"),
            ptop : top,
            pwid : height
        });

        myScroll = new iScroll('wrapper', { hideScrollbar: true });
    }

    function initMenuAnimation(top, height) {
        InitmenuSlide(top, height);
        $('#cuerpo').on('swipeleft', function () {
            document.getElementById('menuprincipal').classList.remove('btn-slide-active');
        });

        $('#cuerpo').on('swiperight', function () {   
            document.getElementById('menuprincipal').classList.add('btn-slide-active');
        });
    }

    function getQuestions() {
        timerInicial = 30;
        clearTimeout(clearTimer);
        $.getJSON(apiRestDomain + '/getQuestions/',{
            course : window.localStorage.getItem('courseId')
        })
        .done(function(dataQuestion){
            var pregunta_id = dataQuestion[0].id_preguntas;
            //alert(data[0].preguntas);
            $.getJSON(apiRestDomain + '/getResultQuestion/', {
                question_id : pregunta_id
            })
            .done(function(dataAnswer){
                $('#questionDescription h5').text(dataQuestion[0].preguntas);

                var btn = "";

                for (var i = 0; i < dataAnswer.length; i++) {
                    btn += '<button class="button button-block button-stable ui-btn ui-shadow ui-corner-all">' + dataAnswer[i].respuesta + '</button>';
                }

                $('#wrapper-questions').empty().append(btn);
                timer();
            });
        });
    }

    function timer() {
        if(timerInicial > 0) {
            $('#timer h5').empty().html(timerInicial);
            clearTimer = setTimeout(function(){
                timerInicial -= 1;
                timer();
            }, 1000);
        }
    }

    return {
        login             : login,
        getMainList       : getMainList,
        transition        : transition,
        getYears          : getYears,
        initMenuAnimation : initMenuAnimation,
        TabNav            : TabNav,
        getQuestions      : getQuestions
    };
})();