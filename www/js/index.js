/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        //armazena o status atual da conexão, inicia como desconectado
        this.possuiConexao = false;

        //armazena o tipo de conexão
        this.tipoConexao = '';
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        document.addEventListener('online', this.checkConnection, false); //escutando quando o dispositivo ficar online
        document.addEventListener('offline', this.checkConnection, false);  //escutando quando o dispositivo ficar offline
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');

        //carregando banco de dados local
        model.initialize();

        //buscando conteúdo armazenado offline
        model.listarConteudoOffline();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    checkConnection: function() {
        //recupera o status atual da conexão
        var networkState = navigator.connection.type;

        //criando um objeto com o significado de cada status de conexão
        var states = {};
        states[networkState.UNKNOWN]  = 'Unknown connection';
        states[networkState.ETHERNET] = 'Ethernet connection';
        states[networkState.WIFI]     = 'WiFi connection';
        states[networkState.CELL_2G]  = 'Cell 2G connection';
        states[networkState.CELL_3G]  = 'Cell 3G connection';
        states[networkState.CELL_4G]  = 'Cell 4G connection';
        states[networkState.NONE]     = 'No network connection';

        //se não tiver conexão, zerar as variáveis
        if( networkState == 'unknown' || networkState == 'none' )
        {
            this.possuiConexao = false;
            this.tipoConexao = '';

            window.plugins.toast.showLongBottom('Desculpe, mas é necessário ter conexão com a internet para utilizar o aplicativo.');
            navigator.notification.vibrate(1000);
        }
        else
        {
            //armazenando nas variáveis globais
            this.possuiConexao = true;
            this.tipoConexao = networkState;
        }
    }
};
