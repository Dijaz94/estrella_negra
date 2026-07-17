import { z} from 'zod'
export default defineEventHandler(async(event)=>{

    const schema = z.object({
        titulo: z.string().min(1),
        descripcion: z.string().min(1),
        fecha_inicio: z.string(),
        fecha_hora:z.string(),
        capacidad_max:z.number().min(1),
        estado:z.enum(['PROGRAMADO', 'CANCELADO', 'FINALIZADO']),
        artistas:z.string().nullish().transform(v => v ?? null),
        fecha_fin:z.string().nullish().transform(v => v ?? null),
        afiche_url:z.string().nullish().transform(v => v ?? null)
    })

    const body = await readBody(event)
    const parsed = schema.safeParse(body)
    if (!parsed.success){
        throw createError({
            statusCode:400,
            message:"Datos no válidos"
        })
    }

    const created = await createNewEvent(parsed.data)
    return {ok:true, created}
})