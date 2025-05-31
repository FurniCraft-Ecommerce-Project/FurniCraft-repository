import formatRupiah from '@/helpers/formatRupiah';
import { X } from 'lucide-react';
import React, { useRef } from 'react';

export default function MyModal({ order }: { order: { items: any[] } }) {
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        modalRef.current?.close();
    };

    // Calculate total amount
    const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div>
            <button 
                className="text-sm" 
                onClick={openModal} style={{cursor: 'pointer'}}
            >
                +{order.items.length - 1} more item(s)
            </button>

            <dialog ref={modalRef} className="modal">
                <div className="modal-box bg-white p-0 max-w-2xl w-full rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Order Items</h3>
                        <button 
                            onClick={closeModal}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    {/* Items List */}
                    <div className="max-h-[60vh] overflow-y-auto p-1">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center p-3 last:border-b-0 hover:bg-gray-50">
                                <div className="w-16 h-16 rounded overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                                    <img 
                                        src={item.thumbnail || '/placeholder-image.jpg'} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                    <div className="flex justify-between items-baseline mt-1">
                                        <span className="text-sm text-gray-500">
                                            {item.quantity} × {formatRupiah(item.price)}
                                        </span>
                                        <span className="font-semibold">
                                            {formatRupiah(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer with Total */}
                    <div className="p-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Amount</span>
                            <span className="text-lg font-bold text-primary">{formatRupiah(totalAmount)}</span>
                        </div>
                    </div>
                </div>
                
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    );
};