/**
 * Este documento servirá como um model
 */

var model = {
	//construtor do model
	initialize: function(){
		//carregando função para criar o banco de dados
		model.instalarBancoLocal();
	},

	//função para instalar o banco de dados local
	instalarBancoLocal: function(){
		if( localStorage.getItem("banco_instalado") != 1 )
		{
			//carregando banco de dados
			db = window.sqlitePlugin.openDatabase({name: "wordpress-reader.sqlite3"});

			// Cria a Tabela "tb_favorito"
			db.transaction(function(tx) {
	        	tx.executeSql('CREATE TABLE IF NOT EXISTS tb_favorito (favorito_id integer primary key, post_id integer, conteudo text)');
	        });

			//setando como instalado
	        localStorage.setItem("banco_instalado", "1");
		}
	}
}