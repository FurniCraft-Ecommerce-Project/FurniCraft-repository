export default function Footer () { 
    return (
        <>
            <footer className="bg-black-500 text-gray-700 py-10 px-10 mt-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-bold mb-4">FurniSphere</h4>
                    <p>Your go-to destination for stylish, sustainable, and marketable furniture collections that elevate your space.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                    <li><a href="#" className="hover:text-black">Home</a></li>
                    <li><a href="#" className="hover:text-black">About</a></li>
                    <li><a href="#" className="hover:text-black">Product</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Contact Us</h4>
                    <p>Email: support@furnisphere.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: 123 Modern Street, Design City, NY</p>
                </div>
                </div>
                <div className="text-center mt-8 text-sm text-gray-500">© {new Date().getFullYear()} FurniSphere. All rights reserved.</div>
            </footer>
        </>
    )
}