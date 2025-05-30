'use client'
export default function ButtonDeleteCart ({orderId} : {orderId : string}) {

    const handleOnClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({orderId}),
            });
            if (!response.ok) {
                throw (await response.json())
            }

            window.location.reload()

        } catch (error) {
            alert((error as Error).message)
        }
    }
    return (
        <>
            <button className="btn btn-outline btn-error" onClick={handleOnClick}>Delete</button>
        </>
    )
}