// export default function handler(req, res) {
//    res.status(200).json({ name: 'John Doe' });
// }

// pages/api/hello.js

// pages/api/getAllMessages.js

import axios from 'axios';

export default async function handler(req, res) {
   try {
      const token =
         'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';

      const response = await axios.get(
         'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllMessages',
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );
      res.status(200).json(response.data);
   } catch (error) {
      console.error('Error fetching message details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
