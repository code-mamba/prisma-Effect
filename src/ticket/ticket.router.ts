import {Router, Request, Response} from "express"
import {Effect, Layer, pipe} from "effect"
import { TicketRepository, TicketRepositoryLive } from "./ticket.service"

export const router: Router = Router()


router.get("/tickets", (_req, res:Response)=>{
    const program = Effect.gen(function*(){
        const repo = yield* TicketRepository
        const tickets = yield* repo.getTickets()
        return tickets
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive));
    Effect.runPromise(runnableProgram).then((tickets)=> res.json(tickets))
})

router.get("/tickets/:id", (req:Request, res:Response)=>{
    const program = Effect.gen(function*(){
        const id = req.params.id
        const repo = yield* TicketRepository
        const ticket = yield* repo.getTicketbyId(Number(id))
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    Effect.runPromise(runnableProgram).then((ticket)=>res.json(ticket))
})

router.post("/tickets", (req:Request, res:Response)=>{
    const program = Effect.gen(function*(){
        const data = req.body
        const repo = yield* TicketRepository
        const ticket = yield* repo.newTicket(data)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    Effect.runPromise(runnableProgram).then((ticket)=>res.json(ticket))
})

router.put("/tickets/:id",(req:Request, res:Response)=>{
    const program = Effect.gen(function*(){
        const id = Number(req.params.id)
        const data = req.body
        const repo = yield*TicketRepository
        const ticket = yield* repo.updateTicketById(id, data)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    Effect.runPromise(runnableProgram).then((ticket)=> res.json(ticket))

})

router.delete("/tickets/:id", (req:Request, res:Response)=>{
    const program = Effect.gen(function*(){
        const id = Number(req.params.id)
        const repo = yield* TicketRepository
        const ticket = yield* repo.deleteTicketById(id)
        return ticket
    })
    const runnableProgram = pipe(program, Effect.provide(TicketRepositoryLive))
    Effect.runPromise(runnableProgram).then((ticket)=> res.json(ticket ))
})