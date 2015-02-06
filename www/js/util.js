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
		URL = 'http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png';

	    var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var img = new Image;
		img.crossOrigin = 'Anonymous';
		
		img.onload = function(){
			canvas.height = img.height;
			canvas.width = img.width;
		  	ctx.drawImage(img,0,0);
		  	var dataURL = canvas.toDataURL('image/png');
		  	//callback.call(this, dataURL);
	        // Clean up
		  	canvas = null; 

		  	//substituindo a url no html pelo base64
		    util.htmlContent = util.htmlContent.replace('src="' + URL + '"', 'src="' + dataURL + '"');

		    $("#app").append(dataURL);
		};

		img.src = URL;
	}
}