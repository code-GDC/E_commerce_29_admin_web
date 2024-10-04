import React from 'react';
import Sidebar from '../component/Sidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex-1 min-h-screen">
            {/* Main content area */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-1/4 bg-gray-200 h-screen">
                    <Sidebar />
                </aside>
                {/* Main content with children */}
                <section className="flex-1  bg-white h-screen ">
                    <div className="h-full flex flex-col">
                        {/* Make children take full available space */}
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </section>
            </div>
            {/* Footer */}
            <footer className="bg-gray-500 text-center py-4 w-full">
                <p>&copy; UOM CSE 22 GRP-29 E-commerce Admin</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;
