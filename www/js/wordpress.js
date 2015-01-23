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
	},
	//função para carregar os posts da categoria selecionada
	carregarPostsCategoriaName: function(name){
		//exibir a mensagem de carregamento com o spinnerDialog
		window.plugins.spinnerDialog.show("Carregando", "Buscando posts de " + name + "...");

		$.ajax({
			url: this.url + 'posts?filter[category_name]=' + name,
			type: 'get',
			success: function(data){
				//carregando o layout
				data = {'supplies':data};
				var html = new EJS({url: 'template/lista-posts.ejs'}).render(data);

				//adicionando ao html atual
				$("#app").html( html );

				//removendo o spinner
				window.plugins.spinnerDialog.hide();
			},
			error: function(){
				window.plugins.toast.showLongBottom('Desculpe, mas não foi possível carregar os posts, verifique sua conexão com a internet e tente novamente.');
            	navigator.notification.vibrate(1000);

            	//removendo o spinner
				window.plugins.spinnerDialog.hide();
			}
		});
	},
	//função para carregar o conteúdo de um post
	carregarConteudoPost: function(postId){
		//exibir a mensagem de carregamento com o spinnerDialog
		window.plugins.spinnerDialog.show("Carregando", "Buscando conteúdo do post...");

		$.ajax({
			url: this.url + 'posts/' + postId,
			type: 'get',
			success: function(data){
				//processando data de postagem
				var dataPostagem = data.date_gmt.split('T');
				data.dia_postagem = dataPostagem[0];
				data.hora_postagem = dataPostagem[1].substring(0, dataPostagem[1].length - 6);
				data.dia_postagem = data.dia_postagem.split('-');

				//convertendo o dia para formato de data
				data.data_postagem = new Date( data.dia_postagem[0], data.dia_postagem[1] - 1, data.dia_postagem[2] );

				//carregando o layout
				data = {'supplies':data};
				var html = new EJS({url: 'template/conteudo-posts.ejs'}).render(data);

				//adicionando ao html atual
				$("#app").html( html );

				//removendo o spinner
				window.plugins.spinnerDialog.hide();
			},
			error: function(){
				window.plugins.toast.showLongBottom('Desculpe, mas não foi possível carregar o conteúdo do post selecionado, verifique sua conexão com a internet e tente novamente.');
            	navigator.notification.vibrate(1000);

            	//removendo o spinner
				window.plugins.spinnerDialog.hide();
			}
		});
	}
}