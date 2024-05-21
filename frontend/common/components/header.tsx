import { FC } from 'react';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import LogoutButton from '@/common/components/logout-button';

const Header: FC = () => {
  return (
    <header className="bg-white w-full p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Image src={Logo} alt="Logo" width={60} height={60} />
        <h2 className="ml-2 font-bold text-xl">Tourno-Bet</h2>
      </div>
      <nav className="flex space-x-4">
        <a href="/home" className="text-gray-700 hover:text-gray-900">
          Home
        </a>
        <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
          Dashboard
        </a>
        <a href="/page-x" className="text-gray-700 hover:text-gray-900">
          Page X
        </a>
      </nav>
      <div className="flex items-center space-x-4">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
