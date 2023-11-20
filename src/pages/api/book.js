import axios from 'axios';

// export default async function handler(req, res) {
//    try {
//       // const token =
//       //    'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';

//       const response = await axios.get(
//          'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllBooks'
//          // {
//          //    headers: {
//          //       Authorization: `Bearer ${token}`,
//          //    },
//          // }
//       );
//       // console.log(response.data);
//       res.status(200).json(response.data);
//    } catch (error) {
//       console.error('Error fetching message details:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//    }
// }

// import axios from 'axios';

export default async function handler(req, res) {
   try {
      const messageURL =
         'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks';

      const response = await axios.get(messageURL);

      const data = response.data.data;

      console.log(data);

      const messageDetails = await Promise.all(
         data.map(async (message) => {
            const ipfsHash = message.hash;
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeMessageInfo = {
                  recId: message.recId,
                  hash: message.hash,
                  counterId: message.counterId,
                  category: message.category,
                  bookFile: message.bookFile,
                  type: message.type,
                  ...ipfsContent,
               };

               console.log(completeMessageInfo);

               return completeMessageInfo;
            } else {
               console.error(
                  'Pinata API returned an error:',
                  pinataResponse.status,
                  pinataResponse.statusText
               );
               return null;
            }
         })
      );

      console.log(messageDetails);
      const filteredMessages = messageDetails.filter(
         (detail) => detail !== null
      );

      console.log(filteredMessages);

      // Return the filteredDownloads as the API response
      res.status(200).json(filteredMessages);
   } catch (error) {
      console.error('Error fetching download details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
