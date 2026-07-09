export function useFeedback(feedback:{nombre:string, email:string, mensaje:string}){
    return $fetch('api/feedback')
}