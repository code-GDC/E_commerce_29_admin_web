import React from 'react';
import Sidebar from '../component/Sidebar';
import Navbar from '../component/Navbar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-1/5 h-full">
                    <Sidebar />
                </aside>

                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <header className="w-full">
                        <Navbar  adminImage={''} />
                    </header>

                    {/* Main content area */}
                    <main className="flex-1 h-full">
                        {children}
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-500 text-center py-4 w-full">
                <p>&copy; UOM CSE 22 GRP-29 Shopzy Admin</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;
