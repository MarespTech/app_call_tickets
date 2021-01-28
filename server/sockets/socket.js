const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('siguienteTicket', (data, callback) => {
        siguiente = ticketControl.siguienteTicket();
        callback(siguiente);
    });

    client.emit('ticketActual', {
        actual: ticketControl.ticketActual(),
        ultimosCuatro: ticketControl.getUltimosCuatro()
    });

    client.on('atenderTicket', (data, callback) => {
        if( !data.escritorio ) {
            return callback({
                ok: false,
                message: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket( data.escritorio );
        callback(atenderTicket);

        // Actualizar/Notificar cambios en los ultimos cuatro
        client.broadcast.emit('ultimosCuatro', {
            ultimosCuatro: ticketControl.getUltimosCuatro()
        })
    });
    
    

});