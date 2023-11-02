import AudioControl from '@/components/audioControl';
import { useSelector } from 'react-redux';
import SongDownloads from '@/components/downloads/songDownloads';
import DownloadSidebar from '@/components/downloads/downloadSidebar';
import { MessagesDownload } from '@/components/downloads/messagesDownload';
import { useState } from 'react';

const Download = ({ products }) => {
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const [selectedFilter, setSelectedFilter] = useState('All'); // State to store the selected filter
   const [filteredProducts, setFilteredProducts] = useState([]);

   const handleFilterChange = (filter) => {
      setSelectedFilter(filter);
   };

   console.log(products);

   return (
      <>
         <div className="md:w-[80%] px-4 flex flex-col m-auto mt-28">
            <DownloadSidebar onFilterChange={handleFilterChange} />
            {/* <div>
               {selectedFilter === 'Songs' ? (
                  <SongDownloads selectedFilter={selectedFilter} />
               ) : selectedFilter === 'Messages' ? (
                  <MessagesDownload selectedFilter={selectedFilter} />
               ) : null}
            </div> */}
         </div>

         {isPlaying || activeSongId ? <AudioControl /> : null}
      </>
   );
};

export default Download;

//previous
// import AudioControl from '@/components/audioControl';
// import { useSelector } from 'react-redux';
// import SongDownloads from '@/components/downloads/songDownloads';
// import DownloadSidebar from '@/components/downloads/downloadSidebar';
// import { MessagesDownload } from '@/components/downloads/messagesDownload';
// import { useState } from 'react';

// const Download = () => {
//    const activeSongId = useSelector((state) => state.audio.activeSongId);
//    const isPlaying = useSelector(
//       (state) => state.audio.songStates[state.audio.activeSongId]
//    );

//    const [selectedFilter, setSelectedFilter] = useState('All'); // State to store the selected filter

//    const handleFilterChange = (filter) => {
//       setSelectedFilter(filter);
//    };

//    return (
//       <>
//          <div className="md:w-[80%] px-4 flex m-auto mt-28">
//             <DownloadSidebar onFilterChange={handleFilterChange} />
//             {selectedFilter === 'Songs' ? (
//                <SongDownloads selectedFilter={selectedFilter} />
//             ) : selectedFilter === 'Messages' ? (
//                <MessagesDownload selectedFilter={selectedFilter} />
//             ) : null}
//          </div>

//          {isPlaying || activeSongId ? <AudioControl /> : null}
//       </>
//    );
// };

// export default Download;
