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

		//carregando funcionalidade para busca de posts
		this.bindBuscaPost();
	},
	//função para carregar todas as categorias disponíveis
	carregarCategorias: function(){
		$.ajax({
			url: this.url + 'taxonomies/category/terms',
			type: 'get',
			success: function(data){
				//em caso de sucesso, carregar o layout do menu principal
				//carregando layout
				
				//adicionando os resultados do ajax em um objeto
				data.categorias = data;

				//buscando favoritos
				data.favoritos = [];
				
				for (var key in localStorage)
				{
					//verificando apenas favoritos
					if( key.indexOf('favorito_') > -1 )
					{
						//verificando apenas os marcados com 1, que são favoritados
						if( localStorage.getItem(key) == 1 )
						{
							//recuperando apenas o id do post
							ID = key.replace('favorito_','');

							//adicionando na listagem de favoritos o título e o id do post
							tmp = {'titulo':localStorage.getItem('favorito_titulo_' + ID), 'ID' : ID};

							data.favoritos.push(tmp);
						}
					}
				}
				
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

				//verificando se o post é um favorito
				data.textoFavorito = 'Favoritar';

				if( localStorage.getItem("favorito_" + postId) == 1 )
					data.textoFavorito = 'Desfavoritar';

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
	},
	//função para executar busca de posts
	bindBuscaPost: function(){
		//listener para quando o usuário submeter o formulário
		$("#frmSearch").bind('submit', function(){
			//validando string
			var busca = $.trim($("#busca").val());

			//não permitir buscar conteúdo com menos de três caracteres
			if( busca.length < 3 )
			{
				//alerta utilizando o dialog
				navigator.notification.alert(
				    'Informe mais do que dois caracteres para realizar a busca.',  // message
				    function(){},         // callback
				    'Texto muito curto!',            // title
				    'Ok'                  // buttonName
				);
			}
			else
			{
				//formatando string para Uri
				busca = encodeURIComponent(busca);

				//exibir a mensagem de carregamento com o spinnerDialog
				window.plugins.spinnerDialog.show("Carregando", "Buscando posts que contenham o texto informado...");

				$.ajax({
					url: wp.url + 'posts?filter[s]=' + busca,
					type: 'get',
					success: function(data){
						//carregando o layout
						data = {'supplies':data};
						var html = new EJS({url: 'template/lista-busca.ejs'}).render(data);

						//adicionando ao html atual
						$("#app").html( html );

						//removendo o spinner
						window.plugins.spinnerDialog.hide();
					},
					error: function(){
						window.plugins.toast.showLongBottom('Desculpe, mas não foi possível carregar a busca de posts, verifique sua conexão com a internet e tente novamente.');
		            	navigator.notification.vibrate(1000);

		            	//removendo o spinner
						window.plugins.spinnerDialog.hide();
					}
				});
			}

			//impedindo que o formulário seja enviado via requisições post
			return false;
		});
	},
	//função para favoritar ou desfavortar um post
	//recebe como parâmetro o id o post e o título do mesmo
	alterarFavorito: function(postId, titulo){
		//verificando se o post já é um favorito
		if( localStorage.getItem("favorito_" + postId) == 1 )
		{
			//desfavoritando, setando como 0 (zero)
			localStorage.setItem("favorito_" + postId, 0);

			//atualizando texto no html
			$("#postFavorito").html('Favoritar');

			//avisando usuário
			window.plugins.toast.showLongBottom('Conteúdo removido dos favoritos com sucesso!');
		}
		else
		{
			//favoritando, setando como 1
			localStorage.setItem("favorito_" + postId, 1);

			//salvando título do post
			localStorage.setItem("favorito_titulo_" + postId, titulo);

			//atualizando texto no html
			$("#postFavorito").html('Desfavoritar');

			//avisando usuário
			window.plugins.toast.showLongBottom('Conteúdo adicionado aos favoritos com sucesso!');
		}
	}
}