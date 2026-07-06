export function useMenu() {
  const data = useFetch('/api/menu')

  
  return data

}
