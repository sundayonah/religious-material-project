import { useDispatch, useSelector } from 'react-redux';
import { setVolumeBar } from '@/reduxToolkit/slices/audioSlice';
import { VolumeUp, VolumeMute } from '@/components/icons';

const Volume = ({ handleVolume, handleVolumeChange }) => {
   const { volume, volumeBar } = useSelector((store) => store.audio);
   const dispatch = useDispatch();

   return (
      <>
         <button
            onClick={handleVolume}
            onMouseOver={() => dispatch(setVolumeBar(true))}
            onMouseLeave={() => dispatch(setVolumeBar(false))}
            className="relative text-white"
         >
            <div
               className={`absolute ${
                  volumeBar ? 'flex' : 'hidden'
               }  bottom-[5.4rem] -left-16 pl-4 pr-2  -rotate-90 `}
            >
               <input
                  type="range"
                  name="volume"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  className="h-7 input"
                  onChange={handleVolumeChange}
               />
            </div>
            {volume ? (
               <VolumeUp className="w-5 h-5 md:w-7 md:h-7" />
            ) : (
               <VolumeMute className="w-5 h-5 md:w-7 md:h-7" />
            )}
         </button>
      </>
   );
};
export default Volume;
