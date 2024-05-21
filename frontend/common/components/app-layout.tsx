import { FC } from 'react';
import Header from '@/common/components/header';

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gradient-to-b from-cyan-100 to-sky-700 relative backdrop-blur-sm w-full h-full bg-fixed z-10">
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
