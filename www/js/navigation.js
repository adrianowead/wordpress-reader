/**
 * Este documento é responsável por carregar os templates
 * quando estes forem chamados na URL
 */

$(window).on('hashchange', function(){
	//verificando se na hash possui a definição da página
	hash = window.location.hash;

	if( hash.indexOf("layout") > -1 )
	{
		hash = hash.split("=");

		if( hash[1].length > 0 )
			carregarLayout( hash[1] );
	}
});

/**
 * Função para carregar o layout solicitado
 */
function carregarLayout(hash){
	//se realmente tiver algum conteúdo
	if( hash.length > 0 )
	{
		//carregando layout
		var html = new EJS({url: 'template/' + hash + '.ejs'}).render();

		//adicionando ao html
		$("#app").html( html );
	}
}