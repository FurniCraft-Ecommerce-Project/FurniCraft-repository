"use client";
export default function ButtonBack() {
    const handleClick = () => {
        window.history.back();
    };

    return (
        <button
            onClick={handleClick}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            style={{ cursor: 'pointer', position: 'absolute', top: '1rem', right: '1rem' }}
        >
            Back
        </button>
    );
}