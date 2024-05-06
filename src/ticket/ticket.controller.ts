import { Effect, pipe } from "effect"
import { TicketRepository, TicketRepositoryLive } from "./ticket.service"

class TicketNotFoundErr {
    readonly _tag = "TicketNotFoundErr"
    readonly status = 500
}
class EmptyTicket {
    readonly _tag = "EmptyTicket"
    readonly status = 400
}
interface Ticket {
    readonly id: number,
    readonly name: string,
    readonly subject: string,
    readonly description : string,
    readonly status: string,

}
export const getTickets = () =>{
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const tickets = yield* repo.getTickets()
        if(tickets.length === 0){
             return yield* Effect.fail(new EmptyTicket())
        }
        return tickets
    })
   return program
}

export const getTicketById = (id:number) => {
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const ticket = yield* repo.getTicketbyId(id)
        if(!ticket){
            return yield* Effect.fail(new TicketNotFoundErr())
        }
        return ticket
    })
    return program
}

export const createTicket = (data:Ticket) =>{
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const ticket = yield* repo.newTicket(data)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    return Effect.runPromise(runnableProgram).then((ticket)=> ticket)
}

export  const editTicket = (id:number, data:Ticket) => {
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const ticket = yield* repo.updateTicketById(id, data)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    return Effect.runPromise(runnableProgram).then((ticket)=>ticket)
}

export const deletTicket = (id:number) => {
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const ticket = yield* repo.deleteTicketById(id)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    return Effect.runPromise(runnableProgram).then((ticket)=> ticket)
}