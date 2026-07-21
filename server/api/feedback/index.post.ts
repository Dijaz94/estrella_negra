import {z} from 'zod'
export  default defineEventHandler(async(event)=>{
     const body = await readBody(event)

    const schema = z.object({
        nombre: z.string().min(1, 'El nombre es obligatorio'),
        email:z.email('El correo es obligatorio'),
        mensaje:z.string().min(1, 'Debes ingresar un mensaje para enviar el formulario')
    })

    const parsed = schema.safeParse(body)

    if (!parsed.success){
        throw createError({
            statusCode:400,
            message:'Datos no válidos. Por favor, reintente el formulario',
            data: parsed.error.issues
        })
    }
    try{
        await sendEmail(body)
    }
    catch(e:any){
        console.error('Error SMTP:', e) 
        throw createError({
            statusCode:500,
            message:'Error al enviar el correo'
        })
    }
    


    return { ok: true, message: 'Feedback enviado' }
})