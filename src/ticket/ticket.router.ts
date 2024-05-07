import {Router, Request, Response} from "express"
import { createTicket, deletTicket, editTicket, getTicketById, getTickets } from "./ticket.controller"
import { Effect, pipe } from "effect"
import { TicketRepositoryLive } from "./ticket.service"


export const router: Router = Router()


router.get("/tickets", async (_req, res:Response)=>{
    const tickets = getTickets()
    const programWithErrors = pipe(tickets, Effect.map(x=>({
        status:200,
        data: x
    })),
    Effect.catchTags({
        EmptyTicket:(err) => Effect.succeed({
            status: 400,
            data:{
                error: err._tag
            }
        })
    })
)
    const runnableProgram = pipe(programWithErrors, Effect.provide(TicketRepositoryLive))
    return Effect.runPromise(runnableProgram).then((data)=>{
        res.status(data.status).json(data.data)
    })
    .catch(x=>{
        res.json(x)
    })
    
})

router.get("/tickets/:id", async (req:Request, res:Response)=>{
    const id = Number(req.params.id)
    const ticket = getTicketById(Number(id))
    const programWithErrors = pipe(ticket, Effect.map(x=>({
        status:200,
        data: x
    })),
    Effect.catchTags({
        TicketNotFoundErr:(err)=> Effect.succeed({
            status: 400,
            date: err._tag
        })
    })
)
    const runnableProgram = pipe(programWithErrors, Effect.provide(TicketRepositoryLive))
    return Effect.runPromise(runnableProgram).then((data)=>{
        res.status(data.status).json(data)
    })
    .catch((x)=>{
        res.json(x)
    })
})

router.post("/tickets", async(req:Request, res:Response)=>{
    const data = req.body
    const ticket = await createTicket(data)
    res.json(ticket)
    
})

router.put("/tickets/:id",async(req:Request, res:Response)=>{
    const id = Number(req.params.id)
    const data = req.body
    const ticket = await editTicket(id, data)
    res.json(ticket)

})

router.delete("/tickets/:id", async(req:Request, res:Response)=>{
    const id = Number(req.params.id)
    const ticket = await deletTicket(id)
    res.json(ticket)
})