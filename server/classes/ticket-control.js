const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimosCuatro = [];

        let data = require('../data/data.json');
        
        if( data.hoy === this.hoy ) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimosCuatro = data.ultimosCuatro;
        } else {
            this.reiniciarConteo();
        }
    }
    
    ticketActual() {
        return `Ticket ${this.ultimo}`;
    }

    getUltimosCuatro() {
        return this.ultimosCuatro;
    }

    siguienteTicket() {
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    }

    atenderTicket(escritorio) {
        if( this.tickets.length === 0 ) {
            return {
                ok: false,
                message: 'Ya no hay tickets en espera'
            }
        }

        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let atenderTicket = new Ticket(numeroTicket, escritorio);
        this.ultimosCuatro.unshift( atenderTicket );

        if( this.ultimosCuatro.length > 4 ) {
            this.ultimosCuatro.splice(-1,1); // Borra ultimo elemento
        }

        console.log(this.ultimosCuatro);

        this.grabarArchivo();
        return({
            ok: true,
            atenderTicket
        });
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.ticket = [];
        this.ultimosCuatro = [];
        console.log("Se ha inicializado el sistema");
        this.grabarArchivo();
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosCuatro: this.ultimosCuatro
        };
        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }
}


module.exports = {
    TicketControl
}