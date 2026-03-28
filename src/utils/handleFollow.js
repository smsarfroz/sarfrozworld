const handleFollow = async (id1, id2, refetch, VITE_BASE_URL) => {
    const api1 = `${VITE_BASE_URL}/users/follow`;
    try {
        const res1 = await (
        fetch(api1, {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id1: id1,
                id2: id2
            })
        }));
        if (!res1.ok) {
            throw new Error(`HTTP error! Status: ${Response.status}`);
        }

        const data1 = await res1.json();
        if (refetch !== undefined) {
            refetch();
        }
        return data1;
        
    } catch (error) {
        console.error(`There was a problem with the fetch operation:`, error);
        throw error;
    }
} 

export default handleFollow;