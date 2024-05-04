import {Prisma, PrismaClient} from "@prisma/client"
import { Context, Data, Effect, Layer } from "effect"

const prisma = new PrismaClient()

interface Ticket {
    readonly id: number,
    readonly name: string,
    readonly subject: string,
    readonly description : string,
    readonly status: string,

}

export class TicketRepository extends Context.Tag("Tickets")<TicketRepository,{
    readonly getTickets:() => Effect.Effect<Array<Ticket>>,
    readonly getTicketbyId:(id:number) => Effect.Effect<Ticket|null>
    readonly newTicket:(data:Ticket) => Effect.Effect<Ticket>
    readonly updateTicketById:(id:number, data:Ticket) => Effect.Effect<Ticket>
    readonly deleteTicketById:(id:number) => Effect.Effect<Ticket>

}>(){

}
export const TicketRepositoryLive = Layer.succeed(TicketRepository, TicketRepository.of({
    getTickets:() =>{
        return Effect.promise(()=> showTickets())
    },
    getTicketbyId:(id:number)=>{
      return Effect.promise(()=> showTicketById(id))
    },
    newTicket:(data:Ticket) =>{
        return Effect.promise(() =>createTicket(data) )
    }, 
    updateTicketById:(id:number, data:Ticket) =>{
        return Effect.promise(()=> updateTicket(id, data))
    },
    deleteTicketById:(id:number) => {
        return Effect.promise(()=> deleteTicket(id) )
    }


}))

export const showTickets = async () => {
    const tickets = await prisma.ticket.findMany()
    return tickets
}
export const showTicketById = async (id:number) => {
    const ticket = await prisma.ticket.findUnique({
        where:{
            id:id
        }
    })
    return ticket
}

const createTicket = async (data: Prisma.TicketCreateInput) => {
    const ticket = await prisma.ticket.create({
        data:{
            name: data.name,
            subject: data.subject,
            description: data.description,
            status: data.status,
        }
    })
    return ticket

}

const updateTicket = async(id:number, data: Prisma.TicketUpdateInput) =>{
    const ticket = await prisma.ticket.update({
        where:{id:id},
        data:{
            name:data.name,
            subject: data.subject,
            description: data.description,
            status: data.status,
        }
    })
    return ticket
}

const deleteTicket = async(id:number) =>{
    const ticket = await prisma.ticket.delete({
        where:{
            id:id
        }
    })
    return ticket
}