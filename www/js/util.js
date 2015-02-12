/**
 * Este documento servirá como um helper de utilidades, para executar tarefas que não se adequam aos outros objetos
 */

var util = {
	initialize: function(){
		//variável responsável por manter uma cópia do html, mas substituindo as imagens pelo seu base64
		this.htmlContent = '';

		//varável que define se o browser não suporta o processamento local para converter imagem em base64 via canvas
		this.suportaBase64 = true;

		//variável que controla se o alerta já foi enviado ou não ao usuário sobre o suporte ao base64
		this.avisadoSobreBase64 = false;
	},

	//processar cxonteúdo html, e gerar has das imagens para armazenamento offline
	processarImagens: function(conteudo, callback){
		rex = /<img[^>]+src="(http|https|ftp):\/\/([^">]+)/g; //extrair todas as tags de imagem
		//results = rex.exec( conteudo );
		results = conteudo.match( rex );

		regex2 = /src="(.*)/; //extrair apenas o src

		//armazenando o html
		util.htmlContent = conteudo;

		//caso suporte base64, prosseguir
		if( util.suportaBase64 )
		{
			for( var i = 0; i < results.length; i++ )
			{	
				var src = regex2.exec(results[i]);

				if(src != null)
				{
					src = String(src);
					src = src.split(',');

					//carregando o conteúdo em base64
					if( util.suportaBase64 )
						util.getBase64FromImageUrl(src[1]);
				}
			}
		}

		//executando o callback
		callback.call();
	},

	//função para converter a imagem em base 64
	getBase64FromImageUrl: function(URL) {
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

		  	//se o resultado for extremamente curto, significa que não deu certo e com isso defino que o device não suporta o base64 via canvas
		  	if( dataURL.length < 15 )
		  	{
		  		util.suportaBase64 = false;

		  		//avisando usuário
		  		if( util.avisadoSobreBase64 == false )
		  			util.alertaBase64();

		  		util.avisadoSobreBase64 = true;
		  	}
		  	else
		  	{
		  		//substituindo a url no html pelo base64
		    	util.htmlContent = util.htmlContent.replace('src="' + URL + '"', 'src="' + dataURL + '"');

		    	alert(util.htmlContent);
		  	}
		};

		img.src = URL;
	},

	//função que alerta ao usuário sobre o não suporte ao base64 via canvas
	alertaBase64: function(){
		//alerta utilizando o dialog
		navigator.notification.alert(
		    'Seu dispositivo não suporta armazenamento offline de imagens, apenas o texto será armazenado. As imagens serão visíveis apenas quando houver conexão.',  // message
		    function(){},         // callback
		    'Recurso indisponível!',            // title
		    'Então tá...'                  // buttonName
		);

        navigator.notification.vibrate(1000);
	}
}