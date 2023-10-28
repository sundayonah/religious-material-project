import AudioControl from '@/components/audioControl';
import { useSelector } from 'react-redux';
import SongDownloads from '@/components/downloads/songDownloads';
import DownloadSidebar from '@/components/downloads/downloadSidebar';
import { MessagesDownload } from '@/components/downloads/messagesDownload';

const Download = () => {
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   return (
      <>
         <div className="md:w-[80%] px-4 flex m-auto mt-28">
            <DownloadSidebar />
            <SongDownloads />
         </div>

         {isPlaying || activeSongId ? <AudioControl /> : null}
      </>
   );
};

export default Download;
