/**
 * Este arquivo tem como função, realizar toda a comunicação entre o aplicativo e o Wordpress
 * @author Adriano Maciel
 */
var wp = {
	initialize: function(){
		//definindo a url base do site
		this.url = 'http://www.infonaveia.com.br/wp-json/';

		//carregando categorias
		this.carregarCategorias();
	},
	//função para carregar todas as categorias disponíveis
	carregarCategorias: function(){
		$.ajax({
			url: this.url + 'taxonomies/category/terms',
			type: 'get',
			success: function(data){
				//em caso de sucesso, carregar o layout do menu principal
				//carregando layout
				data = {'supplies':data};
				var html = new EJS({url: 'template/menu-principal.ejs'}).render(data);

				//adicionando ao final do html atual
				$("#app").append( html );
			},
			error: function(){
				window.plugins.toast.showLongBottom('Desculpe, mas não foi possível carregar as categorias, verifique sua conexão com a internet e tente novamente.');
            	navigator.notification.vibrate(1000);
			}
		});
	}
}