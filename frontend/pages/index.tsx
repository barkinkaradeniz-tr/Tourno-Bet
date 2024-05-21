import Login from '@/common/modules/auth/components/login';
import { getCurrentUser } from '@/common/modules/auth/services/auth-service';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function LoginPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getCurrentUser());
  }, []);

  return <Login />;
}
