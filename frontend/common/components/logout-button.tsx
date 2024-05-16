import { logoutUser } from '@/common/modules/auth/services/auth-service';
import { useAppSelector } from '@/common/modules/store';
import { useDispatch } from 'react-redux';
import Router from 'next/router';

export default function LogoutButton() {
  const { loading, error } = useAppSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        // @ts-ignore
        dispatch(logoutUser());
        if (!error) Router.push('/');
      }}
    >
      Logout
    </button>
  );
}
