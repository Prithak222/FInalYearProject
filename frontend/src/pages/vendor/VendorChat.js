import React from 'react';
import { Messages } from '../Messages';

export function VendorChat() {
    return (
        <div className="md:ml-64 h-screen bg-white">
            <Messages isVendorPortal={true} />
        </div>
    );
}
