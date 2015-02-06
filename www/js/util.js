/**
 * Este documento servirá como um helper de utilidades, para executar tarefas que não se adequam aos outros objetos
 */

var util = {
	initialize: function(){
		//variável responsável por manter uma cópia do html, mas substituindo as imagens pelo seu base64
		this.htmlContent = '';
	},

	//processar cxonteúdo html, e gerar has das imagens para armazenamento offline
	processarImagens: function(conteudo){
		rex = /<img[^>]+src="(http|https|ftp):\/\/([^">]+)/g; //extrair todas as tags de imagem
		//results = rex.exec( conteudo );
		results = conteudo.match( rex );

		regex2 = /src="(.*)/; //extrair apenas o src

		//armazenando o html
		util.htmlContent = conteudo;

		for( var i = 0; i < results.length; i++ )
		{	
			var src = regex2.exec(results[i]);

			if(src != null)
			{
				src = String(src);
				src = src.split(',');

				//carregando o conteúdo em base64
				util.getBase64FromImageUrl(src[1]);
			}
		}
	},

	//função para converter a imagem em base 64
	getBase64FromImageUrl: function(URL) {
	    var img = new Image();
	    img.crossOrigin = "Anonymous";
	    img.src = URL;

	    img.onload = function () {
		    var canvas = document.createElement("canvas");
		    canvas.width = img.width;
		    canvas.height = img.height;

		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0);

		    $("#app").append(canvas);

		    var dataURL = canvas.toDataURL("image/png", 1.0);

		    //alert(  dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));

		    //base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

		    //substituindo a url no html pelo base64
		    util.htmlContent = util.htmlContent.replace('src="' + URL + '"', 'src="' + dataURL + '"');

		    alert( util.htmlContent );
	    }
	}
}