export function useFeedback(feedback:{nombre:string, email:string, mensaje:string, recaptchaToken:string}){
    return $fetch('api/feedback',{
        method:'POST',
        body:(feedback),
    })
}