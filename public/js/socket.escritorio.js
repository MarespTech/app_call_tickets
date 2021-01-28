const socket = io();

socket.on('connect', function() {
    console.log("Se ha conectado al servidor");
});

socket.on("disconnect", function() {
    console.log("Se ha desconectado del servidor");
});

var searchParams = new URLSearchParams( window.location.search );
if( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

var escritorio = searchParams.get('escritorio');
var label = $('small');

$('h1').text('Escritorio ' + escritorio);
$('button').on('click', function(){
    socket.emit('atenderTicket', { escritorio: escritorio }, function( resp ){
        if( resp.ok ) {
            label.text( 'Ticket ' + resp.atenderTicket.numero );
        } else {
            swal("Error", resp.message, "error");
            label.text( resp.message );
        }
    });
});