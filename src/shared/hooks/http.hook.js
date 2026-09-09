import { useCallback } from "react";

const useHttp = () => {
    const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
        try {
            const responce = await fetch(url, {
                method,
                body,
                headers
            })

            if (!responce.ok) {
                throw new Error(`Could not fetch ${url}, status: ${responce.status}`);
            }
            return await responce.json()


        } catch (error) {
            throw error
        }
    }, [])

    return {
        request,
    }
}
export default useHttp;
