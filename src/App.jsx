import { useEffect, useState } from 'react';
import './App.css';
import Routing from './Routing/Routing';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import LoadingAnimation from './Components/Loading';
import { useDispatch } from 'react-redux';
import { stopLoading } from './Redux/Slice/loadingSlice';

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Minimum display time for smooth UX
    const timer = setTimeout(() => {
      dispatch(stopLoading());
      setIsInitializing(false);
    }, 2500); 

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <>
      {/* GLOBAL LOADER */}
      <LoadingAnimation />

      {/* APP UI - Only render after initial delay */}
      {!isInitializing && (
        <>
          <ToastContainer />
          <Toaster />
          <Routing />
        </>
      )}
    </>
  );
}

export default App;